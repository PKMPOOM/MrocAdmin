import { Divider } from "antd";
import React from "react";

type Props = {
  name: string;
  element?: React.ReactNode;
  children?: React.ReactNode;
};

const ThemeCardContainer = ({ name, element, children }: Props) => {
  return (
    <div className="tw-p-2 tw-border tw-rounded tw-flex tw-flex-col">
      <p className=" tw-font-semibold">{name}</p>
      <Divider
        style={{
          marginBottom: 8,
          marginTop: 8,
        }}
      />
      {element}
      {children}
    </div>
  );
};

export default ThemeCardContainer;
