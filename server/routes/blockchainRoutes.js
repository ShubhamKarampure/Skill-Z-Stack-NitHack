// src/routes/blockchainRoutes.js
import express from 'express';
import { getWeb3 } from '../blockchain/utils/provider.js';
import { checkConnection } from '../blockchain/utils/provider.js';
import { addresses } from '../blockchain/utils/contractLoader.js';

const router = express.Router();

// Get blockchain status
router.get('/status', async (req, res) => {
    try {
        const status = await checkConnection();
        res.status(200).json({ success: true, blockchain: status });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get deployed contract addresses
router.get('/contracts', (req, res) => {
    res.status(200).json({ success: true, contracts: addresses });
});

// Get current gas price
router.get('/gas-price', async (req, res) => {
    try {
        const web3 = getWeb3();
        const gasPrice = await web3.eth.getGasPrice();
        const gasPriceGwei = web3.utils.fromWei(gasPrice, 'gwei');

        res.status(200).json({
            success: true,
            gasPrice: {
                wei: gasPrice,
                gwei: gasPriceGwei
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get account balance
router.get('/balance/:address', async (req, res) => {
    try {
        const web3 = getWeb3();
        const balance = await web3.eth.getBalance(req.params.address);
        const balanceEth = web3.utils.fromWei(balance, 'ether');

        res.status(200).json({
            success: true,
            balance: {
                wei: balance,
                eth: balanceEth
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
