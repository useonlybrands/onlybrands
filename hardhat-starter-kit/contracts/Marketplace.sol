// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Strings.sol";

import { FunctionsClient } from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import { ConfirmedOwner } from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import { FunctionsRequest } from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

import { OnlyToken } from "./OnlyToken.sol";

/**
 * @title Marketplace
 * @notice This is an example contract to show how to make HTTP requests using Chainlink
 * @dev This contract uses hardcoded values and should not be used in production.
 */
contract Marketplace is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    event OfferCreated(
        uint adId, 
        address indexed influencer, 
        address indexed brand, 
        uint paymentAmount, 
        uint views, Status status
    );

    event OfferAccepted(
        uint indexed adId, 
        address indexed influencer, 
        address indexed brand
    );

    event OfferRemoved(
        uint adId,
        address indexed influencer,
        address indexed brand
    );

    event SettlementStarted(
        uint adId,
        address influencer,
        address brand,
        string url
    );

    event SettlementCompleted(
        uint adId,
        address influencer,
        address brand,
        uint views
    );

    /**
     * @dev Enum representing the status of an advertisement deal.
     * 
     * @notice The status lifecycle of an ad:
     * - Open: The brand has made an offer to the influencer.
     * - Live: The influencer has accepted the deal, and the advertisement is now live.
     * - Settling: The influencer has submitted the post URL for verification. 
     * - Chainlink functions are called to verify the view count.
     * ~~ HERE ARE STATES THAT WE DONT KEEP ON CHAIN ~~ 
     * - Rejected: The influencer has rejected the offer made by the brand.
     * - Closed: The views have been confirmed, and the payout to the influencer is completed.
     */
    enum Status { Open, Live, Settling }

    struct Ad {
        uint id;
        address influencer;
        address brand;
        uint paymentAmount;
        uint views;
        Status status;
    }
    
    uint32 public gasLimit = 300000; // Callback gas limit
    bytes32 public donID;
    address public router;
    string public source;

    uint64 public subscriptionId;
    uint public nextAdId = 1;
    mapping(uint => Ad) public ads;
    OnlyToken public tokenContract;

    mapping(bytes32 => uint) public requestIdToAdId;

    /**
     * @notice Initializes the Marketplace contract with the specified router address, donation ID, and source code for Chainlink function.
     * @param _router The address of the Chainlink functions router
     * @param _donID The donation ID for the Chainlink function
     * @param _source The source code for the Chainlink function in JavaScript
     */
    constructor(address _router, bytes32 _donID, uint64 _subscriptionId, string memory _source, address _tokenContract) FunctionsClient(_router) ConfirmedOwner(msg.sender) {
        router = _router;
        donID = _donID;
        subscriptionId = _subscriptionId;
        source = _source;
        tokenContract = OnlyToken(_tokenContract);
    }

    /**
     * @notice Creates an offer for an advertisement deal
     * @param influencer The address of the influencer
     * @param views The expected number of views for the advertisement
     * @param paymentAmount The amount of tokens to be paid for the deal
     */
    function createOffer(address influencer, uint views, uint paymentAmount) external {
        require(influencer != address(0), "Influencer address cannot be zero");
        require(views > 0, "Views must be greater than zero");
        require(paymentAmount > 0, "Payment amount must be greater than zero");

        // Transfer tokens from the brand to the contract as escrow
        require(tokenContract.transferFrom(msg.sender, address(this), paymentAmount), "Token transfer failed");

        // Create the ad object
        Ad memory newAd = Ad({
            id: nextAdId,
            influencer: influencer,
            brand: msg.sender,
            paymentAmount: paymentAmount,
            views: views,
            status: Status.Open
        });

        // Store the ad object
        ads[nextAdId] = newAd;

        // Emit an event for the new offer
        emit OfferCreated(nextAdId, influencer, msg.sender, paymentAmount, views, Status.Open);

        // Increment the ad ID for the next ad
        nextAdId++;
    }

    /**
     * @notice Accepts an offer for an advertisement deal
     * @param adId The ID of the advertisement offer to accept
     */
    function acceptOffer(uint adId) external {
        Ad storage ad = ads[adId];
        require(ad.brand != address(0), "Brand address cannot be zero");
        require(ad.status == Status.Open, "Offer must be open");
        require(ad.influencer == msg.sender, "Only the influencer can accept the offer");

        ad.status = Status.Live;

        emit OfferAccepted(adId, ad.influencer, ad.brand);
    }

    /**
     * @notice Allows an influencer to reject an offer or a brand to rescind an offer
     * @param adId The ID of the advertisement offer to reject or rescind
     */
    function removeOffer(uint adId) external {
        Ad storage ad = ads[adId];
        require(ad.brand == msg.sender || ad.influencer == msg.sender, "Only brand or influencer can remove the offer");
        require(ad.status == Status.Open, "Offer must be open to remove");

        delete ads[adId];

        emit OfferRemoved(adId, ad.influencer, ad.brand);
    }

    /**
     * @notice Initiates the settlement process for an advertisement
     * @param adId The ID of the advertisement to settle
     * @param url The URL of the post to verify views
     */
    function startSettlement(uint adId, string memory url) external returns (bytes32 requestId) {
        Ad storage ad = ads[adId];
        require(ad.influencer == msg.sender, "Only the influencer can initiate settlement");
        require(ad.status == Status.Live, "Ad must be live to initiate settlement");

        ad.status = Status.Settling;

        // Construct arguments array for Chainlink request
        string[] memory args = new string[](2);
        args[0] = Strings.toString(adId);
        args[1] = url;

        emit SettlementStarted(adId, ad.influencer, ad.brand, url);

        // Send request to Chainlink to verify views 
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code
        if (args.length > 0) req.setArgs(args); // Set the arguments for the request

        // Send the request and store the request ID
        requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        requestIdToAdId[requestId] = adId;

        return requestId;
    }

    /**
     * @notice Callback function for Chainlink to call once the request is fulfilled
     * @param requestId The ID of the request to fulfill
     * @param response The HTTP response data containing views count
     * @param err Any errors from the Functions request
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override { 
        if(response.length == 0) {
            return;
        }
        uint views = abi.decode(response, (uint256));
        uint adId = requestIdToAdId[requestId];

        Ad storage ad = ads[adId];
        require(ad.status == Status.Settling, "Ad must be in settling status");

        if (views >= ad.views) {
            // Full payment to influencer as views target met
            tokenContract.transfer(ad.influencer, ad.paymentAmount);
        } else {
            // Calculate payment based on views achieved
            uint paymentToInfluencer = (ad.paymentAmount * views) / ad.views;
            uint refundToBrand = ad.paymentAmount - paymentToInfluencer;

            tokenContract.transfer(ad.influencer, paymentToInfluencer);
            tokenContract.transfer(ad.brand, refundToBrand);
        }

        emit SettlementCompleted(adId, ad.influencer, ad.brand, views);

        delete ads[adId];
    }

    /**
     * @notice Manually settle an ad campaign for a given adId
     * @param adId The ID of the ad to settle
     * @param views The number of views to settle the ad with
     */
    function manualSettlement(uint adId, uint views) external onlyOwner {
        Ad storage ad = ads[adId];
        require(ad.status == Status.Live, "Ad must be in live status");

        if (views >= ad.views) {
            // Full payment to influencer as views target met
            tokenContract.transfer(ad.influencer, ad.paymentAmount);
        } else {
            // Calculate payment based on views achieved
            uint paymentToInfluencer = (ad.paymentAmount * views) / ad.views;
            uint refundToBrand = ad.paymentAmount - paymentToInfluencer;

            tokenContract.transfer(ad.influencer, paymentToInfluencer);
            tokenContract.transfer(ad.brand, refundToBrand);
        }

        emit SettlementCompleted(adId, ad.influencer, ad.brand, views);

        delete ads[adId];
    }
}
