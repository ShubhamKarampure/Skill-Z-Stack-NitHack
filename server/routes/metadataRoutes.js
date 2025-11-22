// src/routes/metadataRoutes.js
import express from 'express';
import multer from 'multer';
import {
    uploadCredentialMetadata,
    getMetadata
} from '../controllers/credentialMetadataController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and PDF allowed.'));
        }
    }
});

// Upload metadata to IPFS
router.post(
    '/upload',
    authenticate,
    requireRole(['institute', 'admin']),
    upload.single('file'),
    uploadCredentialMetadata
);

// Get metadata by CID
router.get('/:cid', getMetadata);

export default router;
