import {useDynamicContext} from "@dynamic-labs/sdk-react-core";
import {useEffect, useState} from "react";

export interface BrandInfo {

}
export interface InfluencerInfo {

}
export interface BackendProfile {
    username: string;
    brandInfo: BrandInfo;
    influencerInfo: InfluencerInfo;
}

export const useApi = () => {
    const dynContext = useDynamicContext();

    const signMessage = async (msg) => {
        if (!dynContext.primaryWallet) return;

        const signer = await dynContext.primaryWallet.connector.getSigner();

        if (!signer) return;

        const signature = await signer.signMessage({
            account: dynContext.primaryWallet.address,
            message: msg
        });

        console.log('signature', signature);
    };

    const [backendProfile, setBackendProfile] = useState<BackendProfile|null>(null);

    const updatedBackendProfile = (profile: BackendProfile) => {
        return fetch("/updateProfile", {
            headers: {
                Authorization: `Bearer ${dynContext.authToken}`,
            },
            method: "POST",
            body: JSON.stringify(profile)
        })
    }

    useEffect(() => {
        const loadData = async () => {
            const profileRes = await fetch("/getProfile", {
                headers: {
                    Authorization: `Bearer ${dynContext.authToken}`,
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
    }, [dynContext.authToken])

    return {
        user: dynContext.user,
        dynContext,
        signMessage,
        connectionType: "dynamic",
        backendProfile,
        updatedBackendProfile
    };
}