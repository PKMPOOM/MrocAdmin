import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RetweetOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Empty, Popconfirm, Spin, Tag, theme } from "antd";
import dayjs from "dayjs";
import { produce } from "immer";
import { createContext, useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import DragableRow from "../DragableRow";
import {
  customColumn,
  getSystemSiteContent,
  siteContentTableProps,
} from "../api";
import { deleteSiteContent, updateSiteContentOrder } from "./api";
import NewContentDrawer from "./Drawer/NewContentDrawer";
import { useAuth } from "~/context/Auth/AuthContext";
import LoadingFallback from "~/component/Global/Suspense/LoadingFallback";
import ErrorFallback from "~/component/Global/Suspense/ErrorFallback";
import DescValue from "~/component/Global/Utils/DescValue";
const { useToken } = theme;

type contextValue = {
  editorDrawerOpen: boolean;
  seteditorDrawerOpen: (value: boolean) => void;
  contentSelectorDrawerOpen: boolean;
  setContentSelectorDrawerOpen: (value: boolean) => void;
  EditingSiteContent: siteContentTableProps | undefined;
  setEditingSiteContent: (value: siteContentTableProps | undefined) => void;
  siteContentData: siteContentTableProps[] | undefined;
  ConnectedContent: siteContentTableProps["content"] | undefined;
  setConnectedContent: (
    value: siteContentTableProps["content"] | undefined
  ) => void;
  refetch: () => void;
};

export const SiteContentContext = createContext({} as contextValue);

const SiteContentsTable = () => {
  const [FilterStatus, setFilterStatus] = useState(["active", "draft"]);
  const [editorDrawerOpen, seteditorDrawerOpen] = useState(false);
  const [contentSelectorDrawerOpen, setContentSelectorDrawerOpen] =
    useState(false);
  const [EditingSiteContent, setEditingSiteContent] = useState<
    siteContentTableProps | undefined
  >(undefined);
  const [ConnectedContent, setConnectedContent] = useState<
    siteContentTableProps["content"] | undefined
  >(undefined);
  const [siteContentData, setsiteContentData] = useState<
    siteContentTableProps[] | undefined
  >(undefined);

  const { token } = useToken();
  const { notificationApi } = useAuth();

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: refetch,
  } = getSystemSiteContent();

  useEffect(() => {
    setsiteContentData(undefined);
    if (data) {
      setsiteContentData(data);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingFallback />;
  }
  if (!siteContentData) {
    return <LoadingFallback />;
  }
  if (error) {
    return <ErrorFallback errorTitle="Error loading Site content" />;
  }

  const editSiteContent = (selectedContent: siteContentTableProps) => {
    setEditingSiteContent(selectedContent);
    seteditorDrawerOpen(true);
  };

  const colsData: customColumn<siteContentTableProps>[] = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render(record) {
        return (
          <DescValue
            key={record.id}
            keyValue={"Status"}
            element={
              <Tag color={record.status === "active" ? "green" : "default"}>
                {record.status}
              </Tag>
            }
          />
        );
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Date Created",
      dataIndex: "date_created",
      key: "date_created",
      render(record) {
        return (
          <DescValue
            key={record.id}
            keyValue={"Date Created"}
            value={dayjs(record.date_created).format("DD MMM YYYY")}
          />
        );
      },
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render(record) {
        return (
          <DescValue
            key={record.id}
            keyValue={"Content"}
            value={record.content?.title}
          />
        );
      },
    },
    {
      key: "action",
      width: 150,
      render(record) {
        return (
          <div className=" tw-flex tw-gap-2  tw-justify-end">
            <Button
              size="small"
              type="default"
              icon={<EditOutlined />}
              onClick={() => {
                editSiteContent(record);
              }}
            >
              Edit
            </Button>

            <Popconfirm
              icon={null}
              placement="left"
              title="Delete site content"
              description="Are you sure to delete this content?"
              onConfirm={async () => {
                await deleteSiteContent(record.id, record.index);
                refetch();
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
        );
      },
    },
  ];

  const onDragEnd = async (event: DropResult) => {
    const sourceIndex = event.source.index;
    const destIndex = event.destination?.index;
    const elementID = event.draggableId;

    if (destIndex === undefined) {
      return;
    }

    if (sourceIndex === destIndex) {
      return;
    }

    const copyState = [...siteContentData];

    const updatedState = produce(siteContentData, (draftState) => {
      const [removeObject] = draftState.splice(sourceIndex, 1);
      draftState.splice(destIndex, 0, removeObject);
    });

    setsiteContentData(updatedState);
    try {
      await updateSiteContentOrder(elementID, sourceIndex, destIndex);
      notificationApi.success({
        message: "Site content order updated",
        description: "Site content order has been updated",
      });
      refetch();
    } catch (error) {
      setsiteContentData(copyState);
      notificationApi.error({
        message: "Error updating site content order",
        description: "Please try again",
      });
    }
  };

  const contextValue = {
    editorDrawerOpen,
    seteditorDrawerOpen,
    contentSelectorDrawerOpen,
    setContentSelectorDrawerOpen,
    EditingSiteContent,
    setEditingSiteContent,
    ConnectedContent,
    setConnectedContent,
    refetch,
    siteContentData,
  };

  return (
    <SiteContentContext.Provider value={contextValue}>
      <NewContentDrawer />
      <div>
        <div className="tw-flex tw-flex-col tw-gap-4">
          <div className="tw-flex tw-gap-2 tw-items-stretch">
            <div className="tw-flex tw-gap-2">
              <Button
                onClick={() => {
                  seteditorDrawerOpen(true);
                }}
                icon={<PlusOutlined />}
                type="primary"
              >
                Create New Site Content
              </Button>
            </div>

            <div
              style={{
                border: `1px solid ${token.colorPrimaryBgHover}`,
                backgroundColor: token.colorPrimaryBg,
                borderRadius: "6px",
              }}
              className="tw-flex tw-gap-2 tw-items-center tw-px-4"
            >
              <p className="tw-font-semibold">Status:</p>
              <Checkbox.Group
                onChange={(e) => setFilterStatus(e as string[])}
                defaultValue={["active", "draft"]}
              >
                <Checkbox value={"active"}>Active</Checkbox>
                <Checkbox value={"draft"}>Draft</Checkbox>
              </Checkbox.Group>
            </div>

            <div className="tw-ml-auto tw-gap-2 tw-flex">
              <Button
                onClick={() => {
                  refetch();
                }}
                icon={<RetweetOutlined />}
              >
                Refresh
              </Button>
            </div>
          </div>

          {siteContentData.length === 0 ? (
            <Empty />
          ) : (
            <Spin
              spinning={isLoading || isValidating}
              indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
            >
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={"sitecontentlist"}>
                  {(provided, snapshot) => (
                    <div
                      className="tw-flex tw-flex-col tw-h-[calc(100vh-240px)] tw-overflow-y-auto"
                      style={{
                        backgroundColor: snapshot.isDraggingOver
                          ? "#f7f7f7"
                          : undefined,
                        borderRadius: "6px",
                      }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {siteContentData.map((items, index) => {
                        const colswidth = colsData.map((item) => {
                          return item.width
                            ? `minmax(10px, ${item.width.toString()}px)`
                            : "minmax(10px, 1fr)";
                        });

                        return (
                          <DragableRow
                            customColsWidth={colswidth}
                            key={items.id}
                            items={items}
                            index={index}
                            FilterStatus={FilterStatus}
                            columnNames={colsData}
                            shouldDisplay={FilterStatus.includes(items.status)}
                          />
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Spin>
          )}
        </div>
      </div>
    </SiteContentContext.Provider>
  );
};

export default SiteContentsTable;
