const { ethers, network, run } = require("hardhat")
const {
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
} = require("../../helper-hardhat-config")

async function deployFunctionsConsumer() {
    console.log("Starting deployment process...")
    
    // if (network.name !== "mumbai") {
    //     console.log("This deployment script is only for the Polygon Mumbai network.")
    //     return
    // }

    if (network.name !== "arbitrumSepolia") {
        console.log("This deployment script is only for the arbitrumSepolia network.")
        return
    }


    const functionConsumerFactory = await ethers.getContractFactory("FunctionsConsumer")
    console.log("Contract factory created successfully.")

    const FunctionsConsumer = await functionConsumerFactory.deploy()
    console.log("Contract deployed successfully.")

    const waitBlockConfirmations = VERIFICATION_BLOCK_CONFIRMATIONS
    await FunctionsConsumer.deployTransaction.wait(waitBlockConfirmations)
    console.log("Transaction confirmed by waiting for block confirmations.")

    console.log(`FunctionsConsumer deployed to ${FunctionsConsumer.address} on ${network.name}`)

    // if (process.env.POLYGONSCAN_API_KEY) {
    if (process.env.ARBISCAN_API_KEY) {
        console.log("Verifying contract on ARBISCAN...")
        await run("verify:verify", {
            address: FunctionsConsumer.address,
            constructorArguments: [],
        })
        console.log("Contract verification completed.")
    }
}

module.exports = {
    deployFunctionsConsumer,
}

if (require.main === module) {
    deployFunctionsConsumer().then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}