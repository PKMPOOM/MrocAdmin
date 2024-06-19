import {
  UserParticipate_SubTab,
  TabItem,
} from "../../../../../../Interface/DiscussionThreadInterfaces";
import { Tabs } from "antd";
import { useDiscussionStore } from "../../../../../../Store/useDiscussionStore";
import { useEffect } from "react";
import Discussion_Invite_user from "./Subtabs/Discussion_Invite_user";

const items: TabItem<UserParticipate_SubTab>[] = [
  {
    key: "invite_users",
    label: `Invite users`,
    children: <Discussion_Invite_user />,
  },
  {
    key: "view_list",
    label: `View list`,
    children: "View list",
  },
];

function Discussion_User_Participate() {
  const [activeUserParticipateSubtab, setActiveUserParticipateSubtab] =
    useDiscussionStore((state) => [
      state.activeUserParticipateSubtab,
      state.setActiveUserParticipateSubtab,
    ]);

  const searchParams = new URLSearchParams(window.location.search);
  const subtab = searchParams.get("subtab");

  const redirect = (key: UserParticipate_SubTab) => {
    const url = new URL(window.location.href);
    url.searchParams.set("subtab", key);
    window.history.pushState({}, "", url.toString());
    setActiveUserParticipateSubtab(key);
  };

  useEffect(() => {
    // ----------- Default Tab ----------
    if (subtab === "invite_users") {
      setActiveUserParticipateSubtab("invite_users");
    } else if (subtab === "view_list") {
      setActiveUserParticipateSubtab("view_list");
    } else {
      setActiveUserParticipateSubtab("invite_users");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <Tabs
        style={{ marginTop: "-20px" }}
        items={items}
        activeKey={activeUserParticipateSubtab}
        onTabClick={(e) => {
          redirect(e as UserParticipate_SubTab);
        }}
      />
    </div>
  );
}

export default Discussion_User_Participate;
