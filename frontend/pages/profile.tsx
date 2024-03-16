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
              <section className="flex flex-col items-center justify-center py-5 space-y-2 text-gray-800">
                <div className="flex items-end mb-1">
                  <Avatar avatar={userData?.image} isRounded size="md" />

                  {(
                    <div className="relative top right-5" title="Certified account">
                      <CheckCircleIcon className="w-4 h-4 bg-white rounded-full text-primary-500" />
                    </div>
                  )}
                </div>

                <h1 className="mb-1 text-xl font-bold">{userData.name}</h1>
                <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <h3 className="mb-1 text-l font-semibold">@{userData.username}</h3>
                  
                  <br></br>
                  




                  <h3 className="mb-1 text-l justify-center items-center space-x-2">Platform: {userData.platform}</h3>

                  <h3 className="mb-1 text-l justify-center items-center space-x-2">Industry: {userData.industry}</h3>

                  <h3 className="mb-1 text-l justify-center items-center space-x-2">Followers: {userData.follower_count}</h3>

                  <h3 className="mb-1 text-l justify-center items-center space-x-2">Sex: {userData.sex}</h3>

                  <h3 className="mb-1 text-l  justify-center items-center space-x-2">Age: {userData.age}</h3>

                  <h3 className="mb-1 text-l font-normal justify-center items-center space-x-2">Language: {userData.language}</h3>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <Link href={`mailto:${userData.email}`} title="Drop me a message">
                      <EnvelopeIcon className="inline-block w-5 h-5" />
                    </Link>
                    {/* {{userData.phone && (
                      <Link href={`mailto:${userData.phone}`} title="Drop me a message">
                      <PhoneIcon className="inline-block w-5 h-5" />
                      </Link>
                    )}} */}
                  </div>
                  <div>
                    {!showWallet && (
                      <h3 className="text-primary-700 mb-1 text-l font-semibold cursor-pointer" onClick={toggleWallet}>Wallet address</h3>
                    )}
                    {showWallet && (
                      <h3 className="mb-1 text-l font-semibold" onClick={toggleWallet}>{userData.wallet}</h3>
                    )}
                  </div>
                  
                  </div>
                  


                  {/* {userData.phone && (
                    <p className="text-sm">
                      <span className="font-semibold">Phone:</span> {userData.phone}
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
              </section>
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
