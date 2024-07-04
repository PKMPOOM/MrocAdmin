import {
  CheckCircleFilled,
  DeleteTwoTone,
  LoadingOutlined,
} from "@ant-design/icons";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { Checkbox, Col, Radio, Row, theme } from "antd";
import { produce } from "immer";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { getInitBlock } from "~/component/Global/CustomEditor/BlockNoteCustomEditor";
import { DebounceDelay } from "~/src/Constant/DebounceDelay";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";
import { useAuth } from "../../../../Context/Auth/AuthContext";
import {
  Answer as AnswerInterface,
  QueryResponse,
  TQuestionType,
} from "../../../../Interface/SurveyEditorInterface";
import {
  deleteAnswerMutation,
  updateAnswerLabel as useUpdateAnswerLabel,
} from "../QuestionTree/answer.api";
import "./Sub_components/inlineEditor.css";
import OpenEnd from "./Sub_components/OpenEnd";

type AnswerProps = {
  formInstance: any;
  questionType: TQuestionType;
  answer: AnswerInterface;
  pIndex: number;
  qIndex: number;
  aIndex: number;
};

export type ValidationStatus =
  | "success"
  | "warning"
  | "error"
  | "validating"
  | "";

function Answer({
  questionType,
  answer,
  pIndex,
  qIndex,
  aIndex, // formInstance,
}: AnswerProps) {
  const { notificationApi } = useAuth();
  const [surveyMeta, setSurveyFetchingStatus] = useSurveyEditorStore(
    useShallow((state) => [state.surveyMeta, state.setSurveyFetchingStatus])
  );
  const [ValidationStatus, setValidationStatus] =
    useState<ValidationStatus>("");

  const { trigger: updateAnswerLabel } = useUpdateAnswerLabel(surveyMeta);
  const { trigger: deleteAnswer } = deleteAnswerMutation(surveyMeta);
  const { token } = theme.useToken();

  const editor = useCreateBlockNote({
    initialContent: getInitBlock(answer.label),
    trailingBlock: false,
  });

  const SetSideTabActiveKey = useSurveyEditorStore(
    (state) => state.SetSideTabActiveKey
  );

  const debouncedApiCall = useCallback(
    debounce(async (Mutationfunc: () => void) => {
      setValidationStatus("validating");
      Mutationfunc();
    }, DebounceDelay),
    []
  );

  const handleChange = async () => {
    const JSONContent = JSON.stringify(editor.document);

    debouncedApiCall(async () => {
      setSurveyFetchingStatus({
        isFetching: true,
        isLoading: true,
      });
      await updateAnswerLabel(
        {
          label: JSONContent,
          aID: answer.id,
        },
        {
          rollbackOnError() {
            notificationApi.error({
              message: "Error",
              description: "Error updating question label",
            });

            // todo: rollback to previous state
            // formInstance.setFieldsValue({
            //   [formName]: SavedText,
            // });
            setValidationStatus("error");
            setSurveyFetchingStatus({
              isFetching: false,
              isLoading: false,
            });
            return true;
          },
          optimisticData: (currentData) => {
            const nextState = produce(
              currentData,
              (draftState: QueryResponse) => {
                const { questionlist } = draftState;
                questionlist[pIndex].questions[qIndex].answers[aIndex].label =
                  JSONContent;
              }
            );
            return nextState;
          },
        }
      );
      setSurveyFetchingStatus({
        isFetching: false,
        isLoading: false,
      });
      setValidationStatus("success");
      setTimeout(() => {
        setValidationStatus("");
      }, 1500);
    });
  };

  return (
    <div key={answer.id}>
      <Row
        style={{
          display: "flex",
          alignItems: "center",
        }}
        gutter={8}
      >
        <Col flex="auto">
          <div className="tw-rounded-sm tw-flex tw-gap-1  tw-relative  tw-items-center  ">
            {questionType === "single_select" && <Radio checked={false} />}
            {questionType === "multi_select" && <Checkbox checked={false} />}

            <BlockNoteView
              onFocus={() => {
                SetSideTabActiveKey("Edit");
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
              theme={"light"}
              editor={editor}
              linkToolbar={false}
              filePanel={false}
              sideMenu={false}
              slashMenu={false}
              tableHandles={false}
              onChange={handleChange}
            ></BlockNoteView>
            <div className=" tw-absolute tw-right-4 tw-z-20 inset-0">
              {ValidationStatus === "validating" && <LoadingOutlined />}
              {ValidationStatus === "success" && (
                <CheckCircleFilled
                  style={{
                    color: token.colorSuccess,
                  }}
                />
              )}
            </div>
          </div>
        </Col>
        <div className="tw-flex tw-gap-1">
          {questionType === "multi_select" ||
          questionType === "single_select" ? (
            <OpenEnd
              pIndex={pIndex}
              qIndex={qIndex}
              aIndex={aIndex}
              aID={answer.id}
              useOpenEnd={answer.openend}
              forceOpenEnd={answer.forceopenendresponse}
              numberOnly={answer.number_only}
              AICategorize={answer.ai_categorize}
              categorizeList={answer.ai_categorize_list}
              openEndDirection={answer.openEndDirection}
            />
          ) : null}

          {/* {questionType === "multi_select" ? <Excclusive /> : null} */}

          <div
            onClick={() => {
              deleteAnswer(answer.id, {
                optimisticData: (currentData) => {
                  const nextState = produce(
                    currentData,
                    (draftState: QueryResponse) => {
                      const { questionlist } = draftState;
                      questionlist[pIndex].questions[qIndex].answers.splice(
                        aIndex,
                        1
                      );
                    }
                  );
                  return nextState;
                },
                onError: () => {
                  notificationApi.error({
                    message: "Error",
                    description: "Error while deleting answer",
                  });
                },
              });
            }}
            className="tw-cursor-pointer tw-rounded tw-flex tw-justify-center tw-p-2 hover:tw-bg-red-100"
          >
            <DeleteTwoTone twoToneColor="red" />
          </div>
        </div>
      </Row>
    </div>
  );
}

export default Answer;
