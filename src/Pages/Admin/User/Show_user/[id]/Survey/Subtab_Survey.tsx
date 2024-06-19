import { Tabs } from "antd";
import { useEffect } from "react";
import Subtab_Mroc from "./Mroc/Subtab_Mroc";
import Subtab_Decipher from "./Decipher/Subtab_Decipher";
import { SurveySubtabs, useUserPageStore } from "~/store/useUserPageStore";
import { TabItem } from "~/interface/DiscussionThreadInterfaces";

const items: TabItem<SurveySubtabs>[] = [
  {
    key: "mroc",
    label: `Mroc`,
    children: <Subtab_Mroc />,
  },
  {
    key: "decipher",
    label: `Decipher`,
    children: <Subtab_Decipher />,
  },
];

const Subtab_Survey = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const tab = searchParams.get("subtab");
  const url = new URL(window.location.href);
  const setSurveySubTabs = useUserPageStore((state) => state.setSurveySubTabs);

  useEffect(() => {
    if (!tab) {
      url.searchParams.append("tab", "mroc");
      window.history.pushState({}, "", url.toString());
    }
  }, []);

  const redirect = (key: SurveySubtabs) => {
    url.searchParams.set("subtab", key);
    window.history.pushState({}, "", url.toString());
    setSurveySubTabs(key);
  };

  return (
    <Tabs
      items={items}
      defaultActiveKey={tab ? tab : "mroc"}
      style={{ marginTop: "-20px" }}
      onTabClick={(e) => {
        redirect(e as SurveySubtabs);
      }}
    />
  );
};

export default Subtab_Survey;
