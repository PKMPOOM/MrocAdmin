import {
  DeleteOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { createContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Create_New_Threads from "../../../Components/Discussion/Modal/Create_New_Threads";
import { DiscussionSimplifiedType } from "../../../Interface/DiscussionThreadInterfaces";
import { getDiscussionList } from "./api";

const { Title } = Typography;

const tableDropdownItems: MenuProps["items"] = [
  {
    key: "Pin to top",
    label: "Pin to top",
  },
  {
    key: "Edit",
    label: "Edit",
  },
  {
    key: "Get link",
    label: "Get link",
  },
  {
    key: "Export to Excel",
    label: "Export to Excel",
  },
  {
    key: "Export to Word",
    label: "Export to Word",
  },
  {
    type: "divider",
  },
  {
    key: "Delete",
    label: "Delete",
    danger: true,
  },
];

type DiscussionListContxt = {
  CreateModalOpen: boolean;
  setCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DiscussionListContxt = createContext({} as DiscussionListContxt);

function DiscussionListPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [CreateModalOpen, setCreateModalOpen] = useState(false);
  const disableButton = selectedRowKeys.length === 0;

  const navigate = useNavigate();

  const { data, isLoading } = getDiscussionList<DiscussionSimplifiedType>();

  const columns: ColumnsType<DiscussionSimplifiedType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (_, record) => (
        <>
          {record.type.charAt(0).toUpperCase() +
            record.type.slice(1).toLowerCase()}
        </>
      ),
    },
    {
      title: "Date modified	",
      dataIndex: "created_date",
      key: "createdate",
      width: 150,
      render: (_, record) => (
        <>{dayjs(record.created_date).format("DD-MMM-YYYY")}</>
      ),
    },
    {
      title: "Vote",
      dataIndex: "vote",
      key: "vote",

      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 20,
    },

    {
      title: "Activity",
      dataIndex: "activity",
      key: "activity",
      render: (_, record) => (
        <div className="tw-flex tw-flex-col">
          <p className="tw-text-xs">{`${record._count.comments} comments`}</p>
          <p className="text-xs">{`${record.users?.length} users`}</p>
        </div>
      ),
      width: 150,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div className="tw-flex tw-gap-4">
          <Button
            onClick={() => {
              navigate(
                `/admin/Qualitative/Discussions/${record.id}?tab=discussion`
              );
            }}
            type="primary"
          >
            View Report
          </Button>

          <Dropdown menu={{ items: tableDropdownItems }}>
            <Button shape="circle" type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        </div>
      ),
      width: 300,
    },
  ];

  const ContextValue = useMemo(
    () => ({
      CreateModalOpen,
      setCreateModalOpen,
    }),
    [CreateModalOpen, setCreateModalOpen]
  );

  return (
    <DiscussionListContxt.Provider value={ContextValue}>
      <div className="tw-h-full tw-px-6 tw-flex tw-flex-col tw-gap-4">
        <div className="tw-flex tw-flex-row tw-items-center ">
          <Title level={3}>Manage Threads</Title>
        </div>

        <div className="tw-flex tw-gap-2">
          <Space>
            <Button
              onClick={() => {
                setCreateModalOpen(true);
              }}
              icon={<PlusOutlined />}
              type="primary"
            >
              Create new thread
            </Button>
            <Button>Manage categories</Button>

            <Button disabled={disableButton} icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Space>
        </div>
        <Table
          loading={isLoading}
          rowSelection={{
            selectedRowKeys,
            onChange: (newSelectedRowKeys: React.Key[]) => {
              setSelectedRowKeys(newSelectedRowKeys);
            },
          }}
          dataSource={data}
          columns={columns}
        />
        <Create_New_Threads />
      </div>
    </DiscussionListContxt.Provider>
  );
}

export default DiscussionListPage;
