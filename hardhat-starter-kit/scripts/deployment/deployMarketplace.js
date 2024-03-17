const { ethers, network, run } = require("hardhat")
const {
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
} = require("../../helper-hardhat-config")

async function deployMarketplace() {
    console.log("Starting deployment process for Marketplace contract...")

    // Deploy Marketplace contract
    const marketplaceFactory = await ethers.getContractFactory("Marketplace")
    console.log("Marketplace factory created successfully.")

    const _router = '0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C'
    // const _donID = 'fun-arbitrum-sepolia-1'
    const _donID = '0x66756e2d617262697472756d2d7365706f6c69612d3100000000000000000000'
    const _subscriptionId = 36;
    
    const fs = require('fs');
    const path = require('path');
    const _source = fs.readFileSync(path.join(__dirname, "../../contracts/myFunction.js"), "utf8");

    console.log(`Source code for the Chainlink Function: 
    
    ${_source}
    
    `)

    let _tokenContract;
    if(network.name == 'spicy') {
        _tokenContract = '0xD2A1a753C056aDd5165881DA7eA243D4eDf78A96';
    }
    if(network.name == 'arbitrumSepolia') {
        _tokenContract = '0x5B557183636e4b72F05721036F3655af5885f282' // its hardcoded for now woops 
    }
    console.log(`using $ONLY at ${_tokenContract}.`)

    const Marketplace = await marketplaceFactory.deploy(
        _router, 
        _donID, 
        _subscriptionId,
        _source,  
        _tokenContract
    )
    console.log("Marketplace deployed successfully.")

    const waitBlockConfirmations = VERIFICATION_BLOCK_CONFIRMATIONS
    await Marketplace.deployTransaction.wait(waitBlockConfirmations)
    console.log("Transaction confirmed by waiting for block confirmations.")

    console.log(`Marketplace deployed to ${Marketplace.address} on ${network.name}`)

    if (network.name == 'arbitrumSepolia') {
        console.log("Verifying contract on ARBISCAN...")
        await run("verify:verify", {
            address: Marketplace.address,
            constructorArguments: [
                _router, 
                _donID, 
                _subscriptionId,
                _source,  
                _tokenContract],
            contract: "contracts/Marketplace.sol:Marketplace"
        })
        console.log("Contract verification completed.")
    }
    if(network.name == 'spicy') {
        console.log("Verifying contract on SPICY...")
        await run("verify:verify", {
            address: OnlyToken.address,
            constructorArguments: [],
            contract: "contracts/OnlyToken.sol:OnlyToken"
        })
    }
}

module.exports = {
    deployMarketplace,
}

if (require.main === module) {
    deployMarketplace().then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}