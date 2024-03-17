import {useApi} from "@/hooks/useApi";
import {useEffect, useState} from "react";
import {Influencer} from "@/components/Influencers/JobsItem/types";

export const useInfluencers: () => Influencer[]|undefined = () => {
    const {fetchInfluencers, dynamicContext} = useApi();
    const [influencers, setInfluencers] = useState<Influencer[]|undefined>();
    useEffect(() => {
        fetchInfluencers().then(influencers => {
            console.log(influencers);
            setInfluencers(influencers);
        })
    }, [dynamicContext.walletConnector]);
    return influencers;
}