import { Tabs } from "antd";
import Sentiment_analysis from "./Subtabs/SentimentAnalysis/Sentiment_analysis";
import { useEffect } from "react";
import { useDiscussionStore } from "../../../../../../Store/useDiscussionStore";
import {
  Discussion_ReportSubTab,
  TabItem,
} from "../../../../../../Interface/DiscussionThreadInterfaces";

const items: TabItem<Discussion_ReportSubTab>[] = [
  {
    key: "sentiment_analysis",
    label: `Sentiment analysis`,
    children: <Sentiment_analysis />,
  },
  {
    key: "word_cloud",
    label: `Word cloud`,
    children: "<Distribution />",
  },
  {
    key: "member_in_thread",
    label: `Member in thread`,
    children: " <Member_in_thread />",
  },
  {
    key: `photos`,
    label: `Photos`,
    children: " <Photos />",
  },
  {
    key: `videos`,
    label: `Videos`,
    children: " <Videos />",
  },
  {
    key: `tags_summary`,
    label: `Tags summary`,
    children: " <Tags_summary />",
  },
];

function DiscussionReport() {
  const [activeReportTab, setActiveReportTab] = useDiscussionStore((state) => [
    state.activeReportTab,
    state.setActiveReportTab,
  ]);

  const searchParams = new URLSearchParams(window.location.search);
  const subtab = searchParams.get("subtab");

  useEffect(() => {
    // ----------- Default Tab ----------]
    if (subtab === "sentiment_analysis") {
      setActiveReportTab("sentiment_analysis");
    } else if (subtab === "word_cloud") {
      setActiveReportTab("word_cloud");
    } else if (subtab === "member_in_thread") {
      setActiveReportTab("member_in_thread");
    } else if (subtab === "photos") {
      setActiveReportTab("photos");
    } else if (subtab === "videos") {
      setActiveReportTab("videos");
    } else if (subtab === "tags_summary") {
      setActiveReportTab("tags_summary");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redirect = (key: Discussion_ReportSubTab) => {
    // setparams({ tab: "report", subtab: key });
    const url = new URL(window.location.href);
    url.searchParams.set("subtab", key);
    window.history.pushState({}, "", url.toString());
    setActiveReportTab(key);
  };

  return (
    <div>
      <Tabs
        activeKey={activeReportTab}
        defaultActiveKey={subtab || "sentiment_analysis"}
        onTabClick={(e) => {
          redirect(e as Discussion_ReportSubTab);
        }}
        style={{ marginTop: "-20px" }}
        items={items}
      />
    </div>
  );
}

export default DiscussionReport;
