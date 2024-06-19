import {
  Badge,
  Button,
  Descriptions,
  DescriptionsProps,
  Popconfirm,
  Table,
} from "antd";
import React from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { ColumnsType } from "antd/es/table";

import { DeleteOutlined, GiftOutlined } from "@ant-design/icons";
import { useAuth } from "../../../../../Context/Auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
  UserRewarded,
  GoalData,
} from "../../../../../Interface/AchievementsInterfaces";
import LoadingFallback from "../../../../../Components/Global/Suspense/LoadingFallback";

const AchievementReward = React.memo(() => {
  const { id: achievementID } = useParams();
  const { Axios } = useAuth();

  const fetchAchievementData = async () => {
    const res = await Axios.get(`/achievements/${achievementID}/userlist`);
    return res.data;
  };

  const { data: GoalData, isLoading } = useQuery<GoalData>({
    queryKey: ["Goal", achievementID],
    queryFn: fetchAchievementData,
    refetchOnWindowFocus: false,
  });

  if (!GoalData) {
    return <LoadingFallback />;
  }

  const isAutoReward = GoalData.auto_reward === true;

  const columns: ColumnsType<UserRewarded> = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "rewarded_by",
      dataIndex: "rewarded_by",
      key: "rewarded_by",
      render: (_, records) => (
        <div>{records.rewarded_by === "system" ? "System" : "Pending"}</div>
      ),
    },

    {
      title: "Date rewarded",
      dataIndex: "date_rewarded",
      key: "date_rewarded",
      render: (_, records) => (
        <div>{dayjs(records.date_rewarded).format("DD-MMM-YYYY")}</div>
      ),
    },
    {
      title: "Is reward",
      dataIndex: "is_rewarded",
      key: "is_rewarded",
      render: (_, records) => (
        <div>
          {!isAutoReward && records.is_rewarded === false ? (
            <Button
              icon={<GiftOutlined />}
              size="small"
              onClick={() => {}}
              type="primary"
            >
              Reward
            </Button>
          ) : (
            <Button disabled size="small" onClick={() => {}} type="primary">
              Rewarded
            </Button>
          )}
        </div>
      ),
    },

    {
      title: "Action",
      key: "reward",
      width: 250,
      render: (_, records) => (
        <div className="tw-flex tw-gap-2">
          <Popconfirm
            icon={null}
            title="Remove achievement"
            description={`Remove this achievement from this user`}
            onConfirm={() => {
              console.log(records.id);
            }}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
            }}
          >
            <Button size="small" icon={<DeleteOutlined />} type="dashed" danger>
              Remove
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const filteredColumns = columns.filter((item) => {
    if (isAutoReward) {
      return item.key !== "rewarded_by" && item.key !== "is_rewarded";
    } else {
      return item;
    }
  });

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Reward settings",
      children: GoalData.auto_reward
        ? "Rewarded by system"
        : "Reward manually by admin",
    },
    {
      key: "2",
      label: "Reward",
      children: `${GoalData.reward_detail} ${GoalData.reward_type} `,
    },
    {
      key: "3",
      label: "Date create",
      children: dayjs(GoalData.date_create).format("DD-MMM-YYYY"),
    },
    {
      key: "4",
      label: "Conditions",
      span: 3,
      children: (
        <div className="tw-flex tw-gap-2">
          {GoalData.conditions.map(
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
  ];

  return (
    <div className="tw-w-full">
      <Descriptions title={GoalData?.name} items={items} />

      <div className="tw-mt-6">
        <Table
          loading={isLoading}
          //   rowSelection={rowSelection}
          dataSource={GoalData.user_rewarded}
          columns={filteredColumns}
        />
      </div>
    </div>
  );
});

export default AchievementReward;
