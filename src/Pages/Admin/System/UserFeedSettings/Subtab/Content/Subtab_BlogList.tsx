import {
  RetweetOutlined,
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Button, Image, Popconfirm, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import LoadingFallback from "../../../../../../Components/Global/Suspense/LoadingFallback";
import { useAuth } from "../../../../../../Context/Auth/AuthContext";
import { getContentList } from "./api";
import { BlogProps } from "../../../../../../Interface/User/UserDashboardTypes";

const Subtab_BlogList = () => {
  const { Axios } = useAuth();

  const { isLoading, data: contentList, mutate } = getContentList();

  if (!contentList) {
    return <LoadingFallback />;
  }

  console.log(contentList);

  const deleteContent = async (id: string) => {
    await Axios.delete(`/feed_settings/content/${id}`);
    mutate();
  };

  const columns: ColumnsType<BlogProps> = [
    {
      title: "Image	",
      dataIndex: "image_url",
      key: "image_url",
      width: 90,
      render: (_, record) => (
        <>
          <Image
            style={{
              aspectRatio: "1/1",
              objectFit: "cover",
              height: "50px",
              borderRadius: "4px",
            }}
            src={
              record.image_url
                ? record.image_url
                : "https://gfuwezskflleiadzwihe.supabase.co/storage/v1/object/public/Images/system/image-file-4.png"
            }
          />
        </>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Content",
      dataIndex: "text",
      key: "text",
      render: (_, record) => {
        switch (record.text) {
          case "":
            return <p className=" tw-text-slate-300">No text content</p>;
          default:
            return (
              <p>
                {record.text}
                {record.text.length > 200 ? "..." : ""}
              </p>
            );
        }
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (_, record) => {
        return <p className=" ">{record.status}</p>;
      },
    },
    {
      title: "Created date",
      dataIndex: "date_created",
      key: "date_created",
      width: 150,
      render: (_, record) => {
        return (
          <p className=" ">
            {dayjs(record.date_created).format("DD MMM YYYY")}
          </p>
        );
      },
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div className="tw-flex tw-gap-2">
          <Link to={`/admin/system/newsfeed/blog/${record.id}`}>
            <Button>Edit</Button>
          </Link>

          <Popconfirm
            okButtonProps={{
              danger: true,
            }}
            onConfirm={() => {
              deleteContent(record.id);
            }}
            okText="Delete"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            title={`Are you sure to delete this content`}
          >
            <Button danger type="primary" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
      width: 300,
    },
  ];

  return (
    <div className="tw-flex tw-flex-col tw-gap-2 ">
      <div className="tw-flex tw-gap-2">
        <Link to={"/admin/system/newsfeed/blog/New"}>
          <Button icon={<PlusOutlined />} type="primary">
            Create New Blog
          </Button>
        </Link>

        <Button
          onClick={() => {
            mutate();
          }}
          icon={<RetweetOutlined />}
          type="dashed"
        >
          Refresh
        </Button>
      </div>
      <Table loading={isLoading} dataSource={contentList} columns={columns} />
    </div>
  );
};

export default Subtab_BlogList;
