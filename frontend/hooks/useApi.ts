import { ROLES } from "@/constants/register";
import { useDynamicContext, UserProfile } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import { UseDynamicContext } from "@dynamic-labs/sdk-react-core/src/lib/context/DynamicContext/useDynamicContext";
import {
  chain_ID,
  marketplaceContract_ABI,
  marketplaceContract_ADDRESS,
  onlyContract_ABI,
  onlyContract_ADDRESS,
} from "@/constants/contracts";
import { PublicClient, WalletClient } from "viem";
import {Influencer} from "@/components/Influencers/JobsItem/types";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type AuthFetch = (
  url: string,
  bearerToken: string,
  init?: RequestInit
) => Promise<Response>;
const authFetch: AuthFetch = (url, authToken, init = undefined) => {
  return fetch(API_BASE_URL + url, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${authToken}`,
      "X-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
      "Content-Type": "application/json",
    },
  });
};

export interface BrandInfo {
  username: string;
  name: string;
  email: string;
  wallet: string;
  industry: any;
  size: any;
  description: any;
  image: any;
}

export interface BackendProfile {
  profileType: "brand" | "influencer";
  brandInfo?: BrandInfo;
  influencerInfo?: Influencer;
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
  // TODO: check in database if user is registered (isRegistered endpoint)
  user: UserProfile;
  dynamicContext: UseDynamicContext;
  signMessage: (message: string) => any;
  profile?: BackendProfile;
  updateProfile: (profile: BackendProfile) => Promise<Response>;
  submitBid: (bidInfo: BidInfo) => Promise<void>;
  fetchBalance: () => Promise<any>;
  balance?: bigint;
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
      message: msg,
    });

    console.log("signature", signature);
    return signature;
  };

  const [backendProfile, setBackendProfile] = useState<BackendProfile | null>(
    null
  );

  const updateProfile = (profile: BackendProfile) => {
    console.log("profile:", profile);
    switch (profile.profileType) {
      case ROLES.BRAND:
        return authFetch("/brand", dynamicContext.authToken, {
          headers: {
            Authorization: `Bearer ${dynamicContext.authToken}`,
          },
          method: "POST",
          body: JSON.stringify({
            object: profile.brandInfo
          }),
        });
      case ROLES.INFLUENCER:
        return authFetch("/influencers", dynamicContext.authToken, {
          headers: {
            Authorization: `Bearer ${dynamicContext.authToken}`,
          },
          method: "POST",
          body: JSON.stringify({
            object: profile.influencerInfo
          }),
        });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      console.log(dynamicContext.authToken);
      try {
        const profileRes = await authFetch(
            `/user/${dynamicContext.user?.username}`,
            dynamicContext.authToken
        );
        const profile = await profileRes.json();
        setBackendProfile(profile);
      } catch (e) {
        console.error("Couldn't load backend profile", e);
      }
    };

    loadData();
  }, [dynamicContext.authToken]);

  const fetchBalance = async () => {
    if (!dynamicContext.walletConnector) return;
    const publicClient = await dynamicContext.walletConnector.getPublicClient();

    const result = await publicClient.readContract({
      address: onlyContract_ADDRESS,
      abi: onlyContract_ABI,
      functionName: "balanceOf",
      args: [await dynamicContext.walletConnector.getAddress()],
    });
    console.log(result);
    return result;
  };

  const [balance, setBalance] = useState<bigint | undefined>(undefined);

  useEffect(() => {
    fetchBalance().then((balance) => {
      setBalance(balance as bigint);
    });
  }, [dynamicContext]);

  const submitBid = async (bidInfo: BidInfo) => {
    if (!dynamicContext.walletConnector) return;
    const publicClient: PublicClient =
      (await dynamicContext.walletConnector.getPublicClient()) as PublicClient;
    const walletClient: WalletClient =
      (await dynamicContext.walletConnector.getWalletClient(
        chain_ID.toString()
      )) as WalletClient;
    const account = await dynamicContext.walletConnector.getAddress();

    // Request approval for amount
    const { request } = await publicClient.simulateContract({
      // @ts-ignore
      account,
      address: onlyContract_ADDRESS,
      abi: onlyContract_ABI,
      functionName: "approve",
      args: [marketplaceContract_ADDRESS, bidInfo.budget],
    });
    console.log(request);
    const approvalHash = await walletClient.writeContract(request);
    await publicClient.waitForTransactionReceipt({
      hash: approvalHash,
    });

    // Create offer with amount
    const { request: createOfferReq } = await publicClient.simulateContract({
      // @ts-ignore
      account,
      address: marketplaceContract_ADDRESS,
      abi: marketplaceContract_ABI,
      functionName: "createOffer",
      args: [bidInfo.influencerWallet, bidInfo.impressions, bidInfo.budget],
    });
    console.log(createOfferReq);
    const createOfferHash = await walletClient.writeContract(createOfferReq);
    await publicClient.waitForTransactionReceipt({
      hash: approvalHash,
    });

    fetchBalance();
  };

  return {
    user: dynamicContext.user,
    dynamicContext,
    signMessage,
    // connectionType: "dynamic",
    profile: backendProfile,
    updateProfile,
    fetchBalance,
    balance,
    submitBid,
  };
};
