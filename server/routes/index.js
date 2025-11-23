// src/routes/index.js
import express from 'express';
import authRoutes from './authRoutes.js';
import issuerRoutes from './issuerRoutes.js';
import credentialRoutes from './credentialRoutes.js';
import verifierRoutes from './verifierRoutes.js';
import metadataRoutes from './metadataRoutes.js';
import userRoutes from './userRoutes.js';
import blockchainRoutes from './blockchainRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js'; // NEW

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Skills Passport API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/issuers', issuerRoutes);
router.use('/credentials', credentialRoutes);
router.use('/verify', verifierRoutes);
router.use('/metadata', metadataRoutes);
router.use('/users', userRoutes);
router.use('/blockchain', blockchainRoutes);
router.use('/enrollments', enrollmentRoutes); // NEW

export default router;
