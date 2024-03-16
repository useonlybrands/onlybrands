import React from 'react';
import Link from 'next/link';
import JobMeta from './JobMeta';
import { timeSince } from '@/utils/formatDate';
import { JobContentProps } from './types';

const InfluencerContent = (props: JobContentProps): React.ReactElement => {
  const { influencer } = props;

  return (
    <div className="items-center justify-between w-full lg:flex">
      <section className="flex flex-col sm:items-start sm:text-left">
        <Link href={`/influencer/${influencer.username}`} rel="noopener noreferrer" target="new">
          <div className="mb-1 text-sm text-gray-500 hover:text-primary-700">{influencer.username}</div>
        </Link>
        <Link href={`/job/${influencer.username}`} rel="noopener noreferrer" target="new">
          <div className="mb-2 text-base font-semibold hover:text-primary-700 text-black">{influencer.name}</div>
        </Link>

        <JobMeta
          jobCategory={influencer.platform}
          jobSalary={influencer.follower_count}
          jobTags={[influencer.industries]}
          jobType={influencer.industries}
          location={influencer.sex}
        />
      </section>

      <section className="absolute top-5 right-5">
        <h1 className="flex justify-center text-sm font-light text-gray-500 lg:text-sm sm:justify-start">
          {timeSince(0)}
        </h1>
      </section>
    </div>
  );
};

export default InfluencerContent;
