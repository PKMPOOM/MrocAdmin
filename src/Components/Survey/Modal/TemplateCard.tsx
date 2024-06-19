import { useContext } from "react";
import { NewSurveyContext } from "./CreateNewSurvey.js";
import { Typography, theme } from "antd";
const { Text } = Typography;
const { useToken } = theme;

type Props = {
  size: "Small" | "Large";
  label: string;
};

function TemplateCard({ size, label }: Props) {
  const { ActiveCard, setActiveCard } = useContext(NewSurveyContext);
  const IsSelected = ActiveCard === label;
  const { token } = useToken();

  return (
    <div
      onClick={() => {
        setActiveCard(label);
      }}
      style={{
        outline: IsSelected ? token.colorPrimary : "1px solid #dfdfdf",
        padding: size === "Large" ? "24px" : size === "Small" ? "10px" : "0px",
        cursor: "pointer",
        borderRadius: "8px",
        backgroundColor: IsSelected ? token.colorPrimary : "white",
        boxShadow: IsSelected ? "1px 2px 9px #eee" : undefined,
      }}
    >
      <Text
        style={{
          marginBottom: 0,
          color: IsSelected ? "white" : "black",
        }}
      >
        {label}
      </Text>
    </div>
  );
}

export default TemplateCard;
