import { Checkbox, Col, Form, Input, Radio, Row, Select, Upload } from "antd";
import { useAuth } from "../../../Context/Auth/AuthContext";
import { useState } from "react";
import type { UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useThemeContext } from "../../../Context/Theme/ApplicationProvider";

const { Dragger } = Upload;

const FormItemStype = {
  marginBottom: 8,
};
function Create_Discussion_Form() {
  const { accessToken } = useAuth();
  const { token } = useThemeContext();
  const [File, setFile] = useState<File | undefined>(undefined);

  const props: UploadProps = {
    name: "file",
    maxCount: 1,
    customRequest(options) {
      setFile(options.file as File);
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

  return (
    <div className=" tw-flex tw-gap-4">
      <div className=" tw-w-5/12">
        <Form.Item
          name={"name"}
          rules={[
            {
              required: true,
              message: "Discussion name cannot be blank",
            },
          ]}
          style={FormItemStype}
          label="Name"
        >
          <Input placeholder="Discussion name" />
        </Form.Item>

        <Form.Item label="Image">
          <Form.Item
            name="dragger"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <Dragger {...props}>
              <div className="   tw-flex tw-flex-col tw-gap-1 tw-justify-center tw-items-center tw-h-40 ">
                {File ? (
                  <img
                    style={{
                      position: "absolute",
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                    src={URL.createObjectURL(File)}
                  />
                ) : (
                  <>
                    <UploadOutlined
                      style={{ color: token.colorPrimary, fontSize: 24 }}
                    />
                    <p>Add discussion image</p>
                  </>
                )}
              </div>
            </Dragger>
          </Form.Item>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={"type"}
              rules={[
                {
                  required: true,
                  message: "Discussion name cannot be blank",
                },
              ]}
              style={FormItemStype}
              label="Discussion type"
            >
              <Select
                options={[
                  {
                    label: "Nested thread",
                    value: "nested",
                  },
                  {
                    label: "Bulletin thread",
                    value: "bulletin",
                  },
                  {
                    label: "1 on 1 thread",
                    value: "dairy",
                  },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name={"category"} style={FormItemStype} label="Category">
              <Select
                placeholder="Select category"
                options={[
                  {
                    label: "Public",
                    value: "public",
                  },
                  {
                    label: "Test2",
                    value: "test2",
                  },
                  {
                    label: "Create New",
                    value: "Create New",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name={"blinded"} style={FormItemStype}>
          <Checkbox>
            <p className=" tw-flex tw-gap-1 tw-items-center">
              Blinded discussion
            </p>
          </Checkbox>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={"show_avatar"}
              rules={[
                {
                  required: true,
                  message: "Please select 1 option",
                },
              ]}
              style={FormItemStype}
              label="Show avatar"
            >
              <Radio.Group>
                <div className=" tw-flex tw-flex-col tw-gap-1">
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={"display_name"}
              rules={[
                {
                  required: true,
                  message: "Discussion name cannot be blank",
                },
              ]}
              style={FormItemStype}
              label="Display name"
            >
              <Radio.Group>
                <div className=" tw-flex tw-flex-col tw-gap-1">
                  <Radio value={"user_name"}>Username</Radio>
                  <Radio value={"real_name"}>Real name</Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={"send_email"}
              rules={[
                {
                  required: true,
                  message: "Please select 1 option",
                },
              ]}
              style={FormItemStype}
              label="Send automatic email"
            >
              <Radio.Group>
                <div className=" tw-flex tw-flex-col tw-gap-1">
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={"edit_option"}
              rules={[
                {
                  required: true,
                  message: "Discussion name cannot be blank",
                },
              ]}
              style={FormItemStype}
              label="Show Edit Button"
            >
              <Radio.Group>
                <div className=" tw-flex tw-flex-col tw-gap-1">
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className=" tw-w-7/12">
        <Form.Item
          name={"start_thread"}
          rules={[
            {
              required: true,
              message: "Discussion starter cannot be blank ",
            },
          ]}
          style={FormItemStype}
          label="Start discussion"
        >
          <Input.TextArea
            placeholder="Start conversation"
            autoSize={{ minRows: 19, maxRows: 30 }}
          />
        </Form.Item>
      </div>
    </div>
  );
}

export default Create_Discussion_Form;
