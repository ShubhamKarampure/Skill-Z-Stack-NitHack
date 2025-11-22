import mongoose from "mongoose";

const NFTSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    imageCID: { type: String, required: true },
    tokenURI: { type: String, required: true },
    tokenId: { type: Number, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model("NFT", NFTSchema);
