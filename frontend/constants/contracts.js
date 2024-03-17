import onlyContract from '../../hardhat-starter-kit/build/artifacts/contracts/OnlyToken.sol/OnlyToken.json'
import marketplaceContract from '../../hardhat-starter-kit/build/artifacts/contracts/Marketplace.sol/Marketplace.json'
export const onlyContract_ADDRESS = process.env.NEXT_PUBLIC_ONLYCONTRACT_ADDRESS
export const onlyContract_ABI = onlyContract.abi;

export const marketplaceContract_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACECONTRACT_ADDRESS
export const marketplaceContract_ABI = marketplaceContract.abi;
// export const chain_ID = 421614;


export const onlyContractAddresses = {
    421614: '0x5B557183636e4b72F05721036F3655af5885f282', // arb
    88882: '0xD2A1a753C056aDd5165881DA7eA243D4eDf78A96' // spicy 
}


export const marketplaceContractAddresses = {
    421614: '0x1EBb2B623bd01d2ce4907799cf853f1d95411114', // arb 
    88882: '0x22bF3c1bF4D4b5508Eb2AF99bBE565F7e2375DCb' // spicy
}