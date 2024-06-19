import { Tabs, Typography } from "antd";
import { TabItem } from "../../../../Interface/DiscussionThreadInterfaces";
import React, { Suspense } from "react";
import LoadingFallback from "~/component/Global/Suspense/LoadingFallback";

const SiteContentsTable = React.lazy(
  () => import("~/component/System/SystemContent/SiteContent/SiteContentsTable")
);

const FooterTable = React.lazy(
  () => import("~/component/System/SystemContent/Footer/FooterTable")
);

const SocialLinksTable = React.lazy(
  () => import("~/component/System/SystemContent/Social/SocialLinksTable")
);

const { Title } = Typography;

export type UserNewsFeedSettings =
  | "footer"
  | "social_media_links"
  | "site_contents";

const items: TabItem<UserNewsFeedSettings>[] = [
  {
    key: "footer",
    label: `Footer`,
    children: (
      <Suspense fallback={<LoadingFallback />}>
        <FooterTable />
      </Suspense>
    ),
  },
  {
    key: "social_media_links",
    label: `Social media links`,
    children: (
      <Suspense fallback={<LoadingFallback />}>
        <SocialLinksTable />
      </Suspense>
    ),
  },
  {
    key: "site_contents",
    label: `Site contents`,
    children: (
      <Suspense fallback={<LoadingFallback />}>
        <SiteContentsTable />
      </Suspense>
    ),
  },
];

const SystemContentPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const tab = searchParams.get("tab");

  const redirect = (key: UserNewsFeedSettings) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", key);
    window.history.pushState({}, "", url.toString());
  };

  return (
    <>
      <div className="tw-flex tw-flex-row tw-items-center ">
        <div className="tw-flex tw-flex-row tw-items-center ">
          <Title level={3}>System content</Title>
        </div>
      </div>
      <Tabs
        defaultActiveKey={tab ? tab : "footer"}
        onTabClick={(e) => {
          redirect(e as UserNewsFeedSettings);
        }}
        items={items}
      />
    </>
  );
};

export default SystemContentPage;
