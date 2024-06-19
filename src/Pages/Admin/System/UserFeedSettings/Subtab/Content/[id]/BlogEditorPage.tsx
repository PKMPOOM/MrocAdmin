import {
  HomeOutlined,
  UploadOutlined,
  UserOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Editor } from "@tinymce/tinymce-react";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Result,
  Select,
  Upload,
  UploadProps,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingFallback from "../../../../../../../Components/Global/Suspense/LoadingFallback";
import DescValue from "../../../../../../../Components/Global/Utils/DescValue";
import { useAuth } from "../../../../../../../Context/Auth/AuthContext";
import { StatusOption } from "../../../../../../../Interface/SurveyEditorInterface";
import { useContentEditorStore } from "../../../../../../../Store/useContentEditorStore";
import {
  BlogProps,
  DisplayType,
} from "../../../../../../../Interface/User/UserDashboardTypes";
import { useThemeContext } from "../../../../../../../Context/Theme/ApplicationProvider";

const { Dragger } = Upload;
const StatusOptions: StatusOption[] = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Draft",
    label: "Draft",
  },
];

type contentForm = {
  title: string;
  status: "Active" | "Draft" | "Closed";
  display_title: boolean;
  type: DisplayType;
  text: string;
  dragger: any[];
};

const BlogEditorPage = () => {
  const { accessToken, notificationApi } = useAuth();
  const { id: paramID } = useParams();
  const [contentForm] = Form.useForm<contentForm>();
  const { token } = useThemeContext();
  const [ImageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const editorRef = useRef<any>(null);
  const navigate = useNavigate();

  const [contentData, setcontentData] = useContentEditorStore((state) => [
    state.contentData,
    state.setcontentData,
  ]);

  const isCreateNew = paramID === "New";
  const { Axios } = useAuth();

  // //todo create store
  const fetchSection = async () => {
    const response = await Axios.get(`/feed_settings/content/${paramID}`);
    return response.data;
  };

  const { isLoading, isError, refetch, data } = useQuery<BlogProps>({
    queryFn: fetchSection,
    queryKey: ["content", "editor", paramID],
    refetchOnWindowFocus: false,
    enabled: !isCreateNew,
  });

  useEffect(() => {
    if (!isCreateNew && data) {
      contentForm.setFieldsValue({
        title: data.title,
        // type: data.type,
        status: data.status,
      });
      setcontentData(data);
      if (data.image_url) {
        setImageUrl(data.image_url);
      }
    }
  }, [data]);

  if (!contentData && isLoading && !isCreateNew) {
    return <LoadingFallback />;
  }

  if (isError) {
    return (
      <div className="tw-w-full tw-items-center tw-justify-center tw-h-full tw-flex ">
        <Result
          status="error"
          title="Error loading section data"
          subTitle="We apologize for the inconvenience, but an error occurred while attempting to load the requested data."
          extra={[
            <Link to={"/admin/system/newsfeed?tab=section"}>
              <Button type="primary" key="console">
                Back
              </Button>
            </Link>,
            <Button onClick={() => refetch()} key="retry">
              Retry
            </Button>,
          ]}
        ></Result>
      </div>
    );
  }

  const props: UploadProps = {
    name: "file",
    maxCount: 1,
    customRequest(options) {
      setImageUrl(URL.createObjectURL(options.file as File));
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    showUploadList: false,
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = async (contentFormsData: any) => {
    const { dragger } = contentFormsData;
    const htmlContent = editorRef?.current?.getContent();
    const textContent: string = editorRef?.current
      ?.getContent({
        format: "text",
      })
      .substring(0, 200)
      .replaceAll("\n", " ")
      .replaceAll("  ", " ");

    const postBody = {
      ...contentFormsData,
      htmlContent,
      textContent,
    };

    if (!isCreateNew) {
      //update current Blog content
      try {
        await Axios.put(`/feed_settings/content/${contentData?.id}`, postBody);

        if (dragger !== undefined) {
          await Axios.post(
            `/feed_settings/content/${contentData?.id}/image_upload`,
            {
              file: dragger[0].originFileObj,
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          ).then(() => {
            navigate("/admin/system/newsfeed?tab=content");
            notificationApi.success({
              message: "Successfully create new content",
            });
          });
        }
      } catch (error) {
        notificationApi.error({
          message: "Error",
        });
      }
    } else {
      //Create new Blog content
      const response = await Axios.post("/feed_settings/content", postBody);

      if (dragger !== undefined && response.status === 200) {
        await Axios.post(
          `/feed_settings/content/${response.data.contentID}/image_upload`,
          {
            file: dragger[0].originFileObj,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
          .then(() => {
            navigate("/admin/system/newsfeed?tab=blog");
            notificationApi.success({
              message: "Successfully create new content",
            });
          })
          .catch(() => {
            notificationApi.error({
              message: "Error",
            });
          });
      }
    }
  };

  const resetUploadField = () => {
    contentForm.setFieldsValue({
      dragger: [],
    });
    setImageUrl(undefined);
  };

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Breadcrumb
        items={[
          {
            title: (
              <Link to={"/admin/Dashboard"}>
                <HomeOutlined />
              </Link>
            ),
          },
          {
            title: (
              <Link to={"/admin/system/newsfeed?tab=blog"}>
                <UserOutlined />
                <span>User Feed Settings</span>
              </Link>
            ),
          },
          {
            title: contentData?.title ?? "New",
          },
        ]}
      />

      <Form
        wrapperCol={{ flex: "auto" }}
        form={contentForm}
        title="Site Settings"
        layout="vertical"
        requiredMark="optional"
        onFinish={onFinish}
        initialValues={{
          type: "card",
          status: "Draft",
          display_title: false,
        }}
      >
        <div className="tw-flex tw-gap-2 tw-justify-end ">
          {!isCreateNew && contentData && (
            <div className="tw-grid tw-grid-cols-2 tw-w-full">
              <DescValue keyValue="Id" value={contentData.id} />
            </div>
          )}
          <div className="tw-flex tw-gap-2 tw-justify-end ">
            <Link to={"/admin/system/newsfeed"}>
              <Button>Back</Button>
            </Link>
            <Button htmlType="submit" type="primary">
              {isCreateNew ? "Create New" : "Save"}
            </Button>
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-8 tw-gap-4">
          <div className="tw-col-span-2 ">
            <Form.Item<contentForm>
              label="Title"
              name={"title"}
              rules={[
                {
                  required: true,
                  message: "Content title cannot be blank",
                },
                {
                  max: 50,
                  message: "Content title is exceed characters limit of 50",
                },
                {
                  min: 4,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<contentForm>
              label="Status"
              name={"status"}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select options={StatusOptions} />
            </Form.Item>

            <Form.Item label="Image" style={{ position: "relative" }}>
              <Form.Item
                name="dragger"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Dragger {...props}>
                  <div className="tw-flex tw-flex-col tw-gap-1 tw-justify-center tw-items-center tw-h-40 ">
                    {ImageUrl && (
                      <img
                        style={{
                          position: "absolute",
                          objectFit: "cover",
                          height: "100%",
                          width: "100%",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                        src={ImageUrl}
                      />
                    )}

                    {!ImageUrl && (
                      <>
                        <UploadOutlined
                          style={{ color: token.colorPrimary, fontSize: 24 }}
                        />
                        <p>Add content image</p>
                      </>
                    )}
                  </div>
                </Dragger>
              </Form.Item>
              <Button
                style={{ position: "absolute", bottom: 8, right: 8 }}
                onClick={resetUploadField}
                icon={<RetweetOutlined />}
              ></Button>
            </Form.Item>
          </div>
          <div className="tw-col-span-6 tw-pt-7 tw-h-[1000px] ">
            <Editor
              onInit={(_, editor) => {
                return (editorRef.current = editor);
              }}
              toolbar="undo redo | fontsizeinput | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | help"
              plugins={["link"]}
              initialValue={contentData?.html_content}
              apiKey="o44dth4r81u4x5lddqche01e0b308mdzhu5wm3hql96iv7d3"
              init={{
                height: 1000,
              }}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default BlogEditorPage;
