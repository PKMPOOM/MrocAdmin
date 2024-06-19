import { Button, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/Auth/AuthContext";
const { Title, Text, Link: LinkText } = Typography;

interface SubmitFormData {
  username: string;
  password: string;
  confirm_password: string;
}

function SignupForm() {
  const { SignUpErrorText, SignUp, Fetching } = useAuth();
  const [SignupForm] = Form.useForm();

  const onSignUp = async (values: SubmitFormData) => {
    console.log(values);
    try {
      await SignUp(values.username, values.password, values.confirm_password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="tw-object-cover tw-w-screen tw-h-screen tw-flex tw-bg-slate-200 tw-justify-center tw-items-center">
      <div className="tw-w-[600px] tw-backdrop-blur-xl tw-bg-white tw-rounded-lg tw-overflow-hidden ">
        <div className="tw-flex tw-flex-row tw-grow">
          <Form
            style={{ flexGrow: 1, padding: "40px" }}
            form={SignupForm}
            name="horizontal_login"
            onFinish={onSignUp}
          >
            <Form.Item>
              <Title>Sign up</Title>
            </Form.Item>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
                {
                  type: "email",
                  message: "Please input valid email format!",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Confirm Password"
              />
            </Form.Item>
            {SignUpErrorText !== "" ? (
              <Form.Item>
                <Text type="danger">{SignUpErrorText}</Text>
              </Form.Item>
            ) : null}

            <Form.Item shouldUpdate>
              <Button block type="primary" htmlType="submit" loading={Fetching}>
                Sign up
              </Button>
            </Form.Item>
            <Form.Item>
              <Link to={"/login"}>
                <Text>
                  Already have an account?
                  <LinkText> Login</LinkText>
                </Text>
              </Link>
            </Form.Item>
          </Form>
          <div className="tw-w-[180px] tw-bg-center	 tw-bg-[url('https://images.unsplash.com/photo-1489183988443-b37b7e119ba6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80')]">
            <div className="tw-p-2 tw-w-full tw-h-full tw-flex tw-flex-col tw-gap-3 tw-pt-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignupForm;
