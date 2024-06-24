import { Button, ConfigProvider } from "antd";
import { BsStars } from "react-icons/bs";

type Props = {
  children?: React.ReactNode;
} & React.ComponentProps<typeof Button>;

const GenerativeButton = ({ children, ...props }: Props) => {
  const defaultBgColor = ["#6253E1", "#04BEFE"];
  const defaultBgColorhover = ["#7b6df9", "#21c6fd"];
  const defaultBgColorActive = ["#5A4ECE", "#04B0EA"];
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            // bg
            defaultBg: `linear-gradient(135deg,${defaultBgColor.join(",")})`,
            defaultActiveBg: `linear-gradient(90deg, ${defaultBgColorActive.join(
              ","
            )})`,
            defaultHoverBg: `linear-gradient(90deg, ${defaultBgColorhover.join(
              ","
            )})`,
            // text
            defaultColor: "#fff",
            defaultHoverColor: "#fff",
            defaultActiveColor: "#fff",
            // border
            defaultBorderColor: "#fff",
            defaultHoverBorderColor: "#fff",
            // shadow
            defaultShadow: "0 2px 0 rgba(5, 145, 255, 0.1)",
          },
        },
      }}
    >
      <Button {...props}>
        <div className=" tw-flex tw-gap-2 tw-items-center tw-justify-center ">
          <span>
            <BsStars />
          </span>
          {children}
        </div>
      </Button>
    </ConfigProvider>
  );
};

export default GenerativeButton;
