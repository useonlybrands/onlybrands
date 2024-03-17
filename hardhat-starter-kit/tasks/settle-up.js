const { BigNumber } = require("ethers")
const { networkConfig } = require("../helper-hardhat-config")

task("settle-up", "Manual settle up")
    .addParam(
        "adId",
    )
    .addParam(
        "views",
    )
    .addParam(
        "marketplace",
    )
    .setAction(async (taskArgs) => {
        const { adId, views, marketplace } = taskArgs
        const networkId = network.config.chainId

        //Get signer information
        const accounts = await hre.ethers.getSigners()
        const signer = accounts[0]

        const Marketplace = await ethers.getContractFactory("Marketplace")
        const marketplaceContract = await Marketplace.attach(marketplace)
        console.log("marketplaceContract", marketplace)
        
        const result = await marketplaceContract.connect(signer).manualSettlement(adId, views)
        console.log(`result: ${JSON.stringify(result)}`)
        const tx = await result.wait()
        console.log(tx);
    })

module.exports = {}
