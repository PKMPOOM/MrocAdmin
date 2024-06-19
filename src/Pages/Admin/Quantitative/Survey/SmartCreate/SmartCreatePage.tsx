import { Button, Form, Input, Popconfirm, Typography } from "antd";
import { useState } from "react";
import NewTemplateCard from "~/component/Survey/Modal/NewTemplateCard";
import { getTextResponse, getTestSurveyQuestion } from "./api";
import LoadingFallback from "~/component/Global/Suspense/LoadingFallback";
import { Pages, Question } from "~/interface/SurveyEditorInterface";
import Question_Preview from "~/component/Survey/Editor/QuestionPageEditor/Question_Preview";
const { Text } = Typography;

import PageContainer from "~/component/Survey/Editor/QuestionPageEditor/QuestionContainer";
import GenerativeQuestionPreview from "./QuestionPreview";

// type Template = {
//   id: string;
//   title: string;
//   cetegory: string;
//   description: string;
// };

type generativeSruveyResponse = {
  data: {
    QuestionList: Question[];
  };
};

const dataTest: generativeSruveyResponse = {
  data: {
    QuestionList: [
      {
        id: "1f14a49d-f89f-4ccb-97a7-4b7c4052a497",
        key: 1,
        index: 1,
        label: "How satisfied are you with our product quality?",
        isselected: false,
        type: "single_select",
        precodesallowed: 100,
        presetanswer: false,
        isrequired: false,
        forcequestionresponse: false,
        POisselected: false,
        POselectedoption: "none",
        shuffleby: "undefined",
        sortdir: "asc",
        pageIdpage: "0c228a41-4270-47ab-9810-c2522d7bb8cb",
        answers: [
          {
            id: "1f695538-62c0-4a50-95c6-c468ebf90549",
            key: 3,
            label: "Very satisfied",
            index: 0,
            exclusive: false,
            forceopenendresponse: true,
            openend: false,
            number_only: true,
            openEndDirection: "horizontal",
            ai_categorize: true,
            ai_categorize_list: [],
            questionsId: "399d986e-6ad2-4e15-8517-665701c6971a",
          },
          {
            id: "5e241f6d-cf04-4fa1-b86d-7d5433ec66fe",
            key: 4,
            label: "Satisfied",
            index: 1,
            exclusive: false,
            forceopenendresponse: true,
            openend: false,
            number_only: true,
            openEndDirection: "horizontal",
            ai_categorize: true,
            ai_categorize_list: [],
            questionsId: "399d986e-6ad2-4e15-8517-665701c6971a",
          },
          {
            id: "5c3b14dd-1ab0-4d2b-857b-882f783f2267",
            key: 5,
            label: "Neutral",
            index: 2,
            exclusive: false,
            forceopenendresponse: true,
            openend: false,
            number_only: true,
            openEndDirection: "horizontal",
            ai_categorize: true,
            ai_categorize_list: [],
            questionsId: "399d986e-6ad2-4e15-8517-665701c6971a",
          },
          {
            id: "2b0c00e8-7b08-4a10-93d6-10beae12df7e",
            key: 6,
            label: "Dissatisfied",
            index: 3,
            exclusive: false,
            forceopenendresponse: true,
            openend: false,
            number_only: true,
            openEndDirection: "horizontal",
            ai_categorize: true,
            ai_categorize_list: [],
            questionsId: "399d986e-6ad2-4e15-8517-665701c6971a",
          },
          {
            id: "ca5de28d-68a3-47f3-be8b-66aa04bc9ada",
            key: 7,
            label: "Very dissatisfied",
            index: 4,
            exclusive: false,
            forceopenendresponse: true,
            openend: false,
            number_only: true,
            openEndDirection: "horizontal",
            ai_categorize: true,
            ai_categorize_list: [],
            questionsId: "399d986e-6ad2-4e15-8517-665701c6971a",
          },
        ],
      },
      {
        id: "0c021507-d8fb-41d7-85f7-49ba0d4c1d2e",
        key: 2,
        index: 2,
        label: "How satisfied are you with our customer service?",
        isselected: false,
        type: "single_select",
        precodesallowed: 100,
        presetanswer: false,
        isrequired: false,
        forcequestionresponse: false,
        POisselected: false,
        POselectedoption: "none",
        shuffleby: "undefined",
        sortdir: "asc",
        pageIdpage: "0c228a41-4270-47ab-9810-c2522d7bb8cb",
        answers: [
          {
            id: "c63fadb1-feec-4965-b871-180d090fc220",
            key: 8,
            label: "Excellent",
            index: 0,
            exclusive: false,
            forceopenendresponse: true,
            openend: false,
            number_only: true,
            openEndDirection: "horizontal",
            ai_categorize: true,
            ai_categorize_list: [],
            questionsId: "b9132f3d-4403-488f-8f4f-70c1e230be78",
          },
          {
            id: "9fc4db15-170b-4aa0-94c2-dc7433b6a1fb",
            key: 9,
            label: "Good",
            index: 1,
            exclusive: false,
            forceopenendresponse: true,
            openend: false,
            number_only: true,
            openEndDirection: "horizontal",
            ai_categorize: true,
            ai_categorize_list: [],
            questionsId: "b9132f3d-4403-488f-8f4f-70c1e230be78",
          },
          {
            id: "413c6e1c-9a1f-4d7a-b4db-035c632cf4c5",
            key: 10,
            label: "Average",
            index: 2,
            exclusive: false,
            forceopenendresponse: true,
            openend: false,
            number_only: true,
            openEndDirection: "horizontal",
            ai_categorize: true,
            ai_categorize_list: [],
            questionsId: "b9132f3d-4403-488f-8f4f-70c1e230be78",
          },
          {
            id: "f51d6d6f-3b08-45b9-8a62-00baa8eada91",
            key: 11,
            label: "Poor",
            index: 3,
            exclusive: false,
            forceopenendresponse: true,
            openend: false,
            number_only: true,
            openEndDirection: "horizontal",
            ai_categorize: true,
            ai_categorize_list: [],
            questionsId: "b9132f3d-4403-488f-8f4f-70c1e230be78",
          },
        ],
      },
      {
        id: "50cad0f3-fd4b-4792-8ddf-4d17905db4d7",
        key: 3,
        index: 3,
        label: "Would you recommend our company to a friend or colleague?",
        isselected: false,
        type: "single_select",
        precodesallowed: 100,
        presetanswer: false,
        isrequired: false,
        forcequestionresponse: false,
        POisselected: false,
        POselectedoption: "none",
        shuffleby: "undefined",
        sortdir: "asc",
        pageIdpage: "0c228a41-4270-47ab-9810-c2522d7bb8cb",
        answers: [
          {
            id: "519bdea3-2a21-4da3-9b0c-dfd64a8b33f9",
            key: 12,
            label: "Definitely",
            index: 0,
            exclusive: false,
            forceopenendresponse: true,
            openend: false,
            number_only: true,
            openEndDirection: "horizontal",
            ai_categorize: true,
            ai_categorize_list: [],
            questionsId: "47a5dc0f-1c94-4dd9-8f24-ef9bba977ca4",
          },
          {
            id: "1c0c7b02-6aa9-434f-b50a-2e2fed2e5ef9",
            key: 13,
            label: "Likely",
            index: 1,
            exclusive: false,
            forceopenendresponse: true,
            openend: false,
            number_only: true,
            openEndDirection: "horizontal",
            ai_categorize: true,
            ai_categorize_list: [],
            questionsId: "47a5dc0f-1c94-4dd9-8f24-ef9bba977ca4",
          },
          {
            id: "c8b63364-9beb-48ca-8db2-fd0116b478ae",
            key: 14,
            label: "Unsure",
            index: 2,
            exclusive: false,
            forceopenendresponse: true,
            openend: false,
            number_only: true,
            openEndDirection: "horizontal",
            ai_categorize: true,
            ai_categorize_list: [],
            questionsId: "47a5dc0f-1c94-4dd9-8f24-ef9bba977ca4",
          },
          {
            id: "262366c6-0eed-4622-b431-df8a1b489f9b",
            key: 15,
            label: "Unlikely",
            index: 3,
            exclusive: false,
            forceopenendresponse: true,
            openend: false,
            number_only: true,
            openEndDirection: "horizontal",
            ai_categorize: true,
            ai_categorize_list: [],
            questionsId: "47a5dc0f-1c94-4dd9-8f24-ef9bba977ca4",
          },
          {
            id: "bc0a8401-2f2a-4ba6-a905-6925443a395b",
            key: 16,
            label: "Definitely not",
            index: 4,
            exclusive: false,
            forceopenendresponse: true,
            openend: false,
            number_only: true,
            openEndDirection: "horizontal",
            ai_categorize: true,
            ai_categorize_list: [],
            questionsId: "47a5dc0f-1c94-4dd9-8f24-ef9bba977ca4",
          },
        ],
      },
    ],
  },
};
const { Title } = Typography;
type SubmitType = "get-template" | "create-new";
const SmartCreatePage = () => {
  const [SubmitType, setSubmitType] = useState<SubmitType>("get-template");
  // const [SelectedTemplateID, setSelectedTemplateID] = useState("second");
  const [SurveyQuestionData, setSurveyQuestionData] = useState<Question[]>([]);
  const [Loading, setLoading] = useState(false);

  const getGenerativeData = async () => {
    const response = await getTestSurveyQuestion();
    setSurveyQuestionData(response.data);
  };

  const [form] = Form.useForm();
  return (
    <div className=" tw-px-6 tw-flex tw-flex-col tw-gap-4 tw-h-[calc(100vh-64px)] tw-relative ">
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between ">
        <Title level={3}>Generative create</Title>
        {SubmitType === "get-template" ? (
          <Button
            onClick={async () => {
              setLoading(true);
              await getGenerativeData();
              setLoading(false);
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
            onFinish={(e) => console.log(e)}
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
          <p>here's a list of template that may fits your needs</p>
          {Loading ? (
            <LoadingFallback />
          ) : (
            <Button
              onClick={async () => {
                setLoading(true);
                await getGenerativeData();
                setLoading(false);
              }}
              type="primary"
            >
              Test button
            </Button>
          )}
          <div className="   tw-flex tw-flex-wrap tw-flex-col tw-gap-2 tw-w-full ">
            {/* <pre>{JSON.stringify(SurveyQuestionData, null, 2)}</pre> */}
            {/* {SurveyQuestionData.map((item) => {
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    // setSelectedTemplateID(item.id);
                  }}
                >
                  <NewTemplateCard
                    size="Small"
                    label={item.title}
                    description={item.description}
                    category={item.category}
                    isactive={SelectedTemplateID === item.id}
                  />
                </div>
              );
            })} */}
            {/* <div>survey</div> */}

            {/* <Text style={{ fontSize: 16 }}>
              {dataTest.data.QuestionList[0].label}
            </Text> */}

            {/* <PageContainer  */}

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
                <Title level={5}>test</Title>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "8px",
                  }}
                ></div>
              </div>

              {dataTest.data.QuestionList.map((question, qIndex) => {
                return (
                  <div key={qIndex}>
                    <GenerativeQuestionPreview
                      pageSize={dataTest.data.QuestionList.length}
                      Previewquestion={question}
                      pIndex={1}
                      qIndex={qIndex}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCreatePage;
