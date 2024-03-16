import * as Yup from "yup";
import {
  emailValidation,
  passwordValidation,
  phoneValidation,
  requiredString,
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
    name: "username",
    label: "Username",
    placeholder: "Enter a unique username",
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
    name: "phone",
    label:
      'Phone <small style="color: #aaa; position: relative; top: -3px">(optional)</small>',
    placeholder: "What is your brand phone?",
    required: false,
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
    name: "location",
    label: "Location",
    placeholder: "What is the location of your brand?",
    required: true,
    type: "select",
    options: [],
    multiple: false,
  },
  {
    name: "industry",
    label: "Industry",
    placeholder: "What is the industry of your brand?",
    required: true,
    type: "select",
    options: INDUSTRY_OPTIONS,
    multiple: false,
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
  username: requiredString("username"),
  email: emailValidation("email address"),
  platform: stringOrArray("platform"),
  industry: stringOrArray("industry"),
});

export const BrandSchemaValidation = Yup.object().shape({
  name: requiredString("name"),
  email: emailValidation("email address"),
  phone: phoneValidation("phone number"),
  password: passwordValidation("password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
  brandName: requiredString("brand name"),
  brandWebsite: url("How To Apply").required(
    "The how to apply URL is required"
  ),
  industry: stringOrArray("Industry"),
  size: stringOrArray("Size"),
  location: stringOrArray("Location"),
  brandDescription: requiredString("brand description")
    .max(2000, "Must be 2000 characters or less")
    .min(500, "Must be 500 characters or more"),
});

export const SCHEMAS = {
  influencer: InfluencerSchemaValidation,
  brand: BrandSchemaValidation,
};
