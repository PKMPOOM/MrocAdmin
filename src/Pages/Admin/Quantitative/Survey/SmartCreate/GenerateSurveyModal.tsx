import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { createNewSurveyFromGenerted } from "./api";
import {
  GenQuestionList,
  SubmitPayload,
  SurveyStatusSelectOptions,
} from "./type";

type Props = {
  questionData: GenQuestionList[];
  topic: string;
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
};

type formSchema = {
  name: string;
  surveyStatus: string;
};

const GenerateSurveyModal = ({
  questionData,
  topic,
  modalOpen,
  setModalOpen,
}: Props) => {
  const [IsLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (topic !== "") {
      form.setFieldValue("name", topic);
    }

    return () => {
      form.resetFields();
    };
  }, [topic]);

  const onCancel = () => {
    setModalOpen(false);
    setIsLoading(false);
    form.resetFields();
  };

  const onCreate = async (e: formSchema) => {
    setIsLoading(true);

    const formattedQuestionData: GenQuestionList[] = questionData.map(
      (item, Qindex) => {
        return {
          label: item.label,
          answer: item.answer.map((item, Andex) => {
            const newAnswerData = [
              {
                id: `id-${Qindex}${Andex}`,
                type: "paragraph",
                props: {
                  textColor: "default",
                  backgroundColor: "default",
                  textAlignment: "left",
                },
                content: [{ type: "text", text: item, styles: {} }],
                children: [],
              },
            ];

            return JSON.stringify(newAnswerData);
          }),
          type: item.type,
        };
      }
    );

    // api call return survey id
    const payload: SubmitPayload = {
      name: e.name,
      status: e.surveyStatus,
      questionData: formattedQuestionData,
    };

    const response = await createNewSurveyFromGenerted(payload);

    if (response.message !== "Success") {
      setIsLoading(false);
      return;
    } else {
      setIsLoading(false);
      onCancel();
      return (window.location.href = `/admin/Quantitative/Survey/${response.id}?tab=build&edit=questions`);
    }
  };

  return (
    <Modal
      title={"Create new Survey"}
      open={modalOpen}
      footer={null}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onCreate}
        requiredMark={"optional"}
        initialValues={{
          name: topic,
          surveyStatus: "Draft",
        }}
      >
        <Form.Item
          label="Survey name"
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-6 tw-items-end">
          <Form.Item
            style={{ marginBottom: 0 }}
            name={"surveyStatus"}
            label="Set status"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              style={{
                width: "200px",
              }}
              options={SurveyStatusSelectOptions}
            />
          </Form.Item>
          <Button
            onClick={onCancel}
            style={{
              marginLeft: "auto",
            }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={IsLoading}>
            <span className=" tw-px-4">Create</span>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default GenerateSurveyModal;
