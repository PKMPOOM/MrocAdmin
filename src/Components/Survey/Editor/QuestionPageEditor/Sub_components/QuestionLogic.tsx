import {
  FaAsterisk,
  FaRandom,
  FaSortAlphaDown,
  FaSortAlphaUp,
} from "react-icons/fa";
import { Tooltip } from "antd";
import { theme } from "antd";

type QuestionLogicProps = {
  required: boolean;
  forcerequired: boolean;
  useprecodeoptions: boolean;
  presetoption: "shuffle" | "sort" | "none";
  sortdir: "asc" | "dsc";
  questiontype: string;
};

function QuestionLogic({
  required,
  forcerequired,
  presetoption,
  sortdir,
  useprecodeoptions,
  questiontype,
}: QuestionLogicProps) {
  const { token } = theme.useToken();

  const isPrecodesAvailable = ["multi_select", "single_select"].includes(
    questiontype
  );
  const showShuffleIcon =
    isPrecodesAvailable && useprecodeoptions && presetoption === "shuffle";
  const showSortIcon =
    isPrecodesAvailable && useprecodeoptions && presetoption === "sort";

  return (
    <div className="tw-flex tw-items-center tw-gap-2 tw-mr-4">
      {required && (
        <Tooltip title={forcerequired ? "Force response" : "Request response"}>
          <FaAsterisk
            style={{
              color: forcerequired ? token.colorError : token.colorIcon,
            }}
            size={14}
          />
        </Tooltip>
      )}
      {showShuffleIcon && (
        <Tooltip title="Shuffle answer">
          <FaRandom style={{ color: token.colorIcon }} size={14} />
        </Tooltip>
      )}
      {showSortIcon && (
        <Tooltip
          title={`Sort ${sortdir === "asc" ? "ascending" : "descending"}`}
        >
          {sortdir === "asc" ? (
            <FaSortAlphaDown style={{ color: token.colorIcon }} size={14} />
          ) : (
            <FaSortAlphaUp style={{ color: token.colorIcon }} size={14} />
          )}
        </Tooltip>
      )}
    </div>
  );
}

export default QuestionLogic;
