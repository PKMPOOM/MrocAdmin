import { PlusOutlined, RetweetOutlined } from "@ant-design/icons";
import { Button, Drawer, Image, Input } from "antd";
import dayjs from "dayjs";
import { LuArrowUpRight } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useThemeContext } from "../../../../../../../Context/Theme/ApplicationProvider";
import { DiscussionFullType } from "../../../../../../../Interface/DiscussionThreadInterfaces";
import { getDiscussionList } from "../../../../../../../Pages/Admin/Qualitative/api";
import { useSectionEditorStore } from "../../../../../../../Store/useSectionEditorStore";
import ErrorFallback from "../../../../../../Global/Suspense/ErrorFallback";
import DescValue from "../../../../../../Global/Utils/DescValue";

const AddDiscussionDrawer = () => {
  const [
    discussionDrawerOpen,
    setDiscussionDrawerOpen,
    sectionData,
    addDiscussion,
    indexData,
  ] = useSectionEditorStore((state) => [
    state.discussionDrawerOpen,
    state.setDiscussionDrawerOpen,
    state.sectionData,
    state.addDiscussion,
    state.indexData,
  ]);

  const { token } = useThemeContext();

  const {
    data: discussionList,
    mutate,
    error,
  } = getDiscussionList<DiscussionFullType>();

  const onCancel = () => {
    setDiscussionDrawerOpen(false);
  };

  if (error) {
    return (
      <Drawer
        width={"80vw"}
        title="Select Content"
        footer={null}
        open={discussionDrawerOpen}
        onClose={() => {
          setDiscussionDrawerOpen(false);
        }}
      >
        <ErrorFallback
          errorTitle="Error loading Content List"
          retryFn={mutate}
        />
      </Drawer>
    );
  }

  const BlockDataState = sectionData?.blocks[indexData.activeBlockIndex];
  const filteredDiscussionList = discussionList?.filter(
    (item) =>
      !BlockDataState?.discussions?.some((current) => current.id === item.id)
  );

  return (
    <Drawer
      title={<p>Select Discussion</p>}
      placement="right"
      size="large"
      onClose={onCancel}
      open={discussionDrawerOpen}
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
          {filteredDiscussionList?.map((discussion) => {
            return (
              <div
                key={discussion.id}
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
                    "https://gfuwezskflleiadzwihe.supabase.co/storage/v1/object/public/Images/system/image-file-4.png"
                  }
                />
                <div className="tw-flex tw-flex-col tw-gap-1 ">
                  <DescValue keyValue="Name" value={discussion.name} />
                  <DescValue
                    keyValue="Date created"
                    value={dayjs(discussion.created_date).format("DD MMM YYYY")}
                  />
                </div>
                <div className="tw-flex tw-gap-4  tw-ml-auto tw-items-center">
                  <div className="group-hover:tw-opacity-100 tw-opacity-0 tw-flex tw-duration-200 tw-transition-all tw-gap-4">
                    <Link target="_blank" to={`/content/${discussion.id}`}>
                      <div className=" tw-flex tw-gap-2 tw-items-center">
                        <p>View</p>
                        <LuArrowUpRight />
                      </div>
                    </Link>
                    <Link
                      target="_blank"
                      to={`/admin/system/newsfeed/content/${discussion.id}`}
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
                      addDiscussion(discussion);
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

export default AddDiscussionDrawer;
