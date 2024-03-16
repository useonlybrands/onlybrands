import {useDynamicContext, UserProfile} from "@dynamic-labs/sdk-react-core";
import {useEffect, useState} from "react";
import {UseDynamicContext} from "@dynamic-labs/sdk-react-core/src/lib/context/DynamicContext/useDynamicContext";
import {
    chain_ID,
    marketplaceContract_ABI,
    marketplaceContract_ADDRESS,
    onlyContract_ABI,
    onlyContract_ADDRESS
} from "@/constants/contracts";
import {parseEther, PublicClient, WalletClient} from "viem";
import {mainnet} from "viem/chains";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type AuthFetch = (url: string, bearerToken: string, init?: RequestInit) => Promise<Response>;
const authFetch: AuthFetch = (url, authToken, init = undefined) => {
    return fetch(API_BASE_URL + url, {
        ...init,
        headers: {
            ...(init?.headers||{}),
            Authorization: `Bearer ${authToken}`
        },
    });
}

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
    impressions: number;
}

export interface UseApi {
    user: UserProfile,
    dynamicContext: UseDynamicContext,
    signMessage: (message: string) => any,
    profile?: BackendProfile,
    updateProfile: (profile: BackendProfile) => Promise<Response>,
    submitBid: (bidInfo: BidInfo) => Promise<void>,
    fetchBalance: () => Promise<any>,
    balance?: bigint
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
                return authFetch("/create_brand", dynamicContext.authToken, {
                    method: "POST",
                    body: JSON.stringify(profile.brandInfo)
                });
            case "influencer":
                return authFetch("/create_influencer", dynamicContext.authToken, {
                    method: "POST",
                    body: JSON.stringify(profile.influencerInfo)
                });
        }
    }

    useEffect(() => {
        const loadData = async () => {
            console.log(dynamicContext.authToken)
            await authFetch("/get_profile", dynamicContext.authToken);
            const profileRes = await authFetch("/get_profile", dynamicContext.authToken);
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
        const publicClient: PublicClient = await dynamicContext.walletConnector.getPublicClient() as PublicClient;

        const result = await publicClient.readContract({
            address: onlyContract_ADDRESS,
            abi: onlyContract_ABI,
            functionName: "balanceOf",
            args: [await dynamicContext.walletConnector.getAddress()]
        })
        console.log(result);
        return result
    }

    const [balance, setBalance] = useState<bigint|undefined>(undefined);

    useEffect(() => {
        fetchBalance().then((balance) => {
            setBalance(balance as bigint);
        })
    }, [dynamicContext]);

    const submitBid = async (bidInfo: BidInfo) => {
        if (!dynamicContext.walletConnector) return;
        const publicClient: PublicClient = await dynamicContext.walletConnector.getPublicClient() as PublicClient;
        const walletClient: WalletClient = await dynamicContext.walletConnector.getWalletClient(chain_ID.toString()) as WalletClient;
        const account = await dynamicContext.walletConnector.getAddress();

        // Request approval for amount
        const { request } = await publicClient.simulateContract({
            // @ts-ignore
            account,
            address: onlyContract_ADDRESS,
            abi: onlyContract_ABI,
            functionName: 'approve',
            args: [marketplaceContract_ADDRESS, bidInfo.budget]
        });
        console.log(request);
        const approvalHash = (await walletClient.writeContract(request));
        await publicClient.waitForTransactionReceipt({
            hash: approvalHash
        });

        // Create offer with amount
        const { request: createOfferReq } = await publicClient.simulateContract({
            // @ts-ignore
            account,
            address: marketplaceContract_ADDRESS,
            abi: marketplaceContract_ABI,
            functionName: 'createOffer',
            args: [bidInfo.influencerWallet, bidInfo.impressions, bidInfo.budget]
        });
        console.log(createOfferReq);
        const createOfferHash  = (await walletClient.writeContract(createOfferReq));
        await publicClient.waitForTransactionReceipt({
            hash: approvalHash
        });

        fetchBalance();
    }

    return {
        user: dynamicContext.user,
        dynamicContext,
        signMessage,
        // connectionType: "dynamic",
        profile: backendProfile,
        updateProfile,
        fetchBalance,
        balance,
        submitBid
    };
}