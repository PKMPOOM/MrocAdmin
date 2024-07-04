import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { useCreateBlockNote } from "@blocknote/react";
import type { MenuProps } from "antd";
import { Button, Dropdown, Form, Typography } from "antd";
import { produce } from "immer";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuth } from "~/context/Auth/AuthContext";
import { useGenerativeQuestion } from "~/src/Hooks/Generative/Question/useGenerativeQuestion";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";
import {
  QueryResponse,
  Question,
} from "../../../../Interface/SurveyEditorInterface";
import {
  CustomBlockNote,
  customSchema,
  getInitBlock,
} from "../../../Global/CustomEditor/BlockNoteCustomEditor";
import PageBreak from "../../../QuestionType/PageBreak";
import { addAnswerMutation } from "../QuestionTree/answer.api";
import {
  useDeleteQuestionMutation,
  useUpdateQuestionLabel,
} from "../QuestionTree/question.api";
import Answer from "./Answer";
import QuestionLogic from "./Sub_components/QuestionLogic";

const { Text } = Typography;

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

function QuestionActive({
  pageID,
  pageSize,
  question,
  pIndex,
  qIndex,
}: QuestionProps) {
  const [questionFrom] = Form.useForm();
  const { notificationApi } = useAuth();
  const [activeQ, surveyMeta, setSurveyFetchingStatus] = useSurveyEditorStore(
    useShallow((state) => [
      state.activeQuestion,
      state.surveyMeta,
      state.setSurveyFetchingStatus,
    ])
  );
  const [SavedText, setSavedText] = useState("");

  const isLastIndex = pageSize - 1 === qIndex;

  const { trigger: deleteQuestion } = useDeleteQuestionMutation(surveyMeta);
  const { trigger: updateQuestionLabel } = useUpdateQuestionLabel(surveyMeta);
  const { trigger: addAnswer } = addAnswerMutation(surveyMeta, {
    pIndex: pIndex,
    qIndex: qIndex,
    qID: question.id,
  });

  const { useEventSource } = useGenerativeQuestion();
  const { StartEventSource, rawData } = useEventSource();

  const editor = useCreateBlockNote({
    schema: customSchema,
    initialContent: getInitBlock(question.label),
    trailingBlock: false,
  });

  useEffect(() => {
    setSavedText(question.label);
    questionFrom.setFieldsValue({
      question_text: question.label,
    });
  }, []);

  useEffect(() => {
    if (editor) {
      const currentBlock = editor.getTextCursorPosition().block;
      if (currentBlock && rawData !== "") {
        editor.updateBlock(currentBlock, {
          content: [{ type: "text", text: rawData, styles: {} }],
        });
      }
    }
  }, [rawData]);

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
                StartEventSource,
                rawData,
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
        <div className="tw-flex tw-justify-center">
          {question.type !== "text_area" && (
            <Button
              onClick={() => {
                addAnswer();
              }}
              type="link"
              icon={<PlusOutlined />}
            >
              Add Answer
            </Button>
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
