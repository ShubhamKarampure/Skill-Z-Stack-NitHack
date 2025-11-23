require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    sepolia: {
      provider: () => new HDWalletProvider({
        privateKeys: [process.env.METAMASK_PRIVATE_KEY],
        providerOrUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        pollingInterval: 15000,        // Increased from 10000
        timeout: 300000                // Added 5 minute timeout
      }),
      network_id: 11155111,
      gas: 6000000,
      gasPrice: 20000000000,
      confirmations: 2,
      timeoutBlocks: 500,              // Increased from 200
      skipDryRun: true,
      networkCheckTimeout: 1000000,    // Increased from 100000
      deploymentPollingInterval: 15000 // Increased from 10000
    },
  },

  mocha: {
    timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
        // Remove viaIR: true
      },
      evmVersion: "london"
    }
  }
};
