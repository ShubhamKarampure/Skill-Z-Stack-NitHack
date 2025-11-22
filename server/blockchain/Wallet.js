// blockchain/wallet.js
import web3 from "./Provider.js";

const account = web3.eth.accounts.wallet.add(process.env.METAMASK_PRIVATE_KEY);

export default account;
