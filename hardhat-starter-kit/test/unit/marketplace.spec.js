const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

const fs = require('fs');
const path = require('path');
const source = fs.readFileSync(path.join(__dirname, "../../contracts/myFunction.js"), "utf8");

const subscriptionId = 36;
const router = "0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C";
const donID = "0x66756e2d617262697472756d2d7365706f6c69612d3100000000000000000000";

!developmentChains.includes(network.name)
? describe.skip
: describe("MARKETPLACE tests", async function () {
    describe("deployment success", async function () {
        it("should deploy correctly", async () => {
            let onlyContract;
            const [deployer] = await ethers.getSigners()
            
            const OnlyFactory = await ethers.getContractFactory("OnlyToken")
            onlyContract = await OnlyFactory.connect(deployer).deploy()
            
            const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
            
            const marketplaceContract = await MarketplaceFactory.connect(deployer).deploy(router, donID, subscriptionId, source, onlyContract.address);
            
            it("should match the token contract address with the only contract address", async () => {
                assert.equal(marketplaceContract.tokenContract.address, onlyContract.address);
            })
        })

        it("Create an offer correctly", async () => {
            let onlyContract;
            const [deployer, brand, influencer] = await ethers.getSigners()
            
            const OnlyFactory = await ethers.getContractFactory("OnlyToken")
            onlyContract = await OnlyFactory.connect(deployer).deploy()
            
            const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
            
            const marketplaceContract = await MarketplaceFactory.connect(deployer).deploy(router, donID, subscriptionId, source, onlyContract.address);

            const amt = "100000000000000000000";
            // transfer to the brand 100 $ONLY  
            await onlyContract.connect(deployer).transfer(brand.address, amt)
            

            const brandBalanceBefore = await onlyContract.balanceOf(brand.address);
            const contractBalanceBefore = await onlyContract.balanceOf(marketplaceContract.address);
            assert.equal(contractBalanceBefore.toString(), "0");
            assert.equal(brandBalanceBefore.toString(), "100000000000000000000");

            // First give access to 100 tokens 
            await onlyContract.connect(brand).approve(marketplaceContract.address, amt);

            const adId = (await marketplaceContract.nextAdId()).toString();
            const views = 1000;
            const paymentAmount = amt;

            const tx = await marketplaceContract.connect(brand).createOffer(influencer.address, views, paymentAmount);
            const res = await tx.wait()

            const offer = await marketplaceContract.ads(adId);
            assert.equal(offer.id, adId);
            assert.equal(offer.influencer, influencer.address);
            assert.equal(offer.brand, brand.address);
            assert.equal(offer.paymentAmount, paymentAmount);
            assert.equal(offer.views, views);
            assert.equal(offer.status, 0); 

            const brandBalanceAfter = await onlyContract.balanceOf(brand.address);
            const contractBalanceAfter = await onlyContract.balanceOf(marketplaceContract.address);

            assert.equal(brandBalanceAfter.toString(), "0");
            assert.equal(contractBalanceAfter.toString(), "100000000000000000000");
        })

        it("Accept offer correctly", async () => {
            let onlyContract;
            const [deployer, brand, influencer] = await ethers.getSigners()
            
            const OnlyFactory = await ethers.getContractFactory("OnlyToken")
            onlyContract = await OnlyFactory.connect(deployer).deploy()
            
            const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
            
            const marketplaceContract = await MarketplaceFactory.connect(deployer).deploy(router, donID, subscriptionId, source, onlyContract.address);

            const amt = "100000000000000000000";
            // transfer to the brand 100 $ONLY  
            await onlyContract.connect(deployer).transfer(brand.address, amt)
            
            // First give access to 100 tokens 
            await onlyContract.connect(brand).approve(marketplaceContract.address, amt);

            const adId = (await marketplaceContract.nextAdId()).toString();
            const views = 1000;
            const paymentAmount = amt;

            await marketplaceContract.connect(brand).createOffer(influencer.address, views, paymentAmount);

            await marketplaceContract.connect(influencer).acceptOffer(adId);

            const updatedOffer = await marketplaceContract.ads(adId);
            assert.equal(updatedOffer.status, 1); // Status.Live is represented by 1
            assert.equal(updatedOffer.id, adId);
            assert.equal(updatedOffer.influencer, influencer.address);
            assert.equal(updatedOffer.brand, brand.address);
            assert.equal(updatedOffer.paymentAmount, paymentAmount);
            assert.equal(updatedOffer.views, views);

        })


        it("influencer Reject the offer correctly", async () => {
            let onlyContract;
            const [deployer, brand, influencer] = await ethers.getSigners()
            
            const OnlyFactory = await ethers.getContractFactory("OnlyToken")
            onlyContract = await OnlyFactory.connect(deployer).deploy()
            
            const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
            
            const marketplaceContract = await MarketplaceFactory.connect(deployer).deploy(router, donID, subscriptionId, source, onlyContract.address);

            const amt = "100000000000000000000";
            // transfer to the brand 100 $ONLY  
            await onlyContract.connect(deployer).transfer(brand.address, amt)
            
            // First give access to 100 tokens 
            await onlyContract.connect(brand).approve(marketplaceContract.address, amt);

            const adId = (await marketplaceContract.nextAdId()).toString();
            const views = 1000;
            const paymentAmount = amt;

            await marketplaceContract.connect(brand).createOffer(influencer.address, views, paymentAmount);

            await marketplaceContract.connect(influencer).removeOffer(adId);

            const removedOffer = await marketplaceContract.ads(adId);
            assert.equal(removedOffer.id, 0); // Offer should be destroyed
            assert.equal(removedOffer.influencer, 0);// Offer should be destroyed
            assert.equal(removedOffer.brand, 0);// Offer should be destroyed
            assert.equal(removedOffer.paymentAmount, 0);// Offer should be destroyed
            assert.equal(removedOffer.views, 0);// Offer should be destroyed
        })

        it("brand Reject the offer correctly", async () => {
            let onlyContract;
            const [deployer, brand, influencer] = await ethers.getSigners()
            
            const OnlyFactory = await ethers.getContractFactory("OnlyToken")
            onlyContract = await OnlyFactory.connect(deployer).deploy()
            
            const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
            
            const marketplaceContract = await MarketplaceFactory.connect(deployer).deploy(router, donID, subscriptionId, source, onlyContract.address);

            const amt = "100000000000000000000";
            // transfer to the brand 100 $ONLY  
            await onlyContract.connect(deployer).transfer(brand.address, amt)
            
            // First give access to 100 tokens 
            await onlyContract.connect(brand).approve(marketplaceContract.address, amt);

            const adId = (await marketplaceContract.nextAdId()).toString();
            const views = 1000;
            const paymentAmount = amt;

            await marketplaceContract.connect(brand).createOffer(influencer.address, views, paymentAmount);

            await marketplaceContract.connect(brand).removeOffer(adId);

            const removedOffer = await marketplaceContract.ads(adId);
            assert.equal(removedOffer.id, 0); // Offer should be destroyed
            assert.equal(removedOffer.influencer, 0);// Offer should be destroyed
            assert.equal(removedOffer.brand, 0);// Offer should be destroyed
            assert.equal(removedOffer.paymentAmount, 0);// Offer should be destroyed
            assert.equal(removedOffer.views, 0);// Offer should be destroyed
        })

        // it("test the receiving data", async () => {
        //     let onlyContract;
        //     const [deployer, brand, influencer] = await ethers.getSigners()
            
        //     const OnlyFactory = await ethers.getContractFactory("OnlyToken")
        //     onlyContract = await OnlyFactory.connect(deployer).deploy()
            
        //     const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
            
        //     const marketplaceContract = await MarketplaceFactory.connect(deployer).deploy(router, donID, subscriptionId, source, onlyContract.address);

        //     const amt = "100000000000000000000";
        //     // transfer to the brand 100 $ONLY  
        //     await onlyContract.connect(deployer).transfer(brand.address, amt)
            
        //     // First give access to 100 tokens 
        //     await onlyContract.connect(brand).approve(marketplaceContract.address, amt);

        //     const adId = (await marketplaceContract.nextAdId()).toString();
        //     const views = 1000;
        //     const paymentAmount = amt;

        //     await marketplaceContract.connect(brand).createOffer(influencer.address, views, paymentAmount);
        //     // Simulate receiving "1:5" from Chainlink
        //     const requestId = ethers.utils.formatBytes32String("dummyRequestId");
        //     const response = 0x4d546f31; // ethers.utils.toUtf8Bytes("1:5"); // 
        //     const err = ethers.utils.toUtf8Bytes("");

        //     console.log(`
        //         requestId: ${requestId}
        //         response: ${response}
        //         err: ${err}
        //     `)

        //     // Manually call fulfillRequest to simulate Chainlink callback
        //     await marketplaceContract.testFulfillRequest(requestId, response, err);

        //     // Retrieve the ad to check if settlement was processed correctly
        //     const settledAd = await marketplaceContract.ads(adId);

        //     // Since "1:5" means adId 1 has 5 views, and our ad required 1000 views,
        //     // the payment should have been calculated proportionally
        //     const expectedPaymentToInfluencer = (paymentAmount * 5) / views;
        //     const expectedRefundToBrand = paymentAmount - expectedPaymentToInfluencer;

        //     // Check if the ad was deleted after settlement
        //     assert.equal(settledAd.id, 0, "Ad should be deleted after settlement");

        //     // Check if the influencer received the correct payment amount
        //     const influencerBalance = await onlyContract.balanceOf(influencer.address);
        //     assert.equal(influencerBalance.toString(), expectedPaymentToInfluencer.toString(), "Influencer did not receive the correct payment amount");

        //     // Check if the brand received the correct refund amount
        //     const brandBalance = await onlyContract.balanceOf(brand.address);
        //     assert.equal(brandBalance.toString(), expectedRefundToBrand.toString(), "Brand did not receive the correct refund amount");
        // })

        
    })
})
