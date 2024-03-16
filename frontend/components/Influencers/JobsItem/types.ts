export interface Influencer {
  "username": string,
  "name": string,
  "email": string,
  "wallet": string,
  "platform": string,
  "industries": string,
  "followerCount": number,
  // "language": string,
  "sex": string,
  "age": number,
  "image": string
}

export interface InfluencerCardItemProps {
  influencer: Influencer;
}

export interface InfluencerContentProps {
  influencer: Influencer;
}

export interface JobActionsProps {
  id: string;
  outlined?: boolean;
}

export interface JobMetaProps {
  location: string;
  jobType: string;
  jobCategory: string;
  jobSalary: number;
  jobTags: string[];
}
