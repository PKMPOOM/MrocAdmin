import {
  Button,
  Switch,
  Divider,
  Input,
  Typography,
  Form,
  InputNumber,
  Col,
} from "antd";
import {
  ActivityStatus,
  SecurityConfig,
  SiteConfig,
} from "../../../../../Interface/ConfigInterfaces";
import LoadingFallback from "../../../../../Components/Global/Suspense/LoadingFallback";
import { useAuth } from "../../../../../Context/Auth/AuthContext";
import _ from "lodash";
import { formattedUppercase } from "../../../../../Interface/Utils";
const { Title, Text } = Typography;

type Subtab_SecurityType = {
  securityConfig: SiteConfig["security_config"];
};

function Subtab_Security({ securityConfig }: Subtab_SecurityType) {
  const { Axios, notificationApi } = useAuth();
  const dividerStyle = { marginTop: 24, marginBottom: 24 };
  const inputStyleShort = { width: " 70%", marginLeft: "auto" };

  type mergedform = SiteConfig["security_config"];

  const [form] = Form.useForm<mergedform>();

  if (!securityConfig) {
    return <LoadingFallback />;
  }

  const {
    activity_status,
    id: securityConfigID,
    ...securityStatus
  } = securityConfig;

  const onFinish = async (data: any) => {
    // split activity data from security config data
    const {
      cheque_min_cashout,
      max_login_attemp,
      user_lockout_time,
      ...activityData
    } = data;

    //filter all activity ids to have only uniqe
    const allIds = _.uniq(
      _.map(Object.keys(activityData), (i) => i.split("_")[0])
    );

    // create array of object of activity by transform data from namedForms obj
    const formattedActivityData = allIds.map((id) => {
      return Object.keys(activityData).map(() => ({
        id: id,
        name: activityData[id + "__name"],
        active_from: activityData[id + "__active_from"],
        active_until: activityData[id + "__active_until"],
        reminder_email: activityData[id + "__reminder_email"],
      }))[0];
    });

    // add to postbody
    const POSTBODY: SecurityConfig = {
      id: securityConfigID,
      cheque_min_cashout,
      max_login_attemp,
      user_lockout_time,
      activity_status: formattedActivityData,
    };

    notificationApi.open({
      key: "loader",
      message: "loading",
      description: "Action in progress..",
      duration: 0,
    });

    await Axios.put(`/config/security/${securityConfigID}`, {
      ...POSTBODY,
    })
      .then(() => {
        notificationApi.destroy("loader");
        notificationApi.success({
          message: "Saved",
        });
      })
      .catch((err) => {
        console.log(err);
        notificationApi.error(err.message);
      });
  };

  let namedForms: { [key: string]: any } = {};

  //item.id + "_" + key
  activity_status.forEach((item) => {
    Object.keys(item).forEach((key) => {
      const newName = item.id + "__" + key;
      namedForms[newName] = item[key as keyof ActivityStatus];
    });
  });

  form.setFieldsValue({
    ...securityStatus,
    ...namedForms,
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
          <Title level={4}>Security status</Title>
          <div className="tw-grid tw-grid-cols-2 tw-gap-2">
            {Object.keys(securityStatus).map((key) => (
              <Form.Item
                key={key}
                label={formattedUppercase(key)}
                name={key}
                rules={[{ required: true, message: "Please input" }]}
              >
                <InputNumber style={inputStyleShort} />
              </Form.Item>
            ))}
          </div>

          <Divider style={dividerStyle} />
          <Title level={4}>Activity status</Title>

          <div className="tw-mb-2 tw-flex tw-gap-2">
            <Col span={8}>
              <Text>Status name</Text>
            </Col>
            <Col span={3}>
              <Text>Actcive from</Text>
            </Col>
            <Col span={3}>
              <Text>To(days ago)</Text>
            </Col>
            <Col span={3}>
              <Text>Email reminder</Text>
            </Col>
          </div>

          <div className="tw-flex tw-flex-col tw-gap-2">
            {activity_status.map((item) => (
              <div key={item.id} className="tw-flex tw-gap-2">
                {Object.keys(item).map((key) => {
                  const namedKey = item.id + "__" + key;

                  switch (key) {
                    case "reminder_email":
                      return (
                        <Col key={namedKey} span={3}>
                          <Form.Item
                            style={{ marginBottom: 8 }}
                            name={namedKey}
                            valuePropName="checked"
                          >
                            <Switch />
                          </Form.Item>
                        </Col>
                      );

                    case "name":
                      return (
                        <Col key={namedKey} span={8}>
                          <Form.Item
                            style={{ marginBottom: 8 }}
                            name={namedKey}
                          >
                            <Input placeholder="Status name" />
                          </Form.Item>
                        </Col>
                      );

                    case "active_until":
                    case "active_from":
                      return (
                        <Col key={namedKey} span={3}>
                          <Form.Item
                            style={{ marginBottom: 8 }}
                            name={namedKey}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      );

                    default:
                      return null;
                  }
                })}
              </div>
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

export default Subtab_Security;
