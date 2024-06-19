import {
  DeleteOutlined,
  EditOutlined,
  HolderOutlined,
  PlusOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Tag } from "antd";
import dayjs from "dayjs";
import { Draggable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import { KeyedMutator } from "swr";
import { useAuth } from "../../../../../Context/Auth/AuthContext";
import { BlockEditorSectionProps } from "../../../../../Interface/User/UserDashboardTypes";
import { useDeleteSection } from "../../../../../Pages/Admin/System/UserFeedSettings/Subtab/Section/api";
import DescValue from "../../../../Global/Utils/DescValue";
import BlockList from "./ContentPreview/Block/BlockList";
import { useState } from "react";
import { useSectionEditorStore } from "../../../../../Store/useSectionEditorStore";
import { useThemeContext } from "../../../../../Context/Theme/ApplicationProvider";

type Props = {
  index: number;
  items: BlockEditorSectionProps;
  FilterStatus: string[];
  mutate: KeyedMutator<BlockEditorSectionProps[]>;
  widthData: {
    SumWidth: number;
    autoWidthAmount: number;
  };
};

const SectionPreview = ({
  items,
  index,
  FilterStatus,
  mutate,
  widthData,
}: Props) => {
  const { notificationApi } = useAuth();
  const { token } = useThemeContext();

  const [showSectionPreview] = useSectionEditorStore((state) => [
    state.showSectionPreview,
  ]);
  const [ShowCurrentSectionPreview, setShowCurrentSectionPreview] =
    useState(true);

  const deleteSection = async (id: string, index: number) => {
    await useDeleteSection(id, index);
    notificationApi.success({
      message: "Successfully delete section",
      icon: <DeleteOutlined style={{ color: "red" }} />,
    });
    mutate();
  };

  return (
    <Draggable draggableId={`${items.id}`} key={items.id} index={index}>
      {(provided, { isDragging }) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div
            style={{
              border: `1px solid ${token.colorBorder}`,
              display: FilterStatus.includes(items.status) ? "flex" : "none",
              backgroundColor:
                items.status !== "Active"
                  ? token.colorBorderSecondary
                  : "white",
            }}
            className={`tw-p-2 tw-gap-2 tw-rounded-md tw-transition-all tw-duration-150 tw-my-1 ${
              isDragging ? "tw-shadow-2xl -tw-rotate-1 tw-origin-top-left" : ""
            }`}
          >
            <div
              {...provided.dragHandleProps}
              className="tw-items-start tw-pt-1 tw-flex "
              style={{
                cursor: "move",
              }}
            >
              <HolderOutlined />
            </div>
            <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full tw-items-center ">
              <div className="tw-flex tw-gap-4 tw-items-center tw-w-full ">
                <div className="tw-grid tw-grid-cols-4 tw-gap-4 tw-w-full ">
                  <DescValue keyValue="Section Type" value={items.type} />
                  <DescValue keyValue="Title" value={items.title} />
                  <DescValue
                    keyValue="Date Created"
                    value={dayjs(items.date_created).format("DD MMM YYYY")}
                  />
                  <DescValue
                    keyValue="Status"
                    element={
                      <Tag
                        color={
                          items.status.toLocaleLowerCase() === "active"
                            ? "green"
                            : "orange"
                        }
                      >
                        {items.status}
                      </Tag>
                    }
                  />
                </div>

                <div className="tw-flex tw-gap-2">
                  <Button
                    size="small"
                    type="default"
                    icon={
                      ShowCurrentSectionPreview === true ? (
                        <EyeOutlined />
                      ) : (
                        <EyeInvisibleOutlined />
                      )
                    }
                    onClick={() => {
                      setShowCurrentSectionPreview((prev) => !prev);
                    }}
                  ></Button>
                  <Link to={`/admin/system/newsfeed/section/${items.id}`}>
                    <Button size="small" type="default" icon={<EditOutlined />}>
                      Edit
                    </Button>
                  </Link>

                  <Popconfirm
                    icon={null}
                    placement="left"
                    title="Delete section"
                    description="Are you sure to delete this section?"
                    onConfirm={() => {
                      deleteSection(items.id, index);
                    }}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{
                      danger: true,
                    }}
                  >
                    <Button
                      size="small"
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                </div>
              </div>

              {ShowCurrentSectionPreview && showSectionPreview && (
                <div className="tw-flex tw-flex-col lg:tw-flex-row tw-w-full tw-max-w-7xl  ">
                  {items?.blocks?.length > 0 ? (
                    items.blocks?.map((blocks) => {
                      return (
                        <BlockList
                          key={blocks.id}
                          blocks={blocks}
                          widthData={widthData}
                        />
                      );
                    })
                  ) : (
                    <div className="tw-flex tw-gap-2 tw-items-center tw-justify-center tw-w-full">
                      <p>This section have no content</p>
                      <Link to={`/admin/system/newsfeed/section/${items.id}`}>
                        <Button
                          size="small"
                          type="primary"
                          icon={<PlusOutlined />}
                        >
                          Add Content
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default SectionPreview;
