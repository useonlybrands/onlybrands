import Head from "@/components/partials/Head";
import {useRouter} from "next/router";
import BidsList from "@/components/Influencers/BidsList";
import {BidInfo} from "@/hooks/useApi";

const MyBids = () => {
    const router = useRouter();

    const bids: BidInfo[] = [
        {
            brandUsername: "indianbricklane123",
            brandWallet: "0x0123",
            influencerUsername: "infamousdelights123",
            influencerWallet: "0xabcd",
            title: "Indian takeaway in Brick Lane",
            description: "Post bla bla bla",
            status: "pending",
            // ... other fields
            budget: 10000,
            impressions: 1000
        },
        {
            brandUsername: "indianbricklane123",
            brandWallet: "0x0123",
            influencerUsername: "infamousdelights123",
            influencerWallet: "0xabcd",
            title: "Indian takeaway in Brick Lane",
            description: "Post bla bla bla",
            status: "pending",
            // ... other fields
            budget: 10000,
            impressions: 1000
        },
        {
            brandUsername: "indianbricklane123",
            brandWallet: "0x0123",
            influencerUsername: "infamousdelights123",
            influencerWallet: "0xabcd",
            title: "Indian takeaway in Brick Lane",
            description: "Post bla bla bla",
            status: "pending",
            // ... other fields
            budget: 10000,
            impressions: 1000
        }
    ]

    return (
        <div className="min-h-screen mb-20">
            <Head />
            <section className="flex flex-col w-full gap-10 mx-auto max-w-8xl">
                <h2 className="font-bold text-2xl mt-2">My Bids</h2>
                <BidsList bids={bids}/>
            </section>
        </div>
    )
}

export default MyBids;