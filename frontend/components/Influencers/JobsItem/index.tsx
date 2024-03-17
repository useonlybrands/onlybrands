import React from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import CompanyLogo from '../../UI/CompanyLogo';
import JobActions from './JobActions';
import InfluencerContent from './InfluencerContent';
import {InfluencerCardItemProps, JobCardItemProps} from './types';
import { ROLES } from '@/constants/register';
import InfluencerActions from "@/components/Influencers/JobsItem/InfluencerActions";
import useModal from "@/hooks/useModal";

// const jobStatus = (job) => {
//   switch (true) {
//     case job.isGuaranteed:
//       return 'border-b-[2rem] sm:border-b-0 sm:border-l-[4rem] border-primary-100';
//     case job.isFeatured:
//       return 'border-l-[4.5rem] border-primary-800';
//     default:
//       return '';
//   }
// };
// ${jobStatus(job)}
// ${
//   (job.isFeatured || job.isGuaranteed) && !job.hasCompanyColor.isActive ? '-ml-14' : 'ml-2'
// }

const JobCardItem = (props: InfluencerCardItemProps): React.ReactElement => {
  const { influencer, onSubmitBid } = props;
  const user = useUser();

  return (
    <div
      className={`
        mx-auto relative flex flex-col justify-start w-full px-5 py-3.5 bg-white rounded-lg sm:rounded-xl shadow-gray-300
      `}
    >
      <div className="grid grid-cols-12 gap-2 place-items-start">
        <div className="col-span-12 lg:col-span-2">
          <CompanyLogo
            companyLogo={influencer.image}
            companySlug={influencer.username}
            hasCompanyLogo={true}
          />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <InfluencerContent influencer={influencer} />
          <InfluencerActions influencer={influencer} onSubmitBid={onSubmitBid}/>
        </div>
      </div>
    </div>
  );
};

export default JobCardItem;
