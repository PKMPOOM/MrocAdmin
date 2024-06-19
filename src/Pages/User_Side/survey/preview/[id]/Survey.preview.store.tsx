import {
  FaDesktop,
  FaMobileScreenButton,
  FaTabletScreenButton,
} from "react-icons/fa6";
import { create } from "zustand";

type TAvailableDevices = "desktop" | "mobile" | "tablet";
type TDeviceData = {
  isActive: boolean;
  deviceName: TAvailableDevices;
  deviceIcon: JSX.Element;
  width: number; // in px
  height: number; // in px
};

type State = {
  deviceData: TDeviceData[];
  isDebugMode: boolean;
};

type Action = {
  setActiveDevice: (deviceName: TAvailableDevices) => void;
  toggleDebugMode: () => void;
  setDebugMode: (isDebugMode: boolean) => void;
};

export const useSurveyPreviewStore = create<State & Action>((set) => ({
  deviceData: [
    {
      isActive: true,
      deviceName: "desktop",
      width: 1920,
      height: 1080,
      deviceIcon: <FaDesktop />,
    },
    {
      isActive: false,
      deviceName: "tablet",
      deviceIcon: <FaTabletScreenButton />,
      width: 768,
      height: 1024,
    },
    {
      isActive: false,
      deviceName: "mobile",
      deviceIcon: <FaMobileScreenButton />,
      width: 375,
      height: 667,
    },
  ],

  setActiveDevice: (deviceName) =>
    set((state) => {
      const newstate = state.deviceData;
      newstate.forEach((device) => {
        if (device.deviceName === deviceName) {
          device.isActive = true;
        } else {
          device.isActive = false;
        }
      });

      return { deviceData: newstate };
    }),

  isDebugMode: false,
  toggleDebugMode: () => set((state) => ({ isDebugMode: !state.isDebugMode })),
  setDebugMode: (isDebugMode) => set(() => ({ isDebugMode })),
}));
