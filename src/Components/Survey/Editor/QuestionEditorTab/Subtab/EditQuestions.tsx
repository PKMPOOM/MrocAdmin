import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Radio, Select, Switch, Typography } from "antd";
import { produce } from "immer";
import { debounce } from "lodash";
import React, { useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { QueryResponse } from "../../../../../Interface/SurveyEditorInterface";
import { availableQuestionType } from "../../../../Helper/QuestionAnswerDefault";
import {
  addAnswerMutation,
  deleteAnswerMutation,
} from "../../QuestionTree/answer.api";
import {
  QuestionOptionsProps,
  useChangeQuestionTypeMutation,
  useUpdateQuestionSettingsMutation,
} from "../../QuestionTree/question.api";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";
import { DebounceDelay } from "~/src/Constant/DebounceDelay";
const { Link, Text } = Typography;

function EditQuestion() {
  const [EditQuestionForm] = Form.useForm();
  const [setSurveyData, SurveyData, surveyMeta, activeQ] = useSurveyEditorStore(
    useShallow((state) => [
      state.setSurveyData,
      state.surveyData,
      state.surveyMeta,
      state.activeQuestion,
    ])
  );

  const { questionlist } = SurveyData || ({} as QueryResponse);
  const { page: pIndex, question: qIndex } = activeQ;

  // extracting stuff for reuse later
  const PresetMenuList: any = [];
  const questionType = questionlist[pIndex]?.questions[qIndex]?.type;
  const questionID = questionlist[pIndex]?.questions[qIndex]?.id;
  const answerLength = questionlist[pIndex]?.questions[qIndex]?.answers?.length;
  const currentQuestionData = questionlist[pIndex]?.questions[qIndex];
  const lastAnswerInQuestionID =
    questionlist[pIndex]?.questions[qIndex]?.answers[
      questionlist[pIndex]?.questions[qIndex]?.answers?.length - 1
    ]?.id;
  const lastAnswerIndex =
    questionlist[pIndex]?.questions[qIndex]?.answers?.length - 1;

  const availablePresetOptions =
    currentQuestionData?.type === "multi_select" ||
    currentQuestionData?.type === "slider" ||
    currentQuestionData?.type === "single_select";

  const availablePrecodesOptions =
    currentQuestionData?.type === "multi_select" ||
    currentQuestionData?.type === "single_select";

  // mutauion hooks
  const { trigger: updateQuestionSettingsOptimistic } =
    useUpdateQuestionSettingsMutation(surveyMeta);
  const { trigger: changeQuestionTypeOptimistic } =
    useChangeQuestionTypeMutation({
      surveyMeta: surveyMeta,
      qID: currentQuestionData?.id,
    });
  const { trigger: addAnswerOptimistic } = addAnswerMutation(surveyMeta, {
    pIndex: pIndex,
    qIndex: qIndex,
    qID: questionID,
  });
  const { trigger: deleteAnswerOptimistic } = deleteAnswerMutation(surveyMeta);

  useEffect(() => {
    if (surveyMeta) {
      EditQuestionForm.setFieldsValue({
        question_type: questionType,
        sortDirection: currentQuestionData?.sortdir,
      });
    }
  }, [activeQ]);

  const debouncedApiCall = useCallback(
    debounce(async (Mutationfunc: () => void) => Mutationfunc(), DebounceDelay),
    []
  );

  const OptionChanges = async ({
    qID = currentQuestionData?.id,
    questionType = currentQuestionData?.type,
    useResponseRequirement = currentQuestionData?.isrequired,
    usePrecodesOption = currentQuestionData?.POisselected,
    presetAnswers = currentQuestionData?.presetanswer,
    selectedPrecodesOption = currentQuestionData?.POselectedoption,
    shuffleBy = currentQuestionData?.shuffleby,
    sortDirection = currentQuestionData?.sortdir,
    forceQuestionResponse = currentQuestionData?.forcequestionresponse,
  }: QuestionOptionsProps) => {
    if (!SurveyData) {
      return;
    }
    const postBody = {
      qID,
      questionType,
      useResponseRequirement,
      usePrecodesOption,
      presetAnswers,
      selectedPrecodesOption,
      shuffleBy,
      sortDirection,
      forceQuestionResponse,
    };

    debouncedApiCall(() => updateQuestionSettingsOptimistic(postBody));

    const nextState = produce(SurveyData, (draftState) => {
      const { questionlist } = draftState;
      const currentQuestion = questionlist[pIndex].questions[qIndex];
      currentQuestion.POisselected = postBody.usePrecodesOption;
      currentQuestion.POselectedoption = postBody.selectedPrecodesOption;
      currentQuestion.isrequired = postBody.useResponseRequirement;
      currentQuestion.presetanswer = postBody.presetAnswers;
      currentQuestion.shuffleby = postBody.shuffleBy;
      currentQuestion.sortdir = postBody.sortDirection;
      currentQuestion.forcequestionresponse = postBody.forceQuestionResponse;
    });

    setSurveyData(nextState);
  };

  return (
    <Form
      form={EditQuestionForm}
      id="scrolltest"
      style={{
        overflowX: "hidden",
        height: "calc(100vh - 262px)",
        width: "250px",
      }}
      layout="vertical"
    >
      <div
        style={{
          width: "234px",
        }}
        className="tw-flex tw-flex-col tw-p-2"
      >
        <Form.Item
          style={{ marginBottom: 8 }}
          label="Question type"
          name={"question_type"}
        >
          <Select
            onChange={(event) => {
              changeQuestionTypeOptimistic({
                targetType: event,
              });
            }}
            options={availableQuestionType.map((items) => ({
              label: items.label,
              value: items.value,
            }))}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: 8 }}>
          <div className="tw-flex tw-flex-col tw-gap-2">
            <div className="tw-flex tw-flex-row tw-gap-2 tw-items-center ">
              <Button
                disabled={answerLength === 0}
                icon={<MinusCircleOutlined />}
                type="text"
                onClick={() => {
                  deleteAnswerOptimistic(lastAnswerInQuestionID, {
                    optimisticData: (currentData: any) => {
                      const nextState = produce(
                        currentData,
                        (draftState: QueryResponse) => {
                          const { questionlist } = draftState;
                          questionlist[pIndex].questions[qIndex].answers.splice(
                            lastAnswerIndex,
                            1
                          );
                        }
                      );
                      return nextState;
                    },
                  });
                }}
              />

              {answerLength > 0 ? (
                <Text style={{ fontSize: 15 }}>{answerLength}</Text>
              ) : (
                <Text style={{ fontSize: 15 }}>0</Text>
              )}

              <Button
                icon={<PlusCircleOutlined />}
                type="text"
                onClick={() => {
                  addAnswerOptimistic();
                }}
              />
              <Link style={{ marginLeft: "auto" }}>Batch edit</Link>
            </div>

            {availablePresetOptions ? (
              <>
                <div className="tw-flex tw-flex-row tw-gap-2 tw-justify-between tw-items-center">
                  Use preset answers
                  <Form.Item
                    // name="usePresetAnswers"
                    style={{ marginBottom: 0 }}
                  >
                    <Switch
                      size="small"
                      checked={currentQuestionData?.presetanswer}
                      onChange={(event) => {
                        OptionChanges({
                          presetAnswers: event,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
                {currentQuestionData?.presetanswer ? (
                  <Select
                    onChange={(event) => {
                      console.log(event);
                    }}
                    placeholder="Select preset"
                    style={{ width: "100%" }}
                    options={PresetMenuList}
                  />
                ) : null}
              </>
            ) : null}
          </div>
        </Form.Item>

        {/* question basic settings */}
        <Divider style={{ marginBottom: 8, marginTop: 8 }} />

        <Form.Item>
          <div className="tw-flex tw-flex-col tw-gap-1 tw-w-full">
            <div>
              <div className="tw-flex tw-flex-row tw-gap-2 tw-justify-between tw-items-center">
                Response requirement
                <Form.Item style={{ marginBottom: 0 }}>
                  <Switch
                    size="small"
                    checked={currentQuestionData?.isrequired}
                    onChange={(event) => {
                      OptionChanges({
                        useResponseRequirement: event,
                      });
                    }}
                  />
                </Form.Item>
              </div>

              {currentQuestionData?.isrequired ? (
                <div>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Radio.Group
                      value={currentQuestionData?.forcequestionresponse}
                      onChange={(event) => {
                        OptionChanges({
                          forceQuestionResponse: event.target.value,
                        });
                      }}
                    >
                      <Radio value={true}>Force response</Radio>
                      <Radio value={false}>Request response</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              ) : null}
            </div>

            {/*//! Precodes option */}
            {availablePrecodesOptions ? (
              <>
                <div className="tw-flex tw-flex-row tw-gap-2 tw-justify-between tw-items-center">
                  Precodes option
                  <Form.Item name="precodeOption" style={{ marginBottom: 0 }}>
                    <Switch
                      checked={currentQuestionData?.POisselected}
                      onChange={(event) => {
                        OptionChanges({
                          usePrecodesOption: event,
                        });
                      }}
                      size="small"
                    />
                  </Form.Item>
                </div>

                {currentQuestionData?.POisselected ? (
                  <Form.Item>
                    <Radio.Group
                      value={currentQuestionData?.POselectedoption}
                      onChange={(event) => {
                        OptionChanges({
                          selectedPrecodesOption: event.target.value,
                        });
                      }}
                    >
                      <div className="tw-flex tw-flex-col">
                        <Radio value={"shuffle"}>Shuffle answer</Radio>
                        <Radio value={"sort"}>Sort answer</Radio>
                        {/* currentQuestion??.POselectedoption */}
                        {currentQuestionData?.POselectedoption === "shuffle" ? (
                          <Form.Item
                            style={{ marginTop: 8 }}
                            name="shuffleBy"
                            label="Shuffle by"
                          >
                            <Select placeholder="Shuffle by" options={[]} />
                          </Form.Item>
                        ) : currentQuestionData?.POselectedoption === "sort" ? (
                          <Form.Item
                            style={{ marginTop: 8 }}
                            label="Sort direction"
                            name="sortDirection"
                          >
                            <Select
                              placeholder="Sort direction"
                              // defaultValue={"asc"}
                              onChange={(event) => {
                                OptionChanges({
                                  sortDirection: event as "asc" | "dsc",
                                });
                              }}
                              options={[
                                { label: "Ascending", value: "asc" },
                                { label: "Descending", value: "dsc" },
                              ]}
                            />
                          </Form.Item>
                        ) : null}
                      </div>
                    </Radio.Group>
                  </Form.Item>
                ) : null}
              </>
            ) : null}
          </div>
        </Form.Item>
        {/* <Showif /> */}
        {questionType === "single_select"
          ? "more single select settings"
          : null}
        {questionType === "multi_select" ? "more multi select settings" : null}
        {questionType === "slider" ? "more slider settings" : null}
        {questionType === "text_area" ? "more open text settings" : null}
        {questionType === "file_upload" ? "more file upload settings" : null}
      </div>
    </Form>
  );
}

export default React.memo(EditQuestion);
