import { useEffect } from "react";
import { TabItem } from "../../../../Interface/DiscussionThreadInterfaces";
import { Tabs, Typography } from "antd";
import Invite_User_current_Community from "./Current_community/Invite_User_current_Community";
import Invite_External_Community from "./External/Invite_External_Community";

const { Title } = Typography;

type UserInviteSubtab = "Current_community" | "External_Community";

const items: TabItem<UserInviteSubtab>[] = [
  {
    key: "Current_community",
    label: `Current community`,
    children: <Invite_User_current_Community />,
  },
  {
    key: "External_Community",
    label: `External Community`,
    children: <Invite_External_Community />,
  },
];

function Invite_User() {
  const searchParams = new URLSearchParams(window.location.search);
  const tab = searchParams.get("tab");
  const url = new URL(window.location.href);

  useEffect(() => {
    if (!tab) {
      url.searchParams.append("tab", "Current_community");
      window.history.pushState({}, "", url.toString());
    }
  }, []);

  const redirect = (key: UserInviteSubtab) => {
    url.searchParams.set("tab", key);
    window.history.pushState({}, "", url.toString());
  };

  return (
    <>
      <div className="tw-flex tw-flex-row tw-items-center ">
        <div className="tw-flex tw-flex-row tw-items-center ">
          <Title level={3}>Invite users</Title>
        </div>
      </div>
      <Tabs
        defaultActiveKey={tab ? tab : "Current_community"}
        items={items}
        onTabClick={(e) => {
          redirect(e as UserInviteSubtab);
        }}
      />
    </>
  );
}
export default Invite_User;
