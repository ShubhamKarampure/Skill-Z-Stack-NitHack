skills-passport/
├── blockchain/                          # Blockchain & Smart Contracts Module
│   ├── contracts/
│   │   ├── core/
│   │   │   ├── CredentialNFT.sol       # Main NFT contract for credentials
│   │   │   ├── IssuerRegistry.sol      # DAO-governed issuer accreditation
│   │   │   ├── CredentialVerifier.sol  # Verification logic
│   │   │   └── RevocationRegistry.sol  # Handle revoked credentials
│   │   ├── zkp/
│   │   │   ├── ZKPVerifier.sol         # ZK proof verification contract
│   │   │   └── SelectiveDisclosure.sol # ZKP-based selective disclosure
│   │   ├── governance/
│   │   │   ├── IssuerDAO.sol           # DAO for issuer voting
│   │   │   └── Timelock.sol            # Timelock for governance
│   │   ├── interfaces/
│   │   │   ├── ICredential.sol
│   │   │   ├── IIssuer.sol
│   │   │   └── IVerifier.sol
│   │   └── libraries/
│   │       ├── CredentialTypes.sol     # Enums and structs
│   │       └── DateUtils.sol           # Expiration handling
│   ├── circuits/                        # ZK circuits (Circom/Noir)
│   │   ├── credential-proof/
│   │   │   ├── credential.circom       # Main circuit
│   │   │   ├── input.json              # Sample inputs
│   │   │   └── build/                  # Compiled circuits
│   │   ├── age-proof/
│   │   │   └── age-verification.circom
│   │   └── university-rank/
│   │       └── rank-proof.circom
│   ├── scripts/
│   │   ├── deploy.ts                    # Main deployment script
│   │   ├── deploy-issuer-registry.ts
│   │   ├── deploy-credential-nft.ts
│   │   ├── deploy-zkp-verifier.ts
│   │   ├── setup-initial-issuers.ts
│   │   └── generate-zkp.ts              # ZKP generation utilities
│   ├── test/
│   │   ├── unit/
│   │   │   ├── CredentialNFT.test.ts
│   │   │   ├── IssuerRegistry.test.ts
│   │   │   └── ZKPVerifier.test.ts
│   │   └── integration/
│   │       └── full-flow.test.ts
│   ├── migrations/                      # Alternative to scripts
│   ├── utils/
│   │   ├── ipfs.ts                      # IPFS metadata upload
│   │   ├── crypto.ts                    # Cryptographic utilities
│   │   └── constants.ts
│   ├── artifacts/                       # Compiled contracts (generated)
│   ├── cache/                          # Build cache (generated)
│   ├── deployed/                        # Deployment addresses & ABIs
│   │   └── addresses.json
│   ├── hardhat.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── Dockerfile

├── backend/                             # Web3 API Layer & Business Logic
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts             # MongoDB config
│   │   │   ├── web3.ts                 # Web3 provider setup
│   │   │   ├── ipfs.ts                 # IPFS/Pinata config
│   │   │   └── env.ts                  # Environment variables
│   │   ├── contracts/
│   │   │   ├── abis/                   # Symlinked or copied from blockchain/
│   │   │   ├── CredentialNFT.ts        # Contract instance wrapper
│   │   │   ├── IssuerRegistry.ts
│   │   │   └── ZKPVerifier.ts
│   │   ├── controllers/
│   │   │   ├── credential.controller.ts # Issue, transfer, revoke
│   │   │   ├── issuer.controller.ts     # Issuer management
│   │   │   ├── verification.controller.ts
│   │   │   ├── student.controller.ts    # Student wallet operations
│   │   │   └── zkp.controller.ts        # ZKP generation & verification
│   │   ├── services/
│   │   │   ├── credential.service.ts    # Business logic for credentials
│   │   │   ├── issuer.service.ts
│   │   │   ├── verification.service.ts
│   │   │   ├── blockchain.service.ts    # Web3 interactions
│   │   │   ├── ipfs.service.ts          # Metadata upload/retrieval
│   │   │   ├── zkp.service.ts           # ZKP proof generation
│   │   │   └── notification.service.ts  # Email/webhook notifications
│   │   ├── models/
│   │   │   ├── Credential.model.ts      # MongoDB schema
│   │   │   ├── Issuer.model.ts
│   │   │   ├── Student.model.ts
│   │   │   ├── Verification.model.ts    # Verification logs
│   │   │   └── Transaction.model.ts     # Blockchain tx tracking
│   │   ├── routes/
│   │   │   ├── index.ts                 # Route aggregator
│   │   │   ├── credential.routes.ts     # /api/credentials/*
│   │   │   ├── issuer.routes.ts         # /api/issuers/*
│   │   │   ├── verification.routes.ts   # /api/verify/*
│   │   │   ├── student.routes.ts        # /api/students/*
│   │   │   └── zkp.routes.ts            # /api/zkp/*
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts       # JWT/Wallet signature auth
│   │   │   ├── validation.middleware.ts # Request validation
│   │   │   ├── error.middleware.ts      # Error handling
│   │   │   ├── rateLimiter.middleware.ts
│   │   │   └── logger.middleware.ts
│   │   ├── validators/
│   │   │   ├── credential.validator.ts  # Joi/Zod schemas
│   │   │   ├── issuer.validator.ts
│   │   │   └── verification.validator.ts
│   │   ├── utils/
│   │   │   ├── web3Helper.ts
│   │   │   ├── encryption.ts            # Data encryption helpers
│   │   │   ├── logger.ts                # Winston logger
│   │   │   └── errors.ts                # Custom error classes
│   │   ├── types/
│   │   │   ├── credential.types.ts
│   │   │   ├── zkp.types.ts
│   │   │   └── api.types.ts
│   │   ├── events/                      # Blockchain event listeners
│   │   │   ├── credentialIssued.listener.ts
│   │   │   ├── credentialRevoked.listener.ts
│   │   │   └── issuerAccredited.listener.ts
│   │   └── app.ts                       # Express app setup
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── logs/
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile