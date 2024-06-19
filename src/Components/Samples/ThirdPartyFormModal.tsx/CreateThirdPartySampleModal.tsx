import { Button, Form, Input, Modal } from "antd";
import {
  useCreateThirdPartySample,
  useGetThirdPartySampleData,
  useUpdateThirdPartySample,
} from "../../../Pages/Admin/Quantitative/Samples/api";
import { useAuth } from "../../../Context/Auth/AuthContext";
import { useEffect } from "react";

type ModalProps = {
  ModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ActiveSamplesId: string | undefined;
  setActiveSamplesId: React.Dispatch<React.SetStateAction<string | undefined>>;
  refetchFn: () => void;
};

type FormSchema = {
  name: string;
  Url: string;
  APIKey: string;
};

function CreateThirdPartySampleModal({
  ModalOpen,
  setModalOpen,
  ActiveSamplesId,
  refetchFn,
  setActiveSamplesId,
}: ModalProps) {
  const { notificationApi } = useAuth();
  const [form] = Form.useForm<FormSchema>();
  const { data: sampleData } = useGetThirdPartySampleData(ActiveSamplesId);

  const isEditing = ActiveSamplesId !== undefined;

  useEffect(() => {
    if (sampleData) {
      form.setFieldsValue({
        name: sampleData.SampleName,
        Url: sampleData.Url,
        APIKey: sampleData.APIKey,
      });
    }
  }, [sampleData]);

  const onCancel = () => {
    setModalOpen(false);
    setActiveSamplesId(undefined);
    form.resetFields();
  };

  const onFinish = async (values: FormSchema) => {
    try {
      if (isEditing) {
        await useUpdateThirdPartySample(ActiveSamplesId, values);
      } else {
        await useCreateThirdPartySample(values);
      }
      notificationApi.success({
        message: " Success",
        description: "Create Third Party Sample Success",
      });
      setModalOpen(false);
      form.resetFields();
      setActiveSamplesId(undefined);
      refetchFn();
    } catch (error) {
      notificationApi.error({
        message: " Failed",
        description: "Create Third Party Sample Failed",
      });
    }
  };

  return (
    <Modal onCancel={onCancel} open={ModalOpen} footer={null}>
      <Form
        layout="vertical"
        form={form}
        requiredMark="optional"
        onFinish={onFinish}
      >
        <Form.Item<FormSchema>
          label={"Name"}
          style={{
            marginBottom: 8,
          }}
          name={"name"}
          rules={[
            {
              required: true,
              message: "Please input name",
            },
          ]}
        >
          <Input placeholder="Sample name" />
        </Form.Item>
        <Form.Item<FormSchema>
          label={"URL/URI"}
          style={{
            marginBottom: 8,
          }}
          name={"Url"}
          rules={[
            {
              required: true,
              message: "Please input URL/URI",
            },
          ]}
        >
          <Input placeholder="Sample URL/URI" />
        </Form.Item>
        <Form.Item<FormSchema>
          label={"API Key"}
          style={{
            marginBottom: 8,
          }}
          name={"APIKey"}
          rules={[
            {
              required: true,
              message: "Please input API Key",
            },
          ]}
        >
          <Input placeholder="API key" />
        </Form.Item>
        <div className=" tw-flex tw-gap-2 tw-justify-end">
          <Button onClick={onCancel} type="text">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default CreateThirdPartySampleModal;
