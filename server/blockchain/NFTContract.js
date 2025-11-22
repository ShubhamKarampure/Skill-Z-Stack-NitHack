// blockchain/nftContract.js
import web3 from "./Provider.js";
import account from "./Wallet.js";
import nftAbi from "../abi/NFT.json" assert { type: "json" };

const nftContract = new web3.eth.Contract(
  nftAbi,
  process.env.NFT_CONTRACT_ADDRESS,
  { from: account.address }
);

export default nftContract;
