import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Upload,
  UploadProps,
  //   Upload,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  UploadOutlined,
  LoadingOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useAuth } from "../../../Context/Auth/AuthContext";
import { RewardSettingsContext } from "../../../Pages/Admin/EngagementTools/RewardSettings/RewardSettings";
import { useThemeContext } from "../../../Context/Theme/ApplicationProvider";
const { Dragger } = Upload;

const formItemStyle = {
  marginBottom: 8,
  gap: 8,
};

const RewardModal = React.memo(() => {
  const [rewardform] = Form.useForm();
  const { Axios } = useAuth();
  const { token } = useThemeContext();

  const {
    IsEditing,
    setIsEditing,
    isModalOpen,
    setIsModalOpen,
    ActiveReward,
    refetchRewardList,
    setActiveReward,
  } = useContext(RewardSettingsContext);

  // const [IconURL, setIconURL] = useState<string | undefined>(undefined);
  const [Error, setError] = useState<string | null>(null);
  const [Uploading, setUploading] = useState(false);
  const [Url, setIconURL] = useState<string | undefined>(undefined);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    if (ActiveReward) {
      setIsEditing(true);
      rewardform.setFieldsValue({
        reward_velue: ActiveReward.value,
        reward_name: ActiveReward.name,
      });
    }
    if (ActiveReward?.icon) {
      setIconURL(ActiveReward?.icon);
    }
  }, [ActiveReward]);

  const onCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setIconURL(undefined);
    setActiveReward(undefined);
    rewardform.resetFields();
  };

  type FormSubmit = {
    reward_name: string;
    reward_velue: number;
  };

  const createNewGoal = async (e: FormSubmit) => {
    setLoading(true);
    await Axios.post("/reward", {
      name: e.reward_name,
      value: e.reward_velue,
    }).then(() => {
      onCancel();
      setLoading(false);
      refetchRewardList();
    });
  };

  const editGoal = async (e: FormSubmit) => {
    setLoading(true);
    await Axios.put(`/reward/${ActiveReward?.id}`, {
      name: e.reward_name,
      value: e.reward_velue,
    }).then(() => {
      onCancel();
      setLoading(false);
      refetchRewardList();
    });
  };

  const onFinish = async (e: FormSubmit) => {
    if (IsEditing === true) {
      editGoal(e);
    } else if (IsEditing === false) {
      createNewGoal(e);
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
    action: `${import.meta.env.VITE_API_URL}/reward/${ActiveReward?.id}/upload`,
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
        refetchRewardList();
      } else if (info.file.status === "error") {
        console.log({ error: info.file.response.error });
        setUploading(false);
        setError(info.file.response.error);
        refetchRewardList();
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
      title={"Create New Reward"}
      open={isModalOpen}
      footer={null}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form
        form={rewardform}
        onFinish={onFinish}
        layout="vertical"
        requiredMark={"optional"}
      >
        <Form.Item
          name={"reward_name"}
          style={formItemStyle}
          label="Name"
          rules={[
            {
              required: true,
              message: "Reward name cannot be blank",
            },
          ]}
        >
          <Input placeholder="Reward name" />
        </Form.Item>
        <Form.Item
          name={"reward_velue"}
          style={formItemStyle}
          label="Value"
          rules={[
            {
              required: true,
              message: "Reward value cannot be blank",
            },
          ]}
          extra="*Amount of points user have to pay for this reward"
        >
          <InputNumber style={{ width: "100%" }} placeholder="Reward value" />
        </Form.Item>

        {IsEditing && (
          <Form.Item label="Icon">
            <Form.Item
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              <Dragger {...props} disabled={Uploading}>
                <div className="tw-flex tw-h-24 tw-flex-col tw-items-center tw-justify-center tw-gap-1 ">
                  {Uploading ? (
                    <div className="tw-absolute tw-inset-0 tw-z-10 tw-flex tw-items-center tw-justify-center tw-bg-white/40">
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
                        <p>Add Reward icon</p>
                      )}
                    </>
                  )}
                </div>
              </Dragger>
            </Form.Item>
          </Form.Item>
        )}

        <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
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

export default RewardModal;
