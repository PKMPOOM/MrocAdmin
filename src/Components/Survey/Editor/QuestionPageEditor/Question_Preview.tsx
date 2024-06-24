import { Checkbox, Input, Radio, Typography } from "antd";

const { Text } = Typography;
// import PageBreak from "../../QuestionType/PageBreak";
// import ICSlider from "../../QuestionType/ICSlider";
import { FaFileUpload } from "react-icons/fa";
import { Question } from "../../../../Interface/SurveyEditorInterface";
import ICSlider from "../../../QuestionType/IcSlider";
import PageBreak from "../../../QuestionType/PageBreak";
import QuestionLogic from "./Sub_components/QuestionLogic";
import { useShallow } from "zustand/react/shallow";
import React from "react";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";

type QuestionPreviewProps = {
  pageSize: number;
  question: Question;
  pIndex: number;
  qIndex: number;
};

function Question_Preview({ pageSize, pIndex, qIndex }: QuestionPreviewProps) {
  const isLastIndex = pageSize - 1 === qIndex;
  const [setActiveQ, question] = useSurveyEditorStore(
    useShallow((state) => [
      state.SetActiveQuestion,
      state.surveyData?.questionlist[pIndex].questions[qIndex],
    ])
  );

  if (!question) {
    return null;
  }

  switch (question.type) {
    case "page_break":
      return <div>page break</div>;

    default:
      return (
        <>
          <div
            className={`tw-p-2 relative duration-200 hover:tw-bg-[#f7fdff] tw-rounded-md tw-cursor-pointer`}
            onClick={() => {
              setActiveQ(pIndex, qIndex, question.id);
            }}
          >
            <div
              id={`Q${pIndex + 1}${qIndex + 1}`}
              style={{
                position: "absolute",
                top: "-50px",
                zIndex: 9999,
              }}
            />
            <div className="tw-flex tw-gap-5">
              <Text style={{ fontSize: 16 }}>{question.label}</Text>
              <QuestionLogic
                questiontype={question.type}
                forcerequired={question.forcequestionresponse}
                required={question.isrequired}
                presetoption={question.POselectedoption}
                sortdir={question.sortdir}
                useprecodeoptions={question.POisselected}
              />
            </div>
            <div className="tw-flex tw-flex-col tw-gap-1 tw-mt-2">
              {question.type === "single_select" &&
                question.answers?.map((answer, index) => (
                  <div
                    key={index}
                    className={`tw-flex  ${
                      answer.openEndDirection === "horizontal"
                        ? "tw-flex-row tw-items-center "
                        : "tw-flex-col "
                    }`}
                  >
                    <Radio>{answer.label}</Radio>
                    {answer.openend ? (
                      <Input
                        placeholder={"please answer"}
                        style={{
                          marginLeft:
                            answer.openEndDirection === "horizontal"
                              ? "0"
                              : "24px",
                          width: "50%",
                        }}
                      />
                    ) : null}
                  </div>
                ))}

              {question.type === "multi_select" &&
                question.answers.map((answer, index) => (
                  <div key={index}>
                    <Checkbox>{answer.label}</Checkbox>
                  </div>
                ))}

              {question.type === "slider" && (
                <ICSlider scale={question.answers} />
              )}
              
              {question.type === "text_area" && (
                <Input.TextArea placeholder="please answer" />
              )}

              {question.type === "file_upload" && <FaFileUpload />}
            </div>
          </div>
          {!isLastIndex && (
            <>
              <PageBreak isBreak={false} pIndex={pIndex} qIndex={qIndex} />
            </>
          )}
        </>
      );
  }
}

export default React.memo(Question_Preview);
