import Avatar from '@/components/UI/Avatar';
import Head from '@/components/partials/Head';
import { PROVIDERS } from '@/constants/index';
import { Tab } from '@headlessui/react';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import {useApi} from "../hooks/useApi";
import { IDKitWidget, VerificationLevel, ISuccessResult } from '@worldcoin/idkit'
import ProfileKeyVal  from './profilekeyval'
import InfluencerProfile from './influencer-profile'
import BrandProfile from './brand-profile'


const UPLOAD_IMAGE_PATH = process.env.NEXT_PUBLIC_SUPABASE_UPLOAD_IMAGE_PATH;
// I guess I should add stuff here
const Profile = () => {
  const router = useRouter();
  // const {user, profile, dynamicContext} = useApi();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userData, setuserData] = useState({
    username: "something",
    name:"George Costanza",
    email: "example@gmail.com",
    wallet: "nfewisndgprbsfuoidkbuewops32768",
    platform: "Instagram",
    industry: "Lifestyle",
    follower_count: 129384,
    sex: "Male",
    age:30,
    language: "english",

    //phone: 40392439479, we dont do phone right
    image: "https://pbs.twimg.com/profile_images/708090673208033280/_RcBYLyg_400x400.jpg"
  });

  const [brandData, setbrandData] = useState({
    username: "ethglobal",
    name:"EthGlobal",
    email: "example@gmail.com",
    wallet: "nfewisndgprbsfuoidkbuewops32768",
    website: "ethglobal.com",
    location: "London",
    description: "Building our decentralized future",
    size: 100,

    //phone: 40392439479, we dont do phone right
    image: "https://pbs.twimg.com/profile_images/708090673208033280/_RcBYLyg_400x400.jpg"
  });

  const [brand, setBrand] = useState(true);
  // useEffect(() => {
  //   if (!dynamicContext.isAuthenticated) {
  //     void router.push('/login');
  //   }
  //   console.log({
  //     ...user,
  //     ...profile
  //   });
  //   setuserData({
  //     ...user,
  //     ...profile
  //   });
  //
  // }, [dynamicContext.isAuthenticated]);

  // const [showWallet, setShowWallet] = useState(false);

  // const toggleWallet = () => {
  //   setShowWallet(!showWallet);
  // };

  const handleVerify = async (proof: ISuccessResult) => {
    const res = await fetch(`/api/worldcoin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proof),
    })
    if (!res.ok) {
      // IDKit will display the error message to the user in the modal
      throw new Error("Verification failed."); 
    }
  };

  const onSuccess = () => {
    window.location.href = "/success";

    // ADD COLUMN  WORLD_COIN ID TO PROFILE 
    // HTI THE MUTATION TO SAVE IT 
  };

  return (
    <>
      <Head title="Profile" />
      <article className="max-w-sm px-4 pt-10 mx-auto">
        <Tab.Group onChange={setSelectedIndex} selectedIndex={selectedIndex}>
          <Tab.List className="space-x-2 text-base">
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`${
                    selected
                      ? 'bg-primary-700 hover:bg-primary-800 text-white'
                      : 'bg-gray-200 hover:bg-primary-800 text-black hover:text-white'
                  } py-2 px-5 rounded cursor-pointer`}
                  role="tab"
                  type="button"
                >
                  Profile
                </button>
              )}
            </Tab>

            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`${
                    selected
                      ? 'bg-primary-700 hover:bg-primary-800 text-white'
                      : 'bg-gray-200 hover:bg-primary-800 text-black hover:text-white'
                  } py-2 px-5 rounded cursor-pointer`}
                  type="button"
                >
                  Settings
                </button>
              )}
            </Tab>
          </Tab.List>

          <Tab.Panels className="flex flex-col items-center justify-center p-5 mt-3 bg-white border rounded-xl">
            <Tab.Panel>
            {!brand && (
              <InfluencerProfile userData={userData} />
            )}
            {brand && (
              <BrandProfile brandData={brandData} />
            )}
            </Tab.Panel>

            <Tab.Panel>
              <section className="py-5 text-lg font-semibold text-left">
                <span>TODO: Settings Panel</span>
                <br />
                <span>...</span>
                <pre>{JSON.stringify(userData, null, 2)}</pre>
              </section>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </article>
    </>
  );
};

export default Profile;
