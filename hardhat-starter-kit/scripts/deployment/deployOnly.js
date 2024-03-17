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

    // if (network.name == "arbitrumSepolia") {
    console.log("Verifying contract on etherscan...")
    await run("verify:verify", {
        address: OnlyToken.address,
        constructorArguments: [],
        contract: "contracts/OnlyToken.sol:OnlyToken"
    })
    console.log("Contract verification completed.")
    // }
    // if(network.name == 'spicy') {
    //     console.log("Verifying contract on SPICY...")
    //     await run("verify:verify", {
    //         address: OnlyToken.address,
    //         constructorArguments: [],
    //         contract: "contracts/OnlyToken.sol:OnlyToken"
    //     })
    // }
    // if(network.name == 'celoAlfajores') {
    //     console.log("Verifying contract on celoAlfajores...")
    //     await run("verify:verify", {
    //         address: OnlyToken.address,
    //         constructorArguments: [],
    //         contract: "contracts/OnlyToken.sol:OnlyToken"
    //     })
    // }
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