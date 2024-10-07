use reqwest::Client;
use rusqlite::{params, Connection, Result};
use serde::Deserialize;
use std::time::Duration;
use tokio::time;

#[derive(Deserialize)]
struct BlockChainInfo {
    blocks: u64,
}

async fn fetch_latest_block_height(client: &Client) -> Result<u64, Box<dyn std::error::Error>> {
    let response = client
        .get("http://localhost:8332/rest/chaininfo.json")
        .basic_auth("jilsoncorreia", Some("jilsoncorreia")) 
        .send()
        .await?;

    if response.status().is_success() {
        let blockchain_info: BlockChainInfo = response.json().await?;
        Ok(blockchain_info.blocks)
    } else {
        Err(format!(
            "Failed to fetch block height. Status code: {}",
            response.status()
        )
        .into())
    }
}

fn store_block_height(conn: &Connection, height: u64) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS block_height (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             height INTEGER NOT NULL,
             timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
         )",
        [],
    )?;

    conn.execute(
        "INSERT INTO block_height (height) VALUES (?1)",
        params![height],
    )?;

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new();
    let conn = Connection::open("block_data.db")?;

    loop {
        match fetch_latest_block_height(&client).await {
            Ok(block_height) => {
                println!("Latest block height: {}", block_height);
                if let Err(e) = store_block_height(&conn, block_height) {
                    eprintln!("Failed to store block height: {}", e);
                }
            }
            Err(e) => {
                eprintln!("Failed to fetch latest block height: {}", e);
            }
        }

        // 10 seconds before checking again
        time::sleep(Duration::from_secs(10)).await;
    }
}
