import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RetweetOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Empty,
  Image,
  Popconfirm,
  Spin,
  Tag,
  theme,
} from "antd";
import dayjs from "dayjs";
import { produce } from "immer";
import { createContext, useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import DragableRow from "../DragableRow";
import { customColumn, socialLinkTableProps } from "../api";
import {
  deleteSocialLink,
  getSocialLinkList,
  updateSocialLinkOrder,
} from "./api";
import NewContentDrawer from "./Drawer/NewSocialLinkDrawer";
import { useAuth } from "~/context/Auth/AuthContext";
import LoadingFallback from "~/component/Global/Suspense/LoadingFallback";
import ErrorFallback from "~/component/Global/Suspense/ErrorFallback";
import DescValue from "~/component/Global/Utils/DescValue";
const { useToken } = theme;

type contextValue = {
  editorDrawerOpen: boolean;
  seteditorDrawerOpen: (value: boolean) => void;
  EditingSocialLink: socialLinkTableProps | undefined;
  setEditingSocialLink: (value: socialLinkTableProps | undefined) => void;
  SocialLinkData: socialLinkTableProps[] | undefined;
  refetch: () => void;
};

export const SocialLinkPageContext = createContext({} as contextValue);

const SocialLinksTable = () => {
  const [FilterStatus, setFilterStatus] = useState(["active", "draft"]);
  const [editorDrawerOpen, seteditorDrawerOpen] = useState(false);

  const [EditingSocialLink, setEditingSocialLink] = useState<
    socialLinkTableProps | undefined
  >(undefined);
  const [SocialLinkData, setSocialLinkData] = useState<
    socialLinkTableProps[] | undefined
  >(undefined);

  const { token } = useToken();
  const { notificationApi } = useAuth();

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: refetch,
  } = getSocialLinkList();

  useEffect(() => {
    setSocialLinkData(undefined);
    if (data) {
      setSocialLinkData(data);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!SocialLinkData) {
    return <LoadingFallback />;
  }

  if (error) {
    return <ErrorFallback errorTitle="Error loading Social link" />;
  }

  const editSiteContent = (selectedContent: socialLinkTableProps) => {
    setEditingSocialLink(selectedContent);
    seteditorDrawerOpen(true);
  };

  const colsData: customColumn<socialLinkTableProps>[] = [
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
          <div className=" tw-flex tw-items-center">
            <Image
              style={{
                aspectRatio: "1/1",
                objectFit: "cover",
                height: "40px",
                borderRadius: "4px",
              }}
              src={
                record.content?.icon
                  ? record.content.icon
                  : "https://gfuwezskflleiadzwihe.supabase.co/storage/v1/object/public/Images/system/image-file-4.png"
              }
            />
          </div>
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
              title="Delete Social link "
              description="Are you sure to delete this Social link?"
              onConfirm={async () => {
                await deleteSocialLink(record.id, record.index);
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

    const copyState = [...SocialLinkData];

    const updatedState = produce(SocialLinkData, (draftState) => {
      const [removeObject] = draftState.splice(sourceIndex, 1);
      draftState.splice(destIndex, 0, removeObject);
    });

    setSocialLinkData(updatedState);
    try {
      await updateSocialLinkOrder(elementID, sourceIndex, destIndex);
      notificationApi.success({
        message: "Social Links order updated",
        description: "Social Links order has been updated",
      });
      refetch();
    } catch (error) {
      setSocialLinkData(copyState);
      notificationApi.error({
        message: "Error updating Social Links order",
        description: "Please try again",
      });
    }
  };

  const contextValue = {
    editorDrawerOpen,
    seteditorDrawerOpen,
    EditingSocialLink,
    setEditingSocialLink,
    SocialLinkData,
    refetch,
  };

  return (
    <SocialLinkPageContext.Provider value={contextValue}>
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
                Create New Social link
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

          {SocialLinkData.length === 0 ? (
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
                      {SocialLinkData.map((items, index) => {
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
    </SocialLinkPageContext.Provider>
  );
};

export default SocialLinksTable;
