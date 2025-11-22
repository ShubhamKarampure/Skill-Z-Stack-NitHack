// blockchain/scripts/extract-addresses.js
const fs = require('fs');
const path = require('path');

const extractAddresses = () => {
  console.log('\n📋 Extracting Contract Addresses...\n');
  
  const buildPath = path.join(__dirname, '../build/contracts');
  const deployedPath = path.join(__dirname, '../deployed');
  
  // Create deployed directory if it doesn't exist
  if (!fs.existsSync(deployedPath)) {
    fs.mkdirSync(deployedPath, { recursive: true });
  }
  
  const contracts = [
    'IssuerRegistry',
    'CredentialNFT',
    'CredentialVerifier',
    'RevocationRegistry',
    'IssuerDAO',
    'Timelock',
    'GovernanceHelper'
  ];
  
  const addresses = {
    network: 'development',
    deployedAt: new Date().toISOString()
  };
  
  contracts.forEach(contractName => {
    const contractPath = path.join(buildPath, `${contractName}.json`);
    
    if (fs.existsSync(contractPath)) {
      const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
      const networks = contractJson.networks;
      
      // Get the latest network deployment (usually 5777 for Ganache)
      const networkIds = Object.keys(networks);
      if (networkIds.length > 0) {
        const latestNetworkId = networkIds[networkIds.length - 1];
        const address = networks[latestNetworkId].address;
        
        if (contractName.includes('DAO') || contractName === 'Timelock' || contractName === 'GovernanceHelper') {
          if (!addresses.governance) {
            addresses.governance = {};
          }
          addresses.governance[contractName] = address;
        } else {
          addresses[contractName] = address;
        }
        
        console.log(`✓ ${contractName}: ${address}`);
      }
    } else {
      console.warn(`⚠️  ${contractName}.json not found`);
    }
  });
  
  // Save to file
  const outputPath = path.join(deployedPath, 'development_addresses.json');
  fs.writeFileSync(outputPath, JSON.stringify(addresses, null, 2));
  
  console.log(`\n✅ Addresses saved to: ${outputPath}\n`);
  
  return addresses;
};

extractAddresses();
