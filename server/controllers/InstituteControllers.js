import NFTModel from "../models/NFTModel.js";
import { uploadFileToPinata, uploadJSONToPinata } from "../utils/PinataHelper.js";
import UserModel from "../models/UserModel.js";
import nftContract from "../blockchain/NFTContract.js";
import account from "../blockchain/Wallet.js";
import web3 from "../blockchain/Provider.js";

export const createNFT = async (req, res) => {
    try {
        const file = req.file;
        const ownerId = req.body.ownerId;  // Metamask address

        const owner=await UserModel.findById(ownerId).then(user=>user.walletAddress);

        if (!file) 
            return res.status(400).json({ message: "Image file is required." });

        if (!owner)
            return res.status(400).json({ message: "Owner wallet address is required." });

        // Upload image to Pinata
        const imageCID = await uploadFileToPinata(file.path);
        const imageURL = `ipfs://${imageCID}`;

        // Build metadata JSON
        const metadata = {
            name: "DAO Credential NFT",
            image: imageURL,
            description: "Credential issued by DAO platform.",
            owner
        };

        // Upload metadata JSON to Pinata
        const metadataCID = await uploadJSONToPinata(metadata);
        const metadataURI = `ipfs://${metadataCID}`;

        const nft = await NFTModel.create({
            owner,
            imageCID,
            metadataCID,
            metadataURI,
            isMinted: false
        });

        return res.status(201).json({
            message: "NFT metadata created successfully.",
            nft
        });

    } catch (error) {
        console.error("NFT Create Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const mintNFT = async (req, res) => {
    try {
        const { nftId, toAddress } = req.body;

        if (!nftId || !toAddress) {
            return res.status(400).json({ message: "nftId and toAddress are required." });
        }

        // 1. Fetch NFT metadata from DB
        const nft = await NFTModel.findById(nftId);
        if (!nft) {
            return res.status(404).json({ message: "NFT not found" });
        }

        if (nft.isMinted) {
            return res.status(400).json({ message: "NFT already minted" });
        }

        const tokenURI = `ipfs://${nft.metadataCID}`;

        // 2. Build transaction
        const tx = nftContract.methods.mint(toAddress, tokenURI);

        const gas = await tx.estimateGas({ from: account.address });

        const txData = {
            from: account.address,
            to: nftContract.options.address,
            data: tx.encodeABI(),
            gas
        };

        // 3. Sign + send
        const receipt = await web3.eth.sendTransaction(txData);

        // 4. Update DB
        nft.isMinted = true;
        nft.save();

        return res.status(200).json({
            success: true,
            message: "NFT minted successfully",
            transactionHash: receipt.transactionHash,
            tokenURI,
        });

    } catch (error) {
        console.error("Mint NFT Error:", error);
        return res.status(500).json({ message: "Server error minting NFT" });
    }
};
