import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  //   Upload,
} from "antd";
import React, { useState, useContext, useEffect } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { StrictSelectTypes } from "../../../Interface/Utils";
import { AchievementsContext } from "../../../Pages/Admin/EngagementTools/Achievements/Achievements";
import { useAuth } from "../../../Context/Auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
  GoalDataEdit,
  LogicListType,
} from "../../../Interface/AchievementsInterfaces";

type logicList = "Completed" | "Incompleted" | "Created" | "Reply to";
type logicItemsList = "Survey" | "Discussions";
type operValue =
  | "is equal to"
  | "is not equal"
  | "is greater than or equal to"
  | "is lesser than or equal to"
  | "is greater than"
  | "is lesser than";
type operLabel = "=" | "!=" | "=>" | "<=" | ">" | "<";
type rewardList = "Points" | "Badge";

const logic: StrictSelectTypes<logicList> = [
  { value: "completed", label: "Completed" },
  { value: "incompleted", label: "Incompleted" },
  { value: "created", label: "Created" },
  { value: "reply_to", label: "Reply to" },
];

const logicItems: StrictSelectTypes<logicItemsList> = [
  { value: "survey", label: "Survey" },
  { value: "discussions", label: "Discussions" },
];

const logicOper: StrictSelectTypes<operValue, operLabel> = [
  { value: "is_equal_to", label: "=" },
  { value: "is_not_equal", label: "!=" },
  { value: "is_greater_than_or_equal_to", label: "=>" },
  { value: "is_lesser_than_or_equal_to", label: "<=" },
  { value: "is_greater_than", label: ">" },
  { value: "is_lesser_than", label: "<" },
];

const rewardList: StrictSelectTypes<rewardList> = [
  { value: "points", label: "Points" },
  { value: "badge", label: "Badge" },
];

const formItemStyle = {
  marginBottom: 8,
  gap: 8,
};

