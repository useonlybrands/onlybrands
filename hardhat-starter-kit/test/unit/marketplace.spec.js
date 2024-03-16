const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")



!developmentChains.includes(network.name)
  ? describe.skip
  : describe("MARKETPLACE tests", async function () {
      describe("deployment", async function () {
        describe("success", async function () {
          it("should deploy correctly", async () => {
            let onlyContract;
            const [deployer] = await ethers.getSigners()

            const OnlyFactory = await ethers.getContractFactory("OnlyToken")
            onlyContract = await OnlyFactory.connect(deployer).deploy()
            
            const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
            const fs = require('fs');
            const path = require('path');
            const source = fs.readFileSync(path.join(__dirname, "../../contracts/myFunction.js"), "utf8");

            const router = "0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C";
            const donID = "0x66756e2d617262697472756d2d7365706f6c69612d3100000000000000000000";

            const marketplaceContract = await MarketplaceFactory.connect(deployer).deploy(router, donID, source, onlyContract.address);
            console.log(marketplaceContract.address)

            it("should match the token contract address with the only contract address", async () => {
                assert.equal(marketplaceContract.tokenContract.address, onlyContract.address);
            })
          })
      })
    })
})
