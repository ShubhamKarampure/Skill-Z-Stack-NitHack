const IssuerRegistry = artifacts.require("IssuerRegistry");
const Timelock = artifacts.require("Timelock");
const IssuerDAO = artifacts.require("IssuerDAO");
const GovernanceHelper = artifacts.require("GovernanceHelper");
const fs = require('fs-extra');
const path = require('path');

module.exports = async function (deployer, network, accounts) {
    console.log("\n=== Deploying Governance Contracts ===\n");

    const [admin] = accounts;

    // Get IssuerRegistry address
    const issuerRegistry = await IssuerRegistry.deployed();

    // Deploy Timelock (2 days delay)
    console.log("\n1. Deploying Timelock...");
    const timelockDelay = 2 * 24 * 60 * 60; // 2 days
    await deployer.deploy(Timelock, timelockDelay, { from: admin });
    const timelock = await Timelock.deployed();
    console.log("✓ Timelock deployed at:", timelock.address);
    console.log("  Delay:", timelockDelay, "seconds (2 days)");

    // Deploy IssuerDAO
    console.log("\n2. Deploying IssuerDAO...");
    await deployer.deploy(
        IssuerDAO,
        issuerRegistry.address,
        timelock.address,
        { from: admin }
    );
    const dao = await IssuerDAO.deployed();
    console.log("✓ IssuerDAO deployed at:", dao.address);

    // Setup roles
    console.log("\n3. Setting up DAO roles...");

    // Grant DAO the ACCREDITOR_ROLE in IssuerRegistry
    const ACCREDITOR_ROLE = await issuerRegistry.ACCREDITOR_ROLE();
    await issuerRegistry.grantRole(ACCREDITOR_ROLE, dao.address, { from: admin });
    console.log("✓ DAO granted ACCREDITOR_ROLE in IssuerRegistry");

    // Grant DAO the PROPOSER and EXECUTOR roles in Timelock
    const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
    const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
    await timelock.grantRole(PROPOSER_ROLE, dao.address, { from: admin });
    await timelock.grantRole(EXECUTOR_ROLE, dao.address, { from: admin });
    console.log("✓ DAO granted PROPOSER and EXECUTOR roles in Timelock");

    // Deploy GovernanceHelper
    console.log("\n4. Deploying GovernanceHelper...");
    await deployer.deploy(
        GovernanceHelper,
        dao.address,
        timelock.address,
        issuerRegistry.address,
        { from: admin }
    );
    const helper = await GovernanceHelper.deployed();
    console.log("✓ GovernanceHelper deployed at:", helper.address);

    // Update addresses file
    const addressesFile = path.join(__dirname, '..', 'deployed', `${network}_addresses.json`);
    const addresses = await fs.readJson(addressesFile);

    addresses.governance = {
        Timelock: timelock.address,
        IssuerDAO: dao.address,
        GovernanceHelper: helper.address
    };

    await fs.writeJson(addressesFile, addresses, { spaces: 2 });

    console.log("\n=== Governance Contracts Deployed Successfully ===\n");
};
