import { Button, Checkbox, Form, Input, Modal, Space } from "antd";
import { useState } from "react";
import { FormSchema, createWhitelist } from "./api";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  refetchFn: () => void;
};

const WhiteListModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const [form] = Form.useForm<FormSchema>();
  const [Loading, setLoading] = useState(false);

  const onSubmit = async (values: FormSchema) => {
    setLoading(true);
    await createWhitelist(values);
    onCancel();
  };

  const onCancel = () => {
    setIsModalOpen(false);
    setLoading(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Create New Whitelist"
      open={isModalOpen}
      footer={null}
      onCancel={onCancel}
    >
      <Form
        name="create_new_discussion"
        form={form}
        layout="vertical"
        requiredMark="optional"
        onFinish={onSubmit}
        initialValues={{
          name: "New Discussion",
        }}
      >
        <Form.Item<FormSchema>
          label="Site url"
          name="url"
          rules={[
            {
              required: true,
              message: "required",
            },
            {
              pattern: /^(http:\/\/|https:\/\/)(?!.*\/$).*$/,
              message: "Must begin with http:// or https:// and not end in a /",
            },
          ]}
        >
          <Input placeholder="Site url" />
        </Form.Item>
        <Form.Item<FormSchema>
          label="Allowed methods"
          name="methods"
          rules={[
            {
              required: true,
              message: "required",
            },
          ]}
        >
          <Checkbox.Group>
            <Space direction="vertical">
              <Checkbox value="GET">GET</Checkbox>
              <Checkbox value="POST">POST</Checkbox>
              <Checkbox value="PUT">PUT</Checkbox>
              <Checkbox value="DELETE">DELETE</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>
        <div className=" tw-flex tw-flex-row tw-gap-2 tw-mt-4 tw-justify-between">
          <div className=" tw-ml-auto tw-flex tw-gap-2">
            <Button onClick={onCancel} type="text" htmlType="reset">
              Cancel
            </Button>
            <Button htmlType="submit" type="primary" loading={Loading}>
              Create
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default WhiteListModal;
