import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  InputNumber,
  Select,
  Tooltip,
  Tour,
  TourProps,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";
import GenerateSurveyModal from "./GenerateSurveyModal";
import GenerativeQuestionPreview from "./GenerativeQuestionPreview";
import { useGenerativeSurvey } from "~/src/Hooks/Generative";
const { Title } = Typography;

type SubmitType = "get-template" | "create-new";

type formSchema = {
  instruction: string;
  model: string;
  Qamount: number;
};

const SmartCreatePage = () => {
  const [SubmitType, setSubmitType] = useState<SubmitType>("get-template");
  const [Topic, setTopic] = useState("Customer experience");
  const [IsCreateSurveyModalOpen, setIsCreateSurveyModalOpen] = useState(false);
  const [TourOpen, setTourOpen] = useState(false);
  const [form] = Form.useForm();

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const steps: TourProps["steps"] = [
    {
      title: "Select AI model",
      description: "Choose the AI model you want to use.",
      target: () => ref1.current,
      style: {
        width: "300px",
      },
    },
    {
      title: "Question amount",
      description: "Select the number of questions you want to generate.",
      target: () => ref2.current,
      style: {
        width: "500px",
      },
    },
    {
      title: "Make a wish!",
      description: "Click the button to start generating questions.",
      target: () => ref3.current,
    },
    {
      title: "Use this survey",
      description:
        "Once you are happy with the questions, click here to build the survey using the generated questions.",
      cover: (
        <img
          alt="tour.png"
          src="https://gfuwezskflleiadzwihe.supabase.co/storage/v1/object/sign/system/tourImg1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzeXN0ZW0vdG91ckltZzEucG5nIiwiaWF0IjoxNzE5MjkxMjc2LCJleHAiOjE3MjcwNjcyNzZ9.7TcvXmFwcMduYP29krO8_nnjX7eMimmDPzSK4nqKyPs&t=2024-06-25T04%3A54%3A38.028Z"
        />
      ),
      target: () => ref4.current,
    },
  ];

  const { useEventSource } = useGenerativeSurvey();

  const {
    IsStreaming,
    StartEventSource,
    isStreamingDone,
    parsedData,
    rawData,
  } = useEventSource();

  useEffect(() => {
    localStorage.getItem("tour") === "true"
      ? setTourOpen(false)
      : setTourOpen(true);
  }, []);

  const onSubmit = async ({ Qamount, model }: formSchema) => {
    switch (SubmitType) {
      case "create-new":
        const Url = `${
          import.meta.env.VITE_API_URL
        }/generative/streaming/${Topic.replace(
          / /g,
          "_"
        )}?Qamount=${Qamount}&model=${model}`;
        await StartEventSource(Url);
        break;

      default:
        break;
    }
  };

  const onCreateNewSurvey = () => {
    setIsCreateSurveyModalOpen(true);
  };

  return (
    <div className=" tw-px-6 tw-flex tw-flex-col tw-gap-4 tw-h-[calc(100vh-64px)] tw-relative  ">
      <div className="tw-flex tw-flex-row tw-items-start tw-justify-start tw-gap-2  ">
        <Title level={3}>Generative create</Title>
        <Tooltip title="Help">
          <Button
            shape="circle"
            icon={<QuestionCircleOutlined />}
            onClick={() => {
              setTourOpen(true);
            }}
            type="dashed"
          ></Button>
        </Tooltip>
      </div>
      <div className=" tw-flex tw-flex-row tw-gap-4  tw-h-full tw-max-w-full tw-justify-center ">
        <div className="  tw-flex tw-flex-col tw-w-4/5 tw-gap-2 tw-items-center  tw-h-[calc(100vh-125px)] tw-p-2 tw-overflow-auto">
          <div className="   tw-flex tw-flex-wrap tw-flex-col tw-gap-2 tw-w-full ">
            <div
              key={"pages.id"}
              style={{
                position: "relative",
                backgroundColor: "white",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                outline: "1px solid #DFDFDF",
                borderRadius: "4px",
                marginBottom: "24px",
              }}
            >
              <Form<formSchema>
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                requiredMark={"optional"}
                initialValues={{
                  model: "gpt-4o-mini",
                  Qamount: 3,
                }}
              >
                <div className=" tw-flex tw-flex-col tw-justify-between tw-items-start tw-mb-4">
                  <div className=" tw-flex tw-gap-2 tw-w-full ">
                    <div ref={ref1}>
                      <Form.Item<formSchema>
                        label={"AI model"}
                        name={"model"}
                        rules={[
                          {
                            required: true,
                            message: "Please select a model",
                          },
                        ]}
                      >
                        <Select
                          options={[
                            { label: "GPT-3.5 turbo", value: "gpt-4o-mini" },
                            { label: "GPT-4o", value: "gpt-4o" },
                          ]}
                        />
                      </Form.Item>
                    </div>
                    <div ref={ref2}>
                      <Form.Item<formSchema>
                        label={"Question amount"}
                        name={"Qamount"}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <InputNumber />
                      </Form.Item>
                    </div>

                    <Button
                      ref={ref3}
                      style={{ marginLeft: "auto" }}
                      onClick={() => {
                        form.validateFields().then(() => {
                          setSubmitType("create-new");
                        });
                      }}
                      htmlType="submit"
                      type="primary"
                    >
                      Start Generate
                    </Button>
                  </div>
                  <Title
                    level={5}
                    editable={{
                      onChange: (e) => {
                        setTopic(e);
                      },
                    }}
                  >
                    {Topic}
                  </Title>
                </div>
              </Form>

              {parsedData.map((question, qIndex) => {
                return (
                  <div key={qIndex}>
                    <GenerativeQuestionPreview
                      choices={question.answer}
                      label={question.label}
                      type={question.type}
                    />
                  </div>
                );
              })}

              {rawData
                .replace(/[{}",`]/g, "")
                .replace(/:/g, "")
                .replace(/\[/g, "")
                .replace(/\]/g, "")
                .replace("label", "")}

              {isStreamingDone && !IsStreaming && (
                <div className=" tw-flex tw-my-3 tw-w-full tw-justify-center">
                  <Button ref={ref4} onClick={onCreateNewSurvey} type="primary">
                    Use this survey
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Tour
        open={TourOpen}
        onClose={() => {
          localStorage.setItem("tour", "true");
          setTourOpen(false);
        }}
        steps={steps}
      />

      <GenerateSurveyModal
        questionData={parsedData}
        topic={Topic}
        modalOpen={IsCreateSurveyModalOpen}
        setModalOpen={setIsCreateSurveyModalOpen}
      />
    </div>
  );
};

export default SmartCreatePage;
