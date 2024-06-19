import { Form, Input, Select, Typography, Button } from "antd";
import { useState } from "react";
import { useAuth } from "../../Context/Auth/AuthContext";
import axios from "axios";
const { Title } = Typography;

interface postDataType {
  first_name: string;
  last_name: string;
  gender: "male" | "female" | "other" | "";
  region: "Us" | "Eu" | "Sea" | "";
  user_name: string;
}

type selectOptionsProps = {
  label: string;
  value: string;
};

const genderOptions: selectOptionsProps[] = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
  {
    label: "Other",
    value: "other",
  },
];

const regionOptions: selectOptionsProps[] = [
  {
    label: "Us",
    value: "Us",
  },
  {
    label: "Eu",
    value: "Eu",
  },
  {
    label: "Sea",
    value: "Sea",
  },
];

function Onboarding() {
  const [onbardform] = Form.useForm();
  const [Steps, setSteps] = useState(0);
  const [PostData, setPostData] = useState<postDataType>({
    first_name: "",
    last_name: "",
    gender: "",
    region: "",
    user_name: "",
  });

  const { AuthUser } = useAuth();
  console.log(PostData);

  async function onSubmit(event: postDataType) {
    if (Steps === 0) {
      setSteps(1);
      setPostData((prev) => ({
        ...prev,
        first_name: event.first_name,
        last_name: event.last_name,
        gender: event.gender,
        region: event.region,
      }));
    } else {
      const updatedPostData = {
        ...PostData,
        user_name: event.user_name,
      };

      setPostData(updatedPostData);

      await axios
        .put(`${import.meta.env.VITE_AUTH_API_URL}/userdata`, {
          PostData: updatedPostData,
          userID: AuthUser?.id,
        })
        .then((res: any) => {
          console.log(res);
          window.location.href = "/admin/Dashboard";
        });
    }
  }

  return (
    <div className="tw-w-screen tw-flex tw-gap-6 tw-h-max tw-min-h-full">
      <div className="tw-w-3/5 tw-flex tw-justify-center">
        <div className="tw-pt-12 tw-flex tw-flex-col tw-gap-7 tw-w-[500px] tw-px-10">
          <div className="tw-flex tw-flex-col ">
            <div>
              <Title level={5}>Hi {AuthUser?.email}</Title>
              <Title level={2}>Let's get you up and running</Title>
              <p className="tw-text-base tw-text-slate-400">
                To begin, we require some introductory information about you.
                Please provide the details below so we can proceed.
              </p>
              <p className="tw-text-slate-400 tw-text-sm tw-mt-2">
                You can edit or delete this information anytime,
                <br /> so accuracy isn't a concern.
              </p>
            </div>
          </div>
          <div>
            <Form
              form={onbardform}
              layout="vertical"
              onFinish={onSubmit}
              requiredMark="optional"
            >
              {Steps === 0 ? (
                <>
                  <Form.Item
                    rules={[{ required: true }]}
                    name={"first_name"}
                    label="First name"
                  >
                    <Input placeholder="First name" />
                  </Form.Item>
                  <Form.Item
                    rules={[{ required: true }]}
                    name={"last_name"}
                    label="Last name"
                  >
                    <Input placeholder="Last name" />
                  </Form.Item>
                  <Form.Item
                    rules={[{ required: true }]}
                    name={"gender"}
                    label="Gender"
                  >
                    <Select options={genderOptions} />
                  </Form.Item>
                  <Form.Item
                    rules={[{ required: true }]}
                    name={"region"}
                    label="Region"
                  >
                    <Select options={regionOptions} />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    rules={[{ required: true }]}
                    name={"user_name"}
                    label="Display name"
                  >
                    <Input placeholder="Display name" />
                  </Form.Item>
                </>
              )}
              <div className="tw-flex tw-justify-between">
                {Steps === 0 ? (
                  <Button htmlType="submit" type="primary">
                    Next
                  </Button>
                ) : (
                  <>
                    <Button
                      type="text"
                      onClick={() => {
                        setSteps(0);
                      }}
                    >
                      Back
                    </Button>
                    <Button type="primary" htmlType="submit">
                      submit
                    </Button>
                  </>
                )}
              </div>
            </Form>
          </div>
        </div>
      </div>
      <div className="tw-w-2/5 tw-overflow-hidden">
        <img
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          src="https://images.pexels.com/photos/3617457/pexels-photo-3617457.jpeg?auto=compress&cs=tinysrgb&w=1920&h=2400&dpr=1"
        />
      </div>
    </div>
  );
}

export default Onboarding;
