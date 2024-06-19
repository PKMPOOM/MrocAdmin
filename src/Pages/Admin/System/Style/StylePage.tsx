import {
  DeleteOutlined,
  DeleteTwoTone,
  EditOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ErrorFallback from "../../../../Components/Global/Suspense/ErrorFallback";
import LoadingFallback from "../../../../Components/Global/Suspense/LoadingFallback";
import CurrentThemeDisplayer from "../../../../Components/Style/SystemDefault/CurrentThemeDisplayer";
import ThemeColorInfo from "../../../../Components/Style/ThemeColorInfo";
import { TthemeData } from "../../../../Store/useTheme";
import { deleteTheme, getStyleList, setActiveTheme } from "./api";
import { rgbaToHex } from "./function";

const { Title, Text } = Typography;

const StylePage = () => {
  const [Loading, setLoading] = useState(true);
  const [ActiveThemeID, setActiveThemeID] = useState<string | undefined>(
    undefined
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { data: StyleList, isLoading, error, mutate: refetch } = getStyleList();

  const tableCol: ColumnsType<TthemeData> = [
    {
      title: "Id",
      dataIndex: "key",
      key: "key",
      sorter: (a, b) => a.key - b.key,
      defaultSortOrder: "ascend",
    },
    {
      title: "Primary color",
      dataIndex: "colorPrimary",
      key: "colorPrimary",
      render: (_, record) => (
        <>
          <ThemeColorInfo color={record.colorPrimary} />
        </>
      ),
    },
    {
      title: "Container color",
      dataIndex: "colorBgContainer",
      key: "colorBgContainer",
      render: (_, record) => (
        <>
          <ThemeColorInfo color={record.colorBgContainer} />
        </>
      ),
    },
    {
      title: "Text color",
      dataIndex: "colorText",
      key: "colorText",
      render: (_, record) => (
        <>
          <ThemeColorInfo
            color={record.colorText}
            label={rgbaToHex(record.colorText)}
          />
        </>
      ),
    },
    {
      title: "User nav type",
      dataIndex: "userNavType",
      key: "userNavType",
    },
    {
      title: "Login background type",
      dataIndex: "loginTemplate",
      key: "loginTemplate",
    },
    {
      title: "Action",
      dataIndex: "loginBackgroundType",
      render: (_, record) => (
        <div className=" tw-flex tw-gap-2">
          <Button
            type="primary"
            onClick={async () => {
              setLoading(true);
              setActiveThemeID(record.themeID);
              await setActiveTheme(record.themeID);
              // force refresh
              window.location.href = window.location.href;
            }}
          >
            {Loading && ActiveThemeID === record.themeID ? (
              <LoadingOutlined />
            ) : (
              "Set Active"
            )}
          </Button>
          <Link to={`/admin/system/style/${record.themeID}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            icon={null}
            placement="left"
            title="Delete category"
            description="Are you sure to delete this theme?"
            onConfirm={async () => {
              await deleteTheme(record.themeID);
              refetch();
            }}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
            }}
          >
            <Button danger icon={<DeleteTwoTone twoToneColor={"red"} />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const customTheme = useMemo(
    () => StyleList?.find((theme) => theme.default === true),
    [StyleList]
  );

  const themeList = useMemo(
    () => StyleList?.filter((theme) => theme.default === false),
    [StyleList]
  );

  const hasSelected = selectedRowKeys.length > 0;

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <ErrorFallback errorTitle="Error loading Theme Data" retryFn={refetch} />
    );
  }

  return (
    <>
      <div className="tw-flex tw-flex-row tw-items-center ">
        <div className="tw-flex tw-flex-row tw-items-center ">
          <Title level={3}>Style</Title>
        </div>
      </div>
      <div className="  tw-p-2 tw-border tw-rounded-md">
        <div className=" tw-flex tw-gap-2 tw-items-baseline ">
          <Title level={5}>Current theme</Title>
          {!customTheme && <Text type="secondary">System default theme</Text>}
        </div>
        <CurrentThemeDisplayer customTheme={customTheme} />
      </div>

      <div className=" tw-flex tw-justify-between">
        <div className=" tw-flex tw-gap-2">
          <Link to="/admin/system/style/New">
            <Button type="primary" icon={<PlusOutlined />}>
              Create New Theme
            </Button>
          </Link>

          <Button
            type="primary"
            disabled={!hasSelected}
            danger
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </div>
      </div>
      <Table
        dataSource={themeList}
        columns={tableCol}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
      />
    </>
  );
};

export default StylePage;
