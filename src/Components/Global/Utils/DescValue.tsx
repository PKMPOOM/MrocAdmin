import { Typography } from "antd";
import { ReactNode } from "react";
const { Text } = Typography;

type Props = {
  keyValue: string;
  value?: string;
  extra?: string;
  element?: ReactNode;
  invert?: boolean;
};

const DescValue = ({
  keyValue,
  value,
  extra,
  element,
  invert = false,
}: Props) => {
  return (
    <div
      className={`${
        invert ? "tw-text-white" : "tw-text-slate-500"
      } tw-flex tw-gap-1  tw-items-center  `}
    >
      {keyValue ? <p>{keyValue}: </p> : null}
      <Text
        strong
        ellipsis
        style={{
          color: invert ? "white" : "black",
        }}
      >
        {value}

        {extra}
      </Text>
      {element}
    </div>
  );
};

export default DescValue;
