task(
    "call-function",
    "Calls the chainlink function"
)
    .addParam("contract", "The address of the Function contract that you want to query")
    // .addParam("args", "The args to pass into the function")
    .setAction(async (taskArgs) => {
        const contractAddr = taskArgs.contract
        const networkId = network.name
        // const args = taskArgs.aargs

        // const consumerAddress = '0xdAc6703d3dd8B4dCb769A44707CEEF2297Df4f8c' ; // "0x22dDF20AD8bfaE00A68a24B06dFb8b52E23BA706"; // REPLACE this with your Functions consumer address
        // const subscriptionId = 36; // REPLACE this with your subscription ID

        // https://docs.chain.link/chainlink-functions/supported-networks#arbitrum-sepolia-testnet
        // const routerAddress = '0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C'
        // const linkTokenAddress = '0xb1D4538B4571d411F07960EF2838Ce337FE1E80E'
        // const donId = 'fun-arbitrum-sepolia-1'
        // const explorerUrl = 'https://sepolia.arbiscan.io'

        const subscriptionId = 36; 

        const FunctionsContract = await ethers.getContractFactory("FunctionsConsumer")
        console.log(
            "Calling the functions ",
            contractAddr,
            " on network ",
            networkId, 
        )

        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]
        const functionsContract = await new ethers.Contract(
            contractAddr,
            FunctionsContract.interface,
            signer
        )

        await functionsContract.sendRequest(subscriptionId, ['37']).then((data) => {
            console.log("Sent call to function: ", BigInt(data).toString())
        })
    })

module.exports = {}

