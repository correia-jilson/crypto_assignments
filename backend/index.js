const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./block_data.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Endpoint to get the latest block height
app.get('/api/block-height', (req, res) => {
    db.get(
        'SELECT height FROM block_height ORDER BY id DESC LIMIT 1',
        [],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: 'Failed to fetch block height' });
            } else if (row) {
                res.json({ height: row.height });
            } else {
                res.status(404).json({ error: 'No block height found' });
            }
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

