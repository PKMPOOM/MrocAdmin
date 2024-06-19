import { theme } from "antd";
import { useSurveyPreviewStore } from "~/src/Pages/User_Side/survey/preview/[id]/Survey.preview.store";
const { useToken } = theme;

const DeviceSelector = () => {
  const { token } = useToken();
  const [deviceData, setActiveDevice] = useSurveyPreviewStore((state) => [
    state.deviceData,
    state.setActiveDevice,
  ]);

  return (
    <div
      style={{
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
      className=" tw-px-2 tw-py-2 tw-flex tw-gap-2 tw-items-center tw-rounded-md  "
    >
      <p>Device</p>
      {deviceData.map(({ deviceIcon, isActive, deviceName }) => {
        return (
          <div
            onClick={() => {
              setActiveDevice(deviceName);
            }}
            style={{
              color: isActive ? token.colorPrimary : token.colorBorder,
            }}
            className=" hover:tw-bg-slate-100 tw-p-1 tw-text-lg tw-aspect-square tw-rounded tw-cursor-pointer tw-transition-all tw-duration-200"
          >
            {deviceIcon}
          </div>
        );
      })}
    </div>
  );
};

export default DeviceSelector;
