import React, { useState } from "react";
import { Link } from "react-router-dom";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import ErrorFallback from "../../../../../Components/Global/Suspense/ErrorFallback";
import { Sample, getsampleList, useDeleteMultiSamples } from "../api";
import Sampledata from "./SampleRowDataRender";

const columns: ColumnsType<Sample> = [
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
    dataIndex: "SampleName",
    key: "SampleName",
    width: 200,
  },
  {
    title: "Date Create",
    dataIndex: "TimeStamp",
    key: "TimeStamp",
    width: 200,
    render: (_, record) => (
      <div>{dayjs(record.TimeStamp).format("DD MMM YYYY")}</div>
    ),
  },
  {
    title: "Size",
    dataIndex: "SampleSize",
    key: "SampleSize",
    render: (_, record) => (
      <div>{record.SampleSize === 99999 ? "Max" : record.SampleSize}</div>
    ),
    width: 100,
  },
  {
    title: "Freeze",
    dataIndex: "Frozen",
    key: "Frozen",
    width: 100,
    render: (_, record) => <div>{record.Frozen ? "Yes" : "No"}</div>,
  },
  Table.EXPAND_COLUMN,
];

function CommunitySample() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { data, error, isLoading, mutate: refetch } = getsampleList();
  const hasSelected = selectedRowKeys.length > 0;

  if (error) {
    return (
      <ErrorFallback errorTitle="Error loading Sample" retryFn={refetch} />
    );
  }

  return (
    <>
      <Space size="middle" direction="vertical">
        <Space>
          <Link to="/admin/Quantitative/Samples/New">
            <Button type="primary" icon={<PlusOutlined />}>
              Create New Sample
            </Button>
          </Link>

          <Button
            type="primary"
            disabled={!hasSelected}
            danger
            icon={<DeleteOutlined />}
            onClick={async () => {
              useDeleteMultiSamples(selectedRowKeys).then(() => {
                setSelectedRowKeys([]);
                refetch();
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
          dataSource={data}
          rowSelection={{
            selectedRowKeys,
            onChange: (newSelectedRowKeys: React.Key[]) => {
              setSelectedRowKeys(newSelectedRowKeys);
            },
          }}
          expandable={{
            expandedRowRender: (record) => (
              <Sampledata refetchFn={refetch} recordData={record} />
            ),
          }}
        />
      </div>
    </>
  );
}

export default CommunitySample;
