import mongoose from "mongoose";

const NFTSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    imageCID: { type: String, required: true },
    metadataCID: { type: String, required: true },
    metadataURI: { type: String, required: true },
    tokenId: { type: Number },
    isMinted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("NFT", NFTSchema);
