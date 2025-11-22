// scripts/test-connection.js
import dotenv from 'dotenv';
import Web3 from 'web3';

dotenv.config();

const testConnection = async () => {
    try {
        console.log('\n🧪 Testing Blockchain Connection...\n');

        const web3 = new Web3(process.env.GANACHE_URL);
        const isListening = await web3.eth.net.isListening();
        console.log('✓ Web3 Connected:', isListening);

        const networkId = await web3.eth.net.getId();
        console.log('✓ Network ID:', networkId);

        const blockNumber = await web3.eth.getBlockNumber();
        console.log('✓ Current Block:', blockNumber);

        if (process.env.PRIVATE_KEY) {
            const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
            console.log('✓ Admin Account:', account.address);

            const balance = await web3.eth.getBalance(account.address);
            console.log('✓ Balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
        } else {
            console.log('⚠️  PRIVATE_KEY not set in .env');
        }

        console.log('\n✅ All connections successful!\n');

    } catch (error) {
        console.error('\n❌ Connection failed:', error.message);
        console.log('\n💡 Make sure Ganache is running on', process.env.GANACHE_URL);
    }
};

testConnection();
