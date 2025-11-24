// src/blockchain/config/web3Config.js
import Web3 from 'web3';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    networks: {
        development: {
            url: process.env.GANACHE_URL || 'http://127.0.0.1:7545',
            networkId: 5777,
            gasLimit: 6721975
        },
        sepolia: {
            url: process.env.ALCHEMY_URL,
            networkId: 11155111,
            gasLimit: 8000000
        }
    },

    currentNetwork: process.env.NETWORK || 'development',
    privateKey: process.env.PRIVATE_KEY,

    gas: {
        price: process.env.GAS_PRICE || '20000000000',
        limit: process.env.GAS_LIMIT || '6721975'
    }
};

const createWeb3Instance = () => {
    try {
        const networkConfig = config.networks[config.currentNetwork];
        const web3 = new Web3(new Web3.providers.HttpProvider(networkConfig.url));

        console.log(`✓ Web3 connected to ${config.currentNetwork} at ${networkConfig.url}`);
        return web3;
    } catch (error) {
        console.error('✗ Web3 instance creation failed:', error.message);
        throw error;
    }
};

export { config, createWeb3Instance };
