// src/blockchain/utils/wallet.js
import { getWeb3 } from './provider.js';
import dotenv from 'dotenv';

dotenv.config();

let adminAccount = null;

export const getAdminAccount = () => {
    if (!adminAccount) {
        const web3 = getWeb3();
        const privateKey = process.env.PRIVATE_KEY;

        if (!privateKey) {
            throw new Error('PRIVATE_KEY not found in environment variables');
        }

        const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
        adminAccount = web3.eth.accounts.privateKeyToAccount(formattedKey);
        web3.eth.accounts.wallet.add(adminAccount);

        console.log('✓ Admin account loaded:', adminAccount.address);
    }

    return adminAccount;
};

export const getBalance = async (address) => {
    const web3 = getWeb3();
    const balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance, 'ether');
};
