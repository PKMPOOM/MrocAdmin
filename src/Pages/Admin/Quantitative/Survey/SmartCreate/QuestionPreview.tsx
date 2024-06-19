import { Checkbox, Input, Radio, Typography } from "antd";
import { FaFileUpload } from "react-icons/fa";
const { Text } = Typography;

type QuestionPreviewProps = {
  label: string;
  choices: string[];
  type: string;
};

function GenerativeQuestionPreview({
  choices,
  label,
  type,
}: QuestionPreviewProps) {
  if (!label) {
    return "loading";
  }

  switch (type) {
    case "page break":
      return <div>page break</div>;

    default:
      return (
        <>
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
              {/* <QuestionLogic
                questiontype={Previewquestion.type}
                forcerequired={Previewquestion.forcequestionresponse}
                required={Previewquestion.isrequired}
                presetoption={Previewquestion.POselectedoption}
                sortdir={Previewquestion.sortdir}
                useprecodeoptions={Previewquestion.POisselected}
              /> */}
            </div>
            <div className="tw-flex tw-flex-col tw-gap-1 tw-mt-2">
              {type === "single_select" &&
                choices?.map((answer, index) => (
                  <div key={index} className={`tw-flex`}>
                    <Radio>{answer}</Radio>
                    {/* {answer.openend ? (
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
                    ) : null} */}
                  </div>
                ))}

              {type === "multi_select" &&
                choices.map((answer, index) => (
                  <div key={index}>
                    <Checkbox>{answer}</Checkbox>
                  </div>
                ))}
              {type === "text" && (
                <Input.TextArea placeholder="please answer" />
              )}

              {/* {type === "slider" && (
                <ICSlider scale={answers} />
              )} */}

              {type === "file_upload" && <FaFileUpload />}
            </div>
          </div>
        </>
      );
  }
}

export default GenerativeQuestionPreview;
