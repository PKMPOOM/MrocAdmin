import { useState, createContext } from "react";
import { Link } from "react-router-dom";
import { Button, Typography, Space, Table, Popconfirm, Badge } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../Context/Auth/AuthContext";
import AchievementModal from "../../../../Components/Engagement/Achievement/AchievementModal";
import { GoalDataEdit } from "../../../../Interface/AchievementsInterfaces";
const { Title } = Typography;

type AchievementsContext = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  IsEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  ActiveGoalID: string | undefined;
  setActiveGoalID: React.Dispatch<React.SetStateAction<string | undefined>>;
  refetchAchievementTable: any;
};

export const AchievementsContext = createContext({} as AchievementsContext);

function Achievements() {
  const { Axios } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IsEditing, setIsEditing] = useState(false);
  const [ActiveGoalID, setActiveGoalID] = useState<string | undefined>(
    undefined
  );

  const getDiscussionData = async () => {
    const response = await Axios.get(`/achievements`);

    return response.data;
  };

  const {
    data: AchievementsList,
    isLoading,
    refetch: refetchAchievementTable,
  } = useQuery({
    queryKey: ["achievementsList"],
    queryFn: getDiscussionData,
    refetchOnWindowFocus: false,
  });

  //! rowselection func
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const CreateNewGoal = () => {
    setIsModalOpen(true);
  };

  const DeleteGoal = async (id: string) => {
    await Axios.delete(`/achievements/${id}`);
    refetchAchievementTable();
  };

  const EditGoal = (goalID: string) => {
    setActiveGoalID(goalID);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<GoalDataEdit> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Conditions",
      dataIndex: "conditions",
      key: "conditions",
      render: (_, records) => (
        <div className="tw-flex tw-flex-col tw-gap-2">
          {records.conditions.map(
            ({ logic, logic_items, logic_operation, logic_value }, idx) => {
              return (
                <Badge
                  key={idx}
                  status="success"
                  text={`${logic?.replaceAll("_", " ")} ${logic_items} 
                  ${logic_operation?.replaceAll("_", " ")} ${logic_value}`}
                />
              );
            }
          )}
        </div>
      ),
    },
    {
      title: "Reward",
      dataIndex: "reward",
      key: "reward",
      width: 200,
      render: (_, records) => (
        <div>
          {records.reward.reward_type === "points"
            ? `${records.reward.reward_detail} points`
            : `${records.reward.reward_detail} badge`}
        </div>
      ),
    },
    {
      title: "Rewarded amount",
      dataIndex: "amount_reward",
      key: "amount_reward",
      width: 200,
      render: (_, records) => (
        <div>
          <Link to={`/admin/EngagementTools/Achievements/${records.id}`}>
            {`${records.amount_reward} Users reward`}
          </Link>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_, records) => (
        <div className="tw-flex tw-gap-2">
          <Button
            onClick={() => {
              EditGoal(records.id);
            }}
            icon={<EditOutlined />}
            type="text"
          />
          <Popconfirm
            icon={null}
            title="Delete achievement rule"
            description="Are you sure to delete this achievement rule?"
            onConfirm={() => {
              DeleteGoal(records.id);
            }}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
            }}
          >
            <Button icon={<DeleteOutlined />} type="text" danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <AchievementsContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        IsEditing,
        setIsEditing,
        ActiveGoalID,
        setActiveGoalID,
        refetchAchievementTable,
      }}
    >
      <div className="tw-w-full">
        <Title level={2}>Achievements</Title>
        <Space size="middle" direction="vertical">
          <Space>
            <Button
              onClick={() => {
                CreateNewGoal();
              }}
              type="primary"
              icon={<PlusOutlined />}
            >
              Create New Goal
            </Button>
            <Button
              disabled={!hasSelected}
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                // Deletemultiple();
              }}
            >
              Delete
            </Button>
          </Space>
        </Space>
        <div className="tw-mt-6">
          <Table
            loading={isLoading}
            rowSelection={rowSelection}
            dataSource={AchievementsList}
            columns={columns}
          />
        </div>
      </div>
      <AchievementModal />
    </AchievementsContext.Provider>
  );
}

export default Achievements;
