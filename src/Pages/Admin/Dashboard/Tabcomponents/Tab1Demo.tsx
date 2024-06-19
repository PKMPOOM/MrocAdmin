import {
  BarsOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  ExpandAltOutlined,
  LikeOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Card, Col, Divider, Dropdown, Row, Statistic, theme } from "antd";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
const { useToken } = theme;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  maintainAspectRatio: false,
  responsive: true,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  y: {
    min: 0,
    max: 1250,
    ticks: {
      stepSize: 250,
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const data = {
  labels,
  datasets: [
    {
      label: "Positive",
      data: labels.map(() => getRandomNumber(0, 1000)),
      backgroundColor: "rgba(22, 119, 255, 0.5)",
      borderColor: "rgba(22, 119, 255, 1)",
      fill: "start",
    },
    {
      label: "Negative",
      data: labels.map(() => getRandomNumber(0, 1000)),
      borderColor: "rgb(255, 22, 125)",
      backgroundColor: "rgba(255, 22, 125, 0.5)",
      fill: "start",
    },
  ],
};

const items: MenuProps["items"] = [
  {
    key: "refresh",
    label: "refresh",
    icon: <RetweetOutlined />,
  },
  {
    key: "Download",
    label: "Download",
    icon: <DownloadOutlined />,
  },
  {
    key: "View table",
    label: "View table",
    icon: <BarsOutlined />,
  },
  {
    key: "Expand",
    label: "Expand",
    icon: <ExpandAltOutlined />,
  },
];
function Tab1Demo() {
  const { Meta } = Card;
  const { token } = useToken();

  return (
    <div>
      <Row gutter={16}>
        <Col span={4}>
          <Card style={{ height: "100%", maxHeight: "450px" }}>
            <div className="tw-flex tw-justify-between tw-items-start">
              <Meta title="Users" />
              <Dropdown menu={{ items }}>
                <EllipsisOutlined
                  style={{
                    fontSize: 20,
                    color: token.colorPrimary,
                    cursor: "pointer",
                  }}
                />
              </Dropdown>
            </div>
            <Divider />
            <Row gutter={16}>
              <Col span={24}>
                <Statistic title="Total users" value={1128} />
                <Statistic title="Admins" value={20} />
                <Statistic title="Active" value={156} />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={10}>
          <Card style={{ height: "100%", maxHeight: "450px" }}>
            <div className="tw-flex tw-flex-col tw-justify-between">
              <div className="tw-flex tw-justify-between tw-items-start">
                <Meta title="2023 Review by month" description="bla bla bla" />
                <Dropdown menu={{ items }}>
                  <EllipsisOutlined
                    style={{
                      fontSize: 20,
                      color: token.colorPrimary,
                      cursor: "pointer",
                    }}
                  />
                </Dropdown>
              </div>
              <Divider />
              <div className="tw-flex tw-flex-row tw-gap-4">
                <Col span={12}>
                  <Statistic
                    title="Highest positive"
                    value={1128}
                    prefix={<LikeOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Review percentage"
                    value={93}
                    suffix="/ 100%"
                  />
                </Col>
              </div>
              <div className="tw-h-[200px] tw-mt-4">
                <Bar data={data} options={options} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Tab1Demo;
