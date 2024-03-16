const { ethers, network, run } = require("hardhat")
const {
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
} = require("../../helper-hardhat-config")

async function deployOnly() {
    console.log("Starting deployment process...")

    const onlyTokenFactory = await ethers.getContractFactory("OnlyToken")
    console.log("OnlyToken factory created successfully.")

    const OnlyToken = await onlyTokenFactory.deploy()
    console.log("OnlyToken deployed successfully.")

    const waitBlockConfirmations = VERIFICATION_BLOCK_CONFIRMATIONS
    await OnlyToken.deployTransaction.wait(waitBlockConfirmations)
    console.log("Transaction confirmed by waiting for block confirmations.")

    console.log(`OnlyToken deployed to ${OnlyToken.address} on ${network.name}`)

    if (process.env.ARBISCAN_API_KEY) {
        console.log("Verifying contract on ARBISCAN...")
        await run("verify:verify", {
            address: OnlyToken.address,
            constructorArguments: [],
            contract: "contracts/OnlyToken.sol:OnlyToken"
        })
        console.log("Contract verification completed.")
    }
}

module.exports = {
    deployOnly,
}

if (require.main === module) {
    deployOnly().then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}