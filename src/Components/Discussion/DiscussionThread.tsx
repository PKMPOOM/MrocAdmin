import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  EllipsisOutlined,
  ShareAltOutlined,
  SnippetsOutlined,
  StarOutlined,
  StopOutlined,
  TagOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Dropdown, MenuProps, Typography } from "antd";
import dayjs from "dayjs";
import { useContext } from "react";
import { useThemeContext } from "../../Context/Theme/ApplicationProvider";
import { discussionPageContext } from "../../Pages/Admin/Qualitative/Discussions/[ID]/DiscussionPage";
import { useAbuseReportStore } from "../../Store/useAbuseReportStore";
import SkeletonLoadingFallback from "../Global/Suspense/SkeletonLoadingFallback";
import ReportAbuseModal from "./Modal/ReportAbuseModal";
const { Text } = Typography;

const DiscussionThread = () => {
  const { discussionData } = useContext(discussionPageContext);

  if (!discussionData) {
    return <SkeletonLoadingFallback />;
  }

  const { token } = useThemeContext();
  const { image_url, start_thread, username, vote, created_date, comments } =
    discussionData;

  // const image_url = discussionData.image_url;

  const [setAbuseReportModalOpen, setActiveCommentID] = useAbuseReportStore(
    (state) => [state.setAbuseReportModalOpen, state.setActiveCommentID]
  );

  const elipsedMenuItems: MenuProps["items"] = [
    {
      key: "report_abuse",
      label: "Report abuse",
      icon: <WarningOutlined />,
    },
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
    },
    {
      key: "ban_user",
      label: "Ban user",
      icon: <StopOutlined />,
    },
    {
      key: "add_user_to_clipboard",
      label: "Add user to clipboard",
      icon: <SnippetsOutlined />,
    },
    {
      key: "add_points",
      label: "Add points",
      icon: <DollarOutlined />,
    },
    {
      key: "star",
      label: "Star",
      icon: <StarOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const tagsMenuItems: MenuProps["items"] = [
    {
      key: "positive",
      label: <Checkbox>Positive</Checkbox>,
    },
    {
      key: "negative",
      label: <Checkbox>Negative</Checkbox>,
    },
  ];

  const onDropDownClick = ({
    key,
    commentID,
  }: {
    key: string;
    commentID: string;
  }) => {
    if (key === "report_abuse") {
      setAbuseReportModalOpen(true);
      setActiveCommentID(commentID);
    }
  };

  return (
    <div
      style={{
        border: `1px solid ${token.colorBorderSecondary}`,
        padding: "16px",
        borderRadius: "8px",
      }}
      className="tw-w-9/12 tw-flex tw-flex-col tw-gap-2"
    >
      <div className=" tw-flex tw-gap-4 tw-max-h-80 tw-rounded-lg">
        {image_url && image_url !== "" && (
          <img
            style={{
              objectFit: "cover",
              aspectRatio: "1/1",
              height: "100%",
              borderRadius: "4px",
            }}
            src={image_url}
          />
        )}

        <div className=" tw-flex tw-flex-col tw-gap-2 tw-justify-between tw-w-full">
          <Text>{start_thread}</Text>
          <div className=" tw-flex tw-justify-between tw-w-full ">
            <div className=" tw-flex tw-flex-col tw-gap-0">
              <div className=" tw-flex tw-gap-1">
                <Text type="secondary">Author</Text>
                <Text strong>{username}</Text>
              </div>
              <div className="tw-flextw-gap-1">
                <Text type="secondary">Created</Text>
                <Text strong>{dayjs(created_date).format("DD-MMM-YYYY")}</Text>
              </div>
            </div>

            <div className=" tw-flex tw-gap-2 tw-items-center ">
              <ArrowUpOutlined />
              <Text>{vote}</Text>
              <ArrowDownOutlined />
            </div>
          </div>
        </div>
      </div>

      {/* //todo add comment input */}

      <div>
        {comments?.map((comment) => (
          <div
            key={comment.id}
            style={{
              border: `1px solid ${token.colorBorderSecondary}`,
              padding: "8px",
              borderRadius: "4px",
              backgroundColor: token.colorBgBase,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <div className=" tw-flex tw-gap-2 tw-items-baseline">
              <p className=" tw-text-base tw-font-semibold">
                userID = {comment.userId}
              </p>
              <p className="tw-text-slate-400">
                {dayjs(comment.created_date).format("DD-MMM-YYYY")}
              </p>
              <div className=" tw-flex tw-ml-auto tw-gap-1">
                <Button
                  type="text"
                  shape="circle"
                  icon={<ShareAltOutlined />}
                />

                <Dropdown
                  overlayStyle={{
                    minWidth: "150px",
                  }}
                  className="tw-cursor-pointer"
                  menu={{
                    items: tagsMenuItems,
                    // onClick: onDropDownClick
                  }}
                >
                  <Button type="text" shape="circle" icon={<TagOutlined />} />
                </Dropdown>

                <Dropdown
                  overlayStyle={{
                    minWidth: "150px",
                  }}
                  className="tw-cursor-pointer"
                  menu={{
                    items: elipsedMenuItems,
                    onClick: ({ key }) => {
                      onDropDownClick({ key, commentID: comment.id });
                    },
                  }}
                >
                  <Button
                    type="text"
                    shape="circle"
                    icon={<EllipsisOutlined />}
                  />
                </Dropdown>
              </div>
            </div>

            <p>{comment.message}</p>
            <div>
              <div className=" tw-flex tw-gap-2 tw-items-center">
                <ArrowUpOutlined />
                <Text>{comment.key}</Text>
                <ArrowDownOutlined />
              </div>
            </div>
          </div>
        ))}
      </div>
      <ReportAbuseModal />
    </div>
  );
};

export default DiscussionThread;
