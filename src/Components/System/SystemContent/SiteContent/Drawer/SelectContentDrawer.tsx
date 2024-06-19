import { Button, Drawer, Image, theme } from "antd";
import dayjs from "dayjs";
import { useContext } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { Link } from "react-router-dom";
import { SiteContentContext } from "../SiteContentsTable";
import { getContentList } from "../../api";
import { simplifiedBlogProps } from "~/interface/User/UserDashboardTypes";
import LoadingFallback from "~/component/Global/Suspense/LoadingFallback";
import ErrorFallback from "~/component/Global/Suspense/ErrorFallback";
import DescValue from "~/component/Global/Utils/DescValue";

const { useToken } = theme;

const SelectContentDrawer = () => {
  const { token } = useToken();

  const {
    contentSelectorDrawerOpen,
    setContentSelectorDrawerOpen,
    setConnectedContent,
  } = useContext(SiteContentContext);

  const shouldFetch = contentSelectorDrawerOpen === true;

  const {
    data: contentListData,
    error,
    isLoading,
  } = getContentList(shouldFetch);

  const addContent = (content: simplifiedBlogProps) => {
    setConnectedContent(content);
    setContentSelectorDrawerOpen(false);
  };

  return (
    <Drawer
      title="Select content"
      width={"50%"}
      closable={false}
      onClose={() => setContentSelectorDrawerOpen(false)}
      open={contentSelectorDrawerOpen}
    >
      <div className="  tw-h-[calc(100vh-160px)] tw-overflow-y-auto ">
        {isLoading && <LoadingFallback />}
        {error && <ErrorFallback errorTitle=" Error loading data " />}
        {contentListData
          ? contentListData.data.map((blog) => {
              return (
                <div
                  key={blog.id}
                  style={{
                    border: `1px solid ${token.colorBorder}`,
                  }}
                  className={`tw-group tw-transition-all tw-duration-200 tw-p-2 tw-rounded tw-min-w-full tw-flex tw-gap-2 tw-my-1`}
                >
                  <Image
                    style={{
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      height: "80px",
                      borderRadius: "4px",
                    }}
                    src={
                      blog.image_url
                        ? blog.image_url
                        : "https://gfuwezskflleiadzwihe.supabase.co/storage/v1/object/public/Images/system/image-file-4.png"
                    }
                  />
                  <div className="tw-flex tw-flex-col tw-gap-1 ">
                    <DescValue keyValue="Name" value={blog.title} />
                    <DescValue
                      keyValue="Date created"
                      value={dayjs(blog.date_created).format("DD MMM YYYY")}
                    />
                  </div>
                  <div className="tw-flex tw-gap-4  tw-ml-auto tw-items-center">
                    <div className="group-hover:tw-opacity-100 tw-opacity-0 tw-flex tw-duration-200 tw-transition-all tw-gap-4">
                      <Link target="_blank" to={`/content/${blog.id}`}>
                        <div className=" tw-flex tw-gap-2 tw-items-center">
                          <p>View</p>
                          <LuArrowUpRight />
                        </div>
                      </Link>
                      <Link
                        target="_blank"
                        to={`/admin/system/newsfeed/blog/${blog.id}`}
                      >
                        <div className=" tw-flex tw-gap-2 tw-items-center">
                          <p>Edit</p>
                          <LuArrowUpRight />
                        </div>
                      </Link>
                    </div>
                    <Button
                      type="primary"
                      //   icon={<PlusOutlined />}
                      onClick={() => {
                        addContent(blog);
                      }}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </Drawer>
  );
};

export default SelectContentDrawer;
