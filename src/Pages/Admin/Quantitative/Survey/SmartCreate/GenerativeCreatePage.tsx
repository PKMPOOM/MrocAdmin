import { Button, Form, InputNumber, Select, Typography } from "antd";
import { useState } from "react";
import z from "zod";
import GenerativeQuestionPreview from "./QuestionPreview";
const { Title } = Typography;

type SubmitType = "get-template" | "create-new";

const GenQuestionListSchema = z.object({
  label: z.string(),
  answer: z.array(z.string()),
  type: z.string(),
});

type GenQuestionList = z.infer<typeof GenQuestionListSchema>;

const SmartCreatePage = () => {
  const [SubmitType, setSubmitType] = useState<SubmitType>("get-template");
  const [parsedData, setParsedData] = useState<GenQuestionList[]>([]);
  const [Topic, setTopic] = useState("Customer experience");
  const [rawData, setRawData] = useState("");
  const [IsStreaming, setIsStreaming] = useState(false);
  const [isStreamingDone, setisStreamingDone] = useState(false);
  const [form] = Form.useForm();

  const generateStreamData = async (
    promptString: string,
    questionAmount: number,
    AImodel: string
  ) => {
    setRawData("");
    setParsedData([]);
    setIsStreaming(true);
    setisStreamingDone(false);

    const eventSource = new EventSource(
      `${
        import.meta.env.VITE_API_URL
      }/generative/streaming/${promptString.replace(
        / /g,
        "_"
      )}?Qamount=${questionAmount}&model=${AImodel}`,
      {
        withCredentials: true,
      }
    );

    let data = "";

    eventSource.onmessage = function (event) {
      if (event.data === "[DONE]") {
        setIsStreaming(false);
        setisStreamingDone(true);
        eventSource.close();
      } else {
        setRawData((prev) => prev + event.data);
        data += event.data;

        const endIndex = data.indexOf("}");
        if (endIndex !== -1) {
          const startIndex = data.indexOf("{");

          const jsonObject = data.slice(startIndex, endIndex + 1); // Extract the JSON object
          data = data.slice(endIndex + 1); // Remove the extracted JSON object from the accumulated data
          setRawData(data); // remove the extracted JSON object from the accumulated data state

          try {
            const parsedObject = JSON.parse(jsonObject);
            const { success, data } =
              GenQuestionListSchema.safeParse(parsedObject);

            if (success) {
              setParsedData((prev) => [...prev, data]);
            }
          } catch (err) {
            console.error("Error while parsing JSON:", err);
          }
        }
      }
    };

    eventSource.onerror = function () {
      eventSource.close();
      setisStreamingDone(true);
      setIsStreaming(false);
    };
  };

  const onSubmit = async ({ Qamount, model }: formSchema) => {
    switch (SubmitType) {
      case "create-new":
        await generateStreamData(Topic, Qamount, model);
        setRawData("");
        break;

      default:
        break;
    }
  };

  type formSchema = {
    instruction: string;
    model: string;
    Qamount: number;
  };
  return (
    <div className=" tw-px-6 tw-flex tw-flex-col tw-gap-4 tw-h-[calc(100vh-64px)] tw-relative  ">
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between ">
        <Title level={3}>Generative create</Title>
      </div>
      <div className=" tw-flex tw-flex-row tw-gap-4  tw-h-full tw-max-w-full tw-justify-center ">
        <div className="  tw-flex tw-flex-col tw-w-3/5 tw-gap-2 tw-items-center  tw-h-[calc(100vh-125px)] tw-p-2 tw-overflow-auto">
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
                  model: "gpt-3.5-turbo",
                  Qamount: 3,
                }}
              >
                <div className=" tw-flex tw-flex-col tw-justify-between tw-items-start tw-mb-4">
                  <div className=" tw-flex tw-gap-2 tw-w-full ">
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
                        defaultValue="gpt-3.5-turbo"
                        options={[
                          { label: "GPT-3.5 turbo", value: "gpt-3.5-turbo" },
                          { label: "GPT-4o", value: "gpt-4o" },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item<formSchema>
                      label={"Question amount"}
                      name={"Qamount"}
                    >
                      <InputNumber defaultValue={3} />
                    </Form.Item>

                    <Button
                      style={{ marginLeft: "auto" }}
                      onClick={() => {
                        form.validateFields().then(() => {
                          setSubmitType("create-new");
                        });
                      }}
                      htmlType="submit"
                      type="primary"
                    >
                      Generate new survey
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
                  <Button type="primary">Use this survey</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCreatePage;
