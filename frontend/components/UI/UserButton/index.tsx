import {useApi} from "@/hooks/useApi";
import Button from "@/components/UI/Button";
import {DynamicConnectButton, DynamicNav, DynamicWidget} from "@dynamic-labs/sdk-react-core";
import { formatEther } from 'viem'
import {useEffect, useState} from "react";


const UserButton = () => {
    const [serverSide, setServerSide] = useState(true);
    const {user, dynamicContext, signMessage, balance} = useApi();
    useEffect(() => {
        setServerSide(false)
    }, [])
    if (!user || serverSide) {
        return (<div className="flex flex-row">
            <DynamicWidget innerButtonComponent="Connect"></DynamicWidget>
        </div>)
    }

    return (
            <div className="flex flex-row">
            {balance && (
                <div
                    // onClick={() => signMessage("Test")}
                    className="rounded-md align-middle pt-2.5 pr-2 pl-2 mr-2 bg-gray-200 w-full max-w-fit h-[40px] text-sm font-semibold">
                    {formatEther(balance)} $ONLY
                </div>
            )}
            <div
                // onClick={() => signMessage("Test")}
                className="rounded-md align-middle pt-2.5 pr-2 pl-2 mr-[-5px] bg-gray-200 w-full max-w-fit h-[40px] text-sm font-semibold">
                {user?.username}
            </div>
            <div className="w-[1px] bg-gray-100"/>
            <div className="nav_element">
                <DynamicNav/>
            </div>
        </div>
    )
}

export default UserButton;