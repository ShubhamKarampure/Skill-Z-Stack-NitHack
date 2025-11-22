// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

// Authenticate user with JWT
export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await UserModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Attach user to request
        req.user = user;
        req.userId = user._id;
        req.userRole = user.role;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error.message
        });
    }
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await UserModel.findById(decoded.id).select('-password');

            if (user && user.isActive) {
                req.user = user;
                req.userId = user._id;
                req.userRole = user.role;
            }
        }

        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};

// Require specific role(s)
export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.userRole)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(' or ')}`
            });
        }

        next();
    };
};

// Check if user owns the resource
export const requireOwnership = (ownerField = 'walletAddress') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const resourceOwner = req.params[ownerField] || req.body[ownerField];

        if (resourceOwner?.toLowerCase() !== req.user.walletAddress.toLowerCase()) {
            // Allow admin to bypass
            if (req.userRole !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You do not own this resource.'
                });
            }
        }

        next();
    };
};
