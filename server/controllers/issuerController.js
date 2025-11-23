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

export const getAllInstitutes = async (req, res) => {
    try {
        const { page = 1, limit = 20, accredited, suspended } = req.query;

        // Build filter
        const filter = { role: 'institute' };

        if (accredited !== undefined) {
            filter['instituteData.isAccredited'] = accredited === 'true';
        }

        if (suspended !== undefined) {
            filter['instituteData.isSuspended'] = suspended === 'true';
        }

        // Get institutes with pagination
        const institutes = await UserModel.find(filter)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await UserModel.countDocuments(filter);

        // Separate institutes by status
        const accreditedInstitutes = institutes.filter(
            inst => inst.instituteData?.isAccredited && !inst.instituteData?.isSuspended
        );
        const pendingInstitutes = institutes.filter(
            inst => inst.instituteData?.isRegistered && !inst.instituteData?.isAccredited
        );
        const unregisteredInstitutes = institutes.filter(
            inst => !inst.instituteData?.isRegistered
        );
        const suspendedInstitutes = institutes.filter(
            inst => inst.instituteData?.isSuspended
        );

        return res.status(200).json({
            success: true,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
            stats: {
                total: count,
                accredited: accreditedInstitutes.length,
                pending: pendingInstitutes.length,
                unregistered: unregisteredInstitutes.length,
                suspended: suspendedInstitutes.length
            },
            institutes: {
                all: institutes,
                accredited: accreditedInstitutes,
                pending: pendingInstitutes,
                unregistered: unregisteredInstitutes,
                suspended: suspendedInstitutes
            }
        });

    } catch (error) {
        console.error('Get All Institutes Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get institutes',
            error: error.message
        });
    }
};

// NEW: Get institute details by ID (Admin view)
export const getInstituteById = async (req, res) => {
    try {
        const { instituteId } = req.params;

        const institute = await UserModel.findById(instituteId).select('-password');

        if (!institute || institute.role !== 'institute') {
            return res.status(404).json({
                success: false,
                message: 'Institute not found'
            });
        }

        // Get additional stats
        const enrolledStudentCount = institute.instituteData?.enrolledStudents?.filter(
            s => s.isActive
        ).length || 0;

        const issuedCredentialCount = institute.instituteData?.issuedCredentials?.length || 0;

        return res.status(200).json({
            success: true,
            institute: {
                ...institute.toObject(),
                stats: {
                    enrolledStudents: enrolledStudentCount,
                    issuedCredentials: issuedCredentialCount
                }
            }
        });

    } catch (error) {
        console.error('Get Institute By ID Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get institute',
            error: error.message
        });
    }
};

// NEW: Quick accredit flow (combines register + accredit)
export const quickAccreditInstitute = async (req, res) => {
    try {
        const { instituteId } = req.body;

        // Get institute
        const institute = await UserModel.findById(instituteId);

        if (!institute || institute.role !== 'institute') {
            return res.status(404).json({
                success: false,
                message: 'Institute not found'
            });
        }

        // Check if already accredited
        if (institute.instituteData?.isAccredited) {
            return res.status(400).json({
                success: false,
                message: 'Institute is already accredited'
            });
        }

        const issuerAddress = institute.walletAddress;
        const name = institute.name;
        const metadataURI = institute.instituteData?.instituteMetadata?.website ||
            `ipfs://Qm${institute._id}`;

        // Step 1: Register on blockchain if not registered
        if (!institute.instituteData?.isRegistered) {
            try {
                const registerResult = await issuerService.registerIssuer(
                    issuerAddress,
                    name,
                    metadataURI
                );

                institute.instituteData.isRegistered = true;
                institute.instituteData.registrationTxHash = registerResult.transactionHash;
                await institute.save();
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to register institute on blockchain',
                    error: error.message
                });
            }
        }

        // Step 2: Accredit on blockchain
        try {
            const accreditResult = await issuerService.accreditIssuer(issuerAddress);

            institute.instituteData.isAccredited = true;
            institute.instituteData.accreditationDate = new Date();
            institute.instituteData.accreditationTxHash = accreditResult.transactionHash;
            await institute.save();

            return res.status(200).json({
                success: true,
                message: 'Institute accredited successfully',
                data: {
                    registrationTxHash: institute.instituteData.registrationTxHash,
                    accreditationTxHash: accreditResult.transactionHash
                },
                institute: {
                    id: institute._id,
                    name: institute.name,
                    walletAddress: institute.walletAddress,
                    isAccredited: true,
                    accreditationDate: institute.instituteData.accreditationDate
                }
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to accredit institute on blockchain',
                error: error.message
            });
        }

    } catch (error) {
        console.error('Quick Accredit Institute Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to accredit institute',
            error: error.message
        });
    }
};

// NEW: Get institute statistics (Admin dashboard)
export const getInstituteStats = async (req, res) => {
    try {
        const totalInstitutes = await UserModel.countDocuments({ role: 'institute' });

        const accredited = await UserModel.countDocuments({
            role: 'institute',
            'instituteData.isAccredited': true,
            'instituteData.isSuspended': false
        });

        const pending = await UserModel.countDocuments({
            role: 'institute',
            'instituteData.isRegistered': true,
            'instituteData.isAccredited': false
        });

        const unregistered = await UserModel.countDocuments({
            role: 'institute',
            'instituteData.isRegistered': { $ne: true }
        });

        const suspended = await UserModel.countDocuments({
            role: 'institute',
            'instituteData.isSuspended': true
        });

        return res.status(200).json({
            success: true,
            stats: {
                total: totalInstitutes,
                accredited,
                pending,
                unregistered,
                suspended
            }
        });

    } catch (error) {
        console.error('Get Institute Stats Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get institute statistics',
            error: error.message
        });
    }
};
