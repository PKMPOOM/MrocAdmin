import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
  Steps,
  Typography,
  theme,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { useParams } from "react-router-dom";
import CustomContainer from "~/component/Global/CustomContainer";
import ErrorFallback from "~/component/Global/Suspense/ErrorFallback";
import LoadingFallback from "~/component/Global/Suspense/LoadingFallback";
import ICSlider from "~/component/QuestionType/IcSlider";
import PreviewNav from "~/component/Survey/Preview/PreviewNav";
import { getPreviewSurveyData } from "./api";
const { Text } = Typography;
const { useToken } = theme;

const SurveyPreview = () => {
  document.title = "MROC | Survey Preview";
  const { id } = useParams();
  const { data, error, isLoading } = getPreviewSurveyData(id);
  const [current, setCurrent] = useState(0);
  const [AllowNext, setAllowNext] = useState(false);
  const { token } = useToken();
  const [form] = Form.useForm();

  if (isLoading || !data) {
    return <LoadingFallback />;
  }

  if (error) {
    return <ErrorFallback errorTitle="Error loading Survey" />;
  }

  const { detail, questionlist } = data;

  if (detail.expireddate && dayjs(detail.expireddate) < dayjs()) {
    return <>Expired bro</>;
  }

  const totalPage = questionlist.length;

  return (
    <div className="  tw-w-full ">
      <PreviewNav />
      <CustomContainer className=" 2xl:tw-max-w-6xl tw-p-5 tw-gap-2  tw-w-full tw-rounded-lg ">
        <Steps
          progressDot
          size="small"
          current={current}
          items={questionlist.map((item) => ({ title: item.header }))}
        />

        <Form layout="vertical" form={form} onFinish={(e) => console.log(e)}>
          {questionlist.map((page, index) => {
            return (
              <div
                key={page.id}
                className={` ${
                  current === index ? "tw-flex" : "tw-hidden"
                } tw-p-6 tw-bg-white  tw-justify-start tw-flex-col tw-gap-4 tw-rounded-lg tw-mb-8 tw-border tw-shadow-md `}
              >
                {page.questions.map((question) => {
                  return (
                    <div
                      key={question.id}
                      className={`tw-p-2 relative duration-200 tw-rounded-md  `}
                      style={{
                        outline: `1px solid ${token.colorBorderSecondary}`,
                      }}
                    >
                      <div className="tw-flex tw-flex-col tw-gap-1 tw-mt-2">
                        {question.type === "single_select" && (
                          <Form.Item
                            name={[question.label, "single-select"]}
                            rules={[
                              {
                                required: question.isrequired,
                                message: "Please select an answer",
                              },
                              {
                                validator: async ({ required }, value) => {
                                  if (required && !value) {
                                    setAllowNext(false);
                                    return Promise.reject(
                                      new Error("no answer")
                                    );
                                  } else {
                                    setAllowNext(true);
                                    return Promise.resolve();
                                  }
                                },
                              },
                            ]}
                            label={
                              <Text style={{ fontSize: 16 }}>
                                {question.label}
                              </Text>
                            }
                          >
                            <Radio.Group>
                              {question.answers.map((answer, index) => (
                                <div
                                  key={index}
                                  className="tw-flex tw-flex-col"
                                >
                                  <Radio value={answer.id}>
                                    {answer.label}
                                  </Radio>

                                  {answer.openend ? (
                                    <Form.Item
                                      name={[question.label, "open-end"]}
                                      rules={[
                                        {
                                          validator: async (_, value) => {
                                            console.log(
                                              answer.forceopenendresponse
                                            );

                                            if (
                                              answer.forceopenendresponse &&
                                              !value
                                            ) {
                                              setAllowNext(false);
                                              return Promise.reject(
                                                new Error("Answer required")
                                              );
                                            } else {
                                              setAllowNext(true);
                                              return Promise.resolve();
                                            }
                                          },
                                        },
                                      ]}
                                    >
                                      {answer.number_only ? (
                                        <InputNumber
                                          placeholder={"open-end label"}
                                          style={{
                                            width: "100%",
                                            marginLeft: "24px",
                                            marginTop: "8px",
                                          }}
                                        />
                                      ) : (
                                        <Input
                                          placeholder={"open-end label"}
                                          style={{
                                            marginLeft: "24px",
                                            marginTop: "8px",
                                          }}
                                        />
                                      )}
                                    </Form.Item>
                                  ) : null}
                                </div>
                              ))}
                            </Radio.Group>
                          </Form.Item>
                        )}

                        {question.type === "multi_select" && (
                          <Form.Item
                            name={question.label}
                            label={
                              <Text style={{ fontSize: 16 }}>
                                {question.label}
                              </Text>
                            }
                          >
                            <Checkbox.Group>
                              <Space direction="vertical">
                                {question.answers.map((answer) => (
                                  <Checkbox key={answer.id} value={answer.id}>
                                    {answer.label}
                                  </Checkbox>
                                ))}
                              </Space>
                            </Checkbox.Group>
                          </Form.Item>
                        )}

                        {question.type === "slider" && (
                          <ICSlider scale={question.answers} />
                        )}

                        {question.type === "file_upload" && <FaFileUpload />}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div className=" tw-flex tw-gap-4 tw-w-full tw-justify-between">
            {current > 0 && (
              <Button
                onClick={() => {
                  setCurrent((prev) => prev - 1);
                }}
              >
                Back
              </Button>
            )}

            {current < totalPage - 1 && (
              <Button
                style={{
                  marginLeft: "auto",
                }}
                disabled={!AllowNext}
                type="primary"
                htmlType="submit"
                onClick={() => {
                  // setCurrent((prev) => prev + 1);
                  form.validateFields().then((values) => {
                    console.log(values);
                    // setCurrent((prev) => prev + 1);
                  });
                }}
              >
                Next
              </Button>
            )}

            {current === totalPage - 1 && (
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            )}
          </div>
        </Form>
      </CustomContainer>
      {/* <ResizablePreviewSurveyContainer>
      </ResizablePreviewSurveyContainer> */}
    </div>
  );
};

export default SurveyPreview;
