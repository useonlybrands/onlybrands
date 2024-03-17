import {returnTrue} from "react-number-format/types/utils";
import {BidInfo, useApi} from "@/hooks/useApi";
import Button from "@/components/UI/Button";
import {FC} from "react";

interface IProps {
    bid: BidInfo
}

const BidActions: FC<IProps> = ({bid}) => {
    const {} = useApi();
    const isBusy = false;
    return (
        <div className="absolute bottom-2.5 right-3 flex flex-row gap-2">
            <Button
                className={`rounded-lg flex flex-row items-end justify-end text-white hover:text-primary-700`}
                onClick={() => {}}
                title={"Decline"}
                color={"danger"}
                disabled={isBusy}
            >Decline</Button>
            <Button
                className={`rounded-lg flex flex-row items-end justify-end text-gray-500 hover:text-primary-700`}
                onClick={() => {}}
                title={"Accept"}
                color={"primary"}
                disabled={isBusy}
            >Accept</Button>
        </div>
    )
}

export default BidActions;