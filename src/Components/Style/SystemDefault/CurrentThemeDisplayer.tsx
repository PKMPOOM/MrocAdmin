import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { useThemeContext } from "../../../Context/Theme/ApplicationProvider";
import { rgbaToHex } from "../../../Pages/Admin/System/Style/function";
import { TthemeData } from "../../../Store/useTheme";
import ThemeCardContainer from "../ThemeCard";
import ThemeColorInfo from "../ThemeColorInfo";
import { removeCustomTheme } from "../../../Pages/Admin/System/Style/api";

type Props = {
  customTheme: TthemeData | undefined;
};
const CurrentThemeDisplayer = ({ customTheme }: Props) => {
  const { token } = useThemeContext();

  return (
    <>
      {customTheme ? (
        <div className=" tw-flex tw-gap-2 tw-justify-between tw-items-center">
          <div className=" tw-grid tw-grid-cols-6 tw-gap-2">
            <ThemeCardContainer
              name="Color primary"
              element={
                <ThemeColorInfo
                  color={customTheme.colorPrimary}
                  label={rgbaToHex(customTheme.colorPrimary)}
                />
              }
            />
            <ThemeCardContainer
              name="Color text"
              element={
                <ThemeColorInfo
                  color={customTheme.colorText}
                  label={rgbaToHex(customTheme.colorText)}
                />
              }
            />
            <ThemeCardContainer
              name="Container color"
              element={
                <ThemeColorInfo
                  color={customTheme.colorBgContainer}
                  label={rgbaToHex(customTheme.colorBgContainer)}
                />
              }
            />
            <ThemeCardContainer
              name="Nav type"
              element={<>{customTheme.userNavType}</>}
            />
            <ThemeCardContainer
              name="Login background type"
              element={<>{customTheme.loginTemplate}</>}
            />
            <ThemeCardContainer
              name="Fonts"
              element={
                <>
                  {`${customTheme.fontStyle.replaceAll("Variable", "")} ${
                    customTheme.fontSize
                  }`}
                </>
              }
            />
          </div>
          <div className=" tw-flex tw-gap-2">
            <Link to={`/admin/system/style/${customTheme.themeID}`}>
              <Button icon={<EditOutlined />}>Edit</Button>
            </Link>
            <Button
              onClick={async () => {
                await removeCustomTheme(customTheme.themeID);
                window.location.href = window.location.href;
              }}
            >
              Revert to default
            </Button>
          </div>
        </div>
      ) : (
        <div className=" tw-flex tw-gap-2 tw-justify-between tw-items-center">
          <div className=" tw-grid tw-grid-cols-5 tw-gap-2">
            <ThemeCardContainer
              name="Color primary"
              element={
                <ThemeColorInfo
                  color={token.colorPrimary}
                  label={rgbaToHex(token.colorPrimary)}
                />
              }
            />
            <ThemeCardContainer
              name="Color text"
              element={
                <ThemeColorInfo
                  color={token.colorText}
                  label={rgbaToHex(token.colorText)}
                />
              }
            />
            <ThemeCardContainer
              name="Container color"
              element={
                <ThemeColorInfo
                  color={token.colorBgContainer}
                  label={rgbaToHex(token.colorBgContainer)}
                />
              }
            />
            <ThemeCardContainer name="Nav type" element={<>Nav type</>} />
            <ThemeCardContainer
              name="Login background type"
              element={<>Background</>}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CurrentThemeDisplayer;
