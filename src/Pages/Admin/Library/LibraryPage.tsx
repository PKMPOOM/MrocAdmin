import { Tabs, Typography } from "antd";
import ScalesListPage from "./Subtab/Scales/ScalesListPage";

const { Title } = Typography;

type libraryTab =
  | "Survey"
  | "Question"
  | "File"
  | "Images"
  | "EmailTemplate"
  | "Scales";

type LibraryRouteType = {
  [key in libraryTab]: TabRoute;
};

type TabRoute = {
  key: string;
  label: string;
  subtab?: { key: string; label: string }[];
};

const libraryRoute: LibraryRouteType = {
  Survey: {
    label: `Survey`,
    key: "survey",
    subtab: [
      {
        key: "customer-Experience",
        label: "Customer Experience",
      },
      {
        key: "educational",
        label: "Educational",
      },
      {
        key: "user-template",
        label: "User Template",
      },
    ],
  },
  Question: {
    label: `Question`,
    key: "question",
    subtab: [
      {
        key: "certified-question",
        label: "Certified Question",
      },
      {
        key: "team-question-library",
        label: "Team Question Library",
      },
      {
        key: "user-question-library",
        label: "User Question Library",
      },
    ],
  },
  File: {
    label: `File`,
    key: "file",
  },
  Images: {
    label: `Images`,
    key: "images",
  },
  EmailTemplate: {
    label: `Email Template`,
    key: "email-template",
    subtab: [
      {
        key: "email-template",
        label: "Email Template",
      },
      {
        key: "email-template",
        label: "Email Template",
      },
    ],
  },
  Scales: {
    label: `Scales`,
    key: "scales",
  },
};

const Tabitems = [
  {
    key: libraryRoute.Survey.key,
    label: libraryRoute.Survey.label,
    children: "<CommunitySample />",
  },
  {
    key: libraryRoute.Question.key,
    label: libraryRoute.Question.label,
    children: "<ThirdPartySample />",
  },
  {
    key: libraryRoute.File.key,
    label: libraryRoute.File.label,
    children: "<ThirdPartySample />",
  },
  {
    key: libraryRoute.Images.key,
    label: libraryRoute.Images.label,
    children: "<ThirdPartySample />",
  },
  {
    key: libraryRoute.EmailTemplate.key,
    label: libraryRoute.EmailTemplate.label,
    children: "<ThirdPartySample />",
  },
  {
    key: libraryRoute.Scales.key,
    label: libraryRoute.Scales.label,
    children: <ScalesListPage />,
  },
];

const LibraryPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const tab = searchParams.get("tab");
  const url = new URL(window.location.href);

  if (!tab) {
    url.searchParams.append("tab", libraryRoute.Survey.key);
    window.history.pushState({}, "", url.toString());
  }

  const redirect = (key: string) => {
    url.searchParams.set("tab", key);
    window.history.pushState({}, "", url.toString());
  };

  return (
    <>
      <div className="tw-flex tw-flex-row tw-items-center ">
        <Title level={3}>Library</Title>
      </div>
      <Tabs
        defaultActiveKey={tab ? tab : libraryRoute.Survey.key}
        onTabClick={(e) => {
          redirect(e);
        }}
        items={Tabitems}
      />
    </>
  );
};

export default LibraryPage;
