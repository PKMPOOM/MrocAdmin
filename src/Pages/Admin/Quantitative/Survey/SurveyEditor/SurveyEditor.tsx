import { Button, Result, Tabs, Typography } from "antd";
import React, { Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import Skelton from "./SurveyEditorSkeleton";
// type & interfaces
import type { TabsProps } from "antd";
import { SurveyEditorTabs } from "../../../../../Interface/SurveyEditorInterface";
// store & global context
// import tabs
const Tab_build = React.lazy(() => import("./Tab_Build/Tab_build"));
const Tab_detail = React.lazy(() => import("./Tab_Detail/Tab_detail"));
const OverviewPage = React.lazy(
  () => import("./Tab_Overview&Open/OverviewPage")
);
const UserParticipate_Tabs = React.lazy(
  () => import("./Tab_User_Participate/UserParticipate")
);
//hooks
import { useShallow } from "zustand/react/shallow";
import { getSurveyData } from "../api";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";
import LoadingFallback from "~/component/Global/Suspense/LoadingFallback";

const { Title } = Typography;

function SurveyEditor() {
  const params = useParams();
  const surveyID = params.id;
  const searchParams = new URLSearchParams(window.location.search);
  const UrlTab = searchParams.get("tab");
  const url = new URL(window.location.href);

  const [
    SetSurveyEditorTabs,
    activeBuildTab,
    activeOverviewSubtab,
    activeUserparticipatingSubtab,
    setSelectedTree,
    setSurveyMeta,
    setSurveyData,
    setSurveyFetchingStatus,
    initializeActiveQuestion,
  ] = useSurveyEditorStore(
    useShallow((state) => [
      state.SetSurveyEditorTabs,
      state.activeBuildTab,
      state.activeOverviewSubtab,
      state.activeUserparticipatingSubtab,
      state.setSelectedTree,
      state.setSurveyMeta,
      state.setSurveyData,
      state.setSurveyFetchingStatus,
      state.initializeActiveQuestion,
    ])
  );

  const NewSurvey: boolean = surveyID === "Newsurvey";

  const items: TabsProps["items"] = [
    {
      key: "detail",
      label: `Survey Details`,
      children: (
        <Suspense fallback={<LoadingFallback />}>
          <Tab_detail />
        </Suspense>
      ),
    },
    {
      key: "build",
      label: `Build`,
      children: !NewSurvey ? (
        <Suspense fallback={<LoadingFallback />}>
          <Tab_build />
        </Suspense>
      ) : null,
      disabled: NewSurvey,
    },
    {
      key: "distribution",
      label: `Distribution`,
      children: "<DistributionTab />",
      disabled: NewSurvey,
    },
    {
      key: `overview`,
      label: `Overview/Open`,
      children: !NewSurvey ? (
        <Suspense fallback={<LoadingFallback />}>
          <OverviewPage />
        </Suspense>
      ) : null,
      disabled: NewSurvey,
    },
    {
      key: `userparticipating`,
      label: `User participating`,
      children: !NewSurvey ? (
        <Suspense fallback={<LoadingFallback />}>
          <UserParticipate_Tabs />
        </Suspense>
      ) : null,
      disabled: NewSurvey,
    },
    {
      key: `data`,
      label: `Data`,
      children: `Data`,
      disabled: NewSurvey,
    },
    {
      key: `report`,
      label: `Report`,
      children: `Report`,
      disabled: NewSurvey,
    },
  ];

  const validTabs: SurveyEditorTabs[] = [
    "detail",
    "build",
    "distribution",
    "overview",
    "userparticipating",
    "data",
    "report",
  ];

  const { data, error, isLoading, isValidating } = getSurveyData(
    NewSurvey,
    surveyID
  );

  useEffect(() => {
    if (data) {
      setSurveyMeta({
        isCreateNew: NewSurvey,
        surveyID: surveyID || "Newsurvey",
        queryKey: `/survey/${surveyID}`,
      });
      setSurveyData(data);
      initializeActiveQuestion();
    }
  }, [surveyID, data]);

  useEffect(() => {
    setSurveyFetchingStatus({ isFetching: isValidating, isLoading });
  }, [isValidating, isLoading]);

  useEffect(() => {
    if (!validTabs.includes(UrlTab as SurveyEditorTabs)) {
      url.searchParams.set("tab", "detail");
      window.history.pushState({}, "", url.toString());
    }
    setSelectedTree({}); // reset selected question tree
  }, []);

  const redirect = (key: SurveyEditorTabs) => {
    if (key === "build") {
      url.searchParams.set("tab", key);
      url.searchParams.set("edit", activeBuildTab);
    } else if (key === "overview") {
      url.searchParams.set("tab", key);
      url.searchParams.set("edit", activeOverviewSubtab);
    } else if (key === "userparticipating") {
      url.searchParams.set("tab", key);
      url.searchParams.set("edit", activeUserparticipatingSubtab);
    } else {
      url.searchParams.set("tab", key);
      url.searchParams.delete("edit");
    }
    window.history.pushState({}, "", url.toString());

    SetSurveyEditorTabs(key);
  };

  if (!data && !NewSurvey) {
    return <Skelton />;
  }

  if (error) {
    return (
      <div className="tw-w-full tw-items-start tw-justify-center tw-h-full tw-flex ">
        <Result
          status="error"
          title="Error loading survey Data"
          subTitle="We apologize for the inconvenience, but an error occurred while attempting to load the requested data."
          extra={[
            <Button type="primary" key="console">
              Back to Dashboard
            </Button>,
            <Button key="buy">Report Admin</Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div className="tw-h-full tw-px-6 tw-flex tw-flex-col tw-gap-4">
      {/* {contextHolder} */}
      <div className="tw-flex tw-flex-col ">
        <Title level={4}>
          {NewSurvey ? "New Survey" : !data ? "Loading..." : data.detail?.name}
        </Title>
        <Tabs
          defaultActiveKey={
            UrlTab && validTabs.includes(UrlTab as SurveyEditorTabs)
              ? UrlTab
              : "detail"
          }
          items={items}
          onTabClick={(e) => {
            redirect(e as SurveyEditorTabs);
          }}
        />
      </div>
    </div>
  );
}

export default SurveyEditor;
