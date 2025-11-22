const AgeVerifier = artifacts.require("AgeGroth16Verifier"); // or whatever name is in your contract
const CredentialProofVerifier = artifacts.require("CredentialProofGroth16Verifier");
const UniversityRankVerifier = artifacts.require("UniversityRankGroth16Verifier");
const ZKPVerifier = artifacts.require("ZKPVerifier");
const SelectiveDisclosure = artifacts.require("SelectiveDisclosure");
const CredentialNFT = artifacts.require("CredentialNFT");
const fs = require('fs-extra');
const path = require('path');

module.exports = async function (deployer, network, accounts) {
    console.log("\n=== Deploying ZKP Contracts ===\n");

    const [admin] = accounts;

    // Deploy Age Verifier
    console.log("1. Deploying Age Verifier...");
    await deployer.deploy(AgeVerifier, { from: admin });
    const ageVerifier = await AgeVerifier.deployed();
    console.log("✓ Age Verifier deployed at:", ageVerifier.address);

    // Deploy Credential Proof Verifier
    console.log("\n2. Deploying Credential Proof Verifier...");
    await deployer.deploy(CredentialProofVerifier, { from: admin });
    const credentialVerifier = await CredentialProofVerifier.deployed();
    console.log("✓ Credential Proof Verifier deployed at:", credentialVerifier.address);

    // Deploy University Rank Verifier
    console.log("\n3. Deploying University Rank Verifier...");
    await deployer.deploy(UniversityRankVerifier, { from: admin });
    const rankVerifier = await UniversityRankVerifier.deployed();
    console.log("✓ University Rank Verifier deployed at:", rankVerifier.address);

    // Deploy ZKP Verifier (aggregator)
    console.log("\n4. Deploying ZKP Verifier (aggregator)...");
    await deployer.deploy(
        ZKPVerifier,
        ageVerifier.address,
        credentialVerifier.address,
        rankVerifier.address,
        { from: admin }
    );
    const zkpVerifier = await ZKPVerifier.deployed();
    console.log("✓ ZKP Verifier deployed at:", zkpVerifier.address);

    // Get CredentialNFT address
    const credentialNFT = await CredentialNFT.deployed();

    // Deploy Selective Disclosure
    console.log("\n5. Deploying Selective Disclosure...");
    await deployer.deploy(
        SelectiveDisclosure,
        credentialNFT.address,
        zkpVerifier.address,
        { from: admin }
    );
    const selectiveDisclosure = await SelectiveDisclosure.deployed();
    console.log("✓ Selective Disclosure deployed at:", selectiveDisclosure.address);

    // Update addresses file
    const addressesFile = path.join(__dirname, '..', 'deployed', `${network}_addresses.json`);
    const addresses = await fs.readJson(addressesFile);

    addresses.zkp = {
        AgeVerifier: ageVerifier.address,
        CredentialProofVerifier: credentialVerifier.address,
        UniversityRankVerifier: rankVerifier.address,
        ZKPVerifier: zkpVerifier.address,
        SelectiveDisclosure: selectiveDisclosure.address
    };

    await fs.writeJson(addressesFile, addresses, { spaces: 2 });

    console.log("\n=== ZKP Contracts Deployed Successfully ===\n");
};
