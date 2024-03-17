import React, { useEffect, useState } from "react";
import Head from "@/components/partials/Head";
import Hero from "@/components/UI/Hero";
import InfluencersList from "@/components/Influencers/InfluencersList";
import JobsSortBy from "@/components/Influencers/JobsSortBy";
import Pagination from "@/components/UI/Pagination";
import Filters from "@/components/Influencers/Filters";
import useFilteredJobs from "@/hooks/useFilteredJobs";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { ROLES } from "@/constants/register";
import { useInfluencers } from "@/hooks/useInfluencers";
import {BidInfo, useApi} from "@/hooks/useApi";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import useModal from "@/hooks/useModal";
import useStatefulModal from "@/hooks/useStatefulModal";
import {Influencer} from "@/components/Influencers/JobsItem/types";
import Button from "@/components/UI/Button";
import TextField from "@/components/Form/TextField";
import {parseEther} from "viem";
import {ArrowDownCircleIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon} from "@heroicons/react/24/solid";

const Home = (): React.ReactElement => {
  const router = useRouter();
  // const user = useUser();
  const { user } = useDynamicContext();
  const { isOnboarded } = useApi();

  const [action, setAction] = useState({
    title: "Get Started",
    handler: () => router.push("/register"),
  });

  const [pageOptions, setPageOptions] = useState({
    offset: 0,
    limit: 10,
  });

  const [
    jobs,
    totalCount,
    loading,
    error,
    handleFiltersChange,
    memoizedFilters,
  ] = useFilteredJobs(pageOptions.offset, pageOptions.limit);

  const influencers = useInfluencers();

  const handlePageChange = (offset) => {
    setPageOptions({ ...pageOptions, offset });
  };

  const handleLimitChange = (e) => {
    setPageOptions({
      ...pageOptions,
      limit: Number(e.target.value),
      offset: 0,
    });
  };

  // const role = user;
  // const title = role === ROLES.COMPANY ? "Find an influencer" : "Manage bids";
  // const path = role === ROLES.COMPANY ? "/jobs/new" : "/jobs";

  // setAction({
  //   title: title,
  //   handler: () => router.push(path),
  // });

  useEffect(() => {
    const fetchData = async () => {
      if (user?.username) {
        const data = await isOnboarded(user.username);
        console.log(data, "data onboard");
        if (!data) {
          router.push("/register");
        }
      }
    };

    fetchData();
  }, [user]);

  const { Modal, isOpen, openModal, closeModal, setModalState } = useStatefulModal();

  return (
    <div className="min-h-screen mb-20">
      <Head />
      <Hero action={action} />

      <section className="flex flex-col w-full gap-10 mx-auto max-w-8xl sm:grid sm:grid-cols-12">
        <section className="col-span-12 lg:col-span-8 h-fit">
          <header className="flex flex-col items-center justify-between pb-6 pl-5 sm:flex-row">
            <h2 className="text-lg font-semibold sm:text-xl md:text-2xl">
              Content creators
            </h2>

            <div className="flex flex-col items-end gap-2">
              <JobsSortBy onChange={handleFiltersChange} />
              {/* Pagination simple next/prev */}
              {totalCount > 10 && (
                <Pagination
                  error={error}
                  handleLimitChange={handleLimitChange}
                  handlePageChange={handlePageChange}
                  limit={pageOptions.limit}
                  loading={loading}
                  offset={pageOptions.offset}
                  totalCount={totalCount}
                />
              )}
            </div>
          </header>

          <InfluencersList
            error={null}
            influencers={influencers}
            loading={loading}
            onSubmitBid={(influencer: Influencer, submitBid: any) => {
              setModalState({
                influencer,
                submitBid
              });
              openModal()
            }}
          />
        </section>

        <Filters filters={memoizedFilters} onChange={handleFiltersChange} />
      </section>

      <Modal>
        {({modalState, closeModal}) => {
          const [createBidStatus, setCreateBidStatus] = useState("idle");
          const {influencer, submitBid} = modalState;
          const [formData, setFormData] = useState<Record<any, any>>({});

          return (
            <section className="grid w-full grid-cols-1 gap-2">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl md:text-3xl">Submit Bid</h1>
              <ul className="flex flex-col w-full">
                {[
                  {name: "title", label:"Title", required:true, placeholder:"Title"},
                  {name: "description", label:"Description", required:true, placeholder:"Description"},
                  {name: "impressions", label:"Required Likes", required:true, placeholder:"Required Likes"},
                  {name: "budget", label:"Max Payout", required:true, placeholder:"Max Payout"}
                ].map((field) => (
                    <li className="block w-full mb-2" key={field.name}>
                      {(
                          <TextField
                              label={field.label}
                              name={field.name}
                              onChange={e => {
                                setFormData({
                                  ...formData,
                                  [field.name]: e.target.value
                                })
                              }}
                              placeholder={field.placeholder}
                              required={field.required}
                              title={field.label}
                              type="textarea"
                              value={formData[field.name]}
                          />
                      )}
                    </li>
                ))}
              </ul>
              <Button className={`rounded-lg flex flex-row items-end justify-end text-gray-500 hover:text-primary-700`}
                      size="md" color="primary" onClick={() => {
                submitBid(formData);
                closeModal()
              }}
                      color={createBidStatus === "busy" ? "white" : "primary"}
                      disabled={createBidStatus !== "idle"}>
                <div className={"flex flex-row gap-2"}>
                  <div>{createBidStatus === "busy" ? "Submitting.." :
                      createBidStatus === "idle" ? "Submit bid" :
                          createBidStatus === "success" ? "Bid submitted!" : "Error occurred"}</div>
                  <div className="w-5 h-full m-auto">
                    {createBidStatus === "busy" ? <ClockIcon/> :
                        createBidStatus === "idle" ? <ArrowDownCircleIcon/> :
                            createBidStatus === "success" ? <CheckCircleIcon/> : <ExclamationTriangleIcon/>}
                  </div>
                </div>
              </Button>
            </section>
          )
        }}
      </Modal>
    </div>
  );
};

export default Home;
