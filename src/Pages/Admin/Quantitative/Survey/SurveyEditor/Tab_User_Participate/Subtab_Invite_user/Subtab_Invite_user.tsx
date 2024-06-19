import React, { useState, createContext } from "react";
import { Button, Space, Table, Dropdown } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import Modal_user_invitation from "../../../../../../../Components/Survey/Modal/Modal_user_invitation";
import { UserParticipateTableData } from "../../../../../../../Interface/SurveyEditorInterface";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../../../../Context/Auth/AuthContext";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";

type InviteUserContext = {
  InviteModalOpen: boolean;
  setInviteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  DatePickerModalOpen: boolean;
  setDatePickerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

//! exort context
export const UserParticipateContext = createContext<InviteUserContext>(
  {} as InviteUserContext
);

const dropdownItems = [
  {
    key: "Send now",
    label: "Send now",
  },
  {
    key: "Schedule send",
    label: "Schedule send",
  },
];

function Tab_UserParticipatingInviteUser() {
  const { Axios } = useAuth();
  const [surveyID] = useSurveyEditorStore((state) => [
    state.surveyMeta.surveyID,
  ]);
  const [InviteModalOpen, setInviteModalOpen] = useState(false);
  const [DatePickerModalOpen, setDatePickerModalOpen] = useState(false);

  //! row selection function
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const hasSelected = selectedRowKeys.length > 0;

  const columns: ColumnsType<UserParticipateTableData> = [
    {
      title: "Rule type",
      dataIndex: "rule_type",
      key: "rule_type",
      ellipsis: true,
      render: (_: any, records) => (
        <div>{records.rule_type.replace("_", " ")}</div>
      ),
    },
    {
      title: "Include admin",
      dataIndex: "include_admin",
      key: "include_admin",
      render: (_: any, records) => (
        <div>{records.include_admin ? "Yes" : "No"}</div>
      ),
      width: 150,
    },
    {
      title: "Notify users",
      dataIndex: "email_users",
      key: "email_users",
      render: (_: any, records) => (
        <div>{records.email_users ? "Yes" : "No"}</div>
      ),
      width: 150,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (_: any, records) => <>{records.details}</>,
    },
    {
      title: "Start",
      dataIndex: "start_running_on",
      key: "start_running_on",
      render: (_: any, records) => (
        <div>
          {records.start_date
            ? dayjs(records.start_date).format("DD-MMM-YYYY")
            : "-"}
        </div>
      ),
      width: 150,
    },
    {
      title: "End",
      dataIndex: "end_running",
      key: "end_running",
      render: (_: any, records) => (
        <div>
          {records.end_running
            ? dayjs(records.end_running).format("DD-MMM-YYYY")
            : // todo should render button to stop the invitation rule
              "-"}
        </div>
      ),
      width: 150,
    },
    {
      title: "Reminder email",
      dataIndex: "reminder_email",
      key: "reminder_email",
      render: (_: any, records) => {
        return (
          <div>
            <Dropdown
              menu={{
                items: dropdownItems,
                onClick: ({ key }) => {
                  console.log(key, records.id);
                },
              }}
            >
              <a
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Space>
                  Send email
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        );
      },
      width: 150,
    },
    {
      title: "Reminder date",
      dataIndex: "sending_reminder_date",
      key: "sending_reminder_date",
      render: (_: any, records) => (
        <div>
          {records.sending_reminder_date
            ? dayjs(records.sending_reminder_date).format("DD-MMM-YYYY")
            : "-"}
        </div>
      ),
      width: 150,
    },
  ];

  const contextValue = {
    InviteModalOpen,
    setInviteModalOpen,
    DatePickerModalOpen,
    setDatePickerModalOpen,
  };

  const fetchInvitationRuleList = async () => {
    const response = await Axios.get(
      `survey/${surveyID}/survey_user_participate`
    );
    return response.data;
  };
  const {
    data: userInvitationRuleList,
    isLoading,
    isFetching,
  } = useQuery<UserParticipateTableData[]>({
    queryKey: ["InvitationRuleList", "Survey", surveyID],
    queryFn: () => fetchInvitationRuleList(),
    refetchOnWindowFocus: false,
  });

  return (
    <UserParticipateContext.Provider value={contextValue}>
      <div className="tw-flex tw-flex-col tw-gap-4">
        <div className="tw-flex tw-flex-row tw-gap-2">
          <Button
            onClick={() => {
              setInviteModalOpen(true);
            }}
            icon={<PlusOutlined />}
            type="primary"
          >
            New invitation rule
          </Button>
          <Button disabled={!hasSelected} icon={<DeleteOutlined />} danger>
            Delete
          </Button>
          <Button disabled={!hasSelected} icon={<EditOutlined />} type="dashed">
            Copy
          </Button>
        </div>
        <Table
          loading={isLoading || isFetching}
          rowSelection={{
            selectedRowKeys,
            onChange: (e) => {
              onSelectChange(e);
            },
          }}
          pagination={{
            defaultPageSize: 20,
          }}
          scroll={{
            y: "calc(100vh - 400px)",
          }}
          dataSource={userInvitationRuleList}
          columns={columns}
        />
      </div>
      <Modal_user_invitation />
    </UserParticipateContext.Provider>
  );
}

export default Tab_UserParticipatingInviteUser;
