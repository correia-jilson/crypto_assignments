import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App: React.FC = () => {
    const [blockHeight, setBlockHeight] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch block height from the backend API
        const fetchBlockHeight = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/block-height');
                setBlockHeight(response.data.height);
            } catch (error) {
                setError('Failed to fetch block height.');
            }
        };

        // Call the function immediately and then every 10 seconds
        fetchBlockHeight();
        const interval = setInterval(fetchBlockHeight, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Bitcoin Block Height</h1>
                {error ? (
                    <p>{error}</p>
                ) : (
                    <p>
                        Current Block Height: {blockHeight !== null ? blockHeight : 'Loading...'}
                    </p>
                )}
            </header>
        </div>
    );
};

export default App;
