import {
  Button,
  Space,
  Table,
  Dropdown,
  MenuProps,
  Tag,
  Popconfirm,
} from "antd";
import React, { createContext, useMemo, useState } from "react";
import {
  PlusOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  EditOutlined,
  LinkOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import Modal_Invite_User_External from "../../../../../Components/Users/Modal_Invite_User_External";
import Modal_View_External_Invite_List from "../../../../../Components/Users/Modal_View_External_Invite_List";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../../../Context/Auth/AuthContext";

export type ExternalUserInvitationDataSchema = {
  id: string;
  key: number;
  name: string;
  api_key: string;
  survey_id: string;
  conditions: ("qualified" | "terminated" | "overquota" | "partials")[];
  extra_conditions: string;
  form_description?: string;
};

type ContextValue = {
  InviteModalOpen: boolean;
  setInviteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ActiveHistoryData: ExternalUserInvitationDataSchema | undefined;
  setActiveHistoryData: React.Dispatch<
    React.SetStateAction<ExternalUserInvitationDataSchema | undefined>
  >;
  ViewListModalOpen: boolean;
  setViewListModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ExternalInvitationContext = createContext<ContextValue>(
  {} as ContextValue
);

const tableDropdownItems: MenuProps["items"] = [
  {
    key: "share",
    label: "Share",
    icon: <LinkOutlined />,
    disabled: true,
  },
  {
    key: "delete",
    label: "Delete",
    icon: <DeleteOutlined />,
    danger: true,
  },
];

const Invite_External_Community = React.memo(() => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [InviteModalOpen, setInviteModalOpen] = useState(false);
  const [ViewListModalOpen, setViewListModalOpen] = useState(false);
  const [ActiveHistoryData, setActiveHistoryData] = useState<
    ExternalUserInvitationDataSchema | undefined
  >(undefined);
  const { Axios, AuthUser } = useAuth();
  const disableButton = selectedRowKeys.length === 0;

  const queryClient = useQueryClient();

  const fetchInvitaionHistory = async () => {
    const response = await Axios.get(`/invitation`);
    return response.data;
  };

  const {
    data: invitationHistory,
    isLoading,
    isFetching,
  } = useQuery<ExternalUserInvitationDataSchema[]>({
    queryKey: ["invitationhistory", AuthUser?.id],
    queryFn: fetchInvitaionHistory,
    refetchOnWindowFocus: false,
  });

  const ondropdownclick = async ({ key }: { key: string }, id: string) => {
    switch (key) {
      case "delete":
        console.log(id);
        await Axios.delete(`/invitation/${id}`);
        queryClient.invalidateQueries(["invitationhistory", AuthUser?.id]);
        break;
      default:
        console.log("non existing key");
        break;
    }
  };

  const selectedRowIDs = invitationHistory
    ?.filter((item) => selectedRowKeys.includes(item.key))
    .map((item) => item.id);

  const deleteMultipleRecords = async () => {
    await Axios.delete("/invitation/multiple", {
      data: {
        selectedRowIDs,
      },
    });
    setSelectedRowKeys([]);
    queryClient.invalidateQueries(["invitationhistory", AuthUser?.id]);
  };

  const columns: ColumnsType<ExternalUserInvitationDataSchema> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, records) => (
        <div className="tw-flex tw-flex-col tw-gap-0.5">
          <p>{records.name}</p>
          <p className="tw-text-xs tw-text-slate-500">
            {" "}
            {records.form_description}
          </p>
        </div>
      ),
    },
    {
      title: "Survey ID	",
      dataIndex: "survey_id",
      key: "survey_id",
      width: 200,
    },

    {
      title: "Condition",
      dataIndex: "condition",
      key: "condition",
      width: 300,
      render: (_, records) => (
        <div className="tw-flex tw-flex-wrap tw-gap-y-2">
          {records.conditions.map((items, index) => (
            <Tag key={index}>{items}</Tag>
          ))}
        </div>
      ),
    },

    {
      title: "Extra conditions",
      dataIndex: "extra_conditions",
      key: "extra_conditions",
      width: 300,
      render: (_, records) => (
        <>
          {records.extra_conditions === "" ? (
            <p className="tw-text-slate-300">N/A</p>
          ) : (
            records.extra_conditions
          )}
        </>
      ),
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 200,
      render: (_, records) => (
        <div className="tw-flex tw-gap-4">
          <Button
            onClick={() => {
              setInviteModalOpen(true);
              setActiveHistoryData(records);
            }}
            icon={<EditOutlined />}
          />

          <Button
            onClick={() => {
              setViewListModalOpen(true);
              setActiveHistoryData(records);
            }}
            type="primary"
          >
            View list
          </Button>
          <Dropdown
            menu={{
              items: tableDropdownItems,
              onClick: (e) => {
                ondropdownclick(e, records.id);
              },
            }}
          >
            <Button type="text" shape="circle" icon={<EllipsisOutlined />} />
          </Dropdown>
        </div>
      ),
    },
  ];

  const ContextValue: ContextValue = useMemo(
    () => ({
      InviteModalOpen,
      setInviteModalOpen,
      ActiveHistoryData,
      setActiveHistoryData,
      ViewListModalOpen,
      setViewListModalOpen,
    }),
    [
      InviteModalOpen,
      setInviteModalOpen,
      ActiveHistoryData,
      setActiveHistoryData,
      ViewListModalOpen,
      setViewListModalOpen,
    ]
  );

  return (
    <ExternalInvitationContext.Provider value={ContextValue}>
      <div className="tw-flex tw-flex-col tw-gap-4">
        <div className="tw-flex tw-gap-2">
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                setInviteModalOpen(() => true);
              }}
            >
              New External Invitation
            </Button>
            <Popconfirm
              disabled={disableButton}
              okButtonProps={{
                danger: true,
              }}
              onConfirm={deleteMultipleRecords}
              okText="Delete"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              title={`Are you sure to delete ${selectedRowIDs?.length} records`}
            >
              <Button disabled={disableButton} icon={<DeleteOutlined />} danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </div>
        <Table
          loading={isLoading || isFetching}
          rowSelection={{
            selectedRowKeys,
            onChange: (newSelectedRowKeys: React.Key[]) => {
              setSelectedRowKeys(newSelectedRowKeys);
            },
          }}
          dataSource={invitationHistory}
          columns={columns}
        />
        <Modal_Invite_User_External data={ActiveHistoryData} />
        <Modal_View_External_Invite_List />
      </div>
    </ExternalInvitationContext.Provider>
  );
});

export default Invite_External_Community;
