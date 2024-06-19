import { DeleteTwoTone } from "@ant-design/icons";
import { Col, Form, Input, Row } from "antd";
import { debounce } from "lodash";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { produce } from "immer";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";
import { useAuth } from "../../../../Context/Auth/AuthContext";
import {
  Answer as AnswerInterface,
  QueryResponse,
} from "../../../../Interface/SurveyEditorInterface";
import {
  deleteAnswerMutation,
  updateAnswerLabel as useUpdateAnswerLabel,
} from "../QuestionTree/answer.api";
import OpenEnd from "./Sub_components/OpenEnd";
import { DebounceDelay } from "~/src/Constant/DebounceDelay";

type AnswerProps = {
  formInstance: any;
  questionType: string;
  answer: AnswerInterface;
  pIndex: number;
  qIndex: number;
  aIndex: number;
};

type ValidationStatus = "success" | "warning" | "error" | "validating" | "";

function Answer({
  questionType,
  answer,
  pIndex,
  qIndex,
  aIndex,
  formInstance,
}: AnswerProps) {
  const { notificationApi } = useAuth();
  const [surveyMeta, setSurveyFetchingStatus] = useSurveyEditorStore(
    (state) => [state.surveyMeta, state.setSurveyFetchingStatus]
  );

  const [SavedText, setSavedText] = useState("");
  const [ValidationStatus, setValidationStatus] =
    useState<ValidationStatus>("");

  const { trigger: updateAnswerLabel } = useUpdateAnswerLabel(surveyMeta);
  const { trigger: deleteAnswer } = deleteAnswerMutation(surveyMeta);

  const formName = `question_text_${aIndex}`;

  useEffect(() => {
    setSavedText(answer.label);
    formInstance.setFieldsValue({
      [formName]: answer.label,
    });
  }, []);

  const SetSideTabActiveKey = useSurveyEditorStore(
    (state) => state.SetSideTabActiveKey
  );

  const debouncedApiCall = useCallback(
    debounce(async (Mutationfunc: () => void) => Mutationfunc(), DebounceDelay),
    []
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValidationStatus("");
    debouncedApiCall(async () => {
      setSurveyFetchingStatus({
        isFetching: true,
        isLoading: true,
      });
      await updateAnswerLabel(
        {
          label: e.target.value,
          aID: answer.id,
        },
        {
          rollbackOnError() {
            notificationApi.error({
              message: "Error",
              description: "Error updating question label",
            });
            formInstance.setFieldsValue({
              [formName]: SavedText,
            });
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
                  e.target.value;
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
          alignItems: "strech",
        }}
        gutter={8}
      >
        <Col flex="auto">
          <div>
            <Form.Item
              style={{
                marginBottom: 0,
              }}
              name={formName}
              hasFeedback
              validateStatus={ValidationStatus}
            >
              <Input
                onFocus={() => {
                  SetSideTabActiveKey("Edit");
                }}
                onChange={handleChange}
              />
            </Form.Item>
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
