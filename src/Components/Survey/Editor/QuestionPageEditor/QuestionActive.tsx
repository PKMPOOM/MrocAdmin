import {
  DeleteTwoTone,
  EllipsisOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useCreateBlockNote } from "@blocknote/react";
import type { MenuProps } from "antd";
import { Button, Divider, Dropdown, Form, Popconfirm, Typography } from "antd";
import { produce } from "immer";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BsStars } from "react-icons/bs";
import styled from "styled-components";
import { useShallow } from "zustand/react/shallow";
import GenerativeButton from "~/component/Global/AI/GenerativeButton";
import { customQuestionEditorSchema } from "~/component/Global/CustomEditor/Schema/QuestionSchema";
import { getInitBlock } from "~/component/Global/CustomEditor/utils";
import { useAuth } from "~/context/Auth/AuthContext";
import { useGenerativeAnswer } from "~/src/Hooks/Generative/Answer/useGenerativeAnswer";
import { useGenerativeQuestion } from "~/src/Hooks/Generative/Question/useGenerativeQuestion";
import { getTextFromBlock } from "~/src/Hooks/Utils/getTextFromBlock";
import { createAnswerFromGenerated } from "~/src/Pages/Admin/Quantitative/Survey/SurveyEditor/Tab_Build/Subtab_Build/api";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";
import {
  QueryResponse,
  Question,
} from "../../../../Interface/SurveyEditorInterface";
import { CustomBlockNote } from "../../../Global/CustomEditor/BlockNoteCustomEditor";
import PageBreak from "../../../QuestionType/PageBreak";
import {
  addAnswerMutation,
  deleteAllAnswerMutation,
} from "../QuestionTree/answer.api";
import {
  useDeleteQuestionMutation,
  useUpdateQuestionLabel,
} from "../QuestionTree/question.api";
import Answer from "./Answer";
import QuestionLogic from "./Sub_components/QuestionLogic";

const { Text } = Typography;

export const GenerativeContainer = styled.div`
  position: relative;
  padding: 4px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: -3.5px; /* !importanté */
    border-radius: inherit; /* !importanté */
    background: linear-gradient(to right, #06b6d4, #3b82f6);
  }
`;

const items: MenuProps["items"] = [
  {
    key: "duplicate",
    label: "Duplicate",
    disabled: true,
  },
  {
    key: "save to library",
    label: "Save to library",
    disabled: true,
  },
  {
    key: "delete",
    label: "Delete",
    danger: true,
  },
];

type QuestionProps = {
  pageSize: number;
  question: Question;
  pageID: string;
  pIndex: number;
  qIndex: number;
};

type LoadingActions =
  | "delete-all"
  | "generate-answer"
  | "accept-answer-generation"
  | "";

