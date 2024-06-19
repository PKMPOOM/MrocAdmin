import { Checkbox, Input, Radio, Typography } from "antd";
import { FaFileUpload } from "react-icons/fa";
import ICSlider from "~/component/QuestionType/IcSlider";
import QuestionLogic from "~/component/Survey/Editor/QuestionPageEditor/Sub_components/QuestionLogic";
import { Question } from "~/interface/SurveyEditorInterface";
const { Text } = Typography;

type QuestionPreviewProps = {
  pageSize: number;
  Previewquestion: Question;
  pIndex: number;
  qIndex: number;
};

function GenerativeQuestionPreview({
  pIndex,
  qIndex,
  Previewquestion,
}: QuestionPreviewProps) {
  if (!Previewquestion) {
    return null;
  }

  switch (Previewquestion.type) {
    case "page break":
      return <div>page break</div>;

    default:
      return (
        <>
          <div
            className={`tw-p-2 relative duration-200 hover:tw-bg-[#f7fdff] tw-rounded-md tw-cursor-pointer`}
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
              <Text style={{ fontSize: 16 }}>{Previewquestion.label}</Text>
              <QuestionLogic
                questiontype={Previewquestion.type}
                forcerequired={Previewquestion.forcequestionresponse}
                required={Previewquestion.isrequired}
                presetoption={Previewquestion.POselectedoption}
                sortdir={Previewquestion.sortdir}
                useprecodeoptions={Previewquestion.POisselected}
              />
            </div>
            <div className="tw-flex tw-flex-col tw-gap-1 tw-mt-2">
              {Previewquestion.type === "single_select" &&
                Previewquestion.answers?.map((answer, index) => (
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

              {Previewquestion.type === "multi_select" &&
                Previewquestion.answers.map((answer, index) => (
                  <div key={index}>
                    <Checkbox>{answer.label}</Checkbox>
                  </div>
                ))}

              {Previewquestion.type === "slider" && (
                <ICSlider scale={Previewquestion.answers} />
              )}

              {Previewquestion.type === "file_upload" && <FaFileUpload />}
            </div>
          </div>
        </>
      );
  }
}

export default GenerativeQuestionPreview;
