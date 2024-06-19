import { Typography, Tabs, Skeleton } from "antd";
import { createContext, useEffect } from "react";
import { useDiscussionStore } from "../../../../../Store/useDiscussionStore";
import Discussion_User_Participate from "./User_participate/Discussion_User_Participate";
import {
  Discussion_MainTab,
  TabItem,
} from "../../../../../Interface/DiscussionThreadInterfaces";
import {
  DiscussionSchema,
  DiscussionFullType,
} from "../../../../../Interface/DiscussionThreadInterfaces";
// Tabs
import DiscussionReport from "./Report/DiscussionReport";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../../Context/Auth/AuthContext";
import Discussions from "./Discussions/Discussions";

const { Title, Text } = Typography;

type discussionPageContextType = {
  discussionData: DiscussionFullType;
};

export const discussionPageContext = createContext(
  {} as discussionPageContextType
);

function DiscussionPage() {
  const [
    activeDiscussionTab,
    setActiveDiscussionTab,
    activeReportTab,
    activeUserParticipateSubtab,
  ] = useDiscussionStore((state) => [
    state.activeDiscussionTab,
    state.setActiveDiscussionTab,
    state.activeReportTab,
    state.activeUserParticipateSubtab,
  ]);

  const { Axios } = useAuth();

  const { id: discussionID } = useParams();

  const searchParams = new URLSearchParams(window.location.search);
  const tab = searchParams.get("tab");

  useEffect(() => {
    // ----------- Default Tab ----------
    if (tab === "discussion") {
      setActiveDiscussionTab("discussion");
    } else if (tab === "distribution") {
      setActiveDiscussionTab("distribution");
    } else if (tab === "report") {
      setActiveDiscussionTab("report");
    } else if (tab === "tags") {
      setActiveDiscussionTab("tags");
    } else if (tab === "user_participate") {
      setActiveDiscussionTab("user_participate");
    } else {
      setActiveDiscussionTab("discussion");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDiscussionData = async () => {
    const response = await Axios.get(`/discussion/${discussionID}`);
    const data = DiscussionSchema.parse(response.data);
    return data;
  };

  const { data } = useQuery({
    queryKey: ["discussion", discussionID],
    queryFn: getDiscussionData,
    refetchOnWindowFocus: false,
  });

  if (!data) {
    return (
      <div className="tw-w-full tw-flex-col tw-h-full tw-gap-4 tw-flex tw-px-8">
        <Skeleton.Input active />
        <div className="tw-mt-5 tw-flex tw-flex-col tw-gap-2 tw-mb-4">
          <Skeleton.Input active block />
          <div className="tw-w-4/5">
            <Skeleton.Input active block />
          </div>
        </div>
        <div className="tw-flex tw-flex-col tw-gap-4">
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </div>
      </div>
    );
  }

  const items: TabItem<Discussion_MainTab>[] = [
    {
      key: "discussion",
      label: `Discussions`,
      children: <Discussions />,
    },
    {
      key: "distribution",
      label: `Distribution`,
      children: "<Distribution />",
    },
    {
      key: "user_participate",
      label: `User participate`,
      children: <Discussion_User_Participate />,
    },
    {
      key: "report",
      label: `Report`,
      children: <DiscussionReport />,
    },
    {
      key: `tags`,
      label: `Tags`,
      children: " <tags />",
    },
  ];

  const redirect = (key: Discussion_MainTab) => {
    const url = new URL(window.location.href);
    if (key === "report") {
      url.searchParams.set("tab", "report");
      url.searchParams.set("subtab", activeReportTab);
    } else if (key === "user_participate") {
      url.searchParams.set("tab", "report");
      url.searchParams.set("subtab", activeUserParticipateSubtab);
    } else {
      url.searchParams.set("tab", key);
      url.searchParams.delete("subtab");
    }
    window.history.pushState({}, "", url.toString());
    setActiveDiscussionTab(key);
  };

  const ContextValue = {
    discussionData: data,
  };

  return (
    <discussionPageContext.Provider value={ContextValue}>
      <div className="tw-h-full tw-px-6 tw-flex tw-flex-col tw-gap-4 ">
        <div className="tw-flex tw-flex-col ">
          <div className="tw-flex tw-items-end tw-gap-5">
            <Title level={3}>{data?.name}</Title>
            <div className="tw-flex tw-gap-4 tw-mb-3">
              <div className="tw-flex tw-gap-1">
                <Text type="secondary">Categories</Text>
                <Text strong>{data?.Category ? data.Category : "-"}</Text>
              </div>
            </div>
          </div>
          <Tabs
            activeKey={activeDiscussionTab}
            items={items}
            onTabClick={(e) => {
              redirect(e as Discussion_MainTab);
            }}
          />
        </div>
      </div>
    </discussionPageContext.Provider>
  );
}

export default DiscussionPage;
