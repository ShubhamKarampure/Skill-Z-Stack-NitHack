// src/controllers/issuerController.js
import issuerService from '../blockchain/services/issuerService.js';
import UserModel from '../models/User.js';

export const registerIssuer = async (req, res) => {
    try {
        const { issuerAddress, name, metadataURI } = req.body;

        // Validation
        if (!issuerAddress || !name || !metadataURI) {
            return res.status(400).json({
                success: false,
                message: 'issuerAddress, name, and metadataURI are required'
            });
        }

        // Register on blockchain
        const result = await issuerService.registerIssuer(
            issuerAddress,
            name,
            metadataURI
        );

        // Update database
        const user = await UserModel.findOneAndUpdate(
            { walletAddress: issuerAddress.toLowerCase() },
            {
                'instituteData.isRegistered': true,
                'instituteData.registrationTxHash': result.transactionHash
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Issuer registered successfully',
            data: result,
            user: user?.instituteData
        });

    } catch (error) {
        console.error('Register Issuer Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to register issuer',
            error: error.message
        });
    }
};

export const accreditIssuer = async (req, res) => {
    try {
        const { issuerAddress } = req.body;

        if (!issuerAddress) {
            return res.status(400).json({
                success: false,
                message: 'issuerAddress is required'
            });
        }

        // Accredit on blockchain
        const result = await issuerService.accreditIssuer(issuerAddress);

        // Update database
        const user = await UserModel.findOneAndUpdate(
            { walletAddress: issuerAddress.toLowerCase() },
            {
                'instituteData.isAccredited': true,
                'instituteData.accreditationDate': new Date(),
                'instituteData.accreditationTxHash': result.transactionHash
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Issuer accredited successfully',
            data: result,
            user: user?.instituteData
        });

    } catch (error) {
        console.error('Accredit Issuer Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to accredit issuer',
            error: error.message
        });
    }
};

export const getIssuer = async (req, res) => {
    try {
        const { address } = req.params;

        // Get from blockchain
        const issuer = await issuerService.getIssuer(address);

        // Get from database for additional info
        const user = await UserModel.findOne({
            walletAddress: address.toLowerCase()
        }).select('-password');

        return res.status(200).json({
            success: true,
            issuer,
            user: user?.instituteData
        });

    } catch (error) {
        console.error('Get Issuer Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get issuer',
            error: error.message
        });
    }
};

export const getAllAccreditedIssuers = async (req, res) => {
    try {
        const issuers = await issuerService.getAllAccreditedIssuers();

        return res.status(200).json({
            success: true,
            count: issuers.length,
            issuers
        });

    } catch (error) {
        console.error('Get All Issuers Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get issuers',
            error: error.message
        });
    }
};

export const checkAccreditation = async (req, res) => {
    try {
        const { address } = req.params;

        const isAccredited = await issuerService.isAccredited(address);

        return res.status(200).json({
            success: true,
            address,
            isAccredited
        });

    } catch (error) {
        console.error('Check Accreditation Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to check accreditation',
            error: error.message
        });
    }
};

export const suspendIssuer = async (req, res) => {
    try {
        const { issuerAddress, reason } = req.body;

        if (!issuerAddress || !reason) {
            return res.status(400).json({
                success: false,
                message: 'issuerAddress and reason are required'
            });
        }

        const result = await issuerService.suspendIssuer(issuerAddress, reason);

        await UserModel.findOneAndUpdate(
            { walletAddress: issuerAddress.toLowerCase() },
            {
                'instituteData.isSuspended': true,
                'instituteData.suspensionReason': reason,
                'instituteData.suspensionTxHash': result.transactionHash
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Issuer suspended successfully',
            data: result
        });

    } catch (error) {
        console.error('Suspend Issuer Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to suspend issuer',
            error: error.message
        });
    }
};
