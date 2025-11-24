<div align="center">

# 🎓 Skill-Z

### Decentralized Credential & Skill Passport

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success)]()
[![Hackathon](https://img.shields.io/badge/Event-NITHacks_8.0-orange)]()
[![Stack](https://img.shields.io/badge/Stack-MERN_%7C_Web3-blueviolet)]()
[![Winner](https://img.shields.io/badge/🏆_Winner-Blockchain_Track-gold)]()

**A DAO-Governed, Privacy-Preserving Credential Verification Protocol**  
*Powered by ZK-SNARKs and AI-Driven 3D Skill Constellations*

**🏆 1st Place Winner - Blockchain Problem Statement | NITHacks 8.0**

[Live Demo](https://skill-z-stack-nit-hack.vercel.app/) • [Documentation](#-documentation) • [Report Bug](../../issues) • [Request Feature](../../issues)

![Skill-Z Banner](https://github.com/user-attachments/assets/8ae11768-5179-4600-b7ca-54fa6a5a461a)

</div>

---

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [💡 Problem & Solution](#-problem--solution)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development Setup](#local-development-setup)
  - [Production Deployment](#production-deployment)
- [⚙️ Configuration](#️-configuration)
- [👥 Team](#-team)
- [📄 License](#-license)

---

## 🌟 Overview

Skill-Z is a revolutionary blockchain-based credential verification platform that bridges the trust gap in digital credentials. By combining **Zero-Knowledge Proofs**, **NFT credentials**, and **AI-powered skill mapping**, we create a tamper-proof, privacy-first ecosystem for educational and professional achievements.

### 🎯 What Makes Skill-Z Different?

- **Privacy-First**: Prove your credentials without revealing sensitive data using ZK-SNARKs
- **Instant Verification**: No more weeks-long background checks or expensive verification services
- **DAO Governance**: Community-driven accreditation system with reputation-based voting
- **AI-Powered Insights**: Interactive 3D skill constellations that visualize learning paths
- **Gas Optimized**: Smart batch minting based on network conditions
- **Interoperable**: IPFS storage with REST API compatibility for existing HR systems

---

## 💡 Problem & Solution

### 🚨 The Trust Gap

| Problem | Impact |
|---------|--------|
| **Resume Fraud** | 34% of employers make hiring decisions based on unverified credentials |
| **Slow Verification** | Traditional background checks take weeks and cost ~$100 per check |
| **Data Silos** | LinkedIn, universities, and MOOCs operate in isolated ecosystems |
| **Centralized Risk** | Server failures can make credentials inaccessible when needed most |
| **Privacy Concerns** | Candidates must share full transcripts for simple age/degree verification |

### ✅ The Skill-Z Approach

We issue **tamper-proof NFT credentials** stored on blockchain, verifiable in seconds. Our **ZK-SNARK circuits** allow selective disclosure—prove you're over 21 or hold a specific degree without revealing your full academic history. An **AI-powered visualization engine** maps skill relationships and recommends growth paths, while **DAO governance** ensures only legitimate institutions can issue credentials.

---

## ✨ Key Features

### 🛡️ Privacy-First Verification
Powered by **Circom 2.0** circuits and **SnarkJS**, users can generate zero-knowledge proofs for:
- Age verification (without revealing exact birthdate)
- Credential ownership (without exposing full transcript)
- Skill proficiency (without sharing all certifications)

### 🌌 3D Skill Constellations
An interactive **Three.js (React Three Fiber)** visualization powered by **Google Gemini AI**:
- Visualize your skill graph as an explorable 3D constellation
- AI identifies skill gaps and suggests "Ghost Nodes" to learn next
- Dynamic relationships show how skills connect and complement each other

### ⛽ Intelligent Gas Management
Smart contracts monitor Ethereum network conditions:
- Batch credential minting during low-traffic periods
- Automatic cost optimization based on current Gwei prices
- Reduces minting costs by up to 60%

### 🏛️ Decentralized Governance
**DAO-based accreditation system**:
- Institutions earn reputation scores through community verification
- Token-weighted voting on new accreditations
- Automated slashing of bad actors via smart contracts
- Transparent governance logs on-chain

### 🔗 Enterprise Integration
Built for real-world adoption:
- RESTful APIs compatible with existing ATS systems
- IPFS metadata storage for decentralized access
- Webhook support for real-time verification alerts
- Bulk verification tools for HR departments

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="33%">

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js (R3F)
- **Animation**: Framer Motion
- **Web3**: Web3.js

</td>
<td valign="top" width="33%">

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Storage**: IPFS (Pinata)
- **AI**: Google Gemini API

</td>
<td valign="top" width="33%">

### Blockchain
- **Smart Contracts**: Solidity
- **Development**: Truffle
- **Local Network**: Ganache
- **Testnet**: Sepolia
- **ZKP**: Circom 2.0, SnarkJS
- **Hashing**: Poseidon

</td>
</tr>
</table>

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js Frontend]
        B[Web3 Wallet]
        C[ZK Proof Generator]
    end
    
    subgraph "API Layer"
        D[Express Server]
        E[JWT Auth]
    end
    
    subgraph "Data Layer"
        F[(MongoDB)]
        G[IPFS/Pinata]
    end
    
    subgraph "Blockchain Layer"
        H[Smart Contracts]
        I[Ethereum/Sepolia]
        J[ZK Verifier]
    end
    
    subgraph "AI Layer"
        K[Gemini API]
        L[Skill Graph Engine]
    end
    
    A -->|API Requests| D
    A -->|Web3 Calls| H
    A -->|Generate Proof| C
    C -->|Submit Proof| H
    H -->|Verify| J
    D -->|Store Data| F
    D -->|Upload Metadata| G
    H -->|Read Metadata| G
    H -->|Write Tx| I
    A -->|Skill Analysis| K
    K -->|Graph Data| L
    L -->|Render| A
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
Node.js >= 18.0.0
npm >= 9.0.0
MongoDB >= 5.0
Git
```

**Development Tools:**
```bash
npm install -g truffle ganache
```

**For Production Deployment:**
- Alchemy account (for Sepolia RPC)
- MetaMask wallet with Sepolia ETH
- Pinata account (for IPFS)
- MongoDB Atlas cluster
- Vercel/Render accounts

---

## Local Development Setup

> 🎯 **Important**: This project uses a **deterministic mnemonic** for local development to ensure all team members have the same account addresses and private keys. This eliminates configuration issues and makes collaboration seamless.

### Step 1: Clone the Repository

```bash
git clone https://github.com/ShubhamKarampure/Skill-Z-Stack-NitHack.git
cd Skill-Z-Stack-NitHack
```

### Step 2: Start Local Blockchain

Open a **dedicated terminal** and run Ganache with the exact configuration below:

```bash
ganache -a 50 -e 1000 -p 7545 -m "pear find off awake position share fuel memory wonder decide high slam" -b 2
```

**Flags Explained:**
- `-a 50`: Creates 50 test accounts
- `-e 1000`: Each account starts with 1000 ETH
- `-p 7545`: Runs on port 7545
- `-m "..."`: Uses specific mnemonic for deterministic addresses
- `-b 2`: New block every 2 seconds

> ⚠️ **CRITICAL**: Always use the exact mnemonic shown above. This ensures all developers get the same account addresses, making the pre-configured private keys work correctly.

> ⚠️ **Keep this terminal running throughout development**

### Step 3: Configure Blockchain Environment

Before deploying, set up the blockchain environment variables.

```bash
cd blockchain
npm install
```

**Create `blockchain/.env`:**

```env
# ==========================================
# PINATA CONFIGURATION (IPFS)
# ==========================================
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_API_KEY=your_pinata_secret_here
PINATA_JWT=your_pinata_jwt_here

# ==========================================
# GANACHE CONFIGURATION (Local Development)
# ==========================================
GANACHE_URL=http://localhost:7545
GANACHE_NETWORK_ID=1337

# ==========================================
# DEPLOYMENT CONFIGURATION
# ==========================================
# Use the same mnemonic as your Ganache instance
MNEMONIC=pear find off awake position share fuel memory wonder decide high slam

# For local dev, use account[0] private key from Ganache
PRIVATE_KEY=4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d

# ==========================================
# PRODUCTION CONFIGURATION (Leave empty for now)
# ==========================================
ALCHEMY_URL=

# ==========================================
# CONTRACT DEPLOYMENT SETTINGS
# ==========================================
DEPLOY_GAS_LIMIT=6721975
```

> ⚠️ **Note**: For local development, you can use the account[0] private key without the `0x` prefix. For production deployment to Sepolia, you'll need to add your MetaMask private key here.

### Step 4: Deploy Smart Contracts

Now compile and deploy the contracts to your local Ganache network.

```bash
# Compile contracts
truffle compile

# Deploy to Ganache
truffle migrate --reset --network development
```

**📋 Important:** After deployment, Truffle outputs contract addresses. You'll need these in the next step.

### Step 5: Configure Contract Addresses

Truffle generates `build/contracts/*.json` files with deployment addresses.

**Create `blockchain/config/development_addresses.json`:**

```json
{
  "CredentialNFT": "0x...",
  "ZKVerifier": "0x...",
  "DAOGovernance": "0x..."
}
```

Copy this file to the server:
```bash
cp blockchain/config/development_addresses.json server/config/
```

### Step 6: Setup Backend

```bash
cd server
npm install
```

**Create `server/.env`:**

```env
# ==========================================
# MODE SWITCHER
# ==========================================
NODE_ENV=development
NETWORK=development

# ==========================================
# BLOCKCHAIN CONFIGURATION
# ==========================================
GANACHE_URL=http://127.0.0.1:7545
RPC_URL=http://127.0.0.1:7545
NETWORK_ID=5777

# These keys are from the deterministic mnemonic (account[0])
# MNEMONIC: "pear find off awake position share fuel memory wonder decide high slam"
ADMIN_ADDRESS=0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1
PRIVATE_KEY_LOCAL=0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d

# ==========================================
# DATABASE
# ==========================================
MONGO_URI_LOCAL=mongodb://localhost:27017/skillz-local

# ==========================================
# APPLICATION SETTINGS
# ==========================================
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this
CORS_ORIGIN=http://localhost:3000

# ==========================================
# IPFS CONFIGURATION (Pinata)
# ==========================================
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
```

**Start the server:**
```bash
npm run dev
```

### Step 7: Setup Frontend

```bash
cd frontend
npm install
```

**Create `frontend/.env.local`:**

```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Blockchain
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:7545

# AI Integration
NEXT_PUBLIC_GEMINI_API_KEY=your_google_gemini_api_key

# IPFS Gateway
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud

# Environment
NEXT_PUBLIC_NODE_ENV=development
```

**Start the development server:**
```bash
npm run dev
```

### Step 8: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

**Connect MetaMask:**
1. Add Ganache network:
   - Network Name: `Ganache Local`
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337` (or `5777` depending on your Ganache config)
   - Currency Symbol: `ETH`
2. Import a Ganache account using one of the private keys from the terminal output
   - For convenience, use account[0] private key: `0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d`
3. Connect wallet to the application

> 💡 **Tip**: With the deterministic mnemonic, account[0] will always have the same address: `0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1`

---

## Production Deployment

### Prerequisites for Production

1. **Sepolia Testnet ETH**
   - Visit [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia) or [POW Faucet](https://sepolia-faucet.pk910.de/)
   - POW Faucet allows mining free ETH (requires good GPU)
   - **⚠️ Important**: Deploying contracts requires ~0.05-0.1 ETH in gas fees

2. **Get Alchemy RPC URL**
   - Sign up at [Alchemy.com](https://www.alchemy.com/)
   - Create a new app → Select "Ethereum" → "Sepolia"
   - Copy the HTTPS URL: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

3. **Get MetaMask Private Key**
   - Open MetaMask → Click three dots → Account Details → Export Private Key
   - Enter password → Copy the key
   - **🔒 Never share or commit this key**

### Step 1: Configure Blockchain for Production

**Update `blockchain/.env`:**

```env
# Pinata Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt_token

# Alchemy Sepolia RPC
ALCHEMY_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Your MetaMask Wallet
PRIVATE_KEY=your_metamask_private_key_without_0x_prefix

# Local Development (use the same mnemonic as Ganache)
MNEMONIC=pear find off awake position share fuel memory wonder decide high slam
GANACHE_URL=http://localhost:7545
GANACHE_NETWORK_ID=1337
```

**Update `blockchain/truffle-config.js`:**

Make sure the Sepolia network is configured:

```javascript
sepolia: {
  provider: () => new HDWalletProvider(
    process.env.PRIVATE_KEY,
    process.env.ALCHEMY_URL
  ),
  network_id: 11155111,
  gas: 5500000,
  confirmations: 2,
  timeoutBlocks: 200,
  skipDryRun: true
}
```

**Deploy to Sepolia:**

```bash
cd blockchain
truffle migrate --network sepolia
```

> ⏱️ This will take several minutes and consume gas fees

**Save Contract Addresses:**

Create `blockchain/config/sepolia_addresses.json` with the deployed addresses, then:

```bash
cp blockchain/config/sepolia_addresses.json server/config/
```

### Step 2: Configure Backend for Production

**Update `server/.env`:**

```env
# ==========================================
# MODE SWITCHER (IMPORTANT!)
# ==========================================
NODE_ENV=production
NETWORK=sepolia

# ==========================================
# BLOCKCHAIN CONFIGURATION
# ==========================================
ALCHEMY_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
NETWORK_ID=11155111

# Your deployment wallet
ADMIN_ADDRESS=your_metamask_address
PRIVATE_KEY_PROD=your_metamask_private_key

# ==========================================
# DATABASE (MongoDB Atlas)
# ==========================================
MONGO_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/skillz?retryWrites=true&w=majority

# ==========================================
# APPLICATION SETTINGS
# ==========================================
PORT=5000
JWT_SECRET=production_jwt_secret_very_strong
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# ==========================================
# IPFS CONFIGURATION
# ==========================================
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
```

**Deploy Backend to Render:**
1. Push code to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Connect repository
4. Add environment variables from above
5. Deploy

### Step 3: Configure Frontend for Production

**Update `frontend/.env.local`:**

```env
# Backend API (Your Render URL)
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com

# Blockchain
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# AI Integration
NEXT_PUBLIC_GEMINI_API_KEY=your_google_gemini_api_key

# IPFS Gateway
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud

# Environment (MUST be "production")
NEXT_PUBLIC_NODE_ENV=production
```

**Deploy Frontend to Vercel:**
1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Step 4: Verify Deployment

1. **Check Smart Contracts**: Visit [Sepolia Etherscan](https://sepolia.etherscan.io/) and verify your contract addresses
2. **Test Backend**: `curl https://your-backend.onrender.com/health`
3. **Test Frontend**: Open your Vercel URL
4. **Connect Wallet**: Add Sepolia network to MetaMask and connect

---

## ⚙️ Configuration

### Environment Variables Summary

<details>
<summary><b>Backend Environment Variables</b></summary>

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Application mode | `development` or `production` |
| `NETWORK` | Blockchain network | `development` or `sepolia` |
| `GANACHE_URL` | Local blockchain RPC | `http://127.0.0.1:7545` |
| `ALCHEMY_URL` | Sepolia RPC endpoint | `https://eth-sepolia.g.alchemy.com/v2/...` |
| `PRIVATE_KEY_LOCAL` | Ganache private key | `0x4f3edf...` |
| `PRIVATE_KEY_PROD` | MetaMask private key | `abc123...` |
| `MONGO_URI_LOCAL` | Local MongoDB | `mongodb://localhost:27017/skillz` |
| `MONGO_URI_PROD` | MongoDB Atlas URI | `mongodb+srv://...` |
| `JWT_SECRET` | Authentication secret | Strong random string |
| `PINATA_API_KEY` | Pinata API key | From Pinata dashboard |
| `PINATA_SECRET_API_KEY` | Pinata secret | From Pinata dashboard |

</details>

<details>
<summary><b>Frontend Environment Variables</b></summary>

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API endpoint | Yes |
| `NEXT_PUBLIC_RPC_URL` | Blockchain RPC | Yes |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NEXT_PUBLIC_NODE_ENV` | Must be `production` for prod | Yes |
| `NEXT_PUBLIC_IPFS_GATEWAY` | IPFS gateway URL | Yes |

</details>

<details>
<summary><b>Blockchain Environment Variables</b></summary>

| Variable | Description | Required |
|----------|-------------|----------|
| `ALCHEMY_URL` | Sepolia RPC endpoint | Production only |
| `PRIVATE_KEY` | Deployment wallet key | Yes |
| `PINATA_API_KEY` | IPFS API key | Yes |
| `PINATA_SECRET_API_KEY` | IPFS secret key | Yes |

</details>

### Critical Configuration Notes

> 🔴 **IMPORTANT**: Always ensure the correct `_addresses.json` file is copied to `server/config/`:
> - For development: `development_addresses.json`
> - For production: `sepolia_addresses.json`

> 🔴 **IMPORTANT**: Frontend `NEXT_PUBLIC_NODE_ENV` must be set to `"production"` in production, otherwise the app may not connect to the correct network.

> 🔴 **IMPORTANT**: Never commit private keys or API secrets to version control. Use `.env` files and add them to `.gitignore`.

---

## 📚 Documentation

### Getting API Keys

<details>
<summary><b>Google Gemini API</b></summary>

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Create new API key
4. Copy and add to `NEXT_PUBLIC_GEMINI_API_KEY`

</details>

<details>
<summary><b>Pinata (IPFS)</b></summary>

1. Sign up at [Pinata.cloud](https://www.pinata.cloud/)
2. Go to **API Keys** → **New Key**
3. Give permissions:
   - ✅ `pinFileToIPFS`
   - ✅ `pinJSONToIPFS`
   - ✅ `unpin`
4. **Copy all three values**:
   - **API Key** → Add to `PINATA_API_KEY`
   - **API Secret** → Add to `PINATA_SECRET_API_KEY`
   - **JWT** → Add to `PINATA_JWT`
5. Add these to **both** `blockchain/.env` and `server/.env`

> 💡 **Important**: Pinata credentials are needed in both the blockchain folder (for deployment metadata) and server folder (for runtime IPFS uploads).

</details>

<details>
<summary><b>Mining Free Sepolia ETH</b></summary>

**Option 1: Alchemy Faucet (Fast but Limited)**
- Visit [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- Connect wallet → Receive 0.5 ETH per day

**Option 2: POW Faucet (Unlimited but Requires Mining)**
- Visit [POW Faucet](https://sepolia-faucet.pk910.de/)
- Keep browser tab open to mine
- Requires decent GPU for efficient mining
- Can mine several ETH but takes time

**⚠️ Budget**: Smart contract deployment costs ~0.05-0.1 ETH in gas fees

</details>

### Project Structure

```
skill-z/
├── frontend/              # Next.js application
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── lib/             # Utility functions
│   └── public/          # Static assets
│
├── server/               # Express backend
│   ├── config/          # Contract addresses & config
│   ├── controllers/     # Route handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   └── middleware/     # Auth & validation
│
└── blockchain/          # Smart contracts
    ├── contracts/       # Solidity contracts
    ├── migrations/      # Deployment scripts
    ├── test/           # Contract tests
    └── config/         # Address mappings
```

---

## 👥 Team

<div align="center">

### Team Veritas 🏆

**🥇 1st Place Winners - Blockchain Problem Statement**  
**NITHacks 8.0 | 2025**

Built with ❤️ and late-night coding sessions

</div>


<table align="center">
<tr>
<td align="center">
<img src="https://media.licdn.in/dms/image/v2/D5603AQFSPqLF7tFQUw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1729864652628?e=1740614400&v=beta&t=Z7L3pKmKVwCqcuZlMWBdKjm_Y4Y5xO7PK_nIZbkLRvs" width="100px" alt="Ritvik"/><br>
<b>Ritvik Sharma</b><br>
<sub>Backend & Blockchain Lead</sub><br>
<a href="https://github.com/ritvik-sharma-4483b0311">GitHub</a> • <a href="https://in.linkedin.com/in/ritvik-sharma-4483b0311">LinkedIn</a>
</td>
<td align="center">
<img src="https://media.licdn.in/dms/image/v2/D5603AQGMqxAHFrSlXg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724919748823?e=1740614400&v=beta&t=YmxCDZqVkzZFqJy8yPWzKqVPk-0s5nqQFgHyGKJaLBs" width="100px" alt="Vedant"/><br>
<b>Vedant Shah</b><br>
<sub>Full Stack Developer</sub><br>
<a href="https://github.com/vedantshah45">GitHub</a> • <a href="https://in.linkedin.com/in/vedantshah45">LinkedIn</a>
</td>
</tr>
<tr>
<td align="center">
<img src="https://media.licdn.in/dms/image/v2/D5603AQGqZsEVXwV7Xw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1730788622969?e=1740614400&v=beta&t=HJ8w5Y1Y-lrBPZ-U5bqWz8kqDzKp6e3BJWQL0RhvTjs" width="100px" alt="Talha"/><br>
<b>Talha Naik</b><br>
<sub>Frontend Developer</sub><br>
<a href="https://github.com/talha-naik">GitHub</a> • <a href="https://in.linkedin.com/in/talha-naik-06406b257">LinkedIn</a>
</td>
<td align="center">
<img src="https://media.licdn.in/dms/image/v2/D5603AQGJAf4_wt79nQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1730568730634?e=1740614400&v=beta&t=dRz5qP8fJJO_rMGBkYJxVQGU8H8z0P9kRxJuTGQ-cPE" width="100px" alt="Shubham"/><br>
<b>Shubham Karampure</b><br>
<sub>UI/UX & AI Lead</sub><br>
<a href="https://github.com/ShubhamKarampure">GitHub</a> • <a href="https://in.linkedin.com/in/shubham-karampure">LinkedIn</a>
</td>
</tr>
</table>


<div align="center">

</div>

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NITHacks 8.0** for providing the platform
- **Ethereum Foundation** for ZK-SNARK resources
- **Google Gemini** for AI capabilities
- **IPFS/Pinata** for decentralized storage
- The open-source community

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**[Back to Top](#-skill-z)**

Made with 💜 by Team Veritas

</div>
