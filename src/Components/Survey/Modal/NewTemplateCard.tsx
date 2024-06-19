import { Divider, Typography, theme } from "antd";
const { Title, Text } = Typography;
const { useToken } = theme;

type Props = {
  size: "Small" | "Large";
  label: string;
  description: string;
  category: string;
  isactive?: boolean;
};

function NewTemplateCard({
  size,
  label,
  category,
  description,
  isactive = false,
}: Props) {
  const { token } = useToken();

  return (
    <div
      style={{
        outline: isactive
          ? `2px solid ${token.colorPrimary}`
          : "1px solid #dfdfdf",
        padding: size === "Large" ? "24px" : size === "Small" ? "10px" : "0px",
        cursor: "pointer",
        borderRadius: "8px",
        boxShadow: isactive ? "1px 2px 9px #eee" : undefined,
        minHeight: "200px",
        maxWidth: "300px",
        minWidth: "200px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "boxShadow 0.3s",
      }}
    >
      <div className="tw-flex tw-flex-col tw-gap-2 tw-mb-auto">
        <Title
          level={4}
          style={{
            marginBottom: 0,
            // color: isactive ? "white" : "black",
          }}
        >
          {label}
        </Title>
        <Text type="secondary">{description}</Text>
      </div>

      <Divider style={{ marginTop: "auto" }} />
      <Text type="secondary">{category}</Text>
    </div>
  );
}

export default NewTemplateCard;
