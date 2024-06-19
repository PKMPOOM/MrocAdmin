// import React from "react";
import { Tabs } from "antd";
import EditQuestion from "./Subtab/EditQuestions";
import Subtab_questionlist from "./Subtab/Subtab_questionlist";
import { useShallow } from "zustand/react/shallow";
import React from "react";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";

function QuestionEditTabs() {
  const [SideTabActiveKey, SetSideTabActiveKey] = useSurveyEditorStore(
    useShallow((state) => [state.SideTabActiveKey, state.SetSideTabActiveKey])
  );

  return (
    <Tabs
      activeKey={SideTabActiveKey}
      defaultActiveKey="1"
      style={{
        marginTop: 15,
        display: "flex",
        width: "250px",
      }}
      type="card"
      centered={true}
      items={[
        {
          key: "Questions",
          label: "Questions",
          children: <Subtab_questionlist />,
        },
        {
          key: "Edit",
          label: "Edit",
          children: <EditQuestion />,
        },
      ]}
      onTabClick={(e) => {
        SetSideTabActiveKey(e);
      }}
    />
  );
}

export default React.memo(QuestionEditTabs);
