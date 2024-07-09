import { CopyOutlined, InboxOutlined, SaveOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
import type { RcFile } from "antd/es/upload";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../../Context/Auth/AuthContext";
import { StatusOption } from "../../../../../../Interface/SurveyEditorInterface";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";

const { RangePicker } = DatePicker;

const selectOptions: StatusOption[] = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Draft",
    label: "Draft",
  },
  {
    value: "Closed",
    label: "Closed",
  },
];

function Tab_detail() {
  // const { SurveyData, NewSurvey, surveyID } = useContext(SurveyEditorContext);
  const [DetailForm] = Form.useForm();
  const queryClient = useQueryClient();

  const [icon, seticon] = useState<RcFile | null>();
  const [Loading, setLoading] = useState<boolean>(false);
  const [Saving, setSaving] = useState<boolean>(false);
  const [SetSurveyEditorTabs, surveyMeta, surveyData, setSurveyMeta] =
    useSurveyEditorStore((state) => [
      state.SetSurveyEditorTabs,
      state.surveyMeta,
      state.surveyData,
      state.setSurveyMeta,
    ]);
  const navigate = useNavigate();
  const { Axios, AuthUser, notificationApi } = useAuth();

  const surveyID = surveyMeta.surveyID;
  const NewSurvey = surveyMeta.isCreateNew;

  console.log(NewSurvey);
  const { pathname } = window.location;
  const path = pathname.split("/");
  const lastPath = path[path.length - 1];

  console.log(lastPath);

  useEffect(() => {
    setSurveyMeta({
      isCreateNew: lastPath === "Newsurvey",
      surveyID: "",
      queryKey: "",
    });
  }, []);

  const handleAvatarUpload = (file: RcFile) => {
    // Check if file is an image
    if (!file.type.includes("image/")) {
      message.error("You can only upload image files!");
      return false;
    }

    // Check file size
    const fileSize = file.size / 1024 / 1024; // in MB
    if (fileSize > 2) {
      message.error("Image must be smaller than 2MB!");
      return false;
    }

    // Save file to state
    seticon(file);
    return true;
  };

  const projectNameRef = Form.useWatch("projectName", DetailForm);
  const surveyStatusRef = Form.useWatch("surveyStatus", DetailForm);
  const descriptionRef = Form.useWatch("description", DetailForm);
  const surveyTypeRef = Form.useWatch("surveyType", DetailForm);
  const progressBarRef = Form.useWatch("progressBar", DetailForm);
  const backwardNavRef = Form.useWatch("backwardNav", DetailForm);
  const saveResumeRef = Form.useWatch("saveResume", DetailForm);
  const openLinkRef = Form.useWatch("openLink", DetailForm);
  const surveyExpiredRef = Form.useWatch("surveyExpired", DetailForm);

  const FormItemStyle = { marginBottom: 16 };

  // create new survey
  const createNewSurvey = async (): Promise<void> => {
    const Postbody = {
      projectName: projectNameRef || "",
      description: descriptionRef,
      status: surveyStatusRef || "Draft",
      type: surveyTypeRef || "regular",
      progressBar: progressBarRef || false,
      backwardNav: backwardNavRef || false,
      saveResume: saveResumeRef || false,
      openLink: openLinkRef || false,
      surveyExpired: surveyExpiredRef || false,
      userID: AuthUser?.id,
    };
    console.log(AuthUser);

    setLoading(true);
    await Axios.post(`/survey`, Postbody).then((response) => {
      console.log(response);
      const id = response.data.id;
      setLoading(false);
      window.location.href = `/admin/Quantitative/Survey/${id}?tab=build&edit=question`;
    });
  };
  // Update survey detail
  const updateSurveyDetails = async (): Promise<void> => {
    const Putbody = {
      projectName: projectNameRef,
      description: descriptionRef,
      status: surveyStatusRef,
      type: surveyTypeRef,
      progressBar: progressBarRef,
      backwardNav: backwardNavRef,
      saveResume: saveResumeRef,
      openLink: openLinkRef,
      surveyExpired: surveyExpiredRef,
    };

    setSaving(true);
    await Axios.put(`survey/${surveyID}/update_details`, Putbody).then(
      (response) => {
        setSaving(false);
        notificationApi.success({
          message: response.data,
        });
      }
    );
    queryClient.invalidateQueries({ queryKey: ["SurveyData", surveyID] });
  };

  const updateSurveyStatus = async (): Promise<void> => {
    await Axios.put(`survey/${surveyID}/update_status`, {
      status: surveyStatusRef || surveyData?.detail?.status,
    })
      .then(() => {
        setSaving(false);
        notificationApi.success({
          message: "Success",
        });
      })
      .catch((err) => {
        notificationApi.error({
          message: err.message,
        });
      });
  };

  return (
    <Form
      form={DetailForm}
      layout="vertical"
      requiredMark={"optional"}
      initialValues={{
        projectName: NewSurvey ? "" : surveyData?.detail?.name,
        description: NewSurvey ? "" : surveyData?.detail?.description,
        surveyStatus: NewSurvey ? "Draft" : surveyData?.detail?.status,
        surveyType: NewSurvey ? "regular" : surveyData?.detail?.type,
        progressBar: NewSurvey ? false : surveyData?.detail?.progressbar,
        backwardNav: NewSurvey ? false : surveyData?.detail?.backwardnav,
        saveResume: NewSurvey ? false : surveyData?.detail?.saveresume,
        openLink: NewSurvey ? false : surveyData?.detail?.openlink,
        surveyExpired: NewSurvey ? false : surveyData?.detail?.surveyexpire,
      }}
      onFinish={() => {
        // createNewSurvey();
      }}
    >
      <Row gutter={16} style={{ height: "calc(100vh - 161px)" }}>
        <Col span={8}>
          <Form.Item
            style={FormItemStyle}
            name={"projectName"}
            label="Project Name"
            rules={[
              {
                required: true,
                message: "Project name cannot be blank",
              },
            ]}
          >
            <Input placeholder="Project name" />
          </Form.Item>
          <Form.Item style={FormItemStyle}>
            <div style={{ height: "200px", overflow: "hidden" }}>
              <Upload.Dragger
                style={{ height: "100%" }}
                name="avatar"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={handleAvatarUpload}
              >
                {/* <PlusOutlined /> */}
                {icon ? (
                  <div className="tw-relative tw-object-cover tw-overflow-hidden tw-flex tw-justify-center tw-rounded-md tw-px-4">
                    <img
                      style={{
                        width: "100%",
                        height: "165px",
                        objectFit: "cover",
                        overflow: "hidden",
                        borderRadius: 4,
                      }}
                      src={URL.createObjectURL(icon)}
                      alt="avatar"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="">
                      <InboxOutlined style={{ fontSize: "32px" }} />
                    </p>
                    <p className="">
                      Click or drag file to this area to upload
                    </p>
                  </div>
                )}
              </Upload.Dragger>
            </div>
          </Form.Item>

          <Form.Item style={FormItemStyle} name={"description"}>
            <Input.TextArea
              rows={10}
              placeholder="Desctiption (optional)"
              maxLength={500}
            />
          </Form.Item>
        </Col>
        <Col span={16}>
          <div className="tw-flex tw-flex-row tw-gap-2 tw-mb-4 tw-items-end">
            <Form.Item
              style={{ marginBottom: 0 }}
              name={"surveyStatus"}
              label="Set status"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                style={{
                  width: 400,
                }}
                options={selectOptions}
              />
            </Form.Item>

            <Button
              disabled={NewSurvey}
              ghost
              type="primary"
              style={{ marginRight: "auto" }}
              onClick={() => {
                updateSurveyStatus();
              }}
            >
              Apply
            </Button>
            <Button
              disabled={NewSurvey}
              loading={Saving}
              icon={<SaveOutlined />}
              onClick={() => {
                updateSurveyDetails();
              }}
            >
              Save
            </Button>
            {NewSurvey ? (
              <Button
                loading={Loading}
                onClick={() => {
                  createNewSurvey();
                }}
                type={"primary"}
                htmlType="submit"
              >
                Create New Survey
              </Button>
            ) : (
              <Button
                onClick={() => {
                  navigate(`${window.location.pathname}#Build`);
                  // setCurrentTab(2);
                  SetSurveyEditorTabs("build");
                }}
                type={"primary"}
              >
                Edit Survey
              </Button>
            )}
          </div>
          <Typography.Title level={5}>General Settings</Typography.Title>
          <Space size={"large"} align="start" wrap>
            <Form.Item
              name={"surveyType"}
              label="Type"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value={"regular"}>Regular</Radio>
                  <Radio value={"poll"}>Poll </Radio>
                  <Radio value={"profile"}>Profile </Radio>
                  <Radio value={"background"}>Background </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name={"progressBar"}
              label="Show progress bar"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name={"backwardNav"}
              label="Allow backward navigation"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name={"saveResume"}
              label="Allow save & resume later"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Space>
          <div className="tw-flex tw-gap-4 tw-items-end tw-mb-4">
            <Form.Item
              name={"openLink"}
              label="Open link"
              style={{ marginBottom: 0 }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            {openLinkRef ? (
              <Input.Group compact style={{ width: 400 }}>
                <Input
                  style={{ width: "90%" }}
                  defaultValue="https://singapore.insightrix.com/#!/u/surveys/openLink/conduct?token=DHFgBYac9wvewgEytAnd83ygrk07mwOIkCygY1/EfzN/ja2+ug13AkkMw4Z1VzdEbk2zr2dS4qgjChuERppbyo8J+N6ycHeNdJrYNFPwVIrKoHRcRJbUSKO/qfkOFzDs+/7g8H3rL4a7ox0lF9Pall9ZOQFS1OpuU5d8v81mUmIEclBhcgfDqKBfSj4hUvU48wNsSS22kWr2THL5QdclVX8frKozlHgqv4KL5uhtHZRG2V0="
                />
                <Button
                  type="primary"
                  style={{ width: "10%" }}
                  icon={<CopyOutlined />}
                />
              </Input.Group>
            ) : null}
          </div>
          <div className="tw-flex tw-gap-4">
            <Space direction="vertical">
              <Typography.Title level={5}>Response Settings</Typography.Title>
              <Form.Item
                name={"surveyExpired"}
                label="Survey Expiration"
                style={{ marginBottom: 0 }}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio value={false}>
                      Always open for responses collecting
                    </Radio>
                    <Radio value={true}>Set survey duration</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
              {surveyExpiredRef ? (
                <div
                  style={{
                    marginTop: "8px",
                  }}
                >
                  <RangePicker />
                  <Form.Item label={"Expired survey message"}>
                    <Radio.Group defaultValue={"default"}>
                      <Space direction="vertical">
                        <Radio value={"default"}>Default</Radio>
                        <Radio value={"custom"}>
                          Custom <a>Edit Message</a>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              ) : null}
            </Space>
            <div
              style={{
                width: "1px",
                backgroundColor: "rgba(5, 5, 5, 0.06)",
                marginBottom: 24,
                marginRight: 24,
                marginLeft: 8,
              }}
            />
            <Space direction="vertical">
              <Typography.Title level={5}>Response Settings</Typography.Title>
              <Form.Item
                name={"surveyExpired"}
                label="Survey Expiration"
                style={{ marginBottom: 0 }}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio value={false}>
                      Always open for responses collecting
                    </Radio>
                    <Radio value={true}>Set survey duration</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Space>
          </div>
          <Divider />
          <Space direction="vertical">
            <Typography.Title level={5}>User side Settings</Typography.Title>
            This settings will show on user dashboard
            <Space>
              <Form.Item name={"estimateTime"} style={{ marginBottom: 0 }}>
                <InputNumber /> Minutes Estimate time
              </Form.Item>
              <Form.Item name={"estimateTime"} style={{ marginBottom: 0 }}>
                <InputNumber /> Points/Rewards
              </Form.Item>
            </Space>
          </Space>
        </Col>
      </Row>
    </Form>
  );
}

export default Tab_detail;
