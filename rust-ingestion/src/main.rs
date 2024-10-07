extern crate bitcoincore_rpc;

use bitcoincore_rpc::{Auth, Client, RpcApi};
use rusqlite::{params, Connection, Result};
use std::time::Duration;
use tokio::time;
use std::env;

// Initialize the SQLite database
fn initialize_db(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS block_height (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             height INTEGER NOT NULL,
             timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
         )",
        [],
    )?;
    Ok(())
}

// Store block height in the SQLite database
fn store_block_height(conn: &Connection, height: u64) -> Result<()> {
    conn.execute("INSERT INTO block_height (height) VALUES (?1)", params![height])?;
    Ok(())
}

// Fetch the latest block height from Bitcoin Core RPC
async fn fetch_latest_block_height(rpc: &Client) -> Result<u64, Box<dyn std::error::Error>> {
    let block_count = rpc.get_block_count()?;
    Ok(block_count)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv::dotenv().ok();

    // Set up Bitcoin Core RPC client using bitcoincore_rpc
    let rpc = Client::new(
        "http://localhost:8332",
        Auth::UserPass(
            env::var("BTC_USERNAME").expect("BTC_USERNAME not set"),
            env::var("BTC_PASSWORD").expect("BTC_PASSWORD not set"),
        ),
    )?;

    // Connect to SQLite database
    let conn = Connection::open("block_data.db")?;
    initialize_db(&conn)?;

    // Loop to continuously fetch and store block height
    loop {
        match fetch_latest_block_height(&rpc).await {
            Ok(block_height) => {
                println!("Fetched block height: {}", block_height);
                store_block_height(&conn, block_height)?;
            }
            Err(e) => eprintln!("Error fetching block height: {}", e),
        }

        // Sleep for 10 seconds before the next fetch
        time::sleep(Duration::from_secs(10)).await;
    }
}
