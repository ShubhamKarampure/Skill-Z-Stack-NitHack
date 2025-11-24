import { ethers } from "ethers";
import { getPrivateKey } from "./wallet-constants";
import { useAuthStore } from "./store";

const IS_PRODUCTION = process.env.NEXT_PUBLIC_NODE_ENV === "production";

interface TxData {
  to: string;
  from: string;
  data: string;
  gasLimit?: string | number;
  value?: string | number;
}

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
      provider = new ethers.BrowserProvider(window.ethereum);
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
    let finalGasLimit = BigInt(3000000); // Default safe high limit

    try {
      // Try to estimate gas accurately
      const estimated = await provider.estimateGas({
        to: txData.to,
        from: txData.from,
        data: txData.data,
        value: txData.value || 0,
      });
      // Add 20% buffer to estimation
      finalGasLimit = (estimated * BigInt(120)) / BigInt(100);
    } catch (e) {
      console.warn("Gas estimation failed, using hardcoded fallback (3M).", e);
    }

    // Force override if provided in args, otherwise use calculated/fallback
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

    // Wait for confirmation
    const receipt = await response.wait();

    if (!receipt) {
      throw new Error("Transaction mined but no receipt returned.");
    }

    return receipt;
  } catch (error: any) {
    console.error("Transaction Signing/Sending Failed:", error);
    // Extract internal JSON-RPC error if available
    if (error.info?.error?.message) {
      throw new Error(`RPC Error: ${error.info.error.message}`);
    }
    throw error;
  }
};
