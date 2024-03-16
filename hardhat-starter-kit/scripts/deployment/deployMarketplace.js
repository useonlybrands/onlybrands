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
    
    const fs = require('fs');
    const path = require('path');
    const _source = fs.readFileSync(path.join(__dirname, "../../contracts/myFunction.js"), "utf8");

    const _tokenContract = '0x5B557183636e4b72F05721036F3655af5885f282' // its hardcoded for now woops 
    console.log(`using $ONLY at ${_tokenContract}. its' hardcoded, woops.`)

    const Marketplace = await marketplaceFactory.deploy(
        _router, 
        _donID, 
        _source,  
        _tokenContract
    )
    console.log("Marketplace deployed successfully.")

    const waitBlockConfirmations = VERIFICATION_BLOCK_CONFIRMATIONS
    await Marketplace.deployTransaction.wait(waitBlockConfirmations)
    console.log("Transaction confirmed by waiting for block confirmations.")

    console.log(`Marketplace deployed to ${Marketplace.address} on ${network.name}`)

    if (process.env.ARBISCAN_API_KEY) {
        console.log("Verifying contract on ARBISCAN...")
        await run("verify:verify", {
            address: Marketplace.address,
            constructorArguments: [_router, 
                _donID, 
                _source,  
                _tokenContract],
            contract: "contracts/Marketplace.sol:Marketplace"
        })
        console.log("Contract verification completed.")
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