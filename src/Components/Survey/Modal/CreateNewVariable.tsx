import { Button, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import { useState, useContext } from "react";
import { newVarModalContext } from "../../../Pages/Admin/Quantitative/Survey/SurveyEditor/Tab_Build/Subtab_Variable/Subtab_Variable";

export default function CreateNewVariable() {
  const [Loading, setLoading] = useState(false);
  const { IsModalOpen, setIsModalOpen } = useContext(newVarModalContext);
  const [from] = Form.useForm();
  const now = dayjs();

  type stateType = {
    name: string;
    value: string;
    type: string;
    date_create: dayjs.Dayjs;
  };

  const [Var, setVar] = useState<stateType>({
    name: "",
    value: "",
    type: "number",
    date_create: now,
  });

  const onSubmit = async (e: any) => {
    console.log(e);
    setLoading(false);
  };

  return (
    <Modal
      title="New variable"
      open={IsModalOpen}
      footer={null}
      onCancel={() => {
        setIsModalOpen(false);
      }}
    >
      <Form form={from} onFinish={onSubmit} layout="vertical">
        <Form.Item name={"name"} style={{ marginBottom: 8 }} label=" name">
          <Input
            onChange={(e) => {
              setVar({ ...Var, name: e.target.value });
            }}
            name="Variable name"
            placeholder="Variable name"
          />
        </Form.Item>
        <Form.Item
          name={"type"}
          style={{ marginBottom: 8 }}
          label="Variable type"
        >
          <Select
            options={[
              {
                label: "Text",
                value: "text",
              },
              {
                label: "Number",
                value: "Number",
              },
            ]}
            defaultValue={Var.type}
          />
        </Form.Item>
        <Form.Item name={"value"} label=" value">
          <Input.TextArea
            onChange={(e) => {
              setVar({ ...Var, value: e.target.value });
            }}
            name="Variable value"
            placeholder="Variable value"
          />
        </Form.Item>
        <div className="tw-flex tw-flex-row tw-gap-2 tw-justify-end">
          <Button type="text">Cancel</Button>
          <Button
            htmlType="submit"
            loading={Loading}
            // onClick={() => {
            //   onSubmit();
            // }}
            type="primary"
          >
            Create
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
