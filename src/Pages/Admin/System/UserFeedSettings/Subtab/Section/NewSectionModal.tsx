import { Button, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { useAuth } from "../../../../../../Context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

type Props = {
  CreateNewSectionModalOpen: boolean;
  setCreateNewSectionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewSectionModal = ({
  CreateNewSectionModalOpen,
  setCreateNewSectionModalOpen,
}: Props) => {
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { Axios, notificationApi } = useAuth();
  const [form] = Form.useForm();

  const onSubmit = async ({ section_name }: any) => {
    setLoading(true);
    try {
      const response = await Axios.post("feed_settings/section", {
        section_name,
      });
      notificationApi.success({
        message: "New section created",
      });
      navigate(`section/${response.data.sectionID}`);
      setCreateNewSectionModalOpen(false);
    } catch (error) {
      notificationApi.error({
        message: "Error creating new section",
      });
    }

    form.setFieldsValue({
      section_name: "",
    });
    setLoading(true);
  };

  const onCancel = async () => {
    setCreateNewSectionModalOpen(false);
  };

  return (
    <Modal
      title="Section Name"
      footer={null}
      onCancel={onCancel}
      open={CreateNewSectionModalOpen}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        onFinish={(e) => onSubmit(e)}
      >
        <Form.Item
          label={"Section name"}
          rules={[
            {
              required: true,
              message: "Section name cannot be blank",
            },
            {
              max: 25,
              message: "Maximum 25 characters",
            },
            {
              pattern: /^[A-Za-z0-9\s]*$/g,
              message: "asdsa",
            },
            {
              min: 4,
              message: "Minimun 4 characters",
            },
          ]}
          name={"section_name"}
        >
          <Input placeholder="Section name" />
        </Form.Item>
        <div className=" tw-justify-end tw-flex tw-gap-2">
          <Button type="text">cancel</Button>
          <Button loading={Loading} htmlType="submit" type="primary">
            Create
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default NewSectionModal;
