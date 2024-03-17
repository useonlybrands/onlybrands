import AutoComplete from "@/components/Form/AutoComplete";
import TextField from "@/components/Form/TextField";
import TextareaField from "@/components/Form/Textarea";
import AvatarUpload from "@/components/UI/AvatarUpload";
import Button from "@/components/UI/Button";
import {
  INFLUENCER_FIELDS,
  BRAND_FIELDS,
  CREDENTIALS_FIELDS,
  INITIAL_VALUES,
  ROLE_OPTIONS,
  ROLES,
  SCHEMAS,
  STEPS,
} from "@/constants/register";
import useCountries from "@/hooks/useCountries";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import useModal from "@/hooks/useModal";
import { useApi } from "@/hooks/useApi";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const router = useRouter();
  const allCountries = useCountries();
  const { Modal, isOpen, openModal, closeModal } = useModal();
  const { user, updateProfile, dynamicContext } = useApi();

  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(STEPS.SELECT_ROLE);
  const [role, setRole] = useState(ROLES.INFLUENCER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState(INITIAL_VALUES);
  const [typesSchemas] = useState(SCHEMAS);

  useEffect(() => {
    if (!dynamicContext.isAuthenticated) {
      router.push("/");
    }
  }, [dynamicContext.isAuthenticated]);

  // Returns an array of options for a given field name.
  const getFieldOptions = (fieldName) => {
    // Field names for which options are available
    const PLATFORM_FIELD = "platform";
    const SIZE_FIELD = "size";
    const INDUSTRY_FIELD = "industries";

    // Object that maps field names to their available options.
    const fieldOptions = {
      platform: INFLUENCER_FIELDS.find((field) => field.name === PLATFORM_FIELD)
        .options,
      size: BRAND_FIELDS.find((field) => field.name === SIZE_FIELD).options,
      industries: BRAND_FIELDS.find((field) => field.name === INDUSTRY_FIELD)
        .options,
      location: allCountries,
    };

    // Return the options for the specified field name, or an empty array if the field name is not found.
    return fieldOptions[fieldName] || [];
  };

  // Returns an array of field definitions for a given role (either influencer or brand).
  const setFieldsByRole = (role) => {
    // Object that maps roles to their corresponding field definitions.
    const fields = {
      influencer: INFLUENCER_FIELDS,
      brand: BRAND_FIELDS,
    };

    // Return the field definitions for the specified role, or an empty array if the role is not found.
    return fields[role] || [];
  };

  // Checks if the form is valid based on the current step and role
  const isFormValid = (values, step) => {
    if (step === STEPS.CREDENTIALS) {
      return values.email;
    } else if (step === STEPS.REGISTER_INFO) {
      if (role === ROLES.INFLUENCER) {
        return values.name && values.platform.length;
      } else if (role === ROLES.BRAND) {
        return (
          values.brandName &&
          values.brandDescription &&
          values.industries.length &&
          values.size.length
        );
      }
    }
    return false;
  };

  const uploadImageToImgBB = async (formData) => {
    const data = new FormData();
    data.append("image", formData.avatar_url);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: data,
        }
      );

      if (response.ok) {
        const { data } = await response.json();
        return data.url;
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error uploading image to ImgBB:", error.message);
      throw error;
    }
  };

  const createInfluencerOrBrandHandler = async (values, avatarURL) => {
    const profile = {
      profileType: values.role,
      influencerInfo:
        values.role === ROLES.INFLUENCER
          ? {
              username: user.username,
              name: values.name,
              email: values.email,
              wallet: await dynamicContext.primaryWallet.address,
              platform: values.platform[0].id,
              industries: values.industries[0].id,
              sex: values.gender,
              age: values.age,
              image: avatarURL,
            }
          : {},
      brandInfo:
        values.role === ROLES.BRAND
          ? {
              name: user.username,
              email: values.email,
              wallet: await dynamicContext.primaryWallet.address,
              industries: values.industries,
              size: values.size,
              description: values.description,
              image: values.image,
            }
          : {},
    };

    try {
      const res = await updateProfile(profile);
      console.log("updateProfile: ", res);

      return res;
    } catch (error) {
      const errorMessage = error?.message || "Server error occurred";
      toast.error(errorMessage);
      throw error;
    }
  };

  const onRegisterHandler = async () => {
    setIsSubmitting(true);
    console.log("formData: ", formData);

    try {
      const avatarURL = formData.avatar_url
        ? await uploadImageToImgBB(formData)
        : "";
      const res = await createInfluencerOrBrandHandler(formData, avatarURL);

      if (!res.ok || res.status !== 200) {
        const errorMessage = error?.message || "Server error occurred";
        throw new Error(errorMessage);
      }

      closeModal();
      toast.success("Account created successfully");
      router.push("/");
    } catch (error) {
      console.error(error);
      const errorMessage = error?.message || "Server error occurred";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set the email field to the value of the query parameter 'email', if present
  useEffect(() => {
    const { email } = router.query;
    if (email) {
      setInitialValues((prevValues) => ({ ...prevValues, email }));
    }
  }, [router.query.email]);

  // Memoize the Yup validation schema based on the selected role.
  const validationSchemaSelected = useMemo(() => {
    return typesSchemas[role];
  }, [role]);

  console.log({
    role: role,
    currentStep: step,
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchemaSelected}
    >
      {({
        values,
        handleChange,
        handleBlur,
        setFieldValue,
        errors,
        touched,
        setFieldTouched,
      }) => (
        <>
          <article
            className={`container flex flex-col items-center pt-8 w-full min-h-[calc(100vh-4rem)] mx-auto space-y-6 bg-gray-100 min-w-screen
          ${
            step === STEPS.REGISTER_INFO && role === ROLES.BRAND
              ? "max-w-2xl"
              : "max-w-sm"
          }
        `}
          >
            <header>
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl md:text-3xl ">
                {step === STEPS.SELECT_ROLE && "Select your role"}
                {step === STEPS.CREDENTIALS && "Account Registration"}
                {step === STEPS.REGISTER_INFO &&
                  `${
                    values.role === ROLES.INFLUENCER ? "Influencer" : "Brand"
                  } Registration`}
              </h1>
            </header>

            <form
              className="grid w-full grid-cols-1 p-8 bg-white rounded-lg shadow-md shadow-lg shadow-xl"
              role="form"
            >
              {step === STEPS.SELECT_ROLE && (
                <article>
                  <div className="flex items-center justify-center w-full gap-4">
                    {ROLE_OPTIONS.map((option) => (
                      <div
                        className="relative flex items-center justify-start w-full"
                        key={option.id}
                      >
                        <label
                          aria-label={option.name}
                          aria-pressed={option.id === role}
                          className={`flex items-center justify-center w-full p-2 text-lg font-semibold select-none text-white rounded-md cursor-pointer h-32 ${
                            option.id === role
                              ? "bg-primary-700 hover:bg-secondary-800 "
                              : "bg-gray-400 hover:bg-secondary-700"
                          }`}
                          htmlFor={option.id}
                          role="button"
                        >
                          {option.name}
                          <input
                            aria-checked={option.id === role}
                            checked={option.id === role}
                            className="absolute cursor-pointer bottom-1.5 right-1.5 rounded text-primary-800 ring-0 focus:ring-0 focus:outline-none"
                            id={option.id}
                            name="role"
                            onChange={() => {
                              setRole(option.id);
                              setFieldValue("role", option.id);
                            }}
                            role="radio"
                            type="checkbox"
                            value={option.id}
                          />
                        </label>
                      </div>
                    ))}
                  </div>

                  <Button
                    aria-label="Continue"
                    displayType="flex"
                    fullWidth
                    onClick={(event) => {
                      event.preventDefault();
                      // validate form
                      setStep(STEPS.REGISTER_INFO);
                    }}
                    rounded="md"
                    size="lg"
                    styles={"w-full h-[50px] mt-8"}
                    title="Continue"
                    type="button"
                  >
                    <div className="text-white">Get started</div>
                  </Button>
                </article>
              )}

              {step === STEPS.CREDENTIALS && (
                <article className="cols-span-1">
                  <section className="grid w-full grid-cols-1 gap-2">
                    <ul className="flex flex-col w-full">
                      {CREDENTIALS_FIELDS.map((field) => (
                        <li className="block w-full" key={field.name}>
                          {field.type === "email" && (
                            <TextField
                              error={
                                errors[field.name] &&
                                touched[field.name] &&
                                errors[field.name]
                              }
                              label={field.label}
                              name={field.name}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder={field.placeholder}
                              required={field.required}
                              title={field.label}
                              type="text"
                              value={values[field.name]}
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <Button
                    color={isFormValid(values, step) ? "primary" : "disabled"}
                    disabled={!isFormValid(values, step)}
                    displayType="flex"
                    fullWidth
                    onClick={(event) => {
                      event.preventDefault();
                      if (isFormValid(values, step)) {
                        setStep(STEPS.REGISTER_INFO);
                      }
                    }}
                    rounded="md"
                    size="lg"
                    styles={"w-full h-[50px] mt-8"}
                    title="Continue"
                    type="button"
                  >
                    <div
                      className={
                        isFormValid(values, step)
                          ? "text-white"
                          : "text-gray-400"
                      }
                    >
                      Continue
                    </div>
                  </Button>
                  <footer className="flex items-center justify-center w-full mt-4">
                    <Button
                      className="text-sm font-light text-gray-800 cursor-pointer hover:text-secondary-700"
                      color="text"
                      onClick={() => setStep(STEPS.SELECT_ROLE)}
                      type="button"
                    >
                      Return to previous step
                    </Button>
                  </footer>
                </article>
              )}

              {step === STEPS.REGISTER_INFO && (
                <article className="w-full">
                  <section className="flex flex-col items-center w-full">
                    <AvatarUpload
                      errors={errors.avatar_url}
                      id="avatar_url"
                      name="avatar_url"
                      onChange={(uploadedAvatar) => {
                        setFieldValue("avatar_url", uploadedAvatar);
                      }}
                      placeholder={`Upload ${
                        role === "influencer" ? "avatar" : "logo"
                      }`}
                    />

                    <div className="w-full h-px mt-6 mb-4 bg-gray-300" />

                    <section
                      className={`grid w-full gap-4 grid-cols-${
                        role === "influencer" ? 1 : 2
                      }`}
                    >
                      {setFieldsByRole(role).map((field) => (
                        <div className="w-full" key={field.name}>
                          {field.type === "text" && (
                            <TextField
                              error={
                                errors[field.name] &&
                                touched[field.name] &&
                                errors[field.name]
                              }
                              label={field.label}
                              name={field.name}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder={field.placeholder}
                              required={field.required}
                              title={field.label}
                              type="text"
                              value={values[field.name]}
                            />
                          )}

                          {field.type === "email" && (
                            <TextField
                              error={
                                errors[field.name] &&
                                touched[field.name] &&
                                errors[field.name]
                              }
                              label={field.label}
                              name={field.name}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder={field.placeholder}
                              required={field.required}
                              title={field.label}
                              type="text"
                              value={values[field.name]}
                            />
                          )}

                          {field.type === "select" &&
                            getFieldOptions(field.name)?.length > 0 && (
                              <AutoComplete
                                error={
                                  errors[field.name] &&
                                  touched[field.name] &&
                                  errors[field.name]
                                }
                                name={field.name}
                                onChange={(selected) =>
                                  setFieldValue(field.name, selected)
                                }
                                options={getFieldOptions(field.name)}
                                optionsSelected={values[field.name] || []}
                                placeholder={field.placeholder}
                                required={field.required}
                                setTouched={(name) => setFieldTouched(name)}
                                title={field.label}
                              />
                            )}
                        </div>
                      ))}
                    </section>

                    {role === ROLES.BRAND && (
                      <section className="flex flex-col w-full mt-4">
                        <TextareaField
                          error={
                            errors.brandDescription &&
                            touched.brandDescription &&
                            errors.brandDescription
                          }
                          label={"Description"}
                          name={"brandDescription"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder={"Enter your brand description"}
                          required
                          rows={5}
                          title={"brand Description"}
                          value={values.brandDescription}
                        />
                      </section>
                    )}
                  </section>

                  <Button
                    color={isFormValid(values, step) ? "primary" : "disabled"}
                    disabled={!isFormValid(values, step)}
                    displayType="block"
                    fullWidth
                    onClick={(event) => {
                      event.preventDefault();

                      if (!isOpen && isFormValid(values, step)) {
                        setFormData(values);
                        openModal();
                      }
                    }}
                    rounded="md"
                    size="lg"
                    styles={"w-full h-[50px] mt-8"}
                    title="Register"
                    type="button"
                  >
                    <div
                      className={
                        isFormValid(values, step)
                          ? "text-white"
                          : "text-gray-400"
                      }
                    >
                      Create account
                    </div>
                  </Button>

                  <footer className="flex items-center justify-center w-full mt-4">
                    <Button
                      className="text-sm font-light text-gray-800 cursor-pointer hover:text-secondary-700"
                      color="text"
                      onClick={() => setStep(STEPS.SELECT_ROLE)}
                      type="button"
                    >
                      Return to previous step
                    </Button>
                  </footer>
                </article>
              )}
            </form>

            {/* <footer className="flex flex-col gap-2 mt-4 text-center">
              <section className="text-base font-light text-gray-800">
                Already have an account?{' '}
                <button
                  className="cursor-pointer text-primary-700"
                  onClick={() => router.push('/login')}
                  type="button"
                >
                  Login
                </button>
              </section> */}
            {/* 
            <section className="text-base font-light text-gray-800">
              Forgot your password?{' '}
              <button
                type="button"
                className="cursor-pointer text-primary-700"
                onClick={() => router.push('/forgot-password')}
              >
                Reset Password
              </button>
            </section> */}
            {/* </footer> */}
          </article>

          {/* Confirmation Modal */}
          <Modal>
            <article>
              <header className="flex flex-col items-center justify-center w-full h-full">
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-700">
                  <CheckIcon className="w-8 h-8 text-white" />
                </div>

                <h2 className="mb-2 text-2xl font-semibold text-center text-gray-800">
                  Are you sure you want to continue?
                </h2>

                <p className="text-base font-light text-center text-gray-800">
                  You will not be able to change your role after registration.
                </p>
              </header>

              <section className="flex items-center w-full mt-8 space-x-4">
                <Button
                  color="white"
                  displayType="block"
                  fullWidth
                  onClick={() => {
                    setFormData({});
                    closeModal();
                  }}
                  rounded="md"
                  size="lg"
                  styles={"w-full h-[50px]"}
                  title="Cancel"
                  type="button"
                >
                  Cancel
                </Button>

                <Button
                  color={isSubmitting ? "disabled" : "primary"}
                  disabled={isSubmitting}
                  displayType="block"
                  fullWidth
                  onClick={() => {
                    onRegisterHandler();
                  }}
                  rounded="md"
                  size="lg"
                  styles={"w-full h-[50px]"}
                  title="Login"
                  type="button"
                >
                  {isSubmitting ? (
                    <span>
                      <ArrowPathIcon className="w-5 h-5 text-white animate-spin" />
                    </span>
                  ) : (
                    <div className="text-white">Register</div>
                  )}
                </Button>
              </section>
            </article>
          </Modal>
        </>
      )}
    </Formik>
  );
};

export default Register;
