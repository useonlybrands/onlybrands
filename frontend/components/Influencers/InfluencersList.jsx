import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Loader from '../UI/Loader';
import JobCardItem from './JobsItem';

const InfluencersList = ({ loading, error, influencers, onSubmitBid }) => {
  const [currentLoading, setCurrentLoading] = useState(loading);

  useEffect(() => {
    setTimeout(() => {
      setCurrentLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    setCurrentLoading(true);

    setTimeout(() => {
      setCurrentLoading(false);
    }, 500);
  }, [loading]);

  if (currentLoading) {
    return (
      <div className="relative flex flex-col items-center w-full h-full top-20">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>{error?.message || error}</div>;
  }

  if (!error && influencers?.length === 0 && !currentLoading) {
    return (
      <ul className="grid w-full grid-cols-1 gap-5">
        <li className="w-full list-none">
          <div className="flex flex-col items-center justify-center p-5 space-y-5 text-center bg-white border border-gray-200 rounded-md shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-700">No influencers found</h3>
            <p className="text-base font-light text-gray-500">
              We couldn&apos;t find any influencers matching your search.
            </p>
          </div>
        </li>
      </ul>
    );
  }

  return (
    <section className="relative flex flex-col items-center justify-center col-span-12 mx-auto max-w-8xl sm:col-span-8">
      <ul className="grid w-full grid-cols-1 gap-5 h-fit">
        {influencers?.length > 0 &&
            influencers.map((influencer) => {
            return (
              <li className="w-full" key={influencer.username}>
                <JobCardItem influencer={influencer} onSubmitBid={onSubmitBid} />
              </li>
            );
          })}
      </ul>
    </section>
  );
};

InfluencersList.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  influencers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      company: PropTypes.string,
      location: PropTypes.string,
      type: PropTypes.string,
      description: PropTypes.string,
      companyLogo: PropTypes.string,
      companySlug: PropTypes.string,
      jobSlug: PropTypes.string,
    })
  ),
};

export default InfluencersList;
