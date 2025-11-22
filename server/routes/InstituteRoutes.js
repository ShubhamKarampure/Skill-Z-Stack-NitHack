import express from 'express';
import { createNFT, mintNFT } from '../controllers/InstituteControllers.js';

const router = express.Router();

router.post('/create-nft', createNFT);
router.post('/mint-nft', mintNFT);

export default router;