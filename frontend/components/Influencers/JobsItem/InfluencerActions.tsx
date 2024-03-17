import Button from "@/components/UI/Button";
import {REMOVE_BUTTON_TITLE, SAVE_BUTTON_TITLE} from "@/components/Influencers/JobsItem/constants";
import {BookmarkIcon as BookmarkIconOutline} from "@heroicons/react/24/outline";
import {BookmarkIcon as BookmarkIconSolid, ArrowDownCircleIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon} from "@heroicons/react/24/solid";
import React, {useState} from "react";
import {parseEther} from "viem";
import {useApi} from "@/hooks/useApi";
import {Influencer} from "@/components/Influencers/JobsItem/types";
import useModal from "@/hooks/useModal";

interface IProps {
    influencer: Influencer,
    onSubmitBid: any
}
const InfluencerActions: React.FC<IProps> = ({influencer, onSubmitBid}) => {
    const {submitBid, user, dynamicContext} = useApi();

    const [createBidStatus, setCreateBidStatus] = useState("idle");

    const sendBid = async (formData: any) => {
        setCreateBidStatus("busy");
        try {

            await submitBid({
                budget: parseEther(formData.budget),
                influencerWallet: influencer.wallet,
                influencerUsername: influencer.username,
                brandUsername: user.username,
                brandWallet: await dynamicContext.primaryWallet.address,
                impressions: formData.impressions,
                status: "pending",
                title: formData.title,
                description: formData.description
            })
        } catch (e) {
            console.error(e);
            setCreateBidStatus("error");
        }
        setCreateBidStatus("success")
    }

    return (
        <div className="absolute bottom-2.5 right-3">
            <Button
                className={`rounded-lg flex flex-row items-end justify-end text-gray-500 hover:text-primary-700`}
                onClick={() => {
                    onSubmitBid(influencer, sendBid)
                }}
                title={"Submit Bid"}
                color={createBidStatus === "busy" ? "white" : "primary"}
                disabled={createBidStatus !== "idle"}
            >
                <div className={"flex flex-row gap-2"}>
                    <div>{createBidStatus === "busy" ? "Submitting.." :
                        createBidStatus === "idle" ? "Submit bid" :
                            createBidStatus === "success" ? "Bid submitted!" : "Error occurred"}</div>
                    <div className="w-5 h-full m-auto">
                        {createBidStatus === "busy" ? <ClockIcon/> :
                         createBidStatus === "idle" ? <ArrowDownCircleIcon/> :
                         createBidStatus === "success" ? <CheckCircleIcon/> : <ExclamationTriangleIcon/>}
                    </div>
                </div>
            </Button>
        </div>
    )
}

export default InfluencerActions;