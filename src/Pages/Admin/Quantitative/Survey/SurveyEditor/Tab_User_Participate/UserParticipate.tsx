// import React from "react";
import { Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { userparticipatingSubtab } from "../../../../../../Interface/SurveyEditorInterface";
import Tab_UserParticipatingInviteUser from "./Subtab_Invite_user/Subtab_Invite_user";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";

function UserParticipate_Tabs() {
  const navigate = useNavigate();
  const [activeUserparticipatingSubtab, setActiveUserparticipatingSubtab] =
    useSurveyEditorStore((state) => [
      state.activeUserparticipatingSubtab,
      state.setActiveUserparticipatingSubtab,
    ]);

  const items = [
    {
      key: "invite_users",
      label: `Invite users`,
      children: <Tab_UserParticipatingInviteUser />,
    },
    {
      key: "view_list",
      label: `View list`,
      children: "View list",
    },
  ];

  const redirect = (key: userparticipatingSubtab) => {
    if (key === "invite_users") {
      navigate(`${window.location.pathname}?tab=userparticipating&edit=${key}`);
    } else if (key === "view_list") {
      navigate(`${window.location.pathname}?tab=userparticipating&edit=${key}`);
    } else {
      navigate(`${window.location.pathname}?tab=${key}`);
    }
    setActiveUserparticipatingSubtab(key);
  };

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <Tabs
        style={{ marginTop: "-20px" }}
        items={items}
        activeKey={activeUserparticipatingSubtab}
        onTabClick={(e) => {
          redirect(e as userparticipatingSubtab);
        }}
      />
    </div>
  );
}

export default UserParticipate_Tabs;
