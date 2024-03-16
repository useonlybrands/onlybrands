import * as Yup from "yup";
import {
  emailValidation,
  passwordValidation,
  phoneValidation,
  requiredString,
  requiredNumber,
  stringOrArray,
  url,
} from "./helpers";

export const INDUSTRY_OPTIONS = [
  {
    name: "Fashion",
    id: "fashion",
  },
  {
    name: "Beauty",
    id: "beauty",
  },
  {
    name: "Fitness and Health",
    id: "fitness-and-health",
  },
  {
    name: "Gaming",
    id: "gaming",
  },
  {
    name: "Technology",
    id: "technology",
  },
  {
    name: "Travel",
    id: "travel",
  },
  {
    name: "Food and Beverage",
    id: "food-and-beverage",
  },
  {
    name: "Lifestyle",
    id: "lifestyle",
  },
  {
    name: "Education and Career",
    id: "education-and-career",
  },
  {
    name: "Finance and Business",
    id: "finance-and-business",
  },
];

export const PLATFORM_OPTIONS = [
  {
    name: "Facebook",
    id: "facebook",
  },
  {
    name: "Instagram",
    id: "instagram",
  },
  {
    name: "Farcaster",
    id: "farcaster",
  },
  {
    name: "Tiktok",
    id: "tiktok",
  },
];

export const LIST_OF_COUNTRIES = [
  { name: "Spain", id: "spain" },
  { name: "United States", id: "usa" },
  { name: "United Kingdom", id: "uk" },
  { name: "Canada", id: "canada" },
  { name: "Australia", id: "australia" },
  { name: "France", id: "france" },
  { name: "Germany", id: "germany" },
  { name: "Italy", id: "italy" },
  { name: "Japan", id: "japan" },
  { name: "China", id: "china" },
  { name: "India", id: "india" },
  { name: "Brazil", id: "brazil" },
  { name: "Mexico", id: "mexico" },
  { name: "Argentina", id: "argentina" },
  { name: "Russia", id: "russia" },
  { name: "South Africa", id: "south-africa" },
  { name: "South Korea", id: "south-korea" },
  { name: "Turkey", id: "turkey" },
  { name: "Saudi Arabia", id: "saudi-arabia" },
  { name: "Netherlands", id: "netherlands" },
];

export const ROLES = {
  INFLUENCER: "influencer",
  BRAND: "brand",
};

export const ROLE_OPTIONS = [
  { id: "influencer", name: "Influencer" },
  { id: "brand", name: "Brand" },
];

export const STEPS = {
  SELECT_ROLE: "role-selection",
  CREDENTIALS: "credentials",
  REGISTER_INFO: "register-info",
};

export const INITIAL_VALUES = {
  role: ROLES.INFLUENCER,
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  platform: [],
  brandName: "",
  brandDescription: "",
  brandWebsite: "",
  industry: [],
  size: [],
  location: [],
  avatar_url: "",
};

export const CREDENTIALS_FIELDS = [
  {
    name: "email",
    label: "Email",
    placeholder: "What is your email?",
    required: true,
    type: "text",
  },
];

export const INFLUENCER_FIELDS = [
  {
    name: "name",
    label: "Name",
    placeholder: "What is your name?",
    required: true,
    type: "text",
  },
  {
    name: "gender",
    label: "Gender",
    placeholder: "What is your gender?",
    required: true,
    type: "text",
  },
  {
    name: "age",
    label: "Age",
    placeholder: "Enter your age",
    required: true,
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "What is your email?",
    required: true,
    type: "text",
  },
  {
    name: "industry",
    label: "Industry",
    placeholder: "What is your Industry?",
    required: true,
    type: "select",
    options: INDUSTRY_OPTIONS,
    multiple: false,
  },
  {
    name: "platform",
    label: "Platform",
    placeholder: "What is your Platform?",
    required: true,
    type: "select",
    options: PLATFORM_OPTIONS,
    multiple: true,
  },
];

export const BRAND_FIELDS = [
  {
    name: "brandName",
    label: "Name",
    placeholder: "What is the name of your brand?",
    required: true,
    type: "text",
  },
  {
    name: "brandWebsite",
    label: "Website",
    placeholder: "What is the website of your brand?",
    required: true,
    type: "text",
  },
  {
    name: "industry",
    label: "Industry",
    placeholder: "What is the industry of your brand?",
    required: true,
    type: "select",
    options: INDUSTRY_OPTIONS,
    multiple: true,
  },
  {
    name: "size",
    label: "Size",
    placeholder: "What is the size of your brand?",
    required: true,
    type: "select",
    options: [
      {
        id: "1-10",
        name: "1-10",
      },
      {
        id: "11-50",
        name: "11-50",
      },
      {
        id: "51-200",
        name: "51-200",
      },
      {
        id: "201-500",
        name: "201-500",
      },
      {
        id: "501-1000",
        name: "501-1000",
      },
      {
        id: "1001-5000",
        name: "1001-5000",
      },
      {
        id: "5001-10000",
        name: "5001-10000",
      },
    ],
    multiple: false,
  },
  {
    name: "brandDescription",
    label: "Description",
    placeholder: "What is the description of your brand?",
    required: true,
    type: "textarea",
  },
];

export const InfluencerSchemaValidation = Yup.object().shape({
  name: requiredString("name"),
  email: emailValidation("email address"),
  age: requiredNumber("age"),
  platform: stringOrArray("platform"),
  industry: stringOrArray("industry"),
});

export const BrandSchemaValidation = Yup.object().shape({
  brandName: requiredString("brandName"),
  brandWebsite: requiredString("brandWebsite"),
  industry: stringOrArray("Industry"),
  size: stringOrArray("Size"),
  brandDescription: requiredString("brand description")
    .max(2000, "Must be 2000 characters or less")
    .min(500, "Must be 500 characters or more"),
});

export const SCHEMAS = {
  influencer: InfluencerSchemaValidation,
  brand: BrandSchemaValidation,
};
