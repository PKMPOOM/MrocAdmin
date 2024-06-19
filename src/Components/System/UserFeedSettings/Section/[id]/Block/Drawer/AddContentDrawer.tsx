import { PlusOutlined, RetweetOutlined } from "@ant-design/icons";
import { Button, Drawer, Image, Input } from "antd";
import dayjs from "dayjs";
import { LuArrowUpRight } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useThemeContext } from "../../../../../../../Context/Theme/ApplicationProvider";
import { getSimplifiedContentList } from "../../../../../../../Pages/Admin/System/UserFeedSettings/Subtab/Section/api";
import { useSectionEditorStore } from "../../../../../../../Store/useSectionEditorStore";
import ErrorFallback from "../../../../../../Global/Suspense/ErrorFallback";
import DescValue from "../../../../../../Global/Utils/DescValue";

const AddContentDrawer = () => {
  const [
    contentModalOpen,
    setContentModalOpen,
    sectionData,
    addBlog,
    indexData,
  ] = useSectionEditorStore((state) => [
    state.contentDrawerOpen,
    state.setContentDrawerOpen,
    state.sectionData,
    state.addBlog,
    state.indexData,
  ]);

  const { token } = useThemeContext();

  const { data, mutate, error } = getSimplifiedContentList();

  const blogList = data?.data;

  const onCancel = () => {
    setContentModalOpen(false);
  };

  if (error) {
    return (
      <Drawer
        width={"80vw"}
        title="Select Content"
        footer={null}
        open={contentModalOpen}
        onClose={() => {
          setContentModalOpen(false);
        }}
      >
        <ErrorFallback
          errorTitle="Error loading ContentList"
          retryFn={mutate}
        />
      </Drawer>
    );
  }

  const BlockDataState = sectionData?.blocks[indexData.activeBlockIndex];
  const filteredBlogList = blogList?.filter(
    (item) => !BlockDataState?.blog?.some((current) => current.id === item.id)
  );

  return (
    <Drawer
      title={<p>Select Content</p>}
      placement="right"
      size="large"
      onClose={onCancel}
      open={contentModalOpen}
    >
      <div className=" tw-flex tw-flex-col tw-gap-2">
        <div className=" tw-flex tw-gap-2">
          <Input.Search
            placeholder="Search"
            onChange={(e) => {
              if (e.target.value === "") {
                mutate();
              }
            }}
          />
          <Button
            onClick={() => {
              mutate();
            }}
            icon={<RetweetOutlined />}
          >
            Refresh
          </Button>
        </div>

        <div className="  tw-h-[calc(100vh-160px)] tw-overflow-y-auto ">
          {filteredBlogList?.map((blog) => {
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
                      to={`/admin/system/newsfeed/content/${blog.id}`}
                    >
                      <div className=" tw-flex tw-gap-2 tw-items-center">
                        <p>Edit</p>
                        <LuArrowUpRight />
                      </div>
                    </Link>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      addBlog(blog);
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Drawer>
  );
};

export default AddContentDrawer;
