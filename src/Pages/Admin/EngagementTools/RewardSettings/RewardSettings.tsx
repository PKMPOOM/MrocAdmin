import { useState, createContext } from "react";
import { Button, Typography, Space, Table, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../Context/Auth/AuthContext";
import { Dayjs } from "dayjs";
import RewardModal from "../../../../Components/Engagement/Reward/RewardModal";
const { Title } = Typography;

type RewardSettingsContext = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  IsEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  ActiveReward: Reward | undefined;
  setActiveReward: React.Dispatch<React.SetStateAction<Reward | undefined>>;
  refetchRewardList: any;
};

export const RewardSettingsContext = createContext({} as RewardSettingsContext);

export type Reward = {
  id: string;
  key: number;
  name: string;
  marketplace: boolean;
  date_create: Dayjs;
  value: number;
  icon?: string;
  total?: number;
};

function Achievements() {
  const { Axios } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IsEditing, setIsEditing] = useState(false);
  const [ActiveReward, setActiveReward] = useState<Reward | undefined>(
    undefined
  );

  const getDiscussionData = async () => {
    const response = await Axios.get(`/reward/list`);

    return response.data;
  };

  const {
    data: RewardList,
    isLoading,
    refetch: refetchRewardList,
    isFetching,
  } = useQuery({
    queryKey: ["rewardList"],
    queryFn: getDiscussionData,
    refetchOnWindowFocus: false,
  });

  const CreateNewReward = () => {
    setIsModalOpen(true);
  };

  const DeleteReward = async (id: string) => {
    await Axios.delete(`/reward/${id}`);
    refetchRewardList();
  };

  const EditReward = (goalID: Reward) => {
    setActiveReward(goalID);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<Reward> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Value (points)",
      dataIndex: "value",
      key: "value",
      width: 200,
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_, records) => (
        <div className="tw-flex tw-gap-2">
          <Button
            onClick={() => {
              EditReward(records);
            }}
            icon={<EditOutlined />}
            type="text"
          />
          <Popconfirm
            icon={null}
            title="Delete reward"
            description="Are you sure to delete this reward?"
            onConfirm={() => {
              DeleteReward(records.id);
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
    <RewardSettingsContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        IsEditing,
        setIsEditing,
        ActiveReward,
        setActiveReward,
        refetchRewardList,
      }}
    >
      <div className="tw-w-full">
        <Title level={2}>Reward settings</Title>
        <Space size="middle" direction="vertical">
          <Space>
            <Button
              onClick={() => {
                CreateNewReward();
              }}
              type="primary"
              icon={<PlusOutlined />}
            >
              Create New Reward
            </Button>
          </Space>
        </Space>
        <div className="tw-mt-6">
          <Table
            loading={isLoading || isFetching}
            dataSource={RewardList}
            columns={columns}
          />
        </div>
      </div>
      <RewardModal />
    </RewardSettingsContext.Provider>
  );
}

export default Achievements;
