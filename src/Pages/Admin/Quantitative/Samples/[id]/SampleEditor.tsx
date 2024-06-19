import { CheckOutlined, LeftOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { RuleGroupType, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingFallback from "../../../../../Components/Global/Suspense/LoadingFallback";
import ICQueryBuilder from "../../../../../Components/Samples/Query_builder/QueryBuilder";
import { useAuth } from "../../../../../Context/Auth/AuthContext";
import { getCharityList } from "../../../EngagementTools/ManageCharities/api";
import {
  FormSchema,
  Payload,
  getSampleData,
  useCreateNewSample,
  useUpdateSample,
} from "../api";

const { Title } = Typography;

const colStyle = { backgroundColor: "#ffffff" };
const formItemStyle = { marginBottom: 8 };

const initialQuery: RuleGroupType = {
  combinator: "and",
  rules: [],
};

function SampleEditor() {
  const { notificationApi } = useAuth();
  const { id } = useParams();
  const [MaxSize, setMaxSize] = useState<boolean>(false);
  const [form] = Form.useForm<FormSchema>();
  const navigate = useNavigate();
  const [Query, setQuery] = useState<RuleGroupType>(initialQuery);

  // check if create new or not
  const isCreateNew = id === "New";

  // fetch data
  const { data: sampleData, isLoading, mutate } = getSampleData(id);
  const { data: charityList } = getCharityList("simplified=true");

  useEffect(() => {
    if (sampleData) {
      const { SampleSize, CharityIncluded } = sampleData;
      form.setFieldsValue({ selected_charity: CharityIncluded });
      if (JSON.parse(sampleData.json) !== initialQuery) {
        setQuery(JSON.parse(sampleData.json));
      } else {
        setQuery(initialQuery);
      }

      if (SampleSize === 99999) {
        setMaxSize(true);
      }
    }
  }, [sampleData]);

  const charityOptions = useMemo(() => {
    if (charityList) {
      const newstate = charityList?.map((charity) => ({
        label: charity.name,
        value: charity.name,
      }));
      return [{ label: "All Charities", value: "All" }, ...newstate];
    }
  }, [charityList]);

  const onSelectCharityChange = (event: string[]) => {
    switch (true) {
      case event[event.length - 1] === "All":
        form.setFieldsValue({ selected_charity: ["All"] });
        break;
      case event.includes("All") && event.length > 1:
        form.setFieldsValue({
          selected_charity: event.filter((item) => item !== "All"),
        });
        break;
    }
  };

  const createNewSample = async (event: FormSchema) => {
    const payload: Payload = {
      ...event,
      json: Query,
      Parameters: formatQuery(Query, "sql"),
    };

    try {
      await useCreateNewSample(payload);
      notificationApi.success({
        message: "Successfully create sample",
      });
      mutate();
      navigate("/admin/Quantitative/Samples");
    } catch (error) {
      notificationApi.error({
        message: "Failed to create sample",
      });
    }
  };

  const updateSample = async (event: FormSchema) => {
    const payload: Payload = {
      ...event,
      json: Query,
      Parameters: formatQuery(Query, "sql"),
    };

    if (id && !isCreateNew) {
      try {
        await useUpdateSample(id, payload);
        notificationApi.success({
          message: "Successfully update sample",
        });
        mutate();
        navigate("/admin/Quantitative/Samples");
      } catch (error) {
        notificationApi.error({
          message: "Failed to update sample",
        });
      }
    }
  };

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!sampleData && !isCreateNew) {
    return null;
  }

  return (
    <div className="  tw-h-[calc(100vh-64px)] tw-px-6 tw-flex tw-flex-col tw-gap-4 tw-overflow-auto ">
      <Form
        requiredMark="optional"
        form={form}
        layout="vertical"
        onFinish={
          isCreateNew
            ? (event) => {
                createNewSample(event);
              }
            : (event) => {
                updateSample(event);
              }
        }
        initialValues={
          isCreateNew
            ? {
                name: "",
                size: 10,
                notes: "",
                selected_charity: ["All"],
              }
            : {
                name: sampleData?.SampleName,
                size: sampleData?.SampleSize,
                notes: sampleData?.SampleNotes,
              }
        }
      >
        <div className=" flex flex-col gap-4 ">
          <div className=" tw-flex tw-gap-2 tw-justify-between tw-items-baseline">
            <div className=" tw-flex tw-gap-2 tw-items-baseline">
              <Title level={2}>
                {isCreateNew ? "Create New Sample" : sampleData?.SampleName}
              </Title>
              <Link to="/admin/Quantitative/Samples">
                <Button icon={<LeftOutlined />} type="link">
                  Back
                </Button>
              </Link>
            </div>

            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#22c55e",
                },
              }}
            >
              <Button type="primary" htmlType="submit">
                <span className=" tw-px-10">
                  {isCreateNew ? "Create" : "Save"}
                </span>
              </Button>
            </ConfigProvider>
          </div>
          <Row gutter={16}>
            <Col span={8}>
              <div style={colStyle}>
                <Form.Item<FormSchema>
                  style={formItemStyle}
                  label="Sample name"
                  name={"name"}
                  rules={[
                    {
                      required: true,
                      message: "Please input sample name!",
                    },
                  ]}
                >
                  <Input name="Sample name" placeholder="Sample name" />
                </Form.Item>
                <Form.Item<FormSchema>
                  style={formItemStyle}
                  valuePropName="value"
                >
                  <Space.Compact style={{ width: "100%" }}>
                    <Form.Item<FormSchema>
                      name="size"
                      style={{ width: "100%" }}
                      rules={[
                        {
                          required: true,
                          message: "Please input size!",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        disabled={MaxSize}
                        max={99999}
                        onChange={(e) => {
                          if (e === 99999) {
                            setMaxSize(true);
                          }
                        }}
                      />
                    </Form.Item>
                    <Button
                      icon={MaxSize && <CheckOutlined />}
                      type={MaxSize ? "primary" : "default"}
                      onClick={() => {
                        form.setFieldsValue({ size: MaxSize ? 10 : 99999 });
                        setMaxSize(!MaxSize);
                      }}
                    >
                      Max
                    </Button>
                  </Space.Compact>
                </Form.Item>

                <Form.Item<FormSchema>
                  style={formItemStyle}
                  label="Notes"
                  name={"notes"}
                >
                  <Input.TextArea
                    autoSize={{ minRows: 4, maxRows: 6 }}
                    name="Notes"
                    placeholder="Notes"
                  />
                </Form.Item>

                <div className=" p-4 ">
                  <Form.Item<FormSchema>
                    style={formItemStyle}
                    label="Include charity"
                    name={"selected_charity"}
                  >
                    <Select
                      mode="multiple"
                      options={charityOptions}
                      onChange={(e) => onSelectCharityChange(e)}
                    />
                  </Form.Item>
                </div>
              </div>
            </Col>
            <Col span={16}>
              <div style={colStyle}>
                <ICQueryBuilder
                  state={{
                    Query,
                    setQuery,
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
}

export default SampleEditor;
