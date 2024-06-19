import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  TimePicker,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import LoadingFallback from "../../../../../Components/Global/Suspense/LoadingFallback";
import { useAuth } from "../../../../../Context/Auth/AuthContext";
import {
  GeneralConfig,
  SiteConfig,
} from "../../../../../Interface/ConfigInterfaces";
const { Title, Text } = Typography;

const dividerStyle = {
  marginTop: 8,
};

type Subtab_GeneralType = {
  generalConfig: SiteConfig["general_config"];
};

function Subtab_General({ generalConfig }: Subtab_GeneralType) {
  const { Axios, notificationApi } = useAuth();
  const [configForm] = Form.useForm<GeneralConfig>();
  const onFinish = async (data: GeneralConfig) => {
    //todo create api route for update general config
    await Axios.put("/config/general", {
      ...data,
      id: generalConfig.id,
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

  if (!generalConfig) {
    return <LoadingFallback />;
  }

  useEffect(() => {
    if (generalConfig) {
      configForm.setFieldsValue({
        ...generalConfig,
        operation_hours: generalConfig.operation_hours.map((item) =>
          dayjs(item)
        ),
      });
    }
  }, [generalConfig]);

  return (
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
        form={configForm}
        title="Site Settings"
        layout="horizontal"
        requiredMark="optional"
        onFinish={onFinish}
      >
        <Title level={4}>Site settings</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<GeneralConfig>
              label="Site title"
              name="site_title"
              rules={[
                { required: true, message: "Site title cannot be blank" },
              ]}
            >
              <Input placeholder="Site title" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<GeneralConfig> label="Panel title" name={"panel_title"}>
              <Input placeholder="Panel title" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={dividerStyle} />

        <Title level={4}>Address settings</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<GeneralConfig>
              label="City"
              name={"city"}
              rules={[{ required: true, message: "Please input" }]}
            >
              <Input placeholder="City" />
            </Form.Item>

            <Form.Item<GeneralConfig>
              label="Street Address"
              name={"street_address"}
              rules={[{ required: true, message: "Please input" }]}
            >
              <Input placeholder="Street Address" />
            </Form.Item>

            <Form.Item<GeneralConfig>
              label="Province"
              name={"province"}
              rules={[{ required: true, message: "Please input" }]}
            >
              <Input placeholder="Province" />
            </Form.Item>

            <Form.Item<GeneralConfig>
              name={"operation_hours"}
              label="Operation hours"
            >
              <TimePicker.RangePicker />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<GeneralConfig>
              label="Phone number"
              name={"phone_number"}
              rules={[{ required: true, message: "Please input" }]}
            >
              <Input placeholder="Phone number" />
            </Form.Item>

            <Form.Item<GeneralConfig>
              label="Country"
              name={"country"}
              rules={[{ required: true, message: "Please input" }]}
            >
              <Input placeholder="Country" />
            </Form.Item>

            <Form.Item<GeneralConfig>
              label="Postal code"
              name={"postal_code"}
              rules={[{ required: true, message: "Please input" }]}
            >
              <Input placeholder="Postal code" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={dividerStyle} />

        <Title level={4}>Admin settings</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<GeneralConfig>
              label="Show news"
              name={"show_news"}
              valuePropName="checked"
              rules={[{ required: true, message: "Please input" }]}
            >
              <Switch style={{ marginLeft: "auto" }} />
            </Form.Item>

            <Form.Item<GeneralConfig>
              label="Show contact info "
              name={"show_contact_info"}
              valuePropName="checked"
              rules={[{ required: true, message: "Please input" }]}
            >
              <Switch style={{ marginLeft: "auto" }} />
            </Form.Item>

            <Form.Item<GeneralConfig>
              label="Snatch bot "
              name={"snatch_bot"}
              valuePropName="checked"
              rules={[{ required: true, message: "Please input" }]}
            >
              <Switch style={{ marginLeft: "auto" }} />
            </Form.Item>

            <Form.Item<GeneralConfig>
              label="Show user avatar "
              name={"show_user_avatar"}
              valuePropName="checked"
              rules={[{ required: true, message: "Please input" }]}
            >
              <Switch style={{ marginLeft: "auto" }} />
            </Form.Item>

            <Form.Item<GeneralConfig>
              label="Self-serve registration "
              name={"sefe_serve_registration"}
              valuePropName="checked"
              rules={[{ required: true, message: "Please input" }]}
            >
              <Switch style={{ marginLeft: "auto" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<GeneralConfig>
              label="Discussions "
              name={"discussions"}
              valuePropName="checked"
              rules={[{ required: true, message: "Please input" }]}
            >
              <Switch style={{ marginLeft: "auto" }} />
            </Form.Item>

            <Form.Item<GeneralConfig>
              label="low Users to Invite Friends "
              name={"allow_user_to_invite_friends"}
              valuePropName="checked"
              rules={[{ required: true, message: "Please input" }]}
            >
              <Switch style={{ marginLeft: "auto" }} />
            </Form.Item>

            <Form.Item<GeneralConfig>
              label="API Integration "
              name={"api_intergration"}
              valuePropName="checked"
              rules={[{ required: true, message: "Please input" }]}
            >
              <Switch style={{ marginLeft: "auto" }} />
            </Form.Item>

            <Form.Item<GeneralConfig>
              label="User Export Permission "
              name={"user_export_permission"}
              valuePropName="checked"
              rules={[{ required: true, message: "Please input" }]}
            >
              <Switch style={{ marginLeft: "auto" }} />
            </Form.Item>

            <Form.Item<GeneralConfig>
              label="Privacy Policy On Registration "
              name={"privacy_policy_on_registration"}
              valuePropName="checked"
              rules={[{ required: true, message: "Please input" }]}
            >
              <Switch style={{ marginLeft: "auto" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<GeneralConfig>
              label="Carousel Speed (ms)"
              name="carousel_speed"
              rules={[{ required: true, message: "Please input" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item<GeneralConfig>
              label="Campaign Delay (ms)"
              name="campaign_delay"
              rules={[{ required: true, message: "Please input" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item<GeneralConfig>
              label="Privacy Policy Link Text"
              name="privacy_policy_link_text"
            >
              <Input placeholder="Privacy Policy Link Text" />
            </Form.Item>
            <Form.Item<GeneralConfig>
              label="Privacy Policy Agree Text"
              name="privacy_policy_agree_text"
            >
              <Input placeholder="Privacy Policy Agree Text" />
            </Form.Item>
            <Form.Item<GeneralConfig>
              label="First Tile Displayed"
              name="first_tile_displayed"
            >
              <Input placeholder="First Tile Displayed" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<GeneralConfig>
              label="Login Background Speed (ms)"
              name="login_background_speed_ms"
              rules={[{ required: true, message: "Please input" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Login Background Speed (ms)"
              />
            </Form.Item>
            <Form.Item<GeneralConfig>
              label="Support Email"
              name="support_email"
              rules={[{ required: true, message: "Please input" }]}
            >
              <Input placeholder="Support Email" />
            </Form.Item>

            <Form.Item<GeneralConfig>
              label="Privacy Policy URL"
              name="privacy_policy_url"
            >
              <Input placeholder="Privacy Policy URL" />
            </Form.Item>
            <Form.Item<GeneralConfig>
              label="User Email Settings Timezone"
              name="user_email_settings_timezone"
            >
              <Input placeholder="User Email Settings Timezone" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={dividerStyle} />

        <Title level={4}>SEO settings</Title>
        <div className="tw-grid tw-grid-cols-2 tw-gap-4">
          <div className="tw-flex tw-flex-col ">
            <Form.Item<GeneralConfig>
              label="Google analytics"
              name={"google_analytics"}
              rules={[{ required: true }]}
              style={{ marginBottom: 8 }}
              valuePropName="checked"
            >
              <Switch style={{ marginLeft: "auto" }} />
            </Form.Item>
            <Form.Item<GeneralConfig>
              label="Google Analytics ID"
              name="google_analytics_id"
            >
              <Input placeholder="Google Analytics ID" />
            </Form.Item>
          </div>
          <div className="tw-flex tw-flex-col ">
            <Form.Item<GeneralConfig>
              label="Meta Piexel"
              name={"meta_pixel"}
              rules={[{ required: true }]}
              style={{ marginBottom: 8 }}
              valuePropName="checked"
            >
              <Switch style={{ marginLeft: "auto" }} />
            </Form.Item>
            <Form.Item<GeneralConfig>
              label="Meta Piexel ID"
              name="meta_pixel_id"
            >
              <Input placeholder="Meta Piexel ID" />
            </Form.Item>
          </div>
        </div>

        <Divider style={dividerStyle} />

        <Title level={4}>Language settings</Title>
        <div className="tw-mb-4 tw-flex tw-gap-2 tw-items-center">
          <Text>Select default language</Text>
          <Select
            defaultValue="English"
            style={{
              width: 120,
            }}
            options={[
              {
                value: "English",
                label: "English",
              },
              {
                value: "Deutsche",
                label: "Deutsche",
              },
              {
                value: "Nederlands",
                label: "Nederlands",
              },
              {
                value: "עברית",
                label: "עברית",
              },
              {
                value: "普通话",
                label: "普通话",
              },
              {
                value: "Français",
                label: "Français",
              },
              {
                value: "Português",
                label: "Português",
              },
              {
                value: "عربى",
                label: "عربى",
              },
            ]}
          />
          <Button icon={<EditOutlined />} type="primary">
            Replace Language Text
          </Button>
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <div>
              <Text>Deutsche :</Text>
              <div className="tw-w-3/5 tw-ml-auto">
                <Switch defaultChecked style={{ marginLeft: "auto" }} />
              </div>
            </div>
            <div>
              <Text>Nederlands :</Text>
              <div className="tw-w-3/5 tw-ml-auto">
                <Switch defaultChecked style={{ marginLeft: "auto" }} />
              </div>
            </div>
            <div>
              <Text>עברית :</Text>
              <div className="tw-w-3/5 tw-ml-auto">
                <Switch defaultChecked style={{ marginLeft: "auto" }} />
              </div>
            </div>
            <div>
              <Text>普通话 :</Text>
              <div className="tw-w-3/5 tw-ml-auto">
                <Switch defaultChecked style={{ marginLeft: "auto" }} />
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Text>Français :</Text>
              <div className="tw-w-3/5 tw-ml-auto">
                <Switch defaultChecked style={{ marginLeft: "auto" }} />
              </div>
            </div>
            <div>
              <Text>Português :</Text>
              <div className="tw-w-3/5 tw-ml-auto">
                <Switch defaultChecked style={{ marginLeft: "auto" }} />
              </div>
            </div>
            <div>
              <Text>عربى :</Text>
              <div className="tw-w-3/5 tw-ml-auto">
                <Switch defaultChecked style={{ marginLeft: "auto" }} />
              </div>
            </div>
          </Col>
        </Row>

        <Divider style={dividerStyle} />

        <div className="tw-mb-10 tw-flex tw-justify-center ">
          <Button type="primary" size="large" htmlType="submit">
            <span className="tw-px-5">Update</span>
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Subtab_General;
