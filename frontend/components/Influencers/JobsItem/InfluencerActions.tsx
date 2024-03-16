import Button from "@/components/UI/Button";
import {REMOVE_BUTTON_TITLE, SAVE_BUTTON_TITLE} from "@/components/Influencers/JobsItem/constants";
import {BookmarkIcon as BookmarkIconOutline} from "@heroicons/react/24/outline";
import {BookmarkIcon as BookmarkIconSolid, ArrowDownCircleIcon} from "@heroicons/react/24/solid";
import React from "react";
import {parseEther} from "viem";
import {useApi} from "@/hooks/useApi";
import {Influencer} from "@/components/Influencers/JobsItem/types";

interface IProps {
    influencer: Influencer
}
const InfluencerActions: React.FC<IProps> = ({influencer}) => {
    const {submitBid} = useApi();
    return (
        <div className="absolute bottom-2.5 right-3">
            <Button
                className={`rounded-lg flex flex-row items-end justify-end text-gray-500 hover:text-primary-700`}
                onClick={() => submitBid({
                    budget: parseEther("5"),
                    influencerWallet: influencer.wallet,
                    impressions: influencer.follower_count,
                })}
                title={"Submit Bid"}
            >
                <div className={"flex flex-row gap-2"}>
                    <div>Submit Bid</div>
                    <div className="w-5 h-full m-auto">
                        <ArrowDownCircleIcon/>
                    </div>
                </div>
            </Button>
        </div>
    )
}

export default InfluencerActions;