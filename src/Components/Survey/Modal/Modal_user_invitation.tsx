import { useState, useContext } from "react";
import {
  Button,
  Modal,
  Select,
  Form,
  Checkbox,
  DatePicker,
  Divider,
} from "antd";
import type { SelectProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
//! hooks
import { useAuth } from "../../../Context/Auth/AuthContext";
//! context import
import { UserParticipateContext } from "../../../Pages/Admin/Quantitative/Survey/SurveyEditor/Tab_User_Participate/Subtab_Invite_user/Subtab_Invite_user";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";

type SelectOptions =
  | "All_user"
  | "That_completed_a_specific_survey"
  | "From_a_previously_created_sample"
  | "Based_on_User_Survey_data"
  | "From_third_party_sample";

const selectItems: SelectProps["options"] = [
  { value: "All_user", label: "All User" },
  {
    value: "That_completed_a_specific_survey",
    label: "That completed a specific survey",
  },
  {
    value: "From_a_previously_created_sample",
    label: "From previously created sample",
  },
  { value: "From_third_party_sample", label: "From 3rd party sample" },
  {
    value: "Based_on_User_Survey_data",
    label: "Based on user survey data",
  },
];
const Charitylist = [
  { value: "All Charity", label: "All Charity" },
  { value: "Charity 1", label: "Charity 1" },
  { value: "Charity 2", label: "Charity 2" },
  { value: "Charity 3", label: "Charity 3" },
  { value: "Charity 4", label: "Charity 4" },
  { value: "Charity 5", label: "Charity 5" },
];
const SurveyList = [
  { value: "Survey 1", label: "Survey 1" },
  { value: "Survey 2", label: "Survey 2" },
  { value: "Survey 3", label: "Survey 3" },
  { value: "Survey 4", label: "Survey 4" },
  { value: "Survey 5", label: "Survey 5" },
];
const SampleList = [
  { value: "Sample 1", label: "Sample 1" },
  { value: "Sample 2", label: "Sample 2" },
  { value: "Sample 3", label: "Sample 3" },
  { value: "Sample 4", label: "Sample 4" },
  { value: "Sample 5", label: "Sample 5" },
];
const ThirdpartySampleList = [
  { value: "3rd party sample 1", label: "3rd party sample 1" },
  { value: "3rd party sample 2", label: "3rd party sample 2" },
  { value: "3rd party sample 3", label: "3rd party sample 3" },
  { value: "3rd party sample 4", label: "3rd party sample 4" },
  { value: "3rd party sample 5", label: "3rd party sample 5" },
];

function Modal_user_invitation() {
  const { InviteModalOpen, setInviteModalOpen } = useContext(
    UserParticipateContext
  );
  const { Axios } = useAuth();
  const [surveyID] = useSurveyEditorStore((state) => [
    state.surveyMeta.surveyID,
  ]);
  const [ModalSize, setModalSize] = useState(500);
  const { RangePicker } = DatePicker;
  const [invitationForm] = Form.useForm();
  //! states
  const [CurrentRule, setCurrentRule] = useState<SelectOptions>("All_user");
  const [IsExecuted, setIsExecuted] = useState(false);
  const [AutoEmailUser, setAutoEmailUser] = useState(false);
  const [IncludeAdmmin, setIncludeAdmmin] = useState(false);
  const [IncludeCharity, setIncludeCharity] = useState(false);
  const [SendReminderEmail, setSendReminderEmail] = useState(false);
  const [DateTime, setDateTime] = useState<Dayjs[] | null>([]);
  const [ReminderDate, setReminderDate] = useState<Dayjs | undefined>(
    undefined
  );
  const [SelectedCharity, setSelectedCharity] = useState([]);
  const [Details, setDetails] = useState("All users");
  const [Loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().endOf("day").subtract(1, "day");
  };

  const CreateInvitationRequestBody = {
    include_admin: IncludeAdmmin,
    email_users: AutoEmailUser,
    rule_type: CurrentRule,
    details: Details,
    executed: IsExecuted,
    selected_charity: SelectedCharity,
    start_date: IsExecuted ? dayjs() : DateTime && DateTime[0],
    end_running: DateTime && DateTime[1],
    sending_reminder_date: ReminderDate,
    surveyID: surveyID,
    invite_to: "survey",
  };

  const PostNewRule = async () => {
    setLoading(true);
    await Axios.post("/newInvitaion", {
      CreateInvitationRequestBody,
    })
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        setInviteModalOpen(false);
        queryClient.invalidateQueries([
          "InvitationRuleList",
          "Survey",
          surveyID,
        ]);
      });
  };

  return (
    <Modal
      width={ModalSize}
      title="Create New Invitation Rule"
      footer={null}
      open={InviteModalOpen}
      onCancel={() => {
        setInviteModalOpen(false);
      }}
    >
      <Form
        requiredMark="optional"
        onFinish={PostNewRule}
        form={invitationForm}
        layout="vertical"
        initialValues={{
          selected_rule: "All_user",
        }}
      >
        <div className="tw-flex tw-gap-3">
          <div className="tw-w-full tw-max-w-md">
            <Form.Item
              name="selected_rule"
              rules={[{ required: true }]}
              style={{ marginBottom: 8 }}
              label="Select users from"
            >
              <Select
                onChange={(e: SelectOptions) => {
                  if (e !== "Based_on_User_Survey_data") {
                    setCurrentRule(e);
                    setModalSize(500);
                  } else {
                    setModalSize(1300);
                    setCurrentRule(e);
                  }
                }}
                options={selectItems}
              />
            </Form.Item>

            {/*//! conditional render section */}
            {CurrentRule === "That_completed_a_specific_survey" ? (
              <Form.Item
                name={"selected_survey"}
                rules={[
                  {
                    required:
                      CurrentRule === "That_completed_a_specific_survey",
                    message: "Selected survey cannot be blank",
                  },
                ]}
                style={{ marginBottom: 8 }}
                label="Select survey"
              >
                <Select
                  placeholder="Please select one survey"
                  onChange={(e) => {
                    setDetails(e);
                  }}
                  options={SurveyList}
                />
              </Form.Item>
            ) : null}
            {CurrentRule === "From_a_previously_created_sample" ? (
              <Form.Item
                name={"selected_sample"}
                rules={[
                  {
                    required:
                      CurrentRule === "From_a_previously_created_sample",
                    message: "Selected survey cannot be blank",
                  },
                ]}
                style={{ marginBottom: 8 }}
                label="Select sample"
              >
                <Select
                  placeholder="Please select one sample"
                  onChange={(e) => {
                    setDetails(e);
                  }}
                  options={SampleList}
                />
              </Form.Item>
            ) : null}
            {CurrentRule === "From_third_party_sample" ? (
              <Form.Item
                name={"selected_3rd_party_sample"}
                style={{ marginBottom: 8 }}
                label="Select 3rd party sample"
                rules={[
                  {
                    required: CurrentRule === "From_third_party_sample",
                    message: "Selected survey cannot be blank",
                  },
                ]}
              >
                <Select
                  defaultValue=""
                  onChange={(e) => {
                    setDetails(e);
                  }}
                  options={ThirdpartySampleList}
                />
              </Form.Item>
            ) : null}
            <div className="tw-flex tw-flex-col tw-gap-1 tw-pb-4">
              <Checkbox
                style={{ width: "200px" }}
                checked={IncludeAdmmin}
                onChange={(e) => {
                  setIncludeAdmmin(e.target.checked);
                }}
              >
                Include admins
              </Checkbox>
              <Checkbox
                style={{ width: "200px" }}
                checked={IncludeCharity}
                onChange={(e) => {
                  if (e.target.checked === false) {
                    setSelectedCharity([]);
                  }
                  setIncludeCharity(e.target.checked);
                }}
              >
                Include charity users
              </Checkbox>
              {IncludeCharity ? (
                <div className="tw-pl-6">
                  <Form.Item
                    name="selected_charity"
                    rules={[
                      {
                        required: true,
                        message: "Please select at least 1 charity",
                      },
                    ]}
                    style={{ marginBottom: 0 }}
                    label="Select charity"
                  >
                    <Select
                      onChange={(e) => {
                        setSelectedCharity(e);
                      }}
                      mode="tags"
                      style={{ width: "100%" }}
                      options={Charitylist}
                    />
                  </Form.Item>
                </div>
              ) : null}

              <Divider style={{ marginTop: 16, marginBottom: 16 }} />
              <Form.Item
                name={"Execution time"}
                rules={[
                  {
                    required: !IsExecuted,
                    message: "Execution time cannot be blank",
                  },
                ]}
                style={{ marginBottom: 0 }}
              >
                <RangePicker
                  disabled={IsExecuted}
                  disabledDate={disabledDate}
                  style={{ width: "100%" }}
                  format="DD-MMM-YYYY"
                  onChange={(e) => {
                    setDateTime(e as Dayjs[]);
                  }}
                />
              </Form.Item>
              <Checkbox
                style={{ width: "200px" }}
                checked={IsExecuted}
                onChange={(e) => {
                  if (e.target.checked === true) {
                    setDateTime(null);
                  }
                  setIsExecuted(e.target.checked);
                }}
              >
                Execute rule immediately
              </Checkbox>
              <Checkbox
                style={{ width: "200px" }}
                checked={AutoEmailUser}
                onChange={(e) => {
                  setAutoEmailUser(e.target.checked);
                }}
              >
                Email users automatically
              </Checkbox>
              <Checkbox
                style={{ width: "200px" }}
                checked={SendReminderEmail}
                onChange={(e) => {
                  setSendReminderEmail(e.target.checked);
                  if (e.target.checked === true) {
                    setReminderDate(dayjs());
                  } else {
                    setReminderDate(undefined);
                  }
                }}
              >
                Schedule reminder email
              </Checkbox>
              <div className="tw-pl-6">
                {SendReminderEmail ? (
                  <Form.Item
                    name={"scheduled_reminder_date"}
                    rules={[
                      {
                        required: SendReminderEmail,
                        message: "Schedule reminder date cannnot ba blank",
                      },
                    ]}
                  >
                    <DatePicker
                      disabledDate={disabledDate}
                      placeholder="Select date & time"
                      style={{ width: "100%", marginTop: 8 }}
                      showTime
                      onOk={(e) => {
                        setReminderDate(e);
                      }}
                    />
                  </Form.Item>
                ) : null}
              </div>
            </div>
          </div>
          {CurrentRule === "Based_on_User_Survey_data" ? (
            <div className="tw-h-96 tw-bg-slate-50 tw-rounded-lg tw-flex tw-flex-1 tw-justify-center tw-items-center">
              <div> Query builder</div>
            </div>
          ) : null}
        </div>
        <div className="tw-flex tw-flex-row tw-gap-2 tw-mt-4 tw-justify-end">
          <Button
            onClick={() => {
              setInviteModalOpen(false);
            }}
            type="text"
          >
            Cancel
          </Button>
          <Button loading={Loading} htmlType="submit" type="primary">
            Invite users
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default Modal_user_invitation;
