import { Button, Result } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ResultPage() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 10000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Result
      style={{ marginTop: "20vh" }}
      icon={<MailOutlined />}
      status="info"
      title="Confirmation email has been sent to your email"
      subTitle="bro go check your email"
      extra={[
        <Button href="/login" type="primary" key="console" size="large">
          back to login
        </Button>,
      ]}
    />
  );
}

export default ResultPage;
