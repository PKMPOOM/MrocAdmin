import React from "react";

type Props = {
  children: React.ReactNode;
};

const ContainerSimplified = ({ children }: Props) => {
  return (
    <div
      className="tw-group tw-flex-1 tw-flex tw-basis-44 tw-relative "
      style={{
        height: "auto",
        flexDirection: "column",
        borderRadius: "8px",
      }}
    >
      <div className=" tw-bg-white tw-flex-1 tw-flex tw-basis-44 tw-h-auto tw-flex-col tw-rounded-lg tw-overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ContainerSimplified;
