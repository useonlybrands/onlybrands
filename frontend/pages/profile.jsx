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

const UPLOAD_IMAGE_PATH = process.env.NEXT_PUBLIC_SUPABASE_UPLOAD_IMAGE_PATH;
// I guess I should add stuff here
const Profile = () => {
  const router = useRouter();
  const {user, profile, dynamicContext} = useApi();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userData, setuserData] = useState({});
  useEffect(() => {
    if (!dynamicContext.isAuthenticated) {
      void router.push('/login');
    }
    console.log({
      ...user,
      ...profile
    });
    setuserData({
      ...user,
      ...profile
    });

  }, [dynamicContext.isAuthenticated]);

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
                  <Avatar avatar={userData?.avatar} isRounded size="md" />

                  {userData?.certified && (
                    <div className="relative top right-5" title="Certified account">
                      <CheckCircleIcon className="w-4 h-4 bg-white rounded-full text-primary-500" />
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="mb-1 text-xl font-semibold">{userData.name}</h1>

                  <div className="flex items-center justify-center space-x-2">
                    <Link href={`mailto:${userData.email}`} title="Drop me a message">
                      <EnvelopeIcon className="inline-block w-5 h-5" />
                    </Link>
                    {userData.phone && (
                      <Link href={`mailto:${userData.phone}`} title="Drop me a message">
                        <PhoneIcon className="inline-block w-5 h-5" />
                      </Link>
                    )}
                  </div>

                  {userData.phone && (
                    <p className="text-sm">
                      <span className="font-semibold">Phone:</span> {userData.phone}
                    </p>
                  )}
                </div>
              </section>
            </Tab.Panel>

            <Tab.Panel>
              <section className="py-5 text-lg font-semibold text-left">
                <span>TODO: Settings Panel</span>
                <br />
                <span>...</span>
                <pre>{JSON.stringify(user, null, 2)}</pre>
              </section>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </article>
    </>
  );
};

export default Profile;
