import {
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Button, Image, Space } from "antd";
import dayjs from "dayjs";
import { FaArrowRight } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../../../../../../../Context/Auth/AuthContext";
import { DiscussionFullType } from "../../../../../../../../../Interface/DiscussionThreadInterfaces";
import { useSectionEditorStore } from "../../../../../../../../../Store/useSectionEditorStore";
import { ROUTEPATH } from "../../../../../../../../../Utils/RoutePath";
import { useThemeContext } from "../../../../../../../../../Context/Theme/ApplicationProvider";

type ContentCardProps = {
  discussionList: DiscussionFullType[];
  indexData: {
    blockIndex: number;
  };
};

export default function DiscussionList({
  discussionList,
  indexData,
}: ContentCardProps) {
  const { blockIndex } = indexData;
  const { AuthUser } = useAuth();
  const { token } = useThemeContext();

  const [
    setDiscussionDrawerOpen,
    setIndexData,
    onContentSort,
    onContentDelete,
    BlockContentHeight,
  ] = useSectionEditorStore((state) => [
    state.setDiscussionDrawerOpen,
    state.setIndexData,
    state.onContentSort,
    state.onContentDelete,
    state.BLOCKCONTENTHEIGHT,
  ]);

  const { id } = useParams();
  const onClient = window.location.href.includes("/admin");
  const isAdmin = AuthUser?.role === "admin";
  const isEditingSingleSection = id !== undefined;
  const showEditor = onClient && isAdmin && isEditingSingleSection;

  return (
    <div
      style={{
        border: `1px solid ${token.colorBorder}`,
      }}
      className=" tw-w-full tw-overflow-hidden tw-rounded-md"
    >
      <div
        style={{
          maxHeight: `${BlockContentHeight}px`,
          overflow: "auto",
        }}
        className=" tw-bg-white tw-p-2 tw-rounded-lg tw-w-full tw-h-full "
      >
        {discussionList?.map((discussion, blogIndex) => {
          const isLastIndex = discussionList?.length === blogIndex + 1;
          const isFirstIndex = blogIndex === 0;
          return (
            <div
              key={discussion.id}
              className="tw-group tw-flex-1 tw-flex  tw-basis-44 tw-relative tw-border-b tw-py-2 first:tw-pt-0 "
            >
              {isLastIndex && showEditor && (
                <div className=" tw-absolute -tw-bottom-3 tw-z-40 tw-left-1/2">
                  <Button
                    onClick={() => {
                      setDiscussionDrawerOpen(true);
                      setIndexData({
                        activeBlockIndex: blockIndex,
                        activeContentIndex: blogIndex + 1, // last index + 1
                      });
                    }}
                    type="primary"
                    size={"small"}
                    icon={<PlusOutlined />}
                    shape="circle"
                  />
                </div>
              )}

              {showEditor && (
                <div className="tw-absolute tw-top-0  tw-right-0 tw-p-2  tw-flex tw-z-50 ">
                  <div className="tw-flex tw-gap-1 tw-flex-wrap tw-flex-col tw-w-full ">
                    <div className="tw-flex tw-items-center tw-bg-white tw-rounded  ">
                      <Space.Compact>
                        <Button
                          disabled={isFirstIndex}
                          size={"small"}
                          icon={<UpOutlined />}
                          onClick={() => {
                            if (isFirstIndex) {
                              return;
                            }

                            setIndexData({
                              activeBlockIndex: blockIndex,
                              activeContentIndex: blogIndex,
                            });

                            onContentSort(
                              "discussions",
                              blogIndex,
                              blogIndex - 1
                            );
                          }}
                        />
                        <Button
                          disabled={isLastIndex}
                          size={"small"}
                          icon={<DownOutlined />}
                          onClick={() => {
                            if (isLastIndex) {
                              return;
                            }

                            setIndexData({
                              activeBlockIndex: blockIndex,
                              activeContentIndex: blogIndex,
                            });
                            onContentSort(
                              "discussions",
                              blogIndex,
                              blogIndex + 1
                            );
                          }}
                        />
                        <Button
                          danger
                          size={"small"}
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            setIndexData({
                              activeBlockIndex: blockIndex,
                              activeContentIndex: blogIndex,
                            });
                            onContentDelete("discussions", blogIndex);
                          }}
                        />
                      </Space.Compact>
                    </div>
                  </div>
                </div>
              )}

              <div
                style={{
                  minWidth: "80px",
                }}
                className="tw-font-semibold tw-rounded-md tw-overflow-hidden tw-text-base tw-text-white  tw-bg-gradient-to-bl  tw-from-cyan-500 tw-to-blue-500 tw-justify-center  tw-items-start tw-flex tw-h-20 tw-w-20 "
              >
                {discussion.image_url ? (
                  <Image
                    width={80}
                    style={{
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      overflow: "hidden",
                    }}
                    src={discussion.image_url}
                  />
                ) : (
                  <div className="tw-p-2 tw-text-sm tw-w-full  ">
                    <p className=" tw-truncate tw-text-white">
                      {discussion.name.toUpperCase()}
                    </p>
                  </div>
                )}
              </div>

              <div className="  tw-transition-all tw-duration-150 tw-w-full  tw-flex tw-z-20 tw-flex-col tw-gap-2 tw-px-2 ">
                <div className=" tw-flex tw-flex-col tw-gap-1">
                  <p className="tw-text-slate-800 tw-font-semibold tw-text-base">
                    {discussion.name}
                  </p>
                  <p className="tw-text-slate-800">
                    {dayjs(discussion.created_date).format("DD MMM YYYY")}
                  </p>
                </div>
                <Link
                  to={`${ROUTEPATH.USER.DISCUSSION}/${discussion.id}`}
                  target={onClient ? "_blank" : "_self"}
                  style={{ width: "100%" }}
                >
                  <div className=" tw-group/arrow tw-flex tw-gap-2 tw-items-center tw-text-blue-500 tw-cursor-pointer tw-w-fit">
                    <div>View</div>
                    <div className="group-hover/arrow:tw-translate-x-2 tw-translate-x-0 tw-transition-all tw-duration-150 ">
                      <FaArrowRight
                        size={10}
                        style={{ color: token.colorPrimary }}
                      />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
