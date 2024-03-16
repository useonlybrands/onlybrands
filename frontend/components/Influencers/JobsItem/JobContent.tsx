import React from 'react';
import Link from 'next/link';
import JobMeta from './JobMeta';
import { timeSince } from '@/utils/formatDate';
import { JobContentProps } from './types';

const JobContent = (props: JobContentProps): React.ReactElement => {
  const { job } = props;

  return (
    <div className="items-center justify-between w-full lg:flex">
      <section className="flex flex-col sm:items-start sm:text-left">
        <Link href={`/company/${job.wallet}`} rel="noopener noreferrer" target="new">
          <div className="mb-1 text-sm text-gray-500 hover:text-primary-700">{job.username}</div>
        </Link>
        <Link href={`/job/${job.username}`} rel="noopener noreferrer" target="new">
          <div className="mb-2 text-base font-semibold hover:text-primary-700 ">{job.name}</div>
        </Link>

        <JobMeta
          jobCategory={job.platform}
          jobSalary={job.follower_count}
          jobTags={[job.industries]}
          jobType={job.industries}
          location={job.sex}
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

export default JobContent;
