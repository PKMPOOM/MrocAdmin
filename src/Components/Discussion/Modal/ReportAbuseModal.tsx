import {
  Button,
  ConfigProvider,
  Input,
  Modal,
  Popconfirm,
  Typography,
} from "antd";
import { useState } from "react";
import {
  CheckOutlined,
  EditOutlined,
  DeleteTwoTone,
  SaveOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../Context/Auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useAbuseReportStore } from "../../../Store/useAbuseReportStore";
import { useThemeContext } from "../../../Context/Theme/ApplicationProvider";
const { Title, Text } = Typography;

export interface ReportCategory {
  id: string;
  name: string;
  date_create: string;
  _count: {
    Reported: number;
  };
}

type editingData = {
  id: string | undefined;
  content: string | undefined;
};

const ReportAbuseModal = () => {
  const [abuseReportModalOpen, setAbuseReportModalOpen, activeCommentID] =
    useAbuseReportStore((state) => [
      state.abuseReportModalOpen,
      state.setAbuseReportModalOpen,
      state.activeCommentID,
    ]);
  const { Axios, notificationApi } = useAuth();
  const { token } = useThemeContext();

  const [NewCategoryName, setNewCategoryName] = useState("");
  const [Editing, setEditing] = useState<editingData>({
    id: undefined,
    content: undefined,
  });
  const [ReportStatement, setReportStatement] = useState("");
  const [SelectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [Loading, setLoading] = useState(false);

  async function fetchReportCategory() {
    const res = await Axios.get(`/report/category`);
    return res.data;
  }

  const { data: reportcategory, refetch: refetchCategory } = useQuery<
    ReportCategory[]
  >({
    queryKey: ["Reportcategory"],
    queryFn: fetchReportCategory,
    refetchOnWindowFocus: false,
  });

  const newCategory = async () => {
    await Axios.post("/report/category", {
      NewCategoryName,
    });
    setNewCategoryName("");
    refetchCategory();
  };

  const deleteCategory = async (id: string) => {
    await Axios.delete(`/report/category/${id}`);
    refetchCategory();
  };

  const editCategory = async () => {
    const { content, id } = Editing;
    await Axios.put(`/report/category/${id}`, {
      content,
    });
    setEditing({
      id: undefined,
      content: undefined,
    });
    refetchCategory();
  };

  const reportToAdmin = async () => {
    setLoading(true);
    await Axios.post(`/report`, {
      SelectedCategory,
      commentID: activeCommentID,
      ReportStatement,
    })
      .catch(() => {
        notificationApi.error({
          message: "Server error",
        });
      })
      .finally(() => {
        notificationApi.warning({
          message: "Report data was sent to admin",
        });
        setLoading(false);
        onCancel();
      });
  };

  const onCancel = () => {
    setAbuseReportModalOpen(false);
    setSelectedCategory(undefined);
    setReportStatement("");
  };

  const isOnManageAbusePage = window.location.href.includes("ManageAbuse");

  return (
    <>
      <Modal open={abuseReportModalOpen} onCancel={onCancel} footer={null}>
        <Title level={5}>Select report category</Title>
        <div className=" tw-flex tw-flex-col tw-gap-2 ">
          {reportcategory?.map((item) => {
            const isActive = SelectedCategory === item.id;
            const isEditing = Editing.id === item.id;

            // user view
            if (!isOnManageAbusePage) {
              return (
                <div
                  style={{
                    outline: isActive ? `1px solid ${token.colorPrimary}` : "",
                    backgroundColor: isActive
                      ? token.colorPrimaryBg
                      : "#f8fafc",
                  }}
                  className={`tw-p-2 tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200 tw-flex tw-justify-between`}
                  key={item.id}
                  onClick={() => {
                    setSelectedCategory(item.id);
                  }}
                >
                  <p
                    style={{
                      color: isActive ? token.colorPrimary : "",
                    }}
                  >
                    {item.name}
                  </p>
                  <div className={` ${isActive ? "tw-block" : "tw-hidden"}`}>
                    <CheckOutlined
                      style={{
                        color: token.colorPrimary,
                      }}
                    />
                  </div>
                </div>
              );
            }

            // admin view
            if (isOnManageAbusePage) {
              return (
                <div
                  style={{
                    outline: isEditing ? `1px solid ${token.colorPrimary}` : "",
                    backgroundColor: isEditing
                      ? token.colorPrimaryBg
                      : "#f8fafc",
                  }}
                  className={`group tw-p-2 tw-items-center tw-rounded-lg tw-transition-all tw-gap-2 tw-duration-200 tw-flex tw-justify-between `}
                  key={item.id}
                  onClick={() => {
                    setSelectedCategory(item.name);
                  }}
                >
                  {isEditing ? (
                    <Input
                      value={Editing.content}
                      onChange={(e) => {
                        setEditing({
                          id: item.id,
                          content: e.target.value,
                        });
                      }}
                    />
                  ) : (
                    <Text>{item.name}</Text>
                  )}
                  <div className=" tw-flex tw-gap-2 ">
                    {isEditing && (
                      <Button
                        onClick={() => {
                          editCategory();
                        }}
                        type="primary"
                        icon={<SaveOutlined />}
                      />
                    )}

                    {item.name !== "Something else" && (
                      <>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => {
                            setEditing({
                              id: item.id,
                              content: item.name,
                            });
                          }}
                        />

                        <Popconfirm
                          icon={null}
                          placement="left"
                          title="Delete category"
                          description="Are you sure to delete this category?"
                          onConfirm={() => {
                            deleteCategory(item.id);
                          }}
                          okText="Delete"
                          cancelText="Cancel"
                          okButtonProps={{
                            danger: true,
                          }}
                        >
                          <Button
                            danger
                            icon={<DeleteTwoTone twoToneColor={"red"} />}
                          />
                        </Popconfirm>
                      </>
                    )}
                  </div>
                </div>
              );
            }
          })}

          {isOnManageAbusePage && (
            <>
              <div
                style={{
                  outline: `1px solid ${token.colorPrimary}`,
                }}
                className={` group  tw-items-center tw-rounded-lg tw-transition-all tw-gap-2 tw-duration-200 tw-flex tw-justify-between `}
              >
                <Input
                  placeholder="New category"
                  value={NewCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                  }}
                />
                <div className=" tw-flex tw-gap-2 ">
                  <Button
                    type="primary"
                    onClick={() => {
                      newCategory();
                    }}
                  >
                    New category
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {SelectedCategory === "Something else" && !isOnManageAbusePage && (
          <div className="tw-mt-3 tw-mb-10">
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 7 }}
              maxLength={200}
              showCount
              onChange={(e) => {
                setReportStatement(e.target.value);
              }}
            />
          </div>
        )}

        <div className=" tw-flex tw-flex-row tw-gap-2 tw-mt-4 tw-justify-end">
          {isOnManageAbusePage && (
            <div className=" ">
              <Button type="text" onClick={onCancel}>
                Close
              </Button>
            </div>
          )}

          {!isOnManageAbusePage && (
            <div className=" tw-ml-auto tw-flex tw-gap-2">
              <Button type="text" onClick={onCancel}>
                Cancel
              </Button>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: token.colorWarning,
                  },
                }}
              >
                <Button
                  loading={Loading}
                  disabled={SelectedCategory === undefined}
                  type="primary"
                  onClick={() => {
                    reportToAdmin();
                  }}
                >
                  Report
                </Button>
              </ConfigProvider>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ReportAbuseModal;
