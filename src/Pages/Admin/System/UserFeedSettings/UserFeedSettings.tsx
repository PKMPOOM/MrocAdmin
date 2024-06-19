import { Tabs, Typography } from "antd";
import { TabItem } from "../../../../Interface/DiscussionThreadInterfaces";
import Subtab_SectionSettings from "./Subtab/Section/Subtab_SectionList";
import Subtab_BlogList from "./Subtab/Content/Subtab_BlogList";

const { Title } = Typography;

export type UserNewsFeedSettings = "section" | "blog";

const items: TabItem<UserNewsFeedSettings>[] = [
  {
    key: "section",
    label: `Section`,
    children: <Subtab_SectionSettings />,
  },
  {
    key: "blog",
    label: `Blog`,
    children: <Subtab_BlogList />,
  },
];

const UserFeedSettings = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const tab = searchParams.get("tab");

  const redirect = (key: UserNewsFeedSettings) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", key);
    window.history.pushState({}, "", url.toString());
  };

  return (
    <>
      <div className="tw-flex tw-flex-col ">
        <div className="tw-flex tw-flex-row tw-items-center ">
          <Title level={3}>User feed settings</Title>
        </div>

        <Tabs
          defaultActiveKey={tab || "section"}
          onTabClick={(e) => {
            redirect(e as UserNewsFeedSettings);
          }}
          style={{ marginTop: "-20px" }}
          items={items}
        />
      </div>
    </>
  );
};

export default UserFeedSettings;
