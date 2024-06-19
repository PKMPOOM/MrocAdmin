import {
  Button,
  Dropdown,
  Input,
  MenuProps,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import React, { useState } from "react";
const { Title, Paragraph } = Typography;
import { DeleteOutlined, StopOutlined, FlagOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { useAuth } from "../../../../Context/Auth/AuthContext";
import ReportAbuseModal from "../../../../Components/Discussion/Modal/ReportAbuseModal";
import { useAbuseReportStore } from "../../../../Store/useAbuseReportStore";

export interface Report {
  id: string;
  reportMessage: string;
  postMessage: string;
  postID: string;
  reporter: string;
  reportedDate: Dayjs;
  category: string;
}

const ManageAbuse = React.memo(() => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [setAbuseReportModalOpen] = useAbuseReportStore((state) => [
    state.setAbuseReportModalOpen,
  ]);

  const disableButton = selectedRowKeys.length === 0;

  const { Axios } = useAuth();

  async function fetchReportList() {
    const res = await Axios.get(`/report/list`);
    return res.data;
  }

  const { data: reportList, isLoading } = useQuery<Report[]>({
    queryKey: ["ReportedList"],
    queryFn: fetchReportList,
    refetchOnWindowFocus: false,
  });

  const columns: ColumnsType<Report> = [
    {
      title: "Post",
      dataIndex: "postMessage",
      key: "postMessage",
      width: 400,
      render: (_: string, { postMessage }) => (
        <Paragraph
          ellipsis={{
            rows: 2,
            expandable: true,
            symbol: "more",
          }}
        >
          {postMessage}
        </Paragraph>
      ),
    },
    {
      title: "Message",
      dataIndex: "reportMessage",
      key: "reportMessage",
      width: 300,
    },
    {
      title: "Date reported	",
      dataIndex: "date_report",
      key: "date_report",
      render: (_: string, { reportedDate }) => (
        <>{dayjs(reportedDate).format("DD-MMM-YYYY")}</>
      ),
      width: 150,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_: string, { category }) => {
        return <Tag key={category}>{category}</Tag>;
      },
      width: 150,
    },
    {
      title: "Reporter",
      dataIndex: "reporter",
      key: "reporter",
      width: 150,
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (_: string, { postID }) => (
        <Space size="small">
          <Button
            danger
            onClick={() => {
              console.log({ postID });
            }}
            size="small"
            icon={<StopOutlined />}
          >
            Ban
          </Button>

          <Dropdown menu={{ items }} placement="bottomLeft" arrow>
            <Button
              onClick={() => {
                console.log({ postID });
              }}
              size="small"
              icon={<FlagOutlined />}
            >
              Flag user
            </Button>
          </Dropdown>

          <Button
            onClick={() => {
              console.log({ postID });
            }}
            size="small"
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
      width: 300,
    },
  ];

  const items: MenuProps["items"] = [
    {
      key: "spam",
      label: "Spam",
    },
    {
      key: "inappropriate_content",
      label: "Inappropriate Content",
    },
    {
      key: "noisy_behavior",
      label: "Noisy Behavior",
    },
    {
      key: "harassment",
      label: "Harassment",
    },
    {
      key: "misinformation",
      label: "Misinformation",
    },
  ];

  return (
    <>
      <div className="tw-flex tw-flex-row tw-items-center ">
        <Title level={3}>Manage abuse</Title>
      </div>

      <div className="tw-flex tw-gap-2 ">
        <Button
          type="primary"
          onClick={() => {
            setAbuseReportModalOpen(true);
          }}
        >
          Abuse category
        </Button>

        <Button danger disabled={disableButton} icon={<StopOutlined />}>
          Ban
        </Button>

        <Button disabled={disableButton} icon={<DeleteOutlined />}>
          Dismiss
        </Button>
        <Input.Search
          onSearch={(e) => {
            console.log(e);
          }}
          style={{
            marginLeft: "auto",
            maxWidth: "400px",
          }}
        />
      </div>

      <Table
        loading={isLoading}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
        dataSource={reportList}
        columns={columns}
      />
      <ReportAbuseModal />
    </>
  );
});

export default ManageAbuse;