function QuestionActive({
  pageID,
  pageSize,
  question,
  pIndex,
  qIndex,
}: QuestionProps) {
  const [questionFrom] = Form.useForm();
  const { notificationApi } = useAuth();
  const generatedContainerRef = useRef<HTMLDivElement>(null);
  const isLastIndex = pageSize - 1 === qIndex;

  const [
    activeQ,
    surveyMeta,
    setSurveyFetchingStatus,
    SetActiveQuestion,
    instructions,
  ] = useSurveyEditorStore(
    useShallow((state) => [
      state.activeQuestion,
      state.surveyMeta,
      state.setSurveyFetchingStatus,
      state.SetActiveQuestion,
      state.surveyData?.detail.instructions,
    ])
  );
  const [SavedText, setSavedText] = useState("");
  const [IsLoading, setIsLoading] = useState<LoadingActions>("");

  const { trigger: deleteQuestion } = useDeleteQuestionMutation(surveyMeta);
  const { trigger: updateQuestionLabel } = useUpdateQuestionLabel(surveyMeta);
  const { trigger: createAnswerList } = createAnswerFromGenerated(
    surveyMeta,
    question.id
  );
  const { trigger: addAnswer } = addAnswerMutation(surveyMeta, {
    pIndex: pIndex,
    qIndex: qIndex,
    qID: question.id,
  });
  const { trigger: deleteAllAnswer } = deleteAllAnswerMutation(surveyMeta);

  const { useEventSource: QuestionLabelSSE } = useGenerativeQuestion();
  const { useEventSource: AnswerSSE } = useGenerativeAnswer();
  const {
    StartEventSource: answerListGen,
    rawData: rawAnswerList,
    GenAnswerList,
    IsStreaming,
    resetGeneration,
    GeneratedCount,
  } = AnswerSSE();
  const { StartEventSource: questionLabelGen, rawData: rawQuestionLabel } =
    QuestionLabelSSE();

  const editor = useCreateBlockNote({
    schema: customQuestionEditorSchema,
    initialContent: getInitBlock(question.label),
    trailingBlock: false,
  });

  useEffect(() => {
    // set the initial value of the question for error rollback
    setSavedText(question.label);
    questionFrom.setFieldsValue({
      question_text: question.label,
    });
  }, []);

  // update block when rawData changes
  // this is used to update the block when the generative feature is used
  useEffect(() => {
    if (editor) {
      const currentBlock = editor.getTextCursorPosition().block;
      if (currentBlock && rawQuestionLabel !== "") {
        editor.updateBlock(currentBlock, {
          content: [{ type: "text", text: rawQuestionLabel, styles: {} }],
        });
      }
    }
  }, [rawQuestionLabel]);

  // scroll to the bottom of the generated container
  useEffect(() => {
    if (generatedContainerRef.current) {
      generatedContainerRef.current.style.scrollMargin = "24px";
    }
    generatedContainerRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [rawAnswerList]);

  const debouncedApiCall = useCallback(
    debounce(async (Mutationfunc: () => void) => Mutationfunc(), 1500),
    []
  );

  const handleChange = () => {
    const JSONContent = JSON.stringify(editor.document);
    debouncedApiCall(() => {
      setSurveyFetchingStatus({
        isFetching: true,
        isLoading: true,
      });
      updateQuestionLabel(
        {
          label: JSONContent,
          qID: question.id,
        },
        {
          revalidate: false,
          rollbackOnError() {
            notificationApi.error({
              message: "Error",
              description: "Error updating question label",
            });
            questionFrom.setFieldsValue({
              question_text: SavedText,
            });
            return true;
          },
          optimisticData: (currentData) => {
            const nextState = produce(
              currentData,
              (draftState: QueryResponse) => {
                const { questionlist } = draftState;
                questionlist[pIndex].questions[qIndex].label = JSONContent;
              }
            );
            return nextState;
          },
        }
      ).then(() => {
        setSurveyFetchingStatus({
          isFetching: false,
          isLoading: false,
        });
      });
    });
  };

  const onDropdownClick = (
    { key }: { key: string },
    qID: string,
    pIndex: number,
    qIndex: number
  ) => {
    if (key === "delete") {
      deleteQuestion(
        {
          id: qID,
          index: qIndex,
          pageID: pageID,
        },
        {
          optimisticData: (currentData: any) => {
            const nextState = produce(
              currentData,
              (draftState: QueryResponse) => {
                const { questionlist } = draftState;
                questionlist[pIndex].questions.splice(qIndex, 1);
              }
            );
            return nextState;
          },
        }
      );
    }
  };

  const generateAnswerList = async () => {
    if (question.label === "" || question.label === null) {
      return;
    }

    const questionText = getTextFromBlock(question.label);

    const searchParams = new URLSearchParams({
      questionType: question.type,
      questionText: questionText,
      context: instructions || "",
      currentChoices: JSON.stringify(
        question.answers.map((el) => getTextFromBlock(el.label))
      ),
    });

    const Url = `${
      import.meta.env.VITE_API_URL
    }/generative/streaming/answerlist/${questionText
      .replace(/ /g, "_")
      .replace(/\?/g, "")}?${searchParams.toString()}`;
    await answerListGen(Url, question.id);
    setIsLoading("");
  };

  const acceptAnswerGeneration = async () => {
    resetGeneration();
    setIsLoading("accept-answer-generation");
    await createAnswerList(GenAnswerList, {
      revalidate: false,
      optimisticData: (currentData: any) => {
        const nextState = produce(currentData, (draftState: QueryResponse) => {
          const { questionlist } = draftState;
          const newList = [
            ...questionlist[pIndex].questions[qIndex].answers,
            ...GenAnswerList,
          ];
          questionlist[pIndex].questions[qIndex].answers = newList;
        });
        return nextState;
      },
      rollbackOnError() {
        notificationApi.error({
          message: "Error",
          description: "Error while adding answer",
        });
        return true;
      },
    });
    setIsLoading("");
    SetActiveQuestion(pIndex, qIndex, question.id);
    notificationApi.success({
      message: "Success",
      description: "Generated answers added successfully",
    });
  };

  const handleDeleteAllAnswer = async () => {
    setIsLoading("delete-all");
    await deleteAllAnswer(question.id, {
      revalidate: false,
      optimisticData: (currentData: any) => {
        const nextState = produce(currentData, (draftState: QueryResponse) => {
          const { questionlist } = draftState;
          questionlist[pIndex].questions[qIndex].answers = [];
        });
        return nextState;
      },
      onError: () => {
        notificationApi.error({
          message: "Error",
          description: "Error while deleting all answers",
        });
      },
    });
    setIsLoading("");
  };

  return (
    <Form
      form={questionFrom}
      initialValues={{
        question_text: question.label,
      }}
    >
      <div
        key={question.key}
        style={{
          zIndex: 500,
          marginTop: 8,
          marginBottom: 8,
          transitionProperty: "box-shadow",
          transitionDuration: "1s",
          paddingBottom: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          position: "relative",
          padding: 16,
          borderRadius: 8,
          boxShadow: `${
            activeQ
              ? "rgba(0, 0, 0, 0.1) 0px 8px 16px -8px"
              : "0px 3px 6px rgba(0, 0, 0,0)"
          }`,
          outline: `${activeQ ? "1px solid #dfdfdf" : "0px"}`,
        }}
      >
        {/* //! hidden anchor for scroll */}
        <div
          id={`Q${pIndex + 1}${qIndex + 1}`}
          style={{
            position: "absolute",
            top: "-50px",
            zIndex: 9999,
          }}
        />
        <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-gap-2 bgre">
          <Text type="secondary">qID : {question.key}</Text>

          <div className="tw-flex tw-gap-2 tw-items-center">
            <QuestionLogic
              questiontype={question.type}
              forcerequired={question.forcequestionresponse}
              required={question.isrequired}
              presetoption={question.POselectedoption}
              sortdir={question.sortdir}
              useprecodeoptions={question.POisselected}
            />
            <Dropdown
              placement="bottomRight"
              menu={{
                items: items,
                onClick: (e) => {
                  onDropdownClick(e, question.id, pIndex, question.index);
                },
              }}
            >
              <EllipsisOutlined
                style={{
                  fontSize: "24px",
                  marginTop: "auto",
                  color: "#1677ff",
                  cursor: "pointer",
                }}
              />
            </Dropdown>
          </div>
        </div>
        <div>
          <div className="tw-rounded-sm tw-flex tw-gap-1  tw-relative tw-items-center tw-min-h-8 ">
            <CustomBlockNote
              editor={editor}
              handleChange={handleChange}
              questionIndexData={{
                pIndex,
                qIndex,
                questionID: question.id,
              }}
              generativeFeature={{
                StartEventSource: questionLabelGen,
                rawData: rawQuestionLabel,
              }}
            />
          </div>
        </div>

        {question.answers?.map((answer, aIndex) => (
          <Answer
            key={answer.id}
            formInstance={questionFrom}
            questionType={question.type}
            answer={answer}
            pIndex={pIndex}
            qIndex={qIndex}
            aIndex={aIndex}
          />
        ))}

        {GenAnswerList.length > 0 && (
          <div className=" tw-w-full tw-rounded-lg tw-bg-gradient-to-r tw-p-[1.5px] tw-relative tw-bg-white ">
            <GenerativeContainer ref={generatedContainerRef}>
              {GenAnswerList.map((answer, aIndex) => (
                <Answer
                  key={answer.id}
                  formInstance={questionFrom}
                  questionType={question.type}
                  answer={answer}
                  pIndex={pIndex}
                  qIndex={qIndex}
                  aIndex={aIndex}
                />
              ))}
              {rawAnswerList
                .replace(/[{}",`]/g, "")
                .replace(/:/g, "")
                .replace(/\[/g, "")
                .replace(/\]/g, "")
                .replace("label", "")}
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
                      loading={IsLoading === "generate-answer"}
                      onClick={async () => {
                        await acceptAnswerGeneration();
                      }}
                    >
                      Accept
                    </Button>
                  </div>
                )}
                <GenerativeButton
                  icon={IsStreaming ? <LoadingOutlined /> : null}
                  onClick={async () => {
                    await generateAnswerList();
                  }}
                >
                  <span className=" tw-px-3">
                    {GeneratedCount > 0 ? "Re-generate" : "Generate"}
                  </span>
                </GenerativeButton>
              </div>
            </GenerativeContainer>
          </div>
        )}

        <div className="tw-flex tw-justify-center">
          {question.type !== "text_area" && (
            <>
              <Button
                onClick={() => {
                  addAnswer();
                }}
                type="link"
                icon={<PlusOutlined />}
              >
                Answer
              </Button>
              <Button
                style={{ marginRight: "auto" }}
                onClick={async () => {
                  await generateAnswerList();
                  // addAnswer();
                }}
                type="link"
                loading={IsLoading === "generate-answer"}
                icon={<BsStars />}
              >
                Generate
              </Button>
              {question.answers.length > 0 && (
                <Button
                  onClick={handleDeleteAllAnswer}
                  type="link"
                  danger
                  loading={IsLoading === "delete-all"}
                  icon={<DeleteTwoTone twoToneColor="red" />}
                >
                  All Answers
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      {!isLastIndex && (
        <PageBreak isBreak={false} pIndex={pIndex} qIndex={qIndex} />
      )}
    </Form>
  );
}

export default React.memo(QuestionActive);
