import {
  DeleteOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Space } from "antd";
import { FaArrowRight } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../../../../../../../Context/Auth/AuthContext";
import { DiscussionFullType } from "../../../../../../../../../Interface/DiscussionThreadInterfaces";
import { useSectionEditorStore } from "../../../../../../../../../Store/useSectionEditorStore";
import { ROUTEPATH } from "../../../../../../../../../Utils/RoutePath";
import { useThemeContext } from "../../../../../../../../../Context/Theme/ApplicationProvider";

type ContentCardProps = {
  discussion: DiscussionFullType;
  indexData: {
    isLastIndex: boolean;
    isFirstIndex: boolean;
    discussionIndex: number;
    blockIndex: number;
  };
};

export default function DiscussionCard({
  discussion,
  indexData,
}: ContentCardProps) {
  const { isFirstIndex, isLastIndex, discussionIndex, blockIndex } = indexData;
  const { AuthUser } = useAuth();
  const { token } = useThemeContext();

  const [
    setDiscussionDrawerOpen,
    setIndexData,
    onContentSort,
    onContentDelete,
  ] = useSectionEditorStore((state) => [
    state.setDiscussionDrawerOpen,
    state.setIndexData,
    state.onContentSort,
    state.onContentDelete,
  ]);

  const { id } = useParams();
  const onClient = window.location.href.includes("/admin");
  const isAdmin = AuthUser?.role === "admin";
  const isEditingSingleSection = id !== undefined;
  const showEditor = onClient && isAdmin && isEditingSingleSection;

  return (
    <div
      className="tw-group tw-flex-1 tw-flex tw-basis-44 tw-relative"
      style={{
        height: "auto",
        flexDirection: "column",
        borderRadius: "8px",
      }}
    >
      {showEditor && (
        <div
          className={`tw-flex tw-absolute lg:tw-top-1/2 lg:-tw-translate-y-1/2 tw-left-1/2 -tw-translate-x-1/2 tw-my-auto lg:tw-translate-x-0 lg:tw-w-6 lg:tw-flex lg:tw-justify-center ${
            isFirstIndex
              ? "-tw-top-3 lg:-tw-left-3 "
              : "-tw-top-5 lg:-tw-left-4 "
          } tw-z-40 tw-items-center  `}
        >
          <Button
            onClick={() => {
              setDiscussionDrawerOpen(true);
              setIndexData({
                activeBlockIndex: blockIndex,
                activeContentIndex: discussionIndex,
              });
            }}
            type="primary"
            size={"small"}
            icon={<PlusOutlined />}
            shape="circle"
          />
        </div>
      )}

      {isLastIndex && showEditor && (
        <div
          className={` lg:tw-top-1/2 lg:-tw-translate-y-1/2 tw-my-auto tw-flex tw-absolute -tw-bottom-4 tw-right-1/2 tw-translate-x-1/2 lg:-tw-right-3 lg:tw-translate-x-0 lg:tw-w-6 lg:tw-flex lg:tw-justify-center  tw-z-50 tw-items-center  `}
        >
          <Button
            onClick={() => {
              setDiscussionDrawerOpen(true);
              setIndexData({
                activeBlockIndex: blockIndex,
                activeContentIndex: discussionIndex + 1, // last index + 1
              });
            }}
            type="primary"
            size={"small"}
            icon={<PlusOutlined />}
            shape="circle"
          />
        </div>
      )}

      {/* Content settings */}
      {showEditor && (
        <div className="tw-absolute tw-top-0  tw-right-0 tw-p-2  tw-flex tw-z-10 ">
          <div className="tw-flex tw-gap-1 tw-flex-wrap tw-flex-col tw-w-full ">
            <div className="tw-flex tw-items-center tw-bg-white tw-rounded ">
              <Space.Compact>
                <Button
                  disabled={isFirstIndex}
                  size={"small"}
                  icon={<LeftOutlined />}
                  onClick={() => {
                    setIndexData({
                      activeBlockIndex: blockIndex,
                      activeContentIndex: discussionIndex,
                    });
                    onContentSort(
                      "discussions",
                      discussionIndex,
                      discussionIndex - 1
                    );
                  }}
                />
                <Button
                  disabled={isLastIndex}
                  size={"small"}
                  icon={<RightOutlined />}
                  onClick={() => {
                    setIndexData({
                      activeBlockIndex: blockIndex,
                      activeContentIndex: discussionIndex,
                    });
                    onContentSort(
                      "discussions",
                      discussionIndex,
                      discussionIndex + 1
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
                      activeContentIndex: discussionIndex,
                    });
                    onContentDelete("discussions", discussionIndex);
                  }}
                />
              </Space.Compact>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          border: `1px solid ${token.colorBorder}`,
        }}
        className="tw-flex-1 tw-flex tw-basis-44 tw-h-auto tw-flex-col tw-rounded-lg tw-overflow-hidden"
      >
        <div className="tw-bg-gradient-to-bl tw-from-cyan-500 tw-to-blue-500 tw-w-full tw-flex-col tw-overflow-hidden  tw-relative tw-h-full  tw-flex tw-gap-2 tw-justify-start tw-items-start tw-bg-center tw-bg-cover tw-bg-no-repeat ">
          {discussion.image_url ? (
            <img
              style={{
                minWidth: "100%",
                minHeight: "100%",
                objectFit: "cover",
                overflow: "hidden",
                position: "absolute",
              }}
              src={discussion.image_url}
            />
          ) : (
            <div className="tw-font-semibold tw-text-lg tw-p-2 tw-text-white">
              {discussion.name.toUpperCase()}
            </div>
          )}

          <Link
            to={`${ROUTEPATH.USER.DISCUSSION}/${discussion.id}`}
            target="_blank"
            style={{ width: "100%" }}
          >
            <div className="tw-group/arrow tw-transition-all tw-duration-150 tw-border-t tw-absolute tw-bottom-0 tw-w-full tw-bg-white tw-px-4 tw-py-6 tw-h-9 tw-flex tw-justify-between tw-items-center tw-z-20 ">
              <p className="tw-text-slate-800">{discussion.name}</p>
              <div className="group-hover/arrow:tw--translate-x-2 tw-transition-all tw-duration-150">
                <FaArrowRight size={18} style={{ color: token.colorPrimary }} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
