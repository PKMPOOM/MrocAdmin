import { Button, Form, Input, Typography } from "antd";
import { useState } from "react";
import z from "zod";
// import NewTemplateCard from "~/component/Survey/Modal/NewTemplateCard";
// import {
//   getTextResponse,
//   getTestSurveyQuestion,
//   getTestStreamingText,
// } from "./api";
// import LoadingFallback from "~/component/Global/Suspense/LoadingFallback";
// import { Pages, Question } from "~/interface/SurveyEditorInterface";
// import Question_Preview from "~/component/Survey/Editor/QuestionPageEditor/Question_Preview";
// const { Text } = Typography;

// import PageContainer from "~/component/Survey/Editor/QuestionPageEditor/QuestionContainer";
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
  const [rawData, setRawData] = useState("");

  const generateStreamData = async (promptString: string) => {
    setRawData("");
    setParsedData([]);

    const eventSource = new EventSource(
      `http://localhost:9999/generative/streaming/${promptString}`,
      {
        withCredentials: true,
      }
    );

    let data = "";

    eventSource.onmessage = function (event) {
      if (event.data === "[DONE]") {
        eventSource.close();
      } else {
        setRawData((prev) => prev + event.data);
        data += event.data;

        const endIndex = data.indexOf("}");
        if (endIndex !== -1) {
          const startIndex = data.indexOf("{");

          const jsonObject = data.slice(startIndex, endIndex + 1); // Extract the JSON object
          data = data.slice(endIndex + 1); // Remove the extracted JSON object from the accumulated data

          setRawData(data);
          try {
            const parsedObject = JSON.parse(jsonObject);
            const { success, data } =
              GenQuestionListSchema.safeParse(parsedObject);

            if (success) {
              // console.log(parsedObject);
              setParsedData((prev) => [...prev, data]);
            }

            // Make an API call
          } catch (err) {
            console.error("Error while parsing JSON:", err);
          }
        }
      }
    };

    eventSource.onerror = function () {
      eventSource.close();
    };
  };

  const onSubmit = async ({ instruction }: any) => {
    const prompt = instruction.replace(/ /g, "_");

    switch (SubmitType) {
      case "create-new":
        await generateStreamData(prompt);

        setRawData("");

        break;

      default:
        break;
    }
  };

  const [form] = Form.useForm();
  return (
    <div className=" tw-px-6 tw-flex tw-flex-col tw-gap-4 tw-h-[calc(100vh-64px)] tw-relative ">
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between ">
        <Title level={3}>Generative create</Title>
        {SubmitType === "get-template" ? (
          <Button
            onClick={async () => {
              // await getGenerativeData();
            }}
            type="primary"
          >
            Use this template
          </Button>
        ) : (
          <Button type="primary">Use this survey</Button>
        )}
      </div>
      <div className=" tw-flex tw-flex-row tw-gap-4  tw-h-full tw-max-w-full ">
        <div className="  tw-w-2/5  tw-p-2">
          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            requiredMark={"optional"}
          >
            <div className=" tw-flex tw-flex-col tw-gap-2">
              <Form.Item
                name={"instruction"}
                label={
                  "Please explain what type of survey you would like to create"
                }
                rules={[
                  { required: true, message: "Please input your instruction!" },
                  { max: 1000, message: "Instruction is too long" },
                  { min: 10, message: "Instruction is too short" },
                ]}
              >
                <Input.TextArea
                  placeholder="Make a wish"
                  autoSize={{
                    maxRows: 40,
                    minRows: 15,
                  }}
                />
              </Form.Item>
              <div className=" tw-flex tw-flex-col tw-gap-2 tw-justify-end xl:tw-flex-row  ">
                <Button
                  disabled
                  onClick={() => {
                    form.validateFields().then(() => {
                      setSubmitType("get-template");
                    });
                  }}
                  htmlType="submit"
                  type="primary"
                >
                  Get template suggestion
                </Button>
                <Button
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
            </div>
          </Form>
        </div>
        <div className="  tw-flex tw-flex-col tw-w-3/5 tw-gap-2 tw-items-center  tw-h-[calc(100vh-125px)] tw-p-2 tw-overflow-auto">
          {/* <p>here's a list of template that may fits your needs</p> */}
          {/* {Loading ? (
            <LoadingFallback />
          ) : (
            <>
              <Button
                onClick={async () => {
                  setLoading(true);
                  // await getGenerativeData();
                  setLoading(false);
                }}
                type="primary"
              >
                survey data
              </Button>
              <Button
                onClick={async () => {
                  setLoading(true);
                  // await generateStreamData();
                  setLoading(false);
                }}
                type="primary"
              >
                Stream text data
              </Button>
            </>
          )} */}
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignContent: "center",
                  marginBottom: 16,
                }}
              >
                <Title level={5}>
                  {/* {isStreaming ? "Streaming" : "Stream ended"} */}
                  Test
                </Title>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "8px",
                  }}
                ></div>
              </div>
              <Title level={5}></Title>
              {/* <div className=" tw-bg-red-50">{rawData}</div>
              -----
              <div className=" tw-bg-green-50">{parsedData}</div> */}

              {/* <pre>{JSON.stringify(parsedData, null, 2)}</pre> */}

              {parsedData.map((question, qIndex) => {
                return (
                  <div key={qIndex}>
                    <GenerativeQuestionPreview
                      // pageSize={SurveyQuestionData.length}
                      // Previewquestion={question}
                      // pIndex={1}
                      // qIndex={qIndex}
                      choices={question.answer}
                      label={question.label}
                      type={question.type}
                    />
                  </div>
                );
              })}
              {rawData
                .replace(/[{}"`]/g, "")
                .replace(/:/g, "")
                .replace(/\[/g, "")
                .replace(/\]/g, "")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCreatePage;
