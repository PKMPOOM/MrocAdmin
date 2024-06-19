import { Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { OverviewSubtab } from "../../../../../../Interface/SurveyEditorInterface";

// tabs
import Subtab_overview from "./Subtab_Overview&Open/Subtab_overview";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";

function OverviewPage() {
  const navigate = useNavigate();
  const [SetActiveOverviewSubtab] = useSurveyEditorStore((state) => [
    state.SetActiveOverviewSubtab,
  ]);
  const items = [
    {
      key: "overview",
      label: `Overview & open`,
      children: <Subtab_overview />,
    },
    {
      key: "quota manager",
      label: `Quota manager`,
      children: "<QuotaSubTab />",
    },
  ];

  const redirect = (key: OverviewSubtab) => {
    if (key === "overview") {
      navigate(`${window.location.pathname}?tab=overview&edit=${key}`);
    } else if (key === "quota manager") {
      navigate(`${window.location.pathname}?tab=overview&edit=${key}`);
    }
    SetActiveOverviewSubtab(key);
  };

  return (
    <Tabs
      style={{ marginTop: "-20px" }}
      items={items}
      onTabClick={(e) => {
        redirect(e as OverviewSubtab);
      }}
    />
  );
}

export default OverviewPage;
