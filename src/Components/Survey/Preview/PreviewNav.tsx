import { QrcodeOutlined, RetweetOutlined } from "@ant-design/icons";
import { Button, Divider, Popover, QRCode, theme } from "antd";
import DeviceSelector from "./DeviceSelector";
import { useSurveyPreviewStore } from "~/src/Pages/User_Side/survey/preview/[id]/Survey.preview.store";
const { useToken } = theme;

const PreviewNav = () => {
  const { token } = useToken();
  const toggleDebugMode = useSurveyPreviewStore(
    (state) => state.toggleDebugMode
  );
  return (
    <div
      style={{
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
      className=" tw-border-b  tw-p-2 tw-flex tw-justify-between tw-items-center "
    >
      <DeviceSelector />
      <div className=" tw-flex tw-gap-2 tw-items-center">
        <Button type="primary" onClick={toggleDebugMode}>
          Debug
        </Button>
        <Button icon={<RetweetOutlined />} type="primary">
          Restart
        </Button>
        <Popover
          overlayInnerStyle={{ padding: 0 }}
          content={
            <QRCode value={window.location.href || "-"} bordered={false} />
          }
          //   title="QR code"
        >
          <Button icon={<QrcodeOutlined />} />
        </Popover>
        <Button>Send Test Link</Button>
        <Divider type="vertical" />
        <Button type="primary">
          <span className="tw-px-5">Publish</span>
        </Button>
      </div>
    </div>
  );
};

export default PreviewNav;
