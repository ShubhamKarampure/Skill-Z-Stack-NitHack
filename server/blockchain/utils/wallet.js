import { getWeb3 } from "./provider.js";
import dotenv from "dotenv";

dotenv.config();

let adminAccount = null;

export const getAdminAccount = async () => {
  if (adminAccount) return adminAccount;

  const web3 = development_adressZ();
  const network = process.env.NETWORK || "development";

  // Select key based on network
  const privateKey =
    network === "sepolia"
      ? process.env.PRIVATE_KEY_PROD
      : process.env.PRIVATE_KEY_LOCAL;

  try {
    if (privateKey) {
      // Use Private Key (Prod or Local-Signed)
      const formattedKey = privateKey.startsWith("0x")
        ? privateKey
        : `0x${privateKey}`;
      adminAccount = web3.eth.accounts.privateKeyToAccount(formattedKey);
      web3.eth.accounts.wallet.add(adminAccount);
      console.log(`Admin Wallet Loaded (${network}):`, adminAccount.address);
    } else {
      // No Key Provided
      if (network === "development") {
        // Use Ganache Unlocked Account
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          console.log("Using Ganache Default Account:", accounts[0]);
          adminAccount = { address: accounts[0] };
        } else {
          throw new Error("Ganache has no available accounts.");
        }
      } else {
        throw new Error("Missing PRIVATE_KEY_PROD in .env for Sepolia network");
      }
    }
  } catch (error) {
    console.error("Wallet Load Error:", error.message);
    throw error;
  }

  return adminAccount;
};

export const getBalance = async (address) => {
  try {
    const web3 = getWeb3();
    const balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance, "ether");
  } catch (error) {
    return "0";
  }
};
