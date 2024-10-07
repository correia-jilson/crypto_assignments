import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface BlockHeightResponse {
    height: number;
}

const App: React.FC = () => {
    const [blockHeight, setBlockHeight] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlockHeight = async () => {
            try {
                setLoading(true);
                const response = await axios.get<BlockHeightResponse>('http://localhost:3001/api/block-height');
                setBlockHeight(response.data.height);
                setError(null);
            } catch (err) {
                setError('Failed to fetch block height.');
                setBlockHeight(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBlockHeight();
        const interval = setInterval(fetchBlockHeight, 10000);

        return () => clearInterval(interval);
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
                    <p>Current Block Height: {blockHeight.toLocaleString()}</p> // Displaying with commas
                ) : (
                    <p>No block height data available.</p>
                )}
            </header>
        </div>
    );
};

export default App;
