// scripts/deploy-zkp-contracts.js
const fs = require('fs-extra');
const path = require('path');

async function main() {
    console.log("Deploying ZKP Contracts...");

    // Get contract artifacts
    const AgeVerifier = artifacts.require("AgeVerifier");
    const CredentialProofVerifier = artifacts.require("CredentialProofVerifier");
    const UniversityRankVerifier = artifacts.require("UniversityRankVerifier");
    const ZKPVerifier = artifacts.require("ZKPVerifier");
    const SelectiveDisclosure = artifacts.require("SelectiveDisclosure");

    // Get deployed contract addresses
    const deployedAddresses = JSON.parse(
        fs.readFileSync('deployed/addresses.json', 'utf8')
    );

    console.log("\n1. Deploying Age Verifier...");
    const ageVerifier = await AgeVerifier.new();
    console.log("✓ Age Verifier deployed at:", ageVerifier.address);

    console.log("\n2. Deploying Credential Proof Verifier...");
    const credentialVerifier = await CredentialProofVerifier.new();
    console.log("✓ Credential Verifier deployed at:", credentialVerifier.address);

    console.log("\n3. Deploying University Rank Verifier...");
    const rankVerifier = await UniversityRankVerifier.new();
    console.log("✓ Rank Verifier deployed at:", rankVerifier.address);

    console.log("\n4. Deploying ZKP Verifier (aggregator)...");
    const zkpVerifier = await ZKPVerifier.new(
        ageVerifier.address,
        credentialVerifier.address,
        rankVerifier.address
    );
    console.log("✓ ZKP Verifier deployed at:", zkpVerifier.address);

    console.log("\n5. Deploying Selective Disclosure...");
    const selectiveDisclosure = await SelectiveDisclosure.new(
        deployedAddresses.CredentialNFT,
        zkpVerifier.address
    );
    console.log("✓ Selective Disclosure deployed at:", selectiveDisclosure.address);

    // Save addresses
    const zkpAddresses = {
        AgeVerifier: ageVerifier.address,
        CredentialProofVerifier: credentialVerifier.address,
        UniversityRankVerifier: rankVerifier.address,
        ZKPVerifier: zkpVerifier.address,
        SelectiveDisclosure: selectiveDisclosure.address
    };

    deployedAddresses.zkp = zkpAddresses;

    fs.writeFileSync(
        'deployed/addresses.json',
        JSON.stringify(deployedAddresses, null, 2)
    );

    console.log("\n================================================");
    console.log("✓ All ZKP contracts deployed successfully!");
    console.log("================================================");
    console.log("\nDeployed Addresses:");
    console.log(JSON.stringify(zkpAddresses, null, 2));
    console.log("\nAddresses saved to deployed/addresses.json");
}

module.exports = async function (callback) {
    try {
        await main();
        callback();
    } catch (error) {
        console.error(error);
        callback(error);
    }
};
