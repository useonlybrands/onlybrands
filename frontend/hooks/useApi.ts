import {useDynamicContext, UserProfile} from "@dynamic-labs/sdk-react-core";
import {useEffect, useState} from "react";
import {UseDynamicContext} from "@dynamic-labs/sdk-react-core/src/lib/context/DynamicContext/useDynamicContext";
import {num} from "starknet";
import { getContract } from 'viem'
import onlyContract from '../../hardhat-starter-kit/build/artifacts/contracts/OnlyToken.sol/OnlyToken.json'

export interface BrandInfo {

}
export interface InfluencerInfo {

}
export interface BackendProfile {
    username: string;
    profileType: "brand"|"influencer";
    brandInfo?: BrandInfo;
    influencerInfo?: InfluencerInfo;
}

export interface BidInfo {
    brandUsername: string;
    brandWallet: string;
    influencerUsername: string;
    influencerWallet: string;
    title: string;
    description: string;
    status: string;
    // ... other fields
    budget: number;
}

export interface UseApi {
    user: UserProfile,
    dynamicContext: UseDynamicContext,
    signMessage: (message: string) => any,
    profile?: BackendProfile,
    updateProfile: (BackendProfile) => Promise<Response>,
    submitBid: (BidInfo) => Promise<void>,
    fetchBalance: () => Promise<any>
}
export const useApi: () => UseApi = () => {
    const dynamicContext = useDynamicContext();

    const signMessage = async (msg) => {
        if (!dynamicContext.primaryWallet) return;

        const signer = await dynamicContext.primaryWallet.connector.getSigner();

        if (!signer) return;

        // @ts-ignore
        const signature = await signer.signMessage({
            account: dynamicContext.primaryWallet.address,
            message: msg
        });

        console.log('signature', signature);
        return signature;
    };

    const [backendProfile, setBackendProfile] = useState<BackendProfile|null>(null);

    const updateProfile = (profile: BackendProfile) => {
        switch (profile.profileType) {
            case "brand":
                return fetch("/create_brand", {
                    headers: {
                        Authorization: `Bearer ${dynamicContext.authToken}`,
                    },
                    method: "POST",
                    body: JSON.stringify(profile.brandInfo)
                });
            case "influencer":
                return fetch("/create_influencer", {
                    headers: {
                        Authorization: `Bearer ${dynamicContext.authToken}`,
                    },
                    method: "POST",
                    body: JSON.stringify(profile.influencerInfo)
                });
        }
    }

    useEffect(() => {
        const loadData = async () => {
            const profileRes = await fetch("/get_profile", {
                headers: {
                    Authorization: `Bearer ${dynamicContext.authToken}`,
                }
            })
            try {
                const profile = await profileRes.json();
                setBackendProfile(profile);
            } catch (e) {
                console.error("Couldn't load backend profile", e)
            }
        };

        loadData();
    }, [dynamicContext.authToken])

    // const submitBid = (bidInfo: BidInfo) => {
    //     bidInfo
    // }

    const fetchBalance = async () => {
        if (!dynamicContext.walletConnector) return;
        const publicClient = await dynamicContext.walletConnector.getPublicClient();

        const contract = getContract({
            address: "0x5B557183636e4b72F05721036F3655af5885f282",
            abi: onlyContract.abi,
            // @ts-ignore
            publicClient
        });

        const result = await contract.read.balanceOf(["0x239723C845f7Bd613Ec44d5511902E3A2d7A6aCF"]);
        console.log(result);
    }

    useEffect(() => {
        fetchBalance().then(console.log)
    }, [dynamicContext]);

    return {
        user: dynamicContext.user,
        dynamicContext,
        signMessage,
        // connectionType: "dynamic",
        profile: backendProfile,
        updateProfile,
        fetchBalance
    };
}