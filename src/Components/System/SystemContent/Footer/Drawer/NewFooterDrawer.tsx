import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Drawer,
  Form,
  Image,
  Input,
  Select,
  Typography,
  theme,
} from "antd";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { FooterPageContext } from "../FooterTable";
import SelectContentDrawer from "./SelectContentDrawer";
import { createNewFooter, updateFooter } from "../api";
import { useAuth } from "~/context/Auth/AuthContext";
import DescValue from "~/component/Global/Utils/DescValue";

const { useToken } = theme;
const { Text } = Typography;

type formSchema = {
  title: string;
  status: "draft" | "active";
};

type Props = {
  refetch: () => void;
};

const NewFooterDrawer = ({ refetch }: Props) => {
  const { token } = useToken();
  const [formInstance] = Form.useForm<formSchema>();
  const [Loading, setLoading] = useState(false);
  const { notificationApi } = useAuth();

  const {
    editorDrawerOpen,
    seteditorDrawerOpen,
    setContentSelectorDrawerOpen,
    setConnectedContent,
    ConnectedContent,
    EditingFooter,
    setEditingFooter,
    // refetch,
  } = useContext(FooterPageContext);

  const isEditing = EditingFooter !== undefined;

  useEffect(() => {
    // init form state with basic data
    formInstance.setFieldsValue({
      title: "new content",
      status: "draft",
    });
    if (isEditing) {
      formInstance.setFieldsValue({
        title: EditingFooter.title,
        status: EditingFooter.status,
      });
      setConnectedContent(EditingFooter.content);
    }
  }, [EditingFooter]);

  const onCancelEdit = () => {
    seteditorDrawerOpen(false);
    setContentSelectorDrawerOpen(false);
    setEditingFooter(undefined);
    setConnectedContent(undefined);
    formInstance.resetFields();
    setLoading(false);
    refetch();
  };

  const openSelectContentDrawer = () => {
    setContentSelectorDrawerOpen(true);
  };

  const onFinish = async (formdata: formSchema) => {
    setLoading(true);
    const payload = {
      formData: formdata,
      footerData: ConnectedContent,
    };

    try {
      if (isEditing) {
        // if we are editing an existing content
        await updateFooter(EditingFooter.id, payload);
        notificationApi.success({
          message: "Success",
          description: "Footer updated successfully",
        });
      } else {
        // if we are creating a new content
        await createNewFooter(payload);
        notificationApi.success({
          message: "Success",
          description: "New footer created successfully",
        });
      }

      onCancelEdit();
    } catch (error) {
      notificationApi.error({
        message: "Error",
        description: "Something went wrong",
      });
    }
  };

  return (
    <Drawer
      title={isEditing ? "Edit Footer" : "New Footer"}
      width={"50%"}
      size="large"
      closable={true}
      onClose={onCancelEdit}
      open={editorDrawerOpen}
    >
      <Divider orientation="left">
        <Text strong>General details</Text>
      </Divider>

      <Form
        form={formInstance}
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
      >
        <Form.Item<formSchema>
          label="Title"
          name={"title"}
          style={{
            marginBottom: "8px",
          }}
          extra="The use of special characters, such as @ # ( ) / etc. is not permitted."
          rules={[
            {
              required: true,
              message: "Please enter content title",
            },
            // prevent user to add special char
            {
              pattern: /^[a-zA-Z0-9\s]*$/,
              message: "Special characters are not allowed",
            },
          ]}
        >
          <Input placeholder="content title" />
        </Form.Item>
        <Form.Item<formSchema>
          label="Status"
          name={"status"}
          style={{
            marginBottom: "8px",
          }}
          rules={[
            {
              required: true,
              message: "Please select content status",
            },
          ]}
        >
          <Select
            placeholder="Content status"
            options={[
              {
                label: "Draft",
                value: "draft",
              },
              {
                label: "Active",
                value: "active",
              },
            ]}
          />
        </Form.Item>

        <Divider orientation="left">
          <Text strong>Current selected content</Text>
        </Divider>

        <div
          style={{
            border: `1px solid ${token.colorBorder}`,
          }}
          className={`tw-group tw-mb-2 tw-transition-all tw-duration-200 tw-p-2 tw-rounded tw-min-w-full tw-flex tw-gap-2 tw-my-1`}
        >
          {ConnectedContent ? (
            <>
              <Image
                style={{
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  height: "80px",
                  borderRadius: "4px",
                }}
                src={
                  ConnectedContent?.image_url
                    ? ConnectedContent?.image_url
                    : "https://gfuwezskflleiadzwihe.supabase.co/storage/v1/object/public/Images/system/image-file-4.png"
                }
              />

              <div className="tw-flex tw-flex-col tw-gap-1 ">
                <DescValue keyValue="Name" value={ConnectedContent?.title} />
                <DescValue
                  keyValue="Date created"
                  value={dayjs(ConnectedContent.date_created).format(
                    "DD MMM YYYY"
                  )}
                />
              </div>

              <div className="tw-flex tw-gap-4  tw-ml-auto tw-items-center">
                <div className=" tw-flex tw-duration-200 tw-transition-all tw-gap-2">
                  <Button onClick={openSelectContentDrawer}>Change</Button>
                  <Button
                    danger
                    type="primary"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      setConnectedContent(undefined);
                    }}
                  ></Button>
                </div>
              </div>
            </>
          ) : (
            <div className=" tw-h-20 tw-flex tw-items-center tw-justify-center tw-flex-col tw-gap-2  tw-w-full">
              please select content
              <Button onClick={openSelectContentDrawer}>select content</Button>
            </div>
          )}
        </div>

        {/* action Button */}
        <div className=" tw-flex tw-gap-2 tw-mt-6">
          <Button type="text" onClick={onCancelEdit}>
            Cancel
          </Button>
          <Button
            htmlType="submit"
            block
            loading={Loading}
            type="primary"
            disabled={!ConnectedContent}
          >
            {isEditing ? "Update" : "Create new"}
          </Button>
        </div>
      </Form>

      {/* nested drawer */}

      <SelectContentDrawer />
    </Drawer>
  );
};

export default NewFooterDrawer;
