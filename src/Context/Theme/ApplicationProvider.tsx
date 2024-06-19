import { ConfigProvider, theme } from "antd";
import React, { createContext, useContext, useEffect } from "react";
import { useTheme } from "../../Store/useTheme";
import { getTheme } from "./api";
import type { GlobalToken, ThemeConfig } from "antd";
import { useAuth } from "../Auth/AuthContext";

// -------- Fonts import --------
import "@fontsource/roboto";
// Supports weights 100-900
import "@fontsource-variable/roboto-slab";
// Supports weights 100-700
import "@fontsource-variable/roboto-mono";
import "@fontsource/lato";
import "@fontsource/rajdhani";
// Supports weights 100-900
import "@fontsource-variable/inter";
// Supports weights 100-900
import "@fontsource-variable/outfit";
// Supports weights 100-700
import "@fontsource-variable/josefin-sans";

const { useToken } = theme;

type TthemeContext = {
  token: GlobalToken;
};

export const ThemeContext = createContext<TthemeContext>({} as TthemeContext);

const ApplicationProvider = ({ children }: { children: React.ReactNode }) => {
  const [colorThemeToken, setColorThemeToken] = useTheme((state) => [
    state.colorThemeToken,
    state.setColorThemeToken,
  ]);

  const { AuthUser } = useAuth();

  const { token } = useToken();

  const { data: ThemeData, error } = getTheme(AuthUser);

  const defaultThemeToken: ThemeConfig["token"] = {
    colorPrimary: token.colorPrimary,
    colorText: token.colorText,
  };

  useEffect(() => {
    if (error) {
      setColorThemeToken(defaultThemeToken);
    } else if (ThemeData) {
      setColorThemeToken({
        ...ThemeData.data,
        fontSize: ThemeData.data.fontSize,
        fontFamily: ThemeData.data.fontStyle,
      });
    }
  }, [ThemeData]);

  // document.title = "MROC";

  return (
    <ConfigProvider
      theme={{
        token: colorThemeToken,
      }}
    >
      <ThemeContext.Provider
        value={{
          token,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </ConfigProvider>
  );
};

export function useThemeContext() {
  return useContext(ThemeContext);
}

export default ApplicationProvider;
