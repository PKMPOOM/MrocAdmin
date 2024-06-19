import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import { Link } from "react-router-dom";
const { Title, Text, Link: LinkText } = Typography;
import { useAuth } from "../../Context/Auth/AuthContext";

const Login: React.FC = () => {
  const [LoginForm] = Form.useForm();
  const { Login, LoginErrorText, Fetching } = useAuth();

  interface SubmitFormData {
    username: string;
    password: string;
  }

  const onLogin = async (values: SubmitFormData) => {
    Login(values.username, values.password);
  };

  return (
    <div className="tw-object-cover tw-w-screen tw-h-screen tw-flex tw-bg-slate-200 tw-justify-center tw-items-center">
      <div className="tw-w-[600px] tw-backdrop-blur-xl tw-bg-white tw-rounded-lg tw-overflow-hidden ">
        <div className="tw-flex tw-flex-row tw-grow">
          <Form
            style={{ flexGrow: 1, padding: "40px" }}
            form={LoginForm}
            name="horizontal_login"
            onFinish={onLogin}
          >
            <Form.Item>
              <Title>Log in</Title>
              <div>
                <Text>loikloikpoom@gmail.com</Text>
                <br />
                <Text>123123</Text>
              </div>
            </Form.Item>

            <Form.Item
              name="username"
              validateStatus={
                Fetching ? "validating" : LoginErrorText !== "" ? "error" : ""
              }
              hasFeedback
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
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              validateStatus={
                Fetching ? "validating" : LoginErrorText !== "" ? "error" : ""
              }
              hasFeedback
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item shouldUpdate>
              <Button block type="primary" htmlType="submit" loading={Fetching}>
                Log in
              </Button>
              <div className="tw-mt-2">
                <Text type="danger">{LoginErrorText}</Text>
              </div>
            </Form.Item>
            <div className="tw-flex tw-flex-col tw-gap-2">
              <Text>
                Don't have an account?
                <Link to={"/signup"}>
                  <LinkText> Sign up</LinkText>
                </Link>
              </Text>
            </div>
          </Form>
          <div className="tw-w-[180px] tw-bg-center	 tw-bg-[url('https://images.unsplash.com/photo-1489183988443-b37b7e119ba6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80')] ">
            <div className="tw-p-2 tw-w-full tw-h-full tw-flex tw-flex-col tw-gap-3 tw-pt-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
