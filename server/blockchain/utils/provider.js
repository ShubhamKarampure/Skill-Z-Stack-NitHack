import { createWeb3Instance } from "../config/web3Config.js";

let web3Instance = null;

export const getWeb3 = () => {
  if (!web3Instance) {
    web3Instance = createWeb3Instance();
  }
  return web3Instance;
};

export const checkConnection = async () => {
  try {
    const web3 = getWeb3();
    const isListening = await web3.eth.net.isListening();
    const networkId = await web3.eth.net.getId();
    const blockNumber = await web3.eth.getBlockNumber();

    return {
      connected: isListening,
      networkId: Number(networkId),
      blockNumber: Number(blockNumber),
    };
  } catch (error) {
    console.error("Blockchain Provider Error:", error.message);
    return { connected: false, error: error.message };
  }
};
