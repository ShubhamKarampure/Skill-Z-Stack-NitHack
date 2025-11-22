import express from 'express';
import { createNFT, mintNFT } from '../controllers/InstituteControllers.js';
import upload from '../middleware/MulterConfig.js';

const router = express.Router();

router.post('/create-nft', upload.single('image'), createNFT);
router.post('/mint-nft', mintNFT);

export default router;