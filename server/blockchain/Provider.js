// blockchain/provider.js
import Web3 from "web3";

let web3;

export const createWeb3Instance = () => {
    try {
        web3 = new Web3(new Web3.providers.HttpProvider(process.env.ALCHEMY_RPC_URL));   
        console.log("Web3 instance created successfully");
    } catch (error) {
        console.log("Web3 instance creation error: ",error);
    }
}


export default web3;
