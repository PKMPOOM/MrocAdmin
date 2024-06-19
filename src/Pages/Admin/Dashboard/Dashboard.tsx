import { Button, Typography, Tabs } from "antd";
import "../../../App.css";
import type { TabsProps } from "antd";
import Tab1Demo from "./Tabcomponents/Tab1Demo";
import DesignUpdate from "./Tabcomponents/DesignUpdate";
const { Title } = Typography;
import { useAuth } from "../../../Context/Auth/AuthContext";
const items: TabsProps["items"] = [
  {
    key: "1",
    label: `Dashboard (demo)`,
    children: <Tab1Demo />,
  },
  {
    key: "0",
    label: `Design update`,
    children: <DesignUpdate />,
  },
];

function Dashboard() {
  const { notificationApi } = useAuth();
  return (
    <div className="  tw-h-full tw-px-6">
      <div className="  tw-flex tw-flex-row tw-items-center ">
        <Title level={3}>Dashboard</Title>
        <div className=" tw-ml-auto tw-flex tw-gap-2">
          <Button
            disabled
            onClick={() => {
              notificationApi.success({
                message: `test`,
                description:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates ullam ex as",
              });
            }}
          >
            Key Demo
          </Button>
          <Button disabled>Dashboard Manager</Button>
        </div>
      </div>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}

export default Dashboard;