const AchievementModal = React.memo(() => {
  const [goalform] = Form.useForm();
  const { Axios } = useAuth();
  const {
    IsEditing,
    setIsEditing,
    isModalOpen,
    setIsModalOpen,
    ActiveGoalID,
    setActiveGoalID,
    refetchAchievementTable,
  } = useContext(AchievementsContext);

  const fetchSubjectData = async () => {
    const res = await Axios.get(`/achievements/${ActiveGoalID}`);
    return res.data;
  };

  const operatorDictionary = (key: string | undefined) => {
    switch (key) {
      case "is_equal_to":
        return "=";
      case "is_greater_than":
        return ">";
      case "is_greater_than_or_equal_to":
        return "=>";
      case "is_lesser_than":
        return "<";
      case "is_lesser_than_or_equal_to":
        return "<=";
      case "is_not_equal":
        return "!=";
    }
  };

  const { data: GoalData, isFetched } = useQuery<GoalDataEdit>({
    queryKey: ["Goal", ActiveGoalID],
    queryFn: fetchSubjectData,
    refetchOnWindowFocus: false,
    enabled: ActiveGoalID !== undefined,
  });

  useEffect(() => {
    if (GoalData && isFetched) {
      setIsEditing(true);
      if (GoalData.reward_type === "badge") {
        goalform.setFieldsValue({
          badge_name: GoalData.reward_detail,
        });
      } else if (GoalData.reward_type === "points") {
        goalform.setFieldsValue({
          point_amount: GoalData.reward_detail,
        });
      }
      goalform.setFieldsValue({
        auto_reward: GoalData.auto_reward,
        goal_name: GoalData.name,
        select_reward: GoalData.reward_type,
      });
      setLogicList(
        GoalData?.conditions.map((item) => ({
          logic: item.logic,
          logic_items: item.logic_items,
          logic_value: item.logic_value,
          logic_operation: operatorDictionary(item.logic_operation),
        }))
      );
    }
  }, [GoalData]);

  const [LogicList, setLogicList] = useState<LogicListType[]>([]);
  const [Loading, setLoading] = useState(false);

  // watch ref
  const selectedReward = Form.useWatch("select_reward", goalform);
  const auto_reward = Form.useWatch("auto_reward", goalform);
  const badge_name = Form.useWatch("badge_name", goalform);
  const goal_name = Form.useWatch("goal_name", goalform);
  const point_amount = Form.useWatch("point_amount", goalform);

  const onLogicChange = (
    e: string | number,
    index: number,
    property: "logic" | "logicItems" | "logicOper" | "logicValue"
  ) => {
    setLogicList((prevstate) => {
      const newstate = [...prevstate];
      switch (property) {
        case "logic":
          newstate[index].logic = typeof e === "string" ? e : undefined;
          break;
        case "logicItems":
          newstate[index].logic_items = typeof e === "string" ? e : undefined;
          break;
        case "logicOper":
          newstate[index].logic_operation =
            typeof e === "string" ? e : undefined;
          break;
        case "logicValue":
          newstate[index].logic_value = typeof e === "number" ? e : 0;
          break;
        default:
          console.error(`Unknown property: ${property}`);
      }
      return newstate;
    });
  };

  const addNewLogic = () => {
    const newstate = [...LogicList];
    newstate.push({
      logic: undefined,
      logic_items: undefined,
      logic_operation: undefined,
      logic_value: 0,
    });
    setLogicList(newstate);
  };

  const deleteLogicList = (index: number) => {
    const newstate = [...LogicList];
    newstate.splice(index, 1);
    setLogicList(newstate);
  };

  const onCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setLogicList([]);
    setActiveGoalID(undefined);
    goalform.resetFields();
  };

  const createNewGoal = async () => {
    setLoading(true);
    await Axios.post("/achievements", {
      selectedReward,
      auto_reward,
      goal_name,
      badge_name,
      point_amount,
      LogicList,
    })
      .then(() => {
        setLoading(false);
        onCancel();
        refetchAchievementTable();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const editGoal = async () => {
    setLoading(true);
    await Axios.put(`/achievements/${ActiveGoalID}`, {
      selectedReward,
      auto_reward,
      goal_name,
      badge_name,
      point_amount,
      LogicList,
    })
      .then(() => {
        setLoading(false);
        onCancel();
        refetchAchievementTable();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const onFinish = async () => {
    if (IsEditing === true) {
      editGoal();
    } else if (IsEditing === false) {
      createNewGoal();
    }
  };

  return (
    <Modal
      width={700}
      title={"Create New Goal"}
      open={isModalOpen}
      footer={null}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form
        form={goalform}
        onFinish={onFinish}
        layout="vertical"
        requiredMark={"optional"}
      >
        <Form.Item
          name={"goal_name"}
          style={formItemStyle}
          label="Goal name"
          rules={[{ required: true, message: "Name cannot be blank" }]}
        >
          <Input placeholder="Goal name" />
        </Form.Item>
        <Form.Item
          style={formItemStyle}
          label="Select reward"
          name={"select_reward"}
          rules={[{ required: true, message: "Please select reward" }]}
        >
          <Select options={rewardList} placeholder="Select reward" />
        </Form.Item>

        {selectedReward === "points" ? (
          <Form.Item
            name={"point_amount"}
            style={formItemStyle}
            rules={[
              {
                required: selectedReward === "points",
                message: "Points amount cannot be blank",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Amount of points to reward"
            />
          </Form.Item>
        ) : selectedReward === "badge" ? (
          <Form.Item
            name={"badge_name"}
            rules={[
              {
                required: selectedReward === "badge",
                message: "Badge name cannot be blank",
              },
            ]}
          >
            <Input placeholder="Badge name" />
          </Form.Item>
        ) : null}

        <Form.Item
          style={formItemStyle}
          name={"auto_reward"}
          rules={[
            {
              required: true,
              message: "Please select how you going to reward users",
            },
          ]}
        >
          <Radio.Group>
            <Radio value={true}>Automatic reward</Radio>
            <Radio value={false}>Notify admin to reward manually</Radio>
          </Radio.Group>
        </Form.Item>

        <Divider orientation="left" orientationMargin="0">
          Logic
        </Divider>
        <Form.Item style={formItemStyle}>
          <div className=" tw-flex tw-flex-col  tw-mb-2">
            {LogicList.map((items, index) => (
              <Row key={index} gutter={8}>
                <Col span={6}>
                  <Form.Item
                    style={formItemStyle}
                    // name={`logic${index}`}
                    rules={[{ required: true, message: "Cannot be empty" }]}
                  >
                    <Select
                      options={logic}
                      placeholder="Select logic"
                      value={items.logic}
                      onChange={(e) => {
                        onLogicChange(e, index, "logic");
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    style={formItemStyle}
                    // name={`logicItems${index}`}
                    rules={[{ required: true, message: "Cannot be empty" }]}
                  >
                    <Select
                      options={logicItems}
                      placeholder="Select items"
                      value={items.logic_items}
                      onChange={(e) => {
                        onLogicChange(e, index, "logicItems");
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    style={formItemStyle}
                    // name={`logicOper${index}`}
                    rules={[{ required: true, message: "Cannot be empty" }]}
                  >
                    <Select
                      options={logicOper}
                      placeholder="Select operand"
                      value={items.logic_operation}
                      onChange={(e) => {
                        onLogicChange(e, index, "logicOper");
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="amount"
                    value={items.logic_value}
                    onChange={(e) => {
                      onLogicChange(e ? e : 0, index, "logicValue");
                    }}
                  />
                </Col>
                <Col span={2}>
                  <Button
                    onClick={() => {
                      deleteLogicList(index);
                    }}
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Col>
              </Row>
            ))}
          </div>
          <Button
            onClick={() => {
              addNewLogic();
            }}
            icon={<PlusOutlined />}
            type="link"
          >
            Add logic
          </Button>
        </Form.Item>
        {/* button */}
        <div className=" tw-flex tw-justify-end tw-gap-2 tw-mt-4">
          <Button
            onClick={() => {
              onCancel();
            }}
            type="text"
          >
            cancel
          </Button>

          {IsEditing ? (
            <Button
              loading={Loading}
              disabled={LogicList.length === 0}
              htmlType="submit"
              type="primary"
            >
              Save
            </Button>
          ) : (
            <Button loading={Loading} type="primary" htmlType="submit">
              Create New
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
});

export default AchievementModal;
