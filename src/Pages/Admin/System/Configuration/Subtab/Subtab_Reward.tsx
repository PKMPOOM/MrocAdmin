import {
  Button,
  Switch,
  Divider,
  Input,
  Typography,
  Form,
  InputNumber,
} from "antd";
import { formattedUppercase } from "../../../../../Interface/Utils";
import {
  InputRewardsSettingsTypes,
  RewardsConfig,
  SiteConfig,
} from "../../../../../Interface/ConfigInterfaces";
import LoadingFallback from "../../../../../Components/Global/Suspense/LoadingFallback";
import { useAuth } from "../../../../../Context/Auth/AuthContext";
const { Title } = Typography;

type Subtab_RewardType = {
  rewardConfig: SiteConfig["rewards_config"];
};

function Subtab_Reward({ rewardConfig }: Subtab_RewardType) {
  const { Axios, notificationApi } = useAuth();
  const dividerStyle = { marginTop: 24, marginBottom: 24 };
  const inputStyleShort = { width: " 70%", marginLeft: "auto" };

  type mergedform = RewardsConfig["boolean_forms"] &
    RewardsConfig["text_forms"];

  const [form] = Form.useForm<mergedform>();

  const onFinish = async (data: mergedform) => {
    await Axios.put("/config/reward", {
      ...data,
      id: rewardConfig.id,
    })
      .then(() => {
        notificationApi.success({
          message: "Success updating configurations",
        });
      })
      .catch((err) => {
        console.log(err);
        notificationApi.error({
          message: err.message,
        });
      });
  };

  if (!rewardConfig) {
    return <LoadingFallback />;
  }

  const { boolean_forms, text_forms } = rewardConfig;

  form.setFieldsValue({
    ...rewardConfig.boolean_forms,
    ...rewardConfig.text_forms,
  });

  return (
    <div>
      <div
        style={{
          height: "calc(100vh - 190px)",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "18px",
        }}
      >
        <Form
          labelCol={{
            span: 9,
            style: { justifyContent: "start", display: "flex" },
          }}
          wrapperCol={{ flex: "auto" }}
          form={form}
          title="Site Settings"
          layout="horizontal"
          requiredMark="optional"
          onFinish={onFinish}
        >
          <Title level={4}>Rewards Settings</Title>
          <div className="tw-grid tw-grid-cols-2 tw-gap-2">
            {Object.keys(boolean_forms).map((key) => (
              <Form.Item<RewardsConfig["boolean_forms"]>
                key={key}
                valuePropName="checked"
                label={formattedUppercase(key)}
                name={key as keyof RewardsConfig["boolean_forms"]}
                style={{}}
                rules={[{ required: true, message: "Please input" }]}
              >
                <Switch defaultChecked style={{ marginLeft: "auto" }} />
              </Form.Item>
            ))}
          </div>
          <div className="tw-grid tw-grid-cols-2 tw-gap-2">
            {Object.keys(text_forms).map((key) => (
              <Form.Item<RewardsConfig["text_forms"]>
                key={key}
                label={formattedUppercase(key)}
                name={key as keyof RewardsConfig["text_forms"]}
                rules={[{ required: true, message: "Please input" }]}
              >
                {typeof text_forms[key as keyof InputRewardsSettingsTypes] ===
                "number" ? (
                  <InputNumber style={inputStyleShort} />
                ) : (
                  <Input style={inputStyleShort} />
                )}
              </Form.Item>
            ))}
          </div>
          <Divider style={dividerStyle} />

          <div className="tw-mb-10 tw-flex tw-justify-center">
            <Button type="primary" size="large" htmlType="submit">
              <span className="tw-px-5">Update</span>
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Subtab_Reward;
