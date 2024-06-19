import { Dayjs } from "dayjs";

export type RewardDetail = {
  reward_detail: string;
  reward_type: string;
};

export type RewardType = "badge" | "points";

export type GoalDataEdit = Omit<GoalData, "user_rewarded">;

export type GoalData = {
  id: string;
  index: 1;
  name: string;
  date_create: Dayjs;
  conditions: LogicListType[];
  reward_type: RewardType;
  reward_detail: string;
  auto_reward: boolean;
  amount_reward: number;
  reward: RewardDetail;
  user_rewarded: UserRewarded[];
};

export type LogicListType = {
  logic: string | undefined;
  logic_items: string | undefined;
  logic_operation: string | undefined;
  logic_value: number;
};

export type UserRewarded = {
  id: string;
  index: number;
  email: string;
  date_rewarded: Dayjs;
  is_rewarded: boolean;
  rewarded_by: "system" | "admin";
  admin_rewarded?: string;
  achievementsId: string;
};
