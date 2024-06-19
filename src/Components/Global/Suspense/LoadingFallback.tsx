import { LoadingOutlined } from "@ant-design/icons";
import { theme } from "antd";
const { useToken } = theme;

function LoadingFallback() {
  const { token } = useToken();

  return (
    <div className=" tw-flex tw-flex-col tw-items-center tw-gap-4 tw-pt-48   ">
      <div>
        <LoadingOutlined style={{ fontSize: 60, color: token.colorPrimary }} />
      </div>
      <p>Loading..</p>
    </div>
  );
}

export default LoadingFallback;
