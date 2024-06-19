import { Typography } from "antd";
import { TbError404 } from "react-icons/tb";
import { useThemeContext } from "../Context/Theme/ApplicationProvider";

const { Text } = Typography;

function Page404() {
  const { token } = useThemeContext();

  return (
    <div className=" tw-flex tw-h-full tw-w-full tw-justify-center tw-items-start ">
      <div className=" tw-flex tw-flex-col tw-gap-2 tw-items-center tw-mt-[20vh]">
        <TbError404 size={50} color={token.colorWarning} />
        <Text>
          This page is currently being worked on and is not available yet.
        </Text>
      </div>
    </div>
  );
}

export default Page404;
