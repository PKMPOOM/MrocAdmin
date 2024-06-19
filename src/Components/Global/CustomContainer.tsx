import React from "react";
import { cn } from "~/src/lib/utils";

type Props = {
  children: React.ReactNode;
} & React.ComponentProps<"div">;

const CustomContainer = ({ children, className, ...props }: Props) => {
  return (
    <div className="tw-px-4 tw-my-2 tw-w-full  ">
      <div
        {...props}
        className={cn(
          className,
          "tw-flex tw-flex-col lg:tw-flex-initial 2xl:tw-max-w-6xl tw-mx-auto tw-gap-2 tw-justify-stretch tw-bg-white"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default CustomContainer;
