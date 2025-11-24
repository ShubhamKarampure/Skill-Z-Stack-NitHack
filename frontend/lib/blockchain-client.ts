import { ethers } from "ethers";
import { getPrivateKey } from "./wallet-constants";
import { useAuthStore } from "./store";

const IS_PRODUCTION = process.env.NEXT_PUBLIC_NODE_ENV === "production";

// Hex version of Sepolia Chain ID (11155111)
const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";

interface TxData {
  to: string;
  from: string;
  data: string;
  gasLimit?: string | number;
  value?: string | number;
}

// Helper to switch MetaMask network
const switchToSepolia = async () => {
  if (!window.ethereum) return;

  try {
    // Try to switch to Sepolia
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
  } catch (switchError: any) {
    // This error code 4902 means the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID_HEX,
              chainName: "Sepolia Test Network",
              rpcUrls: ["https://sepolia.drpc.org"], // Public RPC or use your Alchemy URL
              nativeCurrency: {
                name: "SepoliaETH",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      } catch (addError) {
        throw new Error("Failed to add Sepolia network to MetaMask");
      }
    } else {
      throw switchError;
    }
  }
};

export const signAndSendTransaction = async (
  txData: TxData
): Promise<ethers.TransactionReceipt> => {
  try {
    let provider;
    let signer;

    if (IS_PRODUCTION) {
      // --- PRODUCTION: METAMASK ---
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      // 1. FORCE NETWORK SWITCH BEFORE DOING ANYTHING ELSE
      await switchToSepolia();

      // 2. Now initialize provider on the correct network
      provider = new ethers.BrowserProvider(window.ethereum);

      // It is good practice to re-fetch the signer after a network switch
      signer = await provider.getSigner();

      const signerAddress = await signer.getAddress();
      if (signerAddress.toLowerCase() !== txData.from.toLowerCase()) {
        throw new Error(
          `MetaMask account (${signerAddress}) does not match the transaction sender (${txData.from})`
        );
      }
    } else {
      // --- DEVELOPMENT: LOCAL KEY ---
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:8545";
      provider = new ethers.JsonRpcProvider(rpcUrl);

      let senderAddress = txData.from;
      if (!senderAddress) {
        const user = useAuthStore.getState().user;
        if (user && user.walletAddress) {
          console.warn(
            "Tx 'from' address missing, falling back to Auth Store."
          );
          senderAddress = user.walletAddress;
        } else {
          throw new Error("Transaction missing 'from' address.");
        }
      }

      const privateKey = getPrivateKey(senderAddress);
      signer = new ethers.Wallet(privateKey, provider);
    }

    // --- GAS ESTIMATION WITH FALLBACK ---
    let finalGasLimit = BigInt(3000000);

    try {
      const estimated = await provider.estimateGas({
        to: txData.to,
        from: txData.from,
        data: txData.data,
        value: txData.value || 0,
      });
      finalGasLimit = (estimated * BigInt(120)) / BigInt(100);
    } catch (e) {
      console.warn("Gas estimation failed, using hardcoded fallback (3M).", e);
    }

    if (txData.gasLimit) {
      finalGasLimit = BigInt(txData.gasLimit);
    }

    const transaction = {
      to: txData.to,
      data: txData.data,
      gasLimit: finalGasLimit,
      value: txData.value || 0,
    };

    console.log(
      `Sending transaction in ${
        IS_PRODUCTION ? "PRODUCTION" : "DEV"
      } mode... Gas Limit: ${finalGasLimit}`
    );

    const response = await signer.sendTransaction(transaction);

    console.log(
      `Transaction sent! Hash: ${response.hash}. Waiting for receipt...`
    );

    const receipt = await response.wait();

    if (!receipt) {
      throw new Error("Transaction mined but no receipt returned.");
    }

    return receipt;
  } catch (error: any) {
    console.error("Transaction Signing/Sending Failed:", error);
    if (error.info?.error?.message) {
      throw new Error(`RPC Error: ${error.info.error.message}`);
    }
    throw error;
  }
};
