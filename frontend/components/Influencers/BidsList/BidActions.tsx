import {returnTrue} from "react-number-format/types/utils";
import {BidInfo} from "@/hooks/useApi";

interface IProps {
    bid: BidInfo
}

const BidActions = () => {
    const isBusy = false;
    return (
        <div>
            <Button
                className={`rounded-lg flex flex-row items-end justify-end text-gray-500 hover:text-primary-700`}
                onClick={() => {}}
                title={"Decline"}
                color={"white"}
                disabled={isBusy}
            >Accept</Button>
            <Button
                className={`rounded-lg flex flex-row items-end justify-end text-gray-500 hover:text-primary-700`}
                onClick={() => {}}
                title={"Accept"}
                color={"primary"}
                disabled={isBusy}
            >Decline</Button>
        </div>
    )
}