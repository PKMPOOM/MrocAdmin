import { create } from "zustand";
import type { ThemeConfig } from "antd";

export const availableFontList = [
  "Roboto",
  "Roboto Mono Variable",
  "Roboto Slab Variable",
  "Lato",
  "Rajdhani",
  "Inter Variable",
  "Outfit Variable",
  "Josefin Sans Variable",
];

export type TthemeData = {
  themeID: string;
  key: number;
  default: boolean;
  mainThemeColor: string;
  footerColor: string;
  buttonsColor: string;
  headerColor: string;
  // ant design token
  colorPrimary: string;
  colorText: string;
  colorBgContainer: string;
  // ant design token
  enabled: boolean;
  start: Date | null;
  end: Date | null;
  logo: string; // main logo
  userlogo: string; //user side logo
  loginLogoPlacement: string; //left, center, right
  loginBackgroundImage: string[]; //background list of login page
  favicon: string;
  loginTemplate: "background" | "carousel" | "banners";
  userNavType: "default" | "hamburger";
  fontSize: number;
  fontStyle: string;
};

type State = {
  IsDarkMode: boolean;
  colorThemeToken: ThemeConfig["token"];
};

type Action = {
  setIsDarkMode: (IsDarkMode: boolean) => void;
  setColorThemeToken: (color: State["colorThemeToken"]) => void;
};

export const useTheme = create<State & Action>((set) => ({
  IsDarkMode: false,
  setIsDarkMode: (IsDarkMode) => set(() => ({ IsDarkMode: IsDarkMode })),

  colorThemeToken: {
    colorPrimary: "#1677ff",
    colorText: "rgba(0, 0, 0, 0.88)",
  },

  setColorThemeToken: (newToken) => set(() => ({ colorThemeToken: newToken })),
}));
