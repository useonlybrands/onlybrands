import onlyContract from '../../hardhat-starter-kit/build/artifacts/contracts/OnlyToken.sol/OnlyToken.json'
import marketplaceContract from '../../hardhat-starter-kit/build/artifacts/contracts/Marketplace.sol/Marketplace.json'
export const onlyContract_ADDRESS = process.env.NEXT_PUBLIC_ONLYCONTRACT_ADDRESS
export const onlyContract_ABI = onlyContract.abi;

export const marketplaceContract_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACECONTRACT_ADDRESS
export const marketplaceContract_ABI = marketplaceContract.abi;
export const chain_ID = 421614;