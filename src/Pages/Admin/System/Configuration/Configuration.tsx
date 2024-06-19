import { Typography, Tabs } from "antd";
import type { TabItem } from "../../../../Interface/DiscussionThreadInterfaces";
import { useQuery } from "@tanstack/react-query";
import { SiteConfig } from "../../../../Interface/ConfigInterfaces";
import { useAuth } from "../../../../Context/Auth/AuthContext";
import LoadingFallback from "../../../../Components/Global/Suspense/LoadingFallback";
import Subtab_General from "./Subtab/Subtab_General";
import Subtab_Reward from "./Subtab/Subtab_Reward";
import Subtab_Security from "./Subtab/Subtab_Security";

export type Configurations_MianTabs =
  | "general"
  | "rewards"
  | "security"
  | "footer&social"
  | "badges"
  | "user";

export type SoteFooterSocial_SubTabs =
  | "Footer"
  | "Social media links"
  | "Site contents";

const { Title } = Typography;

function Configuration() {
  const { Axios } = useAuth();
  const searchParams = new URLSearchParams(window.location.search);
  const tab = searchParams.get("tab");
  const url = new URL(window.location.href);

  if (!tab) {
    url.searchParams.append("tab", "general");
    window.history.pushState({}, "", url.toString());
  }

  const fetchConfig = async () => {
    const response = await Axios.get(`/config`);
    return response.data;
  };

  const { data: ConfigData } = useQuery<SiteConfig>({
    queryKey: ["Config"],
    queryFn: fetchConfig,
    refetchOnWindowFocus: false,
  });

  if (!ConfigData) {
    return <LoadingFallback />;
  }

  const items: TabItem<Configurations_MianTabs>[] = [
    {
      key: "general",
      label: `General`,
      children: <Subtab_General generalConfig={ConfigData.general_config} />,
    },
    {
      key: "rewards",
      label: `Rewards`,
      children: <Subtab_Reward rewardConfig={ConfigData.rewards_config} />,
    },
    {
      key: "security",
      label: `Security`,
      children: <Subtab_Security securityConfig={ConfigData.security_config} />,
    },
    {
      key: "footer&social",
      label: `Site footer & social media`,
      children: "<SitefooterMainPage />",
    },
    {
      key: "user",
      label: `User`,
      children: "<ConfigUser_Tab />",
    },
  ];

  const redirect = (key: Configurations_MianTabs) => {
    url.searchParams.set("tab", key);
    window.history.pushState({}, "", url.toString());
  };

  return (
    <>
      <div className="tw-flex tw-flex-row tw-items-center ">
        <div className="tw-flex tw-flex-row tw-items-center ">
          <Title level={3}>Configurations</Title>
        </div>
      </div>
      <Tabs
        defaultActiveKey={tab ? tab : "general"}
        onTabClick={(e) => {
          redirect(e as Configurations_MianTabs);
        }}
        items={items}
      />
    </>
  );
}

export default Configuration;
