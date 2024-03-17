import Avatar from '@/components/UI/Avatar';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import ProfileKeyVal  from './profilekeyval'
import Link from 'next/link';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';
import { IDKitWidget, VerificationLevel, ISuccessResult } from '@worldcoin/idkit'


import React from 'react';

const BrandProfile = ({ brandData }) => {

    const [showWallet, setShowWallet] = useState(false);

    const toggleWallet = () => {
    setShowWallet(!showWallet);
    };

    const handleVerify = async (proof: ISuccessResult) => {
        const res = await fetch("/world-verify", { // route to your backend will depend on implementation
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(proof),
    })
    if (!res.ok) {
        throw new Error("Verification failed."); // IDKit will display the error message to the user in the modal
    }
    };
  
    const onSuccess = () => {
      // This is where you should perform any actions after the modal is closed
      // Such as redirecting the user to a new page
      window.location.href = "/success";
    };

    return (
    <section className="flex flex-col items-center justify-center py-5 space-y-2 text-gray-800">
    <div className="flex items-end mb-1">
        <Avatar avatar={brandData?.image} isRounded size="md" />

        {(
        <div className="relative top right-5" title="Certified account">
            <CheckCircleIcon className="w-4 h-4 bg-white rounded-full text-primary-500" />
        </div>
        )}
    </div>


    <div className="flex flex-col items-center justify-center space-y-3">

        <div className="flex flex-col items-center justify-center ">  
        <h1 className="text-xl font-bold">{brandData.name}</h1>
        <h3 className="mb-2 ">{brandData.website}</h3>
        </div>
        <ProfileKeyVal label="Size" content={brandData.size} />
        {/* <h3 className="mb-1 text-l justify-center items-center space-x-2">Platform: {brandData.platform}</h3> */}
        <ProfileKeyVal label="Description" content={brandData.description} />

        <ProfileKeyVal label="Location" content={brandData.location} />

        {/* <h3 className="mb-1 text-l justify-center items-center space-x-2">Industry: {brandData.industry}</h3> */}

        
        <div className="flex items-center justify-center space-x-2">
        <Link href={`mailto:${brandData.email}`} title="Drop me a message">
            <EnvelopeIcon className="inline-block w-5 h-5" />
        </Link>
        {/* {{brandData.phone && (
            <Link href={`mailto:${brandData.phone}`} title="Drop me a message">
            <PhoneIcon className="inline-block w-5 h-5" />
            </Link>
        )}} */}
        </div>
        <div>
        {!showWallet && (
            <h3 className="text-primary-700 mb-1 text-l font-semibold cursor-pointer" onClick={toggleWallet}>Wallet address</h3>
        )}
        {showWallet && (
            <h3 className="mb-1 text-l font-semibold" onClick={toggleWallet}>{brandData.wallet}</h3>
        )}
        
        </div>
        


        {/* {brandData.phone && (
        <p className="text-sm">
            <span className="font-semibold">Phone:</span> {brandData.phone}
        </p>
        )} */}

        <div>
        <IDKitWidget
            app_id="app_staging_36f4ed912bf5790caf5fdb754bc5bf3c" // obtained from the Developer Portal
            action="sign-in-action" // obtained from the Developer Portal
            onSuccess={onSuccess} // callback when the modal is closed
            handleVerify={handleVerify} // callback when the proof is received
            verification_level={VerificationLevel.Orb}
        >
            {({ open }) =>
            // This is the button that will open the IDKit modal
            <button onClick={open}>Connect with World ID</button>
            }
        </IDKitWidget >
        </div>
    </div>
    </section>)
}

export default BrandProfile;