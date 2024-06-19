import { Button, Form, Input, Modal, Select, Upload, UploadProps } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  UploadOutlined,
  LoadingOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useAuth } from "../../../Context/Auth/AuthContext";
import { CharitySettingsContext } from "../../../Pages/Admin/EngagementTools/ManageCharities/ManageCharities";
import { useThemeContext } from "../../../Context/Theme/ApplicationProvider";
const { Dragger } = Upload;

const formItemStyle = {
  marginBottom: 8,
  gap: 8,
};

const CharityModal = React.memo(() => {
  const [charityform] = Form.useForm();
  const { Axios } = useAuth();
  const { token } = useThemeContext();
  const {
    IsEditing,
    setIsEditing,
    isModalOpen,
    setIsModalOpen,
    ActiveCharity,
    setActiveCharity,
    refetchCharityList,
  } = useContext(CharitySettingsContext);

  const [Error, setError] = useState<string | null>(null);
  const [Uploading, setUploading] = useState(false);
  const [Url, setIconURL] = useState<string | undefined>(undefined);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    if (ActiveCharity) {
      setIsEditing(true);
      charityform.setFieldsValue({
        charity_name: ActiveCharity.name,
        charity_contact: ActiveCharity.email,
        charity_email: ActiveCharity.email,
        charity_address: ActiveCharity?.address || "",
        charity_fax: ActiveCharity?.fax || "",
        charity_phone: ActiveCharity?.phone || "",
        charity_region: ActiveCharity?.region || "",
        charity_website: ActiveCharity?.website || "",
      });
    }
    if (ActiveCharity?.image_url) {
      setIconURL(ActiveCharity?.image_url);
    }
  }, [ActiveCharity]);

  const onCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setIconURL(undefined);
    setActiveCharity(undefined);
    charityform.resetFields();
  };

  type FormSubmit = {
    charity_address: string;
    charity_contact: string;
    charity_email: string;
    charity_fax?: string;
    charity_name?: string;
    charity_phone?: string;
    charity_region?: string;
    charity_website?: string;
  };

  const createNewCharity = async (data: FormSubmit) => {
    setLoading(true);
    await Axios.post("/charity", { ...data }).then(() => {
      onCancel();
      setLoading(false);
      refetchCharityList();
    });
  };

  const editCharity = async (data: FormSubmit) => {
    setLoading(true);
    await Axios.put(`/charity/${ActiveCharity?.id}`, { ...data }).then(() => {
      onCancel();
      setLoading(false);
      refetchCharityList();
    });
  };

  const onFinish = async (e: FormSubmit) => {
    if (IsEditing === true) {
      editCharity(e);
    } else if (IsEditing === false) {
      createNewCharity(e);
    }
  };

  const props: UploadProps = {
    name: "file",
    maxCount: 1,
    showUploadList: false,
    beforeUpload(file) {
      if (!file.type.includes("image/")) {
        setError("Please upload image file");
        console.log("error");
        return false;
      }

      // Check file size
      const fileSize = file.size / 1024 / 1024; // in MB
      if (fileSize > 2) {
        setError("Maximum file size is 2 MB");
        console.log("error");
        return false;
      }

      // Save file to state
      return true;
    },
    action: `${
      import.meta.env.VITE_API_URL
    }/charity/${ActiveCharity?.id}/upload`,
    onChange(info) {
      setError(null);
      console.log(info);
      setUploading(true);
      if (info.file.status === "uploading") {
        console.log("uploading");
      }
      if (info.file.status === "done") {
        console.log(info);
        setUploading(false);
        setIconURL(info.file.response.Url);
        // refetchRewardList();
      } else if (info.file.status === "error") {
        console.log({ error: info.file.response.error });
        setUploading(false);
        setError(info.file.response.error);
        // refetchRewardList();
      }
    },
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Modal
      width={700}
      title={"Create New Charity"}
      open={isModalOpen}
      footer={null}
      onCancel={onCancel}
    >
      <Form
        autoComplete="off"
        form={charityform}
        onFinish={onFinish}
        layout="vertical"
        requiredMark={"optional"}
      >
        <Form.Item
          name={"charity_name"}
          style={formItemStyle}
          label="Charity name"
          rules={[
            {
              required: true,
              message: "Charity name cannot be blank",
            },
          ]}
        >
          <Input placeholder="Charity name" />
        </Form.Item>

        <Form.Item
          name={"charity_contact"}
          style={formItemStyle}
          label="Contact"
          rules={[
            {
              required: true,
              message: "Charity contact cannot be blank",
            },
          ]}
        >
          <Input placeholder="Charity contact" autoComplete="given-name" />
        </Form.Item>

        <Form.Item
          name={"charity_email"}
          style={formItemStyle}
          label="Email"
          rules={[
            {
              required: true,
              message: "Charity email cannot be blank",
            },
          ]}
        >
          <Input placeholder="Charity email" />
        </Form.Item>

        <Form.Item name={"charity_fax"} style={formItemStyle} label="Fax">
          <Input placeholder="Charity fax" />
        </Form.Item>
        <Form.Item name={"charity_phone"} style={formItemStyle} label="Phone">
          <Input placeholder="Charity phone" />
        </Form.Item>

        <Form.Item
          name={"charity_website"}
          style={formItemStyle}
          label="Website"
        >
          <Input placeholder="Charity website" />
        </Form.Item>
        <Form.Item
          name={"charity_address"}
          style={formItemStyle}
          label="Address"
        >
          <Input placeholder="Charity address" autoComplete="street-address " />
        </Form.Item>

        <Form.Item name={"charity_region"} style={formItemStyle} label="Region">
          <Select
            options={[
              {
                label: "Us",
                value: "Us",
              },
              {
                label: "Eu",
                value: "Eu",
              },
              {
                label: "Sea",
                value: "Sea",
              },
            ]}
          />
        </Form.Item>

        {IsEditing && (
          <Form.Item label="Icon">
            <Form.Item
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              <Dragger {...props} disabled={Uploading}>
                <div className="   tw-flex tw-h-24 tw-flex-col tw-items-center tw-justify-center tw-gap-1 ">
                  {Uploading ? (
                    <div className=" tw-absolute tw-inset-0 tw-z-10 tw-flex tw-items-center tw-justify-center bg-white/40">
                      <LoadingOutlined
                        style={{ color: token.colorPrimary, fontSize: 50 }}
                      />
                    </div>
                  ) : null}

                  {Url && !Error ? (
                    <img
                      style={{
                        borderRadius: "8px",
                        aspectRatio: "1/1",
                        overflow: "hidden",
                      }}
                      src={Url}
                    />
                  ) : (
                    <>
                      {Error ? (
                        <ExclamationCircleFilled
                          style={{
                            color: token.colorErrorText,
                            fontSize: 24,
                          }}
                        />
                      ) : (
                        <UploadOutlined
                          style={{
                            color: token.colorPrimary,
                            fontSize: 24,
                          }}
                        />
                      )}

                      {Error ? (
                        <>
                          <p style={{ color: token.colorErrorText }}>{Error}</p>
                          <p style={{ color: token.colorErrorText }}>
                            try upload different file
                          </p>
                        </>
                      ) : (
                        <p>Add Charity icon</p>
                      )}
                    </>
                  )}
                </div>
              </Dragger>
            </Form.Item>
          </Form.Item>
        )}

        <div className=" tw-flex tw-justify-end tw-gap-2 tw-mt-4">
          <Button
            onClick={() => {
              onCancel();
            }}
            type="text"
          >
            cancel
          </Button>

          {IsEditing ? (
            <Button htmlType="submit" type="primary" loading={Loading}>
              Save
            </Button>
          ) : (
            <Button type="primary" htmlType="submit" loading={Loading}>
              Create
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
});

export default CharityModal;
