import React, { useState } from "react";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import ErrorFallback from "../../../../../Components/Global/Suspense/ErrorFallback";
import {
  ExternalSample,
  useDeleteMultiThirdPartySamples,
  useDeleteThirdPartySample,
  useGetThirdPartySampleList,
} from "../api";
import CreateThirdPartySampleModal from "../../../../../Components/Samples/ThirdPartyFormModal.tsx/CreateThirdPartySampleModal";
import { useAuth } from "../../../../../Context/Auth/AuthContext";

function ThirdPartySample() {
  const { notificationApi } = useAuth();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [ModalOpen, setModalOpen] = useState(false);
  const [ActiveSamplesId, setActiveSamplesId] = useState<string | undefined>(
    undefined
  );

  const {
    data: thirdPartySampleList,
    error,
    isLoading,
    mutate: refetch,
  } = useGetThirdPartySampleList();

  const hasSelected = selectedRowKeys.length > 0;

  const columns: ColumnsType<ExternalSample> = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      width: 50,
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: "Name",
      dataIndex: "SampleName",
      key: "SampleName",
      width: 200,
    },
    {
      title: "URL/API",
      dataIndex: "Url",
      key: "Url",
      width: 200,
    },
    {
      title: "API Key",
      dataIndex: "APIKey",
      key: "APIKey",
      width: 200,
    },
    {
      title: "Date",
      dataIndex: "TimeStamp",
      key: "TimeStamp",
      width: 200,
      render: (_, record) => (
        <div>{dayjs(record.TimeStamp).format("DD MMM YYYY")}</div>
      ),
    },
    {
      title: "Action",
      key: "TimeStamp",
      width: 200,
      render: (_, record) => (
        <div className=" tw-flex tw-gap-2">
          <Button
            onClick={() => {
              editThirdPartyConnection(record.id);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={async () => {
              await useDeleteThirdPartySample(record.id);
              refetch();
              notificationApi.success({
                message: "Delete",
                description: "Delete Third Party Sample successfully",
                icon: <DeleteOutlined />,
              });
            }}
            type="primary"
            danger
            icon={<DeleteOutlined />}
          />
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <ErrorFallback errorTitle="Error loading Sample" retryFn={refetch} />
    );
  }

  const createNewThirdPartyConnection = () => {
    setActiveSamplesId(undefined);
    setModalOpen(true);
  };

  const editThirdPartyConnection = (id: string) => {
    setActiveSamplesId(id);
    setModalOpen(true);
  };

  return (
    <>
      <Space size="middle" direction="vertical">
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={createNewThirdPartyConnection}
          >
            Third Party Connection
          </Button>

          <Button
            type="primary"
            disabled={!hasSelected}
            danger
            icon={<DeleteOutlined />}
            onClick={async () => {
              await useDeleteMultiThirdPartySamples(selectedRowKeys);
              setSelectedRowKeys([]);
              refetch();
              notificationApi.success({
                message: "Delete",
                description: "Delete Third Party Sample successfully",
                icon: <DeleteOutlined />,
              });
            }}
          >
            Delete
          </Button>
        </Space>
      </Space>
      <div>
        <Table
          rowKey={(record) => record.id}
          loading={isLoading}
          style={{ marginTop: "24px" }}
          columns={columns}
          dataSource={thirdPartySampleList}
          rowSelection={{
            selectedRowKeys,
            onChange: (newSelectedRowKeys: React.Key[]) => {
              setSelectedRowKeys(newSelectedRowKeys);
            },
          }}
        />
      </div>
      <CreateThirdPartySampleModal
        refetchFn={refetch}
        ModalOpen={ModalOpen}
        setModalOpen={setModalOpen}
        ActiveSamplesId={ActiveSamplesId}
        setActiveSamplesId={setActiveSamplesId}
      />
    </>
  );
}

export default ThirdPartySample;
