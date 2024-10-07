const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to SQLite database stored in the /data folder inside the container
let db = new sqlite3.Database('/data/block_data.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create the block_height table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS block_height (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        height INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) {
        console.error('Error creating block_height table:', err.message);
    } else {
        console.log('block_height table is ready.');
    }
});

// Endpoint to get the latest block height
app.get('/api/block-height', (req, res) => {
    db.get('SELECT height FROM block_height ORDER BY id DESC LIMIT 1', [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching block height.' });
        }
        if (!row) {
            return res.status(404).json({ error: 'No block height found.' });
        }
        res.json({ height: row.height });
    });
});

// Gracefully close the database connection on server shutdown
process.on('SIGINT', () => {
    console.log('Closing SQLite connection.');
    db.close((err) => {
        if (err) {
            console.error('Error closing SQLite:', err.message);
        }
        process.exit(0);
    });
});

// Start the backend server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
