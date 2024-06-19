import {
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  DownloadOutlined,
  EditOutlined,
  FileWordOutlined,
  PlusOutlined,
  PushpinOutlined,
  SaveOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Button,
  Dropdown,
  Result,
  // Checkbox,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { Link } from "react-router-dom";
import GenerativeButton from "~/component/Global/AI/GenerativeButton";
import CreateNewSurvey from "../../../../Components/Survey/Modal/CreateNewSurvey";
import { useAuth } from "../../../../Context/Auth/AuthContext";
import { SurveylistTypes } from "../../../../Interface/SurveyEditorInterface";
import { getSurveyList } from "./api";
const { Title } = Typography;

const tableDropdownItems: MenuProps["items"] = [
  {
    key: "pin_to_top",
    label: "Pin to top",
    icon: <PushpinOutlined />,
    disabled: true,
  },
  {
    key: "disposition",
    label: "Disposition",
    icon: <UnorderedListOutlined />,
    disabled: true,
  },
  {
    key: "export_questionaire",
    label: "Export questionaire",
    icon: <FileWordOutlined />,
    disabled: true,
  },
  {
    key: "save_as_template",
    label: "Save as template",
    icon: <SaveOutlined />,
    disabled: true,
  },
  {
    key: "export",
    label: "Export",
    icon: <DownloadOutlined />,
    disabled: true,
  },
  {
    key: "topline",
    label: "Topline",
    icon: <EditOutlined />,
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    key: "delete",
    label: "Delete",
    danger: true,
    icon: <DeleteOutlined />,
  },
];

function SurveyListPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { Axios } = useAuth();

  const disableButton = selectedRowKeys.length === 0;

  const { data, error, isLoading, mutate: refetchSurveyList } = getSurveyList();

  if (error) {
    return (
      <div className="tw-w-full tw-items-center tw-justify-center tw-h-full tw-flex ">
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
        ></Result>
      </div>
    );
  }

  const columns: ColumnsType<SurveylistTypes> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date modified	",
      dataIndex: "createdate",
      key: "createdate",
      render: (_: string, { createdate }: { createdate: string }) => (
        <>{createdate.slice(0, 10)}</>
      ),
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: string, { status }) => {
        switch (status) {
          case "Active":
            return (
              <Tag color="green" key={status}>
                Active
              </Tag>
            );
            break;
          case "Draft":
            return (
              <Tag color="orange" key={status}>
                Draft
              </Tag>
            );
            break;
          case "Closed":
            return (
              <Tag color="red" key={status}>
                Closed
              </Tag>
            );
            break;
        }
      },
      width: 100,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 20,
    },

    {
      title: "Users",
      dataIndex: "usersjoined",
      key: "users",
      width: 20,
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      width: 20,
    },
    {
      title: "Screened",
      dataIndex: "screened",
      key: "screened",
      width: 20,
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      width: 20,
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (_: string, { id }: { id: string }) => (
        <Space size="large">
          <Link to={`/admin/Quantitative/Survey/${id}?tab=build&edit=question`}>
            <div className="hover:tw-bg-slate-200 tw-rounded-md tw-cursor-pointer tw-text-blue-600 tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center ">
              <EditOutlined />
            </div>
          </Link>
          <Dropdown
            menu={{
              items: tableDropdownItems,
              onClick: (e) => {
                handleDropdownClick(e.key, id);
              },
            }}
          >
            <a>
              Data <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
      width: 150,
    },
  ];

  const deleteSurvey = async (id: string) => {
    await Axios.delete(`/survey/${id}`).then(() => {
      refetchSurveyList();
    });
  };

  function handleDropdownClick(key: string, id: string) {
    switch (key) {
      case "delete":
        deleteSurvey(id);
        break;
      default:
        break;
    }
    console.log(key, id);
  }

  return (
    <div className="tw-h-full tw-px-6 tw-flex tw-flex-col tw-gap-4">
      <div className="tw-flex tw-flex-row tw-items-center ">
        <Title level={3}>Survey</Title>
      </div>

      <div className="tw-flex tw-gap-2">
        <Space>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setIsCreateModalOpen((prev) => !prev);
            }}
          >
            Create New Survey
          </Button>
          <Button disabled={disableButton} icon={<DeleteOutlined />} danger>
            Delete
          </Button>
          <Button
            disabled={disableButton}
            icon={<CopyOutlined />}
            type="dashed"
          >
            Copy
          </Button>
          <Link to={"/admin/Quantitative/generative-create"}>
            <GenerativeButton
              onClick={() => {
                console.log("Generative create");
              }}
            >
              Generative create
            </GenerativeButton>
          </Link>
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
      <CreateNewSurvey
        IsOpen={isCreateModalOpen}
        setIsopen={setIsCreateModalOpen}
      />
    </div>
  );
}

export default SurveyListPage;
