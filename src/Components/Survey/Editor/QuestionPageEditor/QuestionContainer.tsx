import {
  DeleteTwoTone,
  LoadingOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Button, Divider, Popconfirm, Typography } from "antd";
import { produce } from "immer";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import GenerativeButton from "~/component/Global/AI/GenerativeButton";
import { useAuth } from "~/context/Auth/AuthContext";
import GenerativeQuestionPreview from "~/src/Pages/Admin/Quantitative/Survey/SmartCreate/GenerativeQuestionPreview";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";
import {
  Pages,
  QueryResponse,
} from "../../../../Interface/SurveyEditorInterface";
import {
  useDeleteSinglePageMutation,
  useUpdatePageHeaderMutation,
} from "../QuestionTree/page.api";
import QuestionActive from "./QuestionActive";
import QuestionPreview from "./QuestionPreview";
import {
  formatGenerativeQuestion,
  useGenerativeSurvey,
} from "~/src/Hooks/Generative";
import { createNewQuestionsFromGenerted } from "~/src/Pages/Admin/Quantitative/Survey/SurveyEditor/Tab_Build/Subtab_Build/api";
import { useSWRConfig } from "swr";

const { Title, Text } = Typography;

type PageProps = {
  pages: Pages;
  pIndex: number;
};

//todo add delete page mutation
function PageContainer({ pages, pIndex }: PageProps) {
  const [activeQuestion, surveyMeta, SetActiveQuestion] = useSurveyEditorStore(
    useShallow((state) => [
      state.activeQuestion,
      state.surveyMeta,
      state.SetActiveQuestion,
    ])
  );
  const { notificationApi } = useAuth();
  const { trigger: UpdatePageHeaderMutation } =
    useUpdatePageHeaderMutation(surveyMeta);
  const { trigger: deleteSinglePage } = useDeleteSinglePageMutation(surveyMeta);
  const { useEventSource, AIModel } = useGenerativeSurvey();
  const [IsLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const {
    StartEventSource,
    rawData,
    parsedData,
    IsStreaming,
    resetGeneration,
    GeneratedCount,
  } = useEventSource();

  useEffect(() => {
    if (pIndex === 0 && pages.questions[0]?.id) {
      SetActiveQuestion(0, 0, pages.questions[0].id);
    }
  }, []);

  const generateQuestionList = async () => {
    const Url = `${
      import.meta.env.VITE_API_URL
    }/generative/streaming/${pages.header.replace(
      / /g,
      "_"
    )}?Qamount=${3}&model=${AIModel}`;
    await StartEventSource(Url);
  };

  const acceptgeneratedQuestion = async () => {
    setIsLoading(true);
    const formatedQuestion = formatGenerativeQuestion(parsedData, pages.id);
    await createNewQuestionsFromGenerted({
      pageID: pages.id,
      questionList: formatedQuestion,
    });

    mutate(surveyMeta.queryKey);
    setIsLoading(false);
  };

  return (
    <div
      key={pages.id}
      className=" tw-relative tw-bg-white tw-p-4 tw-flex tw-flex-col tw-outline tw-outline-1 tw-outline-gray-300 tw-rounded tw-mb-6 tw-z-50"
    >
      <div className=" tw-flex tw-flex-row tw-justify-between tw-items-center tw-mb-4 ">
        <Title
          editable={{
            onChange: (value) => {
              UpdatePageHeaderMutation(
                {
                  pageID: pages.id,
                  value: value,
                },
                {
                  optimisticData: (currentData: any) => {
                    const nextState = produce(
                      currentData,
                      (draftState: QueryResponse) => {
                        const { questionlist } = draftState;
                        questionlist[pIndex].header = value;
                      }
                    );
                    return nextState;
                  },
                }
              );
            },
          }}
          level={5}
        >
          {pages.header}
        </Title>
        <div className=" tw-flex tw-flex-row tw-gap-2">
          <Popconfirm
            icon={
              <QuestionCircleOutlined
                style={{
                  color: "red",
                }}
              />
            }
            placement="left"
            title="Delete this page"
            description="Are you sure to delete this page?"
            onConfirm={() => {
              deleteSinglePage(pages.id, {
                optimisticData: (currentData: any) => {
                  const nextState = produce(
                    currentData,
                    (draftState: QueryResponse) => {
                      draftState.questionlist.splice(pIndex, 1);
                    }
                  );
                  return nextState;
                },
                rollbackOnError: () => {
                  notificationApi.error({
                    message: "Error",
                    description: "Error deleting page",
                  });
                  return true;
                },
              });
            }}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
            }}
          >
            <Button
              icon={<DeleteTwoTone twoToneColor="red" />}
              type="text"
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      </div>

      {pages.questions.length > 0 &&
        pages.questions.map((question, qIndex) => {
          const isActiveQuestion =
            activeQuestion.page === pIndex &&
            activeQuestion.question === qIndex;
          return (
            <div key={question.id}>
              {isActiveQuestion ? (
                <QuestionActive
                  pageID={pages.id}
                  pageSize={pages.questions.length}
                  question={question}
                  pIndex={pIndex}
                  qIndex={qIndex}
                />
              ) : (
                <QuestionPreview
                  pageSize={pages.questions.length}
                  question={question}
                  pIndex={pIndex}
                  qIndex={qIndex}
                />
              )}
            </div>
          );
        })}

      {pages.questions.length === 0 && parsedData.length > 0 && (
        <div className=" tw-w-full tw-rounded-lg tw-bg-gradient-to-r tw-from-cyan-500 tw-to-blue-500 tw-p-[1.5px]">
          <div className="  tw-rounded-md tw-bg-white ">
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
          </div>
        </div>
      )}

      {pages.questions.length === 0 && (
        <div className=" tw-flex tw-gap-2 tw-flex-col tw-justify-center tw-items-center tw-my-3">
          <div className=" tw-flex tw-flex-row tw-gap-1 tw-w-full tw-justify-center">
            {GeneratedCount > 0 && (
              <div className=" tw-flex tw-items-center tw-justify-center">
                <Popconfirm
                  title="Discard"
                  description="Are you sure to discard the generated question?"
                  icon={null}
                  onConfirm={resetGeneration}
                  okButtonProps={{
                    danger: true,
                  }}
                >
                  <Button danger>Discard</Button>
                </Popconfirm>
                <Divider type="vertical" />
                <Button
                  type="primary"
                  ghost
                  loading={IsLoading}
                  onClick={async () => {
                    await acceptgeneratedQuestion();
                  }}
                >
                  Accept
                </Button>
              </div>
            )}
            <GenerativeButton
              icon={IsStreaming ? <LoadingOutlined /> : null}
              onClick={async () => {
                await generateQuestionList();
                console.log("generating");
              }}
            >
              <span className=" tw-px-3">
                {GeneratedCount > 0 ? "Re-generate" : "Generate"}
              </span>
            </GenerativeButton>
          </div>
          <Text type="secondary">
            Generate question based on the page header
          </Text>
        </div>
      )}
    </div>
  );
}

export default React.memo(PageContainer);
