import { Button, ConfigProvider } from "antd";
import { BsStars } from "react-icons/bs";

type Props = {
  children?: React.ReactNode;
} & React.ComponentProps<typeof Button>;

const GenerativeButton = ({ children, ...props }: Props) => {
  const colors1 = ["#6253E1", "#04BEFE"];
  const colors2 = ["#6859ED", "#10C3FF"];
  const colors3 = ["#5A4ECE", "#04B0EA"];
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: `linear-gradient(135deg,${colors1.join(",")})`,
            colorPrimaryHover: `linear-gradient(90deg, ${colors2.join(",")})`,
            colorPrimaryActive: `linear-gradient(90deg, ${colors3.join(",")})`,
          },
        },
      }}
    >
      <Button type="primary" {...props}>
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
