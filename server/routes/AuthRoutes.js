// src/routes/authRoutes.js
import express from 'express';
import {
    register,
    login,
    getProfile,
    updateProfile
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes (require authentication)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Logout (optional - mainly handled on client side with JWT)
router.post('/logout', authenticate, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

export default router;
