// scripts/deploy-governance.js
const fs = require('fs-extra');

async function main() {
    console.log("Deploying Governance Contracts...");

    const Timelock = artifacts.require("Timelock");
    const IssuerDAO = artifacts.require("IssuerDAO");
    const GovernanceHelper = artifacts.require("GovernanceHelper");

    // Load deployed addresses
    const deployedAddresses = JSON.parse(
        fs.readFileSync('deployed/addresses.json', 'utf8')
    );

    const issuerRegistryAddress = deployedAddresses.IssuerRegistry;

    console.log("\n1. Deploying Timelock...");
    const timelockDelay = 2 * 24 * 60 * 60; // 2 days
    const timelock = await Timelock.new(timelockDelay);
    console.log("✓ Timelock deployed at:", timelock.address);
    console.log("  Delay:", timelockDelay, "seconds (2 days)");

    console.log("\n2. Deploying IssuerDAO...");
    const dao = await IssuerDAO.new(
        issuerRegistryAddress,
        timelock.address
    );
    console.log("✓ IssuerDAO deployed at:", dao.address);

    console.log("\n3. Granting DAO roles to Timelock...");
    const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
    const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();

    await timelock.grantRole(PROPOSER_ROLE, dao.address);
    await timelock.grantRole(EXECUTOR_ROLE, dao.address);
    console.log("✓ DAO granted proposer and executor roles");

    console.log("\n4. Deploying Governance Helper...");
    const helper = await GovernanceHelper.new(
        dao.address,
        timelock.address,
        issuerRegistryAddress
    );
    console.log("✓ Governance Helper deployed at:", helper.address);

    // Save addresses
    deployedAddresses.governance = {
        Timelock: timelock.address,
        IssuerDAO: dao.address,
        GovernanceHelper: helper.address
    };

    fs.writeFileSync(
        'deployed/addresses.json',
        JSON.stringify(deployedAddresses, null, 2)
    );

    console.log("\n================================================");
    console.log("✓ Governance contracts deployed successfully!");
    console.log("================================================");
    console.log("\nConfiguration:");
    console.log("- Voting Period:", await dao.votingPeriod(), "seconds");
    console.log("- Voting Delay:", await dao.votingDelay(), "seconds");
    console.log("- Quorum:", await dao.quorumPercentage(), "%");
    console.log("- Timelock Delay:", await timelock.delay(), "seconds");
    console.log("- Grace Period:", await timelock.gracePeriod(), "seconds");
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
