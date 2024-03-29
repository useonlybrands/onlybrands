import Head from "@/components/partials/Head";
import {useRouter} from "next/router";
import BidsList from "@/components/Influencers/BidsList";
import {BidInfo, useApi} from "@/hooks/useApi";
import {useEffect, useState} from "react";

const MyBids = () => {
    const router = useRouter();
    const {fetchBids, dynamicContext, user} = useApi();
    const [bids, setBids] = useState<BidInfo[]|undefined>(undefined);
    useEffect(() => {
        if (!user) return;
        fetchBids().then(bids => {
            console.log("Received bids", bids)
            setBids(bids.filter(bid => bid.influencer_username === user.username))
        })
    }, [dynamicContext.primaryWallet, user]);

    // const bids: BidInfo[] = [
    //     {
    //         brandUsername: "indianbricklane123",
    //         brandWallet: "0x0123",
    //         influencerUsername: "infamousdelights123",
    //         influencerWallet: "0xabcd",
    //         title: "Indian takeaway in Brick Lane",
    //         description: "Post bla bla bla",
    //         status: "pending",
    //         // ... other fields
    //         budget: 10000,
    //         impressions: 1000
    //     },
    //     {
    //         brandUsername: "indianbricklane123",
    //         brandWallet: "0x0123",
    //         influencerUsername: "infamousdelights123",
    //         influencerWallet: "0xabcd",
    //         title: "Indian takeaway in Brick Lane",
    //         description: "Post bla bla bla",
    //         status: "pending",
    //         // ... other fields
    //         budget: 10000,
    //         impressions: 1000
    //     },
    //     {
    //         brandUsername: "indianbricklane123",
    //         brandWallet: "0x0123",
    //         influencerUsername: "infamousdelights123",
    //         influencerWallet: "0xabcd",
    //         title: "Indian takeaway in Brick Lane",
    //         description: "Post bla bla bla",
    //         status: "pending",
    //         // ... other fields
    //         budget: 10000,
    //         impressions: 1000
    //     }
    // ]

    return (
        <div className="min-h-screen mb-20">
            <Head />
            <section className="flex flex-col w-full gap-10 mx-auto max-w-8xl">
                <h2 className="font-bold text-2xl mt-2">My Bids</h2>
                {bids ? <BidsList bids={bids}/> : <div>Loading bids</div>}
            </section>
        </div>
    )
}

export default MyBids;