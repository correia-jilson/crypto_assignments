import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App: React.FC = () => {
    const [blockHeight, setBlockHeight] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlockHeight = async () => {
            try {
                setLoading(true);
                
                const response = await axios.get('https://blockstream.info/api/blocks/tip/height');
                setBlockHeight(Number(response.data));
                setError(null);
            } catch (err) {
                setError('Failed to fetch block height.');
                setBlockHeight(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBlockHeight();
        const interval = setInterval(fetchBlockHeight, 10000); // Fetch every 10 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Bitcoin Block Height</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : blockHeight !== null ? (
                    <p>Current Block Height: {blockHeight.toLocaleString()}</p> // Display with commas
                ) : (
                    <p>No block height data available.</p>
                )}
            </header>
        </div>
    );
};

export default App;
