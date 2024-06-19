import { useState, createContext } from "react";
import { Button, Typography, Space, Table, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../Context/Auth/AuthContext";
import CharityModal from "../../../../Components/Engagement/ManageCharities/CharityModal";
const { Title } = Typography;

type CharitySettingsContext = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  IsEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  ActiveCharity: Charity | undefined;
  setActiveCharity: React.Dispatch<React.SetStateAction<Charity | undefined>>;
  refetchCharityList: any;
};

export const CharitySettingsContext = createContext(
  {} as CharitySettingsContext
);

export type Charity = {
  id: string;
  key: number;
  name: string;
  contact: string;
  email?: string;
  fax?: string;
  phone?: string;
  website?: string;
  address?: string;
  image_url?: string;
  region: string;
  points?: number;
  active?: boolean;
};

function Achievements() {
  const { Axios } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IsEditing, setIsEditing] = useState(false);
  const [ActiveCharity, setActiveCharity] = useState<Charity | undefined>(
    undefined
  );

  const getDiscussionData = async () => {
    const response = await Axios.get(`/charity/list`);

    return response.data;
  };

  const {
    data: AchievementsList,
    isLoading,
    refetch: refetchCharityList,
    isFetching,
  } = useQuery({
    queryKey: ["charityList"],
    queryFn: getDiscussionData,
    refetchOnWindowFocus: false,
  });

  const CreateNewCharity = () => {
    setIsModalOpen(true);
  };

  const DeleteCharity = async (id: string) => {
    await Axios.delete(`/Charity/${id}`);
    refetchCharityList();
  };

  const EditCharity = (goalID: Charity) => {
    setActiveCharity(goalID);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<Charity> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 200,
    },
    {
      title: "Fax",
      dataIndex: "fax",
      key: "fax",
      width: 200,
      render: (_, records) => <>{records.fax ? records.fax : "-"}</>,
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_, records) => (
        <div className="tw-flex tw-gap-2">
          <Button
            onClick={() => {
              EditCharity(records);
            }}
            icon={<EditOutlined />}
            type="text"
          />
          <Popconfirm
            icon={null}
            title="Delete Charity"
            description="Are you sure to delete this Charity?"
            onConfirm={() => {
              DeleteCharity(records.id);
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
    <CharitySettingsContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        IsEditing,
        setIsEditing,
        ActiveCharity,
        setActiveCharity,
        refetchCharityList,
      }}
    >
      <div className="tw-w-full">
        <Title level={2}>ManageCharities</Title>
        <Space size="middle" direction="vertical">
          <Space>
            <Button
              onClick={() => {
                CreateNewCharity();
              }}
              type="primary"
              icon={<PlusOutlined />}
            >
              New Charity
            </Button>
          </Space>
        </Space>
        <div className="tw-mt-6">
          <Table
            loading={isLoading || isFetching}
            dataSource={AchievementsList}
            columns={columns}
          />
        </div>
      </div>
      <CharityModal />
    </CharitySettingsContext.Provider>
  );
}

export default Achievements;
