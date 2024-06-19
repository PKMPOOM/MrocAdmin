import { Link } from "react-router-dom";
import ErrorFallback from "../../../Components/Global/Suspense/ErrorFallback";
import LoadingFallback from "../../../Components/Global/Suspense/LoadingFallback";
import CardSection from "../../../Components/User_side/Dashboard/Section/CardSection";
import HeroSection from "../../../Components/User_side/Dashboard/Section/HeroSection";
import { getSiteMeta, getUserFeeds } from "./api";
import { Divider, Select } from "antd";

function UserDashboard() {
  const {
    data: FeedTile,
    error,
    mutate,
    isLoading: dashboardLoading,
  } = getUserFeeds();
  const { data: siteMeta } = getSiteMeta();

  if (dashboardLoading) {
    return <LoadingFallback />;
  }

  if (!FeedTile || !siteMeta) {
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <ErrorFallback errorTitle="Error Loading user feed" retryFn={mutate} />
    );
  }

  const { footer, socialLinks } = siteMeta;

  return (
    <div className="tw-w-full tw-flex tw-justify-center tw-items-star tw-h-full ">
      <div className="tw-flex tw-flex-col tw-w-screen">
        {FeedTile.map((SectionData) => {
          switch (SectionData.type) {
            case "card":
              return (
                <CardSection key={SectionData.id} SectionData={SectionData} />
              );
            case "hero":
              return (
                <HeroSection key={SectionData.id} SectionData={SectionData} />
              );
            default:
              return null;
          }
        })}
        {/* footer */}
        <div className="tw-px-4  tw-w-full  tw-h-60 tw-flex tw-items-center tw-border tw-border-t tw-border-slate-300 tw-mt-6 tw-bg-slate-50 tw-py-12 ">
          <div className="tw-flex tw-flex-col lg:tw-flex-initial 2xl:tw-max-w-6xl tw-mx-auto tw-gap-4  tw-justify-center tw-items-center ">
            <div className=" tw-flex tw-gap-3">
              {socialLinks?.map((item) => {
                return (
                  <Link
                    key={item.id}
                    to={`${item.soclialLinks.url}`}
                    target="_blank"
                  >
                    <img
                      src={`${item.soclialLinks.icon}`}
                      alt={`${item.title}`}
                      className="tw-w-7 tw-h-7 "
                    />
                  </Link>
                );
              })}
            </div>
            <div className=" tw-flex tw-justify-center">
              {footer?.map((item, index) => {
                const lastIndex = footer.length - 1 === index;
                return (
                  <div key={item.id}>
                    {/* <Link to={`/content/${item.blog.id}`}>{item.title}</Link> */}
                    <Link to={`${item.title}`}>{item.title}</Link>
                    {lastIndex ? null : <Divider type="vertical" />}
                  </div>
                );
              })}
            </div>
            <div className=" tw-flex tw-gap-2 tw-items-center">
              <p>Language</p>
              <Select
                defaultValue={"en"}
                options={[
                  {
                    label: "English",
                    value: "en",
                  },
                  {
                    label: "French",
                    value: "fr",
                  },
                ]}
              />
            </div>
            <p className=" tw-flex tw-justify-center tw-text-slate-500">
              Powered By Insightrix Research Inc. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
