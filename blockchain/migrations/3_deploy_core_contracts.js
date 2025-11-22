const IssuerRegistry = artifacts.require("IssuerRegistry");
const CredentialNFT = artifacts.require("CredentialNFT");
const RevocationRegistry = artifacts.require("RevocationRegistry");
const CredentialVerifier = artifacts.require("CredentialVerifier");
const fs = require('fs-extra');
const path = require('path');

module.exports = async function (deployer, network, accounts) {
    console.log("\n=== Deploying Core Contracts ===\n");

    const [admin] = accounts;
    console.log("Deploying with admin account:", admin);

    // Deploy IssuerRegistry
    console.log("\n1. Deploying IssuerRegistry...");
    await deployer.deploy(IssuerRegistry, { from: admin });
    const issuerRegistry = await IssuerRegistry.deployed();
    console.log("✓ IssuerRegistry deployed at:", issuerRegistry.address);

    // Deploy CredentialNFT
    console.log("\n2. Deploying CredentialNFT...");
    await deployer.deploy(CredentialNFT, issuerRegistry.address, { from: admin });
    const credentialNFT = await CredentialNFT.deployed();
    console.log("✓ CredentialNFT deployed at:", credentialNFT.address);

    // Deploy RevocationRegistry
    console.log("\n3. Deploying RevocationRegistry...");
    await deployer.deploy(RevocationRegistry, { from: admin });
    const revocationRegistry = await RevocationRegistry.deployed();
    console.log("✓ RevocationRegistry deployed at:", revocationRegistry.address);

    // Deploy CredentialVerifier
    console.log("\n4. Deploying CredentialVerifier...");
    await deployer.deploy(
        CredentialVerifier,
        credentialNFT.address,
        issuerRegistry.address,
        { from: admin }
    );
    const credentialVerifier = await CredentialVerifier.deployed();
    console.log("✓ CredentialVerifier deployed at:", credentialVerifier.address);

    // Authorize CredentialNFT in RevocationRegistry
    console.log("\n5. Setting up permissions...");
    await revocationRegistry.authorizeContract(credentialNFT.address, { from: admin });
    console.log("✓ CredentialNFT authorized in RevocationRegistry");

    // Save addresses
    const addresses = {
        network: network,
        admin: admin,
        IssuerRegistry: issuerRegistry.address,
        CredentialNFT: credentialNFT.address,
        RevocationRegistry: revocationRegistry.address,
        CredentialVerifier: credentialVerifier.address,
        deployedAt: new Date().toISOString()
    };

    const deployedDir = path.join(__dirname, '..', 'deployed');
    await fs.ensureDir(deployedDir);
    await fs.writeJson(
        path.join(deployedDir, `${network}_addresses.json`),
        addresses,
        { spaces: 2 }
    );

    console.log("\n=== Core Contracts Deployed Successfully ===\n");
    console.log("Addresses saved to deployed/" + network + "_addresses.json");
};
