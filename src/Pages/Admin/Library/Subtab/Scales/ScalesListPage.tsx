import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import ErrorFallback from "../../../../../Components/Global/Suspense/ErrorFallback";
import ScalesFormModal from "../../../../../Components/Library/Scales/ScalesFormModal";
import {
  Scales,
  useDeleteMultiScale,
  useDeleteScale,
  useGetScaleList,
} from "./api";
import LoadingFallback from "../../../../../Components/Global/Suspense/LoadingFallback";
import { useAuth } from "../../../../../Context/Auth/AuthContext";

const ScalesListPage = () => {
  const { notificationApi } = useAuth();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [ModalOpen, setModalOpen] = useState(false);
  const [ActiveScalesId, setActiveScalesId] = useState<string | undefined>(
    undefined
  );
  const [LoadingDataId, setLoadingDataId] = useState("");
  const [BulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  const {
    data: ScaleListData,
    error,
    mutate: refetch,
    isLoading,
  } = useGetScaleList();

  const hasSelected = selectedRowKeys.length > 0;

  if (error) {
    return (
      <ErrorFallback errorTitle="Error loading Scales" retryFn={refetch} />
    );
  }

  if (isLoading) {
    return <LoadingFallback />;
  }

  const columns: ColumnsType<Scales> = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      width: 50,
      sorter: (a, b) => a.key - b.key,
      defaultSortOrder: "ascend",
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      width: 200,
    },
    {
      title: "Scales",
      dataIndex: "scaleList",
      key: "scaleList",
      width: 200,
      render: (_, record) => {
        const lastIndex = record.scaleData.length - 1;

        if (record.scaleData.length === 0) {
          return <div className=" tw-flex tw-gap-2">-</div>;
        }

        return (
          <div className=" tw-flex tw-gap-2">
            {`${record.scaleData[0].Text} - ${record.scaleData[lastIndex].Text}`}
          </div>
        );
      },
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
      render: (_, record) => {
        const isDeleting = LoadingDataId === record.id;
        return (
          <div className=" tw-flex tw-gap-2">
            <Button
              onClick={() => {
                editScales(record.id);
              }}
            >
              Edit
            </Button>
            <Button
              onClick={async () => {
                deleteSelectedScale(record.id);
              }}
              loading={isDeleting}
              type="primary"
              danger
              icon={<DeleteOutlined />}
            />
          </div>
        );
      },
    },
  ];

  const deleteSelectedScale = async (id: string) => {
    setLoadingDataId(id);
    try {
      await useDeleteScale(id);
      refetch();
      notificationApi.success({
        message: "Delete",
        description: "Delete scale successfully",
        icon: <DeleteOutlined />,
      });
    } catch (error) {
      notificationApi.error({
        message: "Error",
        description: "Delete scale failed",
      });
    }
    setLoadingDataId("");
  };

  const deleteMultiScale = async () => {
    setBulkDeleteLoading(true);
    try {
      await useDeleteMultiScale(selectedRowKeys);
      setSelectedRowKeys([]);
      refetch();
      notificationApi.success({
        message: "Delete",
        description: "Delete scale successfully",
        icon: <DeleteOutlined />,
      });
    } catch (error) {
      notificationApi.error({
        message: "Error",
        description: "Delete scale failed",
      });
    }
    setBulkDeleteLoading(false);
  };

  const createNewScales = () => {
    setActiveScalesId(undefined);
    setModalOpen(true);
  };

  const editScales = (id: string) => {
    setActiveScalesId(id);
    setModalOpen(true);
  };

  return (
    <>
      <Space size="middle" direction="vertical">
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={createNewScales}
          >
            Scales
          </Button>

          <Button
            type="primary"
            disabled={!hasSelected}
            danger
            loading={BulkDeleteLoading}
            icon={<DeleteOutlined />}
            onClick={deleteMultiScale}
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
          dataSource={ScaleListData}
          rowSelection={{
            selectedRowKeys,
            onChange: (newSelectedRowKeys: React.Key[]) => {
              setSelectedRowKeys(newSelectedRowKeys);
            },
          }}
        />
      </div>
      <ScalesFormModal
        ModalOpen={ModalOpen}
        setModalOpen={setModalOpen}
        refetchFn={refetch}
        ActiveScalesId={ActiveScalesId}
        setActiveScalesId={setActiveScalesId}
      />
    </>
  );
};

export default ScalesListPage;
