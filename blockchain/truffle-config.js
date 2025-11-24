require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider({
          privateKeys: [process.env.PRIVATE_KEY],
          providerOrUrl: process.env.ALCHEMY_URL,
          pollingInterval: 30000, // Check every 30 seconds (Slow down!)
          deploymentPollingInterval: 30000,
        }),
      network_id: 11155111,
      gas: 6000000,
      gasPrice: 30000000000, // 30 Gwei (pay a bit more to be faster)
      confirmations: 2,
      timeoutBlocks: 500, // Wait long for blocks
      skipDryRun: true,
      networkCheckTimeout: 10000000, // Don't timeout easily
      disableConfirmationListener: true, // ⚠️ Helps prevent hanging
    },
  },

  mocha: {
    timeout: 100000,
  },

  compilers: {
    solc: {
      version: "0.8.20", 
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
      evmVersion: "paris", 
    },
  },
};
