import { Checkbox, Input, Radio, Typography } from "antd";
import { FaFileUpload } from "react-icons/fa";
import ICSlider from "~/component/QuestionType/IcSlider";
import { Answer } from "~/interface/SurveyEditorInterface";
const { Text } = Typography;

export type AIQuestionPreviewProps = {
  label: string;
  choices: string[];
  type: string;
};

function GenerativeQuestionPreview({
  choices,
  label,
  type,
}: AIQuestionPreviewProps) {
  if (!label) {
    return "loading";
  }

  switch (type) {
    case "page break":
      return <div>page break</div>;

    default:
      return (
        <div
          className={`tw-p-2 relative duration-200 hover:tw-bg-[#f7fdff] tw-rounded-md tw-cursor-pointer `}
        >
          <div
            style={{
              position: "absolute",
              top: "-50px",
              zIndex: 9999,
            }}
          />
          <div className="tw-flex tw-gap-5">
            <Text style={{ fontSize: 16 }}>{label}</Text>
          </div>
          <div className="tw-flex tw-flex-col tw-gap-1 tw-mt-2">
            {type === "single_select" && (
              <Radio.Group>
                {choices.map((answer, index) => (
                  <div key={index} className={`tw-flex`}>
                    <Radio value={answer}>{answer}</Radio>
                  </div>
                ))}
              </Radio.Group>
            )}

            {type === "multi_select" && (
              <Checkbox.Group>
                <div className=" tw-flex tw-flex-col tw-gap-1">
                  {choices.map((answer, index) => (
                    <Checkbox key={index} value={answer}>
                      {answer}
                    </Checkbox>
                  ))}
                </div>
              </Checkbox.Group>
            )}

            {type === "text" && <Input.TextArea placeholder="please answer" />}

            {type === "slider" && (
              <ICSlider
                scale={choices.map((answer, idx) => {
                  const newAnswer: Answer = {
                    label: answer,
                    id: idx.toString(),
                    index: idx,
                    ai_categorize: false,
                    ai_categorize_list: [],
                    exclusive: false,
                    key: idx.toString(),
                    forceopenendresponse: false,
                    number_only: false,
                    openend: false,
                    openEndDirection: "horizontal",
                    questionsId: "0",
                  };

                  return newAnswer;
                })}
              />
            )}

            {type === "file_upload" && <FaFileUpload />}
          </div>
        </div>
      );
  }
}

export default GenerativeQuestionPreview;
