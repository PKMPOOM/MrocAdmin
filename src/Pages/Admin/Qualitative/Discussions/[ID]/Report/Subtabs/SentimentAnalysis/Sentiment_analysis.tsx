import {
  Avatar,
  Button,
  DatePicker,
  Input,
  List,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { FaArrowDown, FaArrowUp, FaMagnifyingGlass } from "react-icons/fa6";
import styled from "styled-components";
import { fakeDiscussionResult } from "../../../../../../../../Constant/fakeDiscussionData";
import { useThemeContext } from "../../../../../../../../Context/Theme/ApplicationProvider";

const { Text } = Typography;

interface SemtimentsBarProps {
  color: string;
  border: string;
  background_color: string;
  background_color_hover: string;
  negativeAmount: number;
  positiveAmount: number;
  discussionlength: number;
}
// token.colorSuccessTextActive
const PositiveBar = styled.div<SemtimentsBarProps>`
  display: flex;
  justify-content: end;
  color: ${(props) => props.color};
  padding-right: 10px;
  border-radius: 4px 0px 0px 4px;
  border: 1px solid ${(props) => props.border};
  background-color: ${(props) => props.background_color};
  transition: all 0.1s ease-out;
  cursor: pointer;
  width: ${(props) =>
    props.negativeAmount < props.positiveAmount
      ? (props.positiveAmount / props.discussionlength) * 100 + "%"
      : props.positiveAmount < props.negativeAmount
      ? 100 - (props.negativeAmount / props.discussionlength) * 100 + "%"
      : "50%"};
  &:hover {
    background-color: ${(props) => props.background_color_hover};
    transition: all 0.1s ease-out;
  }
`;

const Negativebar = styled.div<SemtimentsBarProps>`
  display: flex;
  justify-content: start;
  color: ${(props) => props.color};
  padding-left: 10px;
  border-radius: 0px 4px 4px 0px;
  border: 1px solid ${(props) => props.border};
  background-color: ${(props) => props.background_color};
  transition: all 0.1s ease-out;
  cursor: pointer;
  width: ${(props) =>
    props.negativeAmount < props.positiveAmount
      ? (props.positiveAmount / props.discussionlength) * 100 + "%"
      : props.positiveAmount < props.negativeAmount
      ? 100 - (props.negativeAmount / props.discussionlength) * 100 + "%"
      : "50%"};
  width: ${(props) =>
    props.negativeAmount < props.positiveAmount
      ? (props.negativeAmount / props.discussionlength) * 100 + "%"
      : props.positiveAmount < props.negativeAmount
      ? 100 - (props.positiveAmount / props.discussionlength) * 100 + "%"
      : "50%"};
  &:hover {
    background-color: ${(props) => props.background_color_hover};
    transition: all 0.1s ease-out;
  }
`;

function Sentiment_analysis() {
  const { token } = useThemeContext();
  const [SearchKey, setSearchKey] = useState("");

  const filteredList = fakeDiscussionResult.filter((item) => {
    return SearchKey === ""
      ? item
      : Object.entries(item).some((value) =>
          value
            .toString()
            .toLocaleLowerCase()
            .includes(SearchKey.toLocaleLowerCase())
        );
  });

  const positiveAmount = fakeDiscussionResult.reduce((count, item) => {
    if (item.sentiment === "positive") {
      return count + 1;
    } else {
      return count;
    }
  }, 0);

  const negativeAmount = fakeDiscussionResult.reduce((count, item) => {
    if (item.sentiment === "negative") {
      return count + 1;
    } else {
      return count;
    }
  }, 0);

  return (
    <div className="tw-flex tw-h-[calc(100vh-212px)] ">
      <div className="tw-w-full tw-h-full ">
        <div className="tw-flex tw-gap-2 tw-justify-between">
          <div className="tw-w-1/4 tw-flex tw-gap-5 tw-bg-red-50">
            <Input
              placeholder="Seach"
              value={SearchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              suffix={<FaMagnifyingGlass style={{ opacity: 0.5 }} />}
            />
          </div>
          <div className="tw-flex tw-overflow-hidden tw-gap-1 tw-items-center tw-w-[500px] ">
            <Tooltip title="Positive">
              <PositiveBar
                negativeAmount={negativeAmount}
                positiveAmount={positiveAmount}
                discussionlength={fakeDiscussionResult.length}
                background_color_hover={token.colorSuccessBgHover}
                background_color={token.colorSuccessBg}
                border={token.colorSuccessText}
                color={token.colorSuccessTextActive}
                onClick={() => {
                  if (SearchKey.toLocaleLowerCase() !== "positive") {
                    setSearchKey("positive");
                  } else if (SearchKey.toLocaleLowerCase() === "positive") {
                    setSearchKey("");
                  }
                }}
              >
                <p>{positiveAmount.toString()}</p>
              </PositiveBar>
            </Tooltip>
            <Tooltip title="Negative">
              <Negativebar
                negativeAmount={negativeAmount}
                positiveAmount={positiveAmount}
                discussionlength={fakeDiscussionResult.length}
                background_color_hover={token.colorErrorBorder}
                background_color={token.colorErrorBgHover}
                border={token.colorErrorText}
                color={token.colorErrorTextActive}
                onClick={() => {
                  if (SearchKey.toLocaleLowerCase() !== "negative") {
                    setSearchKey("negative");
                  } else if (SearchKey.toLocaleLowerCase() === "negative") {
                    setSearchKey("");
                  }
                }}
              >
                <p>{negativeAmount.toString()}</p>
              </Negativebar>
            </Tooltip>
          </div>
          <div className="tw-flex tw-gap-2">
            <DatePicker.RangePicker
              format={"DD-MMM-YYYY"}
              defaultValue={[dayjs().subtract(30, "day"), dayjs()]}
            />
            <Button type="primary">Run AI analysis</Button>
          </div>
        </div>
        <div className="tw-h-[calc(100vh-260px)] tw-overflow-y-auto tw-mt-4">
          <List
            style={{ marginBottom: "40px" }}
            itemLayout="horizontal"
            dataSource={filteredList}
            renderItem={(item, index) => (
              <List.Item>
                <div className="tw-flex tw-w-full tw-justify-between tw-gap-2">
                  <div className="tw-flex tw-flex-1 tw-gap-2">
                    <div>
                      <Avatar
                        src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                      />
                    </div>
                    <div className="tw-flex tw-flex-col tw-gap-1">
                      <Text>{item.comments}</Text>
                      <div className="tw-flex tw-gap-2 tw-text-xs tw-opacity-70">
                        <p className="tw-font-bold">{item.username}</p>
                        <p>{dayjs(item.datecreated).format("DD-MMM-YYYY")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-items-center tw-basis-20 tw-justify-between">
                    <Tag
                      style={{ marginInlineEnd: 0 }}
                      color={
                        item.sentiment === "positive"
                          ? "green"
                          : item.sentiment === "negative"
                          ? "red"
                          : "default"
                      }
                    >
                      {item.sentiment}
                    </Tag>
                    <div className="tw-flex tw-gap-2 tw-items-center tw-text-gray-700 ">
                      <FaArrowUp />
                      <Text strong>{item.vote}</Text>
                      <FaArrowDown />
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default Sentiment_analysis;
