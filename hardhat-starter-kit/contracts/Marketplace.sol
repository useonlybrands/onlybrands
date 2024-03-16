// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

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

    /**
     * @dev Enum representing the status of an advertisement deal.
     * 
     * @notice The status lifecycle of an ad is as follows:
     * - Open: The brand has made an offer to the influencer.
     * - Rejected: The influencer has rejected the offer made by the brand.
     * - Live: The influencer has accepted the deal, and the advertisement is now live.
     * - Settling: The influencer has submitted the post URL for verification. 
     * - Chainlink functions are called to verify the view count.
     * - Closed: The views have been confirmed, and the payout to the influencer is completed.
     */
    enum Status { Open, Rejected, Live, Settling, Closed }

    struct Ad {
        uint id;
        address influencer;
        address brand;
        uint paymentAmount;
        uint views;
        Status status;
    }
    
    uint32 gasLimit = 300000; // Callback gas limit
    bytes32 donID;
    address router;
    string source;

    uint public nextAdId = 1;
    mapping(uint => Ad) public ads;
    OnlyToken public tokenContract;

    /**
     * @notice Initializes the Marketplace contract with the specified router address, donation ID, and source code for Chainlink function.
     * @param _router The address of the Chainlink functions router
     * @param _donID The donation ID for the Chainlink function
     * @param _source The source code for the Chainlink function in JavaScript
     */
    constructor(address _router, bytes32 _donID, string memory _source, address _tokenContract) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        router = _router;
        donID = _donID;
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
     * @notice Sends an HTTP request for character information
     * @param subscriptionId The ID for the Chainlink subscription
     * @param args The arguments to pass to the HTTP request
     * @return requestId The ID of the request
     */
    function sendRequest(
        uint64 subscriptionId,
        string[] calldata args
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code
        if (args.length > 0) req.setArgs(args); // Set the arguments for the request

        // // Send the request and store the request ID
        bytes32 s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        return s_lastRequestId;
    }

    /**
     * @notice Callback function for fulfilling a request
     * @param requestId The ID of the request to fulfill
     * @param response The HTTP response data
     * @param err Any errors from the Functions request
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        // if (s_lastRequestId != requestId) {
        //     revert UnexpectedRequestID(requestId); // Check if request IDs match
        // }
        // Update the contract's state variables with the response and any errors
        // s_lastResponse = response;
        // character = string(response);
        // s_lastError = err;

        // Emit an event to log the response
        // emit Response(requestId, character, s_lastResponse, s_lastError);
    }
}
