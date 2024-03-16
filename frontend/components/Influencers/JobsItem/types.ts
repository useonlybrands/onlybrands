export interface Influencer {
  "username": string,
  "name": string,
  "email": string,
  "wallet": string,
  "platform": string,
  "industries": string,
  "follower_count": number,
  // "language": string,
  "sex": string,
  "age": number,
  "rating": number,
  "image": string
}

export interface JobCardItemProps {
  job: Influencer;
}

export interface JobContentProps {
  job: Influencer;
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
