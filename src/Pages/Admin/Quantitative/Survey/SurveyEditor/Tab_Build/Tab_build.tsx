import { LoadingOutlined } from "@ant-design/icons";
import { Button, Tabs, Typography, theme } from "antd";
import { useEffect } from "react";
import { TabItem } from "../../../../../../Interface/DiscussionThreadInterfaces";
const { Text } = Typography;

// tabs
import { Link } from "react-router-dom";
import { useSWRConfig } from "swr";
import Subtab_Questions from "./Subtab_Build/Subtab_Questions";
import Subtab_Variables from "./Subtab_Variable/Subtab_Variable";
import { useShallow } from "zustand/react/shallow";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";

type buildSubtab = "questions" | "lookfeels" | "variables" | "translation";
const { useToken } = theme;

function Tab_build() {
  const { token } = useToken();
  const [SetActiveBuildTab, activeBuildTab, surveyData, surveyFetchingStatus] =
    useSurveyEditorStore(
      useShallow((state) => [
        state.SetActiveBuildTab,
        state.activeBuildTab,
        state.surveyData,
        state.surveyFetchingStatus,
      ])
    );

  const {} = useSWRConfig();

  const items: TabItem<buildSubtab>[] = [
    {
      key: "questions",
      label: `Questions`,
      children: <Subtab_Questions />,
    },
    {
      key: `lookfeels`,
      label: `Look & Feels`,
      children:
        " <Look & Feels Font fam, font size, header image, color primary, color text />",
    },
    {
      key: `variables`,
      label: `Variables`,
      children: <Subtab_Variables />,
    },
    {
      key: `translation`,
      label: `Translation`,
      children: `<Translation />`,
    },
  ];

  const operations = (
    <div className=" tw-flex  tw-items-center">
      {surveyFetchingStatus.isFetching ? (
        <div className="  tw-flex tw-gap-3 tw-items-center">
          <LoadingOutlined
            style={{
              color: token.colorPrimary,
            }}
          />
          <Text type="secondary">saving</Text>
        </div>
      ) : (
        <Text type="secondary">Saved</Text>
      )}

      <Link
        to={`/sv/preview/${surveyData?.detail.id}`}
        target="MROC | Survey Preview"
        // rel="noopener noreferrer"
      >
        <Button style={{ marginRight: 8, marginLeft: 24 }}>Preview</Button>
      </Link>

      <Button type="primary" style={{ marginRight: 24 }}>
        Publish
      </Button>
    </div>
  );
  const searchParams = new URLSearchParams(window.location.search);
  const edit = searchParams.get("edit");
  const url = new URL(window.location.href);

  const validTabs: buildSubtab[] = [
    "questions",
    "lookfeels",
    "variables",
    "translation",
  ];

  useEffect(() => {
    // ----------- check invalid tab ----------
    if (!validTabs.includes(edit as buildSubtab)) {
      url.searchParams.set("edit", "questions");
      window.history.pushState({}, "", url.toString());
    }
  }, []);

  return (
    <div>
      <Tabs
        defaultActiveKey={
          edit && validTabs.includes(edit as buildSubtab) ? edit : "questions"
        }
        onTabClick={(e) => {
          SetActiveBuildTab(e);
          url.searchParams.set("edit", e);
          window.history.pushState({}, "", url.toString());
        }}
        tabBarExtraContent={activeBuildTab === "questions" && operations}
        style={{ marginTop: "-20px" }}
        items={items}
      />
    </div>
  );
}

export default Tab_build;
