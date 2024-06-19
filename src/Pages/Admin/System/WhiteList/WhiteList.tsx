import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import ErrorFallback from "../../../../Components/Global/Suspense/ErrorFallback";
import LoadingFallback from "../../../../Components/Global/Suspense/LoadingFallback";
import WhiteListModal from "./WhiteListModal";
import {
  WhiteListData,
  deleteWhitelist,
  getWhitelist,
  updateOperation,
} from "./api";

const { Title } = Typography;

const WhiteList = () => {
  const { data: whitelist, mutate: refetch, error, isLoading } = getWhitelist();
  const [IsmodalOpen, setIsmodalOpen] = useState(false);

  const tableCol: ColumnsType<WhiteListData> = [
    {
      title: "id",
      dataIndex: "pkWhitelist",
      key: "pkWhitelist",
      width: 80,
      sorter: (a, b) => a.pkWhitelist - b.pkWhitelist,
      defaultSortOrder: "ascend",
    },
    {
      title: "Url",
      dataIndex: "url",
      key: "url",
      width: 300,
    },
    {
      title: "Allowed Operations",
      key: "colorBgContainer",
      render: (_, { id, DELETE, GET, POST, PUT }) => {
        const getType = (isOperationAllowed: boolean) => {
          return isOperationAllowed ? "primary" : "dashed";
        };
        return (
          <div className="tw-grid tw-grid-cols-4 tw-gap-4 tw-w-3/5">
            <Button
              onClick={async () => {
                await updateOperation(id, "GET", GET);
                refetch();
              }}
              type={getType(GET)}
            >
              GET
            </Button>
            <Button
              onClick={async () => {
                await updateOperation(id, "POST", POST);
                refetch();
              }}
              type={getType(POST)}
            >
              POST
            </Button>
            <Button
              onClick={async () => {
                await updateOperation(id, "PUT", PUT);
                refetch();
              }}
              type={getType(PUT)}
            >
              PUT
            </Button>
            <Button
              onClick={async () => {
                await updateOperation(id, "DELETE", DELETE);
                refetch();
              }}
              type={getType(DELETE)}
            >
              DELETE
            </Button>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "loginBackgroundType",
      width: 200,
      render: (_, record) => (
        <div className=" tw-flex tw-gap-2">
          <Popconfirm
            icon={null}
            placement="left"
            title="Delete category"
            description="Are you sure to delete this theme?"
            onConfirm={async () => {
              await deleteWhitelist(record.id);
              refetch();
            }}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
            }}
          >
            <Button danger icon={<DeleteTwoTone twoToneColor={"red"} />}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <ErrorFallback errorTitle="Error Loading Whitelist" retryFn={refetch} />
    );
  }

  return (
    <>
      <div className="tw-flex tw-flex-row tw-items-center ">
        <div className="tw-flex tw-flex-row tw-items-center ">
          <Title level={3}>White List</Title>
        </div>
      </div>

      <div className=" tw-flex tw-justify-between">
        <div className=" tw-flex tw-gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsmodalOpen(true);
            }}
          >
            New Whitelisted Site
          </Button>
        </div>
      </div>
      <Table
        dataSource={whitelist}
        columns={tableCol}
        rowKey={(record) => record.id}
      />
      <WhiteListModal
        isModalOpen={IsmodalOpen}
        setIsModalOpen={setIsmodalOpen}
        refetchFn={refetch}
      />
    </>
  );
};

export default WhiteList;
