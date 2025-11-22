// src/middleware/validation.js
import { body, param, validationResult } from 'express-validator';
import { getWeb3 } from '../blockchain/utils/provider.js';

// Handle validation errors
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Registration validation
export const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must contain uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain number'),

    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['student', 'institute', 'employer', 'admin']).withMessage('Invalid role'),

    body('walletAddress')
        .notEmpty().withMessage('Wallet address is required')
        .custom((value) => {
            const web3 = getWeb3();
            if (!web3.utils.isAddress(value)) {
                throw new Error('Invalid Ethereum address');
            }
            return true;
        }),

    validate
];

// Login validation
export const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('Password is required'),

    validate
];

// Ethereum address validation
export const validateAddress = [
    param('address')
        .notEmpty().withMessage('Address is required')
        .custom((value) => {
            const web3 = getWeb3();
            if (!web3.utils.isAddress(value)) {
                throw new Error('Invalid Ethereum address');
            }
            return true;
        }),

    validate
];

// Token ID validation
export const validateTokenId = [
    param('tokenId')
        .notEmpty().withMessage('Token ID is required')
        .isNumeric().withMessage('Token ID must be numeric'),

    validate
];

// Credential issuance validation
export const validateCredentialIssuance = [
    body('issuerPrivateKey')
        .notEmpty().withMessage('Issuer private key is required'),

    body('holderAddress')
        .notEmpty().withMessage('Holder address is required')
        .custom((value) => {
            const web3 = getWeb3();
            if (!web3.utils.isAddress(value)) {
                throw new Error('Invalid holder address');
            }
            return true;
        }),

    body('metadataURI')
        .notEmpty().withMessage('Metadata URI is required')
        .isURL().withMessage('Invalid URI format'),

    body('credentialType')
        .optional()
        .isInt({ min: 0, max: 2 }).withMessage('Credential type must be 0 (DEGREE), 1 (CERTIFICATE), or 2 (BADGE)'),

    validate
];
