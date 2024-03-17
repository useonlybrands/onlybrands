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
import { Influencer } from "@/components/Influencers/JobsItem/types";
import JSONBig from "json-bigint";
import {
  isZeroDevConnector,
  ZeroDevSmartWalletConnectors,
} from "@dynamic-labs/ethereum-aa";

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { readContract } from "viem/actions";

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
  budget: bigint;
  impressions: number;
  id?: number;
  // onchainId: bigint;
}

export interface CheckUsername {
  data: {
    brand: Array<any>;
    influencer: Array<any>;
  };
}

export type BidStatus = "";

export interface UseApi {
  isOnboarded: (username: string) => Promise<any>;
  user: UserProfile;
  dynamicContext: UseDynamicContext;
  signMessage: (message: string) => any;
  profile?: BackendProfile;
  updateProfile: (profile: BackendProfile) => Promise<Response>;
  submitBid: (bidInfo: BidInfo) => Promise<void>;
  fetchBalance: () => Promise<any>;
  fetchBids: () => Promise<BidInfo[]>;
  fetchInfluencers: () => Promise<Influencer[]>;
  acceptBid: (bid: BidInfo) => Promise<any>;
  startSettlement: (bid: BidInfo, url: string) => Promise<any>;
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
            object: profile.brandInfo,
          }),
        });
      case ROLES.INFLUENCER:
        return authFetch("/influencers", dynamicContext.authToken, {
          method: "POST",
          body: JSON.stringify({
            object: profile.influencerInfo,
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
    const connector = dynamicContext.walletConnector;
    if (!connector) return;

    if (isZeroDevConnector(connector)) {
      const signerConnector = connector.getEOAConnector();
      if (!signerConnector) return;

      const publicClient: any = await signerConnector.getPublicClient();

      const result = await readContract(publicClient, {
        address: onlyContract_ADDRESS,
        abi: onlyContract_ABI,
        functionName: "balanceOf",
        args: [await dynamicContext.primaryWallet.address],
      });
      console.log(result);
      return result;
    } else {
      const publicClient: any = await connector.getPublicClient();
      const result = await publicClient.readContract({
        address: onlyContract_ADDRESS,
        abi: onlyContract_ABI,
        functionName: "balanceOf",
        args: [await connector.fetchPublicAddress()],
      });
      console.log(result);
      return result;
    }
  };

  const fetchNextAdId = async () => {
    const connector = dynamicContext.walletConnector;
    if (!connector) return;

    if (isZeroDevConnector(connector)) {
      const signerConnector = connector.getEOAConnector();
      if (!signerConnector) return;

      const publicClient: any = await signerConnector.getPublicClient();

      const result = await readContract(publicClient, {
        address: marketplaceContract_ADDRESS,
        abi: marketplaceContract_ABI,
        functionName: "nextAdId",
        args: [],
      });
      console.log(result);
      return result;
    } else {
      const publicClient: any = await connector.getPublicClient();
      const result = await publicClient.readContract({
        address: marketplaceContract_ADDRESS,
        abi: marketplaceContract_ABI,
        functionName: "nextAdId",
        args: [],
      });
      console.log(result);
      return result;
    }
  };

  const [balance, setBalance] = useState<bigint | undefined>(undefined);

  useEffect(() => {
    fetchBalance().then((balance) => {
      setBalance(balance as bigint);
      fetchNextAdId().then((adid) => console.log(`Ad ID: ${adid}`));
    });
  }, [dynamicContext.walletConnector]);
  const submitBid = async (bidInfo: BidInfo) => {
    console.log("Submitting bid", bidInfo);
    if (!dynamicContext.walletConnector) return;
    const publicClient: PublicClient =
      (await dynamicContext.walletConnector.getPublicClient()) as PublicClient;
    const walletClient: WalletClient =
      (await dynamicContext.walletConnector.getWalletClient(
        chain_ID.toString()
      )) as WalletClient;
    const account = await dynamicContext.primaryWallet.address;

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

    const nextAdId = await fetchNextAdId();

    const createOfferHash = await walletClient.writeContract(createOfferReq);
    await publicClient.waitForTransactionReceipt({
      hash: approvalHash,
    });

    console.log("Notifying backend of new bid");

    await authFetch("/bid", dynamicContext.authToken, {
      method: "POST",
      body: JSONBig({ useNativeBigInt: true }).stringify({
        object: {
          // influencer_wallet: bidInfo.influencerWallet,
          influencer_username: bidInfo.influencerUsername,
          brand_wallet: bidInfo.brandWallet,
          brand_username: bidInfo.brandUsername,
          budget: bidInfo.budget,
          title: bidInfo.title,
          description: bidInfo.description,
          impressions: bidInfo.impressions,
          status: bidInfo.status,
          id: nextAdId,
        },
      }),
    });

    fetchBalance();
  };

  const acceptBid = async (bid: BidInfo) => {
    const bidId = bid.id;
    if (!dynamicContext.walletConnector) return;
    const publicClient: PublicClient =
      (await dynamicContext.walletConnector.getPublicClient()) as PublicClient;
    const walletClient: WalletClient =
      (await dynamicContext.walletConnector.getWalletClient(
        chain_ID.toString()
      )) as WalletClient;
    const account = await dynamicContext.primaryWallet.address;

    const { request } = await publicClient.simulateContract({
      // @ts-ignore
      account,
      address: marketplaceContract_ADDRESS,
      abi: marketplaceContract_ABI,
      functionName: "acceptOffer",
      args: [bidId],
    });
    console.log(request);

    const acceptOfferHash = await walletClient.writeContract(request);
    await publicClient.waitForTransactionReceipt({
      hash: acceptOfferHash,
    });

    await authFetch("/bid", dynamicContext.authToken, {
        method: "POST",
        body: JSONBig({ useNativeBigInt: true }).stringify({
          ...bid,
          status: "accepted"
        })
      }
    );
  };

  const startSettlement = async (bid: BidInfo, url: string) => {
    const bidId = bid.id;
    if (!dynamicContext.walletConnector) return;
    const publicClient: PublicClient =
        (await dynamicContext.walletConnector.getPublicClient()) as PublicClient;
    const walletClient: WalletClient =
        (await dynamicContext.walletConnector.getWalletClient(
            chain_ID.toString()
        )) as WalletClient;
    const account = await dynamicContext.primaryWallet.address;

    const { request } = await publicClient.simulateContract({
      // @ts-ignore
      account,
      address: marketplaceContract_ADDRESS,
      abi: marketplaceContract_ABI,
      functionName: "startSettlement",
      args: [bidId.toString(), url],
    });
    console.log(request);

    const acceptOfferHash = await walletClient.writeContract(request);
    await publicClient.waitForTransactionReceipt({
      hash: acceptOfferHash,
    });

    await authFetch("/bid", dynamicContext.authToken, {
          method: "POST",
          body: JSONBig({ useNativeBigInt: true }).stringify({
            ...bid,
            status: "completed"
          })
        }
    );
  }

  const fetchBids = async () => {
    const bidsRes = await authFetch(`/bid`, dynamicContext.authToken);
    const bids = await bidsRes.json();
    return bids.bid;
  };

  const fetchInfluencers = async () => {
    const influencersRes = await authFetch(
      `/influencers`,
      dynamicContext.authToken
    );
    const influencers = await influencersRes.json();
    return influencers.influencers;
  };

  const isOnboarded = async (username: string) => {
    try {
      const response = await authFetch(
        `/check-username/${username}`,
        dynamicContext.authToken,
        {
          headers: {
            Authorization: `Bearer ${dynamicContext.authToken}`,
          },
          method: "GET",
        }
      );

      const data = await response.json();
      const isBrandExist = data.brand?.length > 0;
      const isInfluencerExist = data.influencers?.length > 0;

      return isBrandExist || isInfluencerExist;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return {
    user: dynamicContext.user,
    dynamicContext,
    signMessage,
    // connectionType: "dynamic",
    profile: backendProfile,
    updateProfile,
    fetchBalance,
    fetchBids,
    acceptBid,
    startSettlement,
    fetchInfluencers,
    balance,
    submitBid,
    isOnboarded,
  };
};
