import { Button, Divider, Drawer, Form, Input, Select, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { SocialLinkPageContext } from "../SocialLinksTable";
import { UploadProps } from "antd/es/upload";
import { createNewSocialLink, updateSocialLink } from "../api";
import { useAuth } from "~/context/Auth/AuthContext";
import { normFile } from "~/utils/normFile";
import { UploadAntd } from "~/component/Global/Utils/UploadAntd";
const formData = new FormData();

const { Text } = Typography;

type formSchema = {
  title: string;
  status: "draft" | "active";
  url: string;
  icon: any;
  alt_text?: string;
};

const NewContentDrawer = () => {
  const [formInstance] = Form.useForm<formSchema>();
  const [Loading, setLoading] = useState(false);
  const { notificationApi } = useAuth();

  const {
    editorDrawerOpen,
    seteditorDrawerOpen,
    refetch,
    EditingSocialLink,
    setEditingSocialLink,
  } = useContext(SocialLinkPageContext);

  const isEditing = EditingSocialLink !== undefined;

  useEffect(() => {
    // init form state with basic data
    formInstance.setFieldsValue({
      title: "new content",
      status: "draft",
    });
    if (isEditing) {
      formInstance.setFieldsValue({
        title: EditingSocialLink.title,
        status: EditingSocialLink.status,
        url: EditingSocialLink.content?.url,
        icon: EditingSocialLink.content?.icon,
        alt_text: EditingSocialLink.content?.alt_text,
        // icon are handle by state of AntdUpload props
      });
    }
  }, [EditingSocialLink]);

  const onCancelEdit = () => {
    formData.delete("title");
    formData.delete("status");
    formData.delete("url");
    formData.delete("icon");
    formData.delete("socialLinkID");
    formData.delete("alt_text");
    seteditorDrawerOpen(false);
    setEditingSocialLink(undefined);
    formInstance.resetFields();
    setLoading(false);
    refetch();
  };

  const onFinish = async (event: formSchema) => {
    setLoading(true);

    const { title, status, url, alt_text, icon } = event;

    formData.append("title", title);
    formData.append("status", status);
    formData.append("url", url);

    if (alt_text) {
      formData.append("alt_text", alt_text);
    }

    if (icon[0]?.originFileObj) {
      formData.append("icon", icon[0].originFileObj);
      const socialLinkId = EditingSocialLink?.content?.id;
      if (socialLinkId) {
        formData.append("socialLinkID", socialLinkId);
      }
    }

    try {
      if (isEditing) {
        // if we are editing an existing content
        await updateSocialLink(EditingSocialLink.id, formData);

        notificationApi.success({
          message: "Success",
          description: "Social link updated successfully",
        });
      } else {
        // if we are creating a new content
        await createNewSocialLink(formData);

        notificationApi.success({
          message: "Success",
          description: "Social link created successfully",
        });
      }
      onCancelEdit();
    } catch (error) {
      notificationApi.error({
        message: "Error",
        description: "Something went wrong",
      });
      formData.delete("title");
      formData.delete("status");
      formData.delete("url");
      formData.delete("icon");
      formData.delete("socialLinkID");
      formData.delete("alt_text");

      setLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        notificationApi?.error({
          message: "You can only upload JPG/PNG file!",
        });
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        notificationApi?.error({
          message: "Image must smaller than 2MB!",
        });
        return false;
      }

      return isJpgOrPng && isLt2M;
    },
  };

  const socialIconRef = Form.useWatch("icon", formInstance);

  return (
    <Drawer
      title={isEditing ? "Edit content" : "New content"}
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
        initialValues={{
          title: "new content",
          status: "draft",
        }}
      >
        <Form.Item<formSchema>
          label="Title"
          name={"title"}
          style={{
            marginBottom: "8px",
          }}
          rules={[
            {
              required: true,
              message: "Please enter content title",
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
          <Text strong>Social Icon</Text>
        </Divider>

        <div className=" tw-flex tw-gap-4 tw-w-full  ">
          <div className=" ">
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please upload social icon",
                },
              ]}
              name="icon"
              label="Icon"
              getValueFromEvent={normFile}
            >
              <UploadAntd
                style={{
                  width: "150px",
                }}
                className="tw-relative "
                form={formInstance}
                name={"main_logo"}
                imageURL={socialIconRef}
                customUploadProps={uploadProps}
              />
            </Form.Item>
          </div>
          <div className=" tw-flex tw-flex-col tw-gap-2  tw-w-full">
            <Form.Item
              label="Url"
              name={"url"}
              style={{
                marginBottom: "8px",
              }}
              rules={[
                {
                  required: true,
                  message: "Url are required",
                },
              ]}
            >
              <Input placeholder="Url" />
            </Form.Item>

            <Form.Item
              label="Alt text"
              name={"alt_text"}
              style={{
                marginBottom: "8px",
              }}
            >
              <Input.TextArea placeholder="alt text" />
            </Form.Item>
          </div>
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
            // disabled={!ConnectedContent}
          >
            {isEditing ? "Update" : "Create new content"}
          </Button>
        </div>
      </Form>

      {/* nested drawer */}
    </Drawer>
  );
};

export default NewContentDrawer;
