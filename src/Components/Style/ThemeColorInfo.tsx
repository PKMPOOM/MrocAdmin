type Props = {
  color?: string;
  label?: string;
};

const ThemeColorInfo = ({ color, label }: Props) => {
  return (
    <div className=" tw-flex tw-items-center tw-gap-2 tw-flex-1">
      {color ? (
        <div
          style={{
            backgroundColor: color,
            border: "1px solid #ccc",
          }}
          className=" tw-h-7 tw-w-7 tw-rounded-full"
        ></div>
      ) : null}

      <p>{label ? label : color}</p>
    </div>
  );
};

export default ThemeColorInfo;
