const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("ONLY $ tests", async function () {
      describe("deployment", async function () {
        describe("success", async function () {
          it("should set the aggregator addresses correctly", async () => {
              
            const [deployer] = await ethers.getSigners()

            const OnlyFactory = await ethers.getContractFactory("OnlyToken")
            const onlyContract = await OnlyFactory.connect(deployer).deploy()

            const supplyResponse = await onlyContract.totalSupply()
            assert.equal(supplyResponse.toString(), "1000000000000000000000000000")

            const myBalanceResponse = await onlyContract.balanceOf(deployer.address)
            assert.equal(myBalanceResponse.toString(), "1000000000000000000000000000")
          })
      })
    })
})
