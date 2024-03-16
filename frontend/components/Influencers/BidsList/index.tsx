import React, {FC} from "react";
import CompanyLogo from "@/components/UI/CompanyLogo";
import InfluencerContent from "@/components/Influencers/JobsItem/InfluencerContent";
import InfluencerActions from "@/components/Influencers/JobsItem/InfluencerActions";
import {BidInfo} from "@/hooks/useApi";
import JobCardItem from "@/components/Influencers/JobsItem";

interface IProps {
    bids: BidInfo[]
}

const BidsItem: FC<{bid: BidInfo}> = ({bid}) => {
    // const brand = useBrand(bid.brandUsername)
    return (
        <div
            className={`
        mx-auto relative flex flex-col justify-start w-full px-5 py-3.5 bg-white rounded-lg sm:rounded-xl shadow-gray-300
      `}
        >
            <div className="grid grid-cols-12 gap-2 place-items-start">
                <div className="col-span-12 lg:col-span-2">
                    <CompanyLogo
                        companyLogo={"https://picsum.photos/600/600"}
                        companySlug={bid.brandUsername}
                        hasCompanyLogo={true}
                    />
                </div>
                <div className="col-span-12 lg:col-span-9">
                    <h2 className="">{bid.title}</h2>
                    <p>{bid.description}</p>
                    <BidActions bid={bid}/>
                    {/*<InfluencerActions influencer={influencer}/>*/}
                </div>
            </div>
        </div>
    )
}

const BidsList: FC<IProps> = ({bids}) => {
    return (
        <section
            className="relative flex flex-col items-center justify-center col-span-12 mx-auto max-w-8xl sm:col-span-8">
            <ul className="grid w-full grid-cols-1 gap-5 h-fit">
                {bids?.length > 0 &&
                    bids.map((bid) => {
                        return (
                            <li className="w-full" key={bid.brandWallet + bid.influencerWallet}>
                                <BidsItem bid={bid}/>
                            </li>
                        );
                    })}
            </ul>
        </section>
    )
}

export default BidsList;