import { Tabs, Typography } from "antd";
import CommunitySample from "./Tab_Community_Sample/CommunitySample";
import ThirdPartySample from "./Tab_Third_Party_Sample/ThirdPartySample";

const { Title } = Typography;

const sampleRoute = {
  community: "community",
  thirdParty: "third-party",
};

const Tabitems = [
  {
    key: sampleRoute.community,
    label: `Community samples`,
    children: <CommunitySample />,
  },
  {
    key: sampleRoute.thirdParty,
    label: `Third party samples`,
    children: <ThirdPartySample />,
  },
];

const SamplePage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const tab = searchParams.get("tab");
  const url = new URL(window.location.href);

  if (!tab) {
    url.searchParams.append("tab", sampleRoute.community);
    window.history.pushState({}, "", url.toString());
  }

  const redirect = (key: string) => {
    url.searchParams.set("tab", key);
    window.history.pushState({}, "", url.toString());
  };

  return (
    <div className="  tw-h-[calc(100vh-64px)] tw-px-6 tw-flex tw-flex-col tw-gap-4 tw-overflow-auto ">
      <div className="tw-flex tw-flex-row tw-items-center ">
        <Title level={3}>Sample</Title>
      </div>
      <Tabs
        defaultActiveKey={tab ? tab : sampleRoute.community}
        onTabClick={(e) => {
          redirect(e);
        }}
        items={Tabitems}
      />
    </div>
  );
};

export default SamplePage;
