import {
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, InputNumber, Popover, Space } from "antd";
import React from "react";
import styled from "styled-components";
import { useAuth } from "../../../../../../Context/Auth/AuthContext";
import { SimplifiedBlockProps } from "../../../../../../Interface/User/UserDashboardTypes";
import { useSectionEditorStore } from "../../../../../../Store/useSectionEditorStore";
import DescValue from "../../../../../Global/Utils/DescValue";
import AddBlockDropdown from "../../AddBlockDropdown";
import BlogDisplayer from "./Content/Blog/BlogDisplayer";
import DiscussionDisplayer from "./Content/Discussion/DiscussionDisplayer";
import SurveyDisplayer from "./Content/Survey/SurveyDisplayer";
import { useThemeContext } from "../../../../../../Context/Theme/ApplicationProvider";

type Props = {
  blocks: SimplifiedBlockProps;
  SumWidth?: number;
  autoWidthAmount?: number;
  index: number;
  otherWidth: number;
  indexData: {
    isLastIndex: boolean;
    isFirstIndex: boolean;
    contentLimitReach: boolean;
  };
};

const ContentCardContainer = styled.div<{
  $otherWidth: number;
  $space: number | undefined;
  $color: string;
  $borderColor: string;
}>`
  padding: 8px;
  border-radius: 8px;
  max-width: 100%;
  min-height: 100%;
  gap: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  flex-grow: ${({ $space }) => ($space ? 0 : 1)};
  min-width: 100%;
  justify-content: stretch;
  max-width: ${({ $otherWidth, $space }) => {
    if ($space) {
      return `${$space}%`;
    } else {
      return $otherWidth === 0 ? `${$space}%` : `${$otherWidth}%`;
    }
  }};
  @media (min-width: 1024px) {
    min-width: ${({ $space }) => ($space ? `${$space}%` : "auto")};
  }
`;

const BlockFullSize = ({
  blocks,
  otherWidth,
  index: blockIndex,
  SumWidth,
  autoWidthAmount,
  indexData,
}: Props) => {
  const { contentLimitReach, isFirstIndex, isLastIndex } = indexData;
  const { AuthUser } = useAuth();
  const { token } = useThemeContext();

  const [
    setCheckBox,
    onCustomWidthChange,
    onSort,
    onBlockDelete,
    BlockContentHeight,
  ] = useSectionEditorStore((state) => [
    state.useUseBlockCustomWidth,
    state.onCustomWidthChange,
    state.onBlockSort,
    state.onBlockDelete,
    state.BLOCKCONTENTHEIGHT,
  ]);

  const onClient = window.location.href.includes("/admin");
  const isAdmin = AuthUser?.role === "admin";
  const showEditor = onClient && isAdmin;

  const ContentMap: { [key: string]: React.ReactNode } = {
    blog: (
      <BlogDisplayer
        blockIndex={blockIndex}
        blog={blocks.blog}
        displayType={blocks.display_type}
      />
    ),

    survey: (
      <SurveyDisplayer
        blockIndex={blockIndex}
        survey={blocks.surveys}
        displayType={blocks.display_type}
      />
    ),

    discussion: (
      <DiscussionDisplayer
        blockIndex={blockIndex}
        discussion={blocks.discussions}
        displayType={blocks.display_type}
      />
    ),
  };

  const RemainingWidth =
    SumWidth === 0
      ? 100 / autoWidthAmount!
      : autoWidthAmount! > 1
      ? (100 - SumWidth!) / autoWidthAmount!
      : 100 - SumWidth!;

  return (
    <ContentCardContainer
      $space={blocks.width!}
      $borderColor={token.colorPrimaryBorder}
      $color={token.colorPrimaryBg}
      $otherWidth={RemainingWidth}
    >
      <div
        className=" tw-rounded-xl tw-group tw-h-full tw-flex tw-flex-col tw-justify-between"
        style={{
          border: `1px solid ${token.colorPrimaryBorder}`,
          backgroundColor: token.colorPrimaryBg,
        }}
      >
        {/* Content List */}
        <div
          style={{
            minHeight: `${BlockContentHeight}px`,
          }}
          className="  tw-flex tw-gap-3 tw-p-3  tw-flex-col lg:tw-flex-row tw-flex-wrap tw-flex-1  "
        >
          {ContentMap[blocks.content_type]}
        </div>

        {!contentLimitReach && showEditor && (
          <AddBlockDropdown
            rotate
            className={`  group-hover:tw-flex tw-absolute tw-z-40 tw-left-1/4 -tw-translate-x-1/2 lg:tw-h-full lg:tw-top-0 lg:tw-translate-x-0 lg:tw-w-6 lg:tw-flex lg:tw-justify-center lg:tw-items-start lg:tw-pt-14 ${
              isFirstIndex
                ? "-tw-top-1 lg:-tw-left-1 "
                : "-tw-top-3 lg:-tw-left-3 "
            } `}
            sectionID={blocks.id!}
            index={blockIndex}
            label="Block"
          />
        )}
        {isLastIndex && showEditor && !contentLimitReach && (
          <AddBlockDropdown
            rotate
            className=" tw-flex tw-absolute tw-z-40 tw-items-center -tw-bottom-3 tw-right-3/4 tw-translate-x-1/2 lg:tw-h-full lg:tw-top-0 lg:tw-translate-x-0 lg:-tw-right-1 lg:tw-w-6 lg:tw-items-start lg:tw-pt-14 lg:tw-flex lg:tw-justify-center
             "
            sectionID={blocks.id!}
            index={blockIndex + 1}
            label="Block"
          />
        )}

        {/* Content List */}
        {showEditor && (
          <div className=" tw-flex tw-items-start tw-gap-2 tw-p-2  tw-flex-col ">
            <div className="tw-flex tw-gap-2 tw-w-full ">
              <Space.Compact>
                <Button
                  disabled={isFirstIndex}
                  type="default"
                  icon={<LeftOutlined />}
                  onClick={() => {
                    onSort(blockIndex, blockIndex - 1);
                  }}
                />
                <Button
                  disabled={isLastIndex}
                  type="default"
                  icon={<RightOutlined />}
                  onClick={() => {
                    onSort(blockIndex, blockIndex + 1);
                  }}
                />
              </Space.Compact>
              <Popover
                placement="bottomLeft"
                content={
                  <div
                    style={{
                      borderTop: `1px solid ${token.colorPrimaryBorder}`,
                    }}
                    className=" tw-flex tw-gap-2 tw-items-start tw-flex-wrap tw-basis-24  "
                  >
                    <div className=" tw-flex tw-items-start tw-p-2 tw-flex-wrap tw-flex-1 tw-h-full tw-justify-start">
                      <div className="tw-flex tw-flex-col tw-gap-2 lg:tw-flex-row tw-items-start lg:tw-items-center tw-flex-wrap  ">
                        <Checkbox
                          style={{
                            width: "130px",
                          }}
                          checked={blocks.width !== null}
                          onChange={(e) => {
                            const newValue =
                              SumWidth === 0
                                ? 15
                                : autoWidthAmount! > 1
                                ? (100 - SumWidth!) / autoWidthAmount!
                                : 100 - SumWidth!;

                            setCheckBox(e.target.checked, blockIndex, newValue);
                          }}
                        >
                          Custom Width
                        </Checkbox>
                      </div>
                    </div>
                  </div>
                }
                title={
                  <div className=" tw-p-2 tw-gap-1 tw-flex-col  tw-transition-all tw-duration-150 tw-flex">
                    <DescValue keyValue="Display" value={blocks.display_type} />
                    <DescValue
                      keyValue="Width"
                      value={blocks.width ? `${blocks.width}%` : "auto"}
                    />
                    <DescValue keyValue="Content" value={blocks.content_type} />
                  </div>
                }
              >
                <Button icon={<SettingOutlined />}></Button>
              </Popover>
              <Button
                type="default"
                danger
                icon={<DeleteOutlined />}
                style={{
                  marginLeft: "auto",
                }}
                onClick={() => {
                  onBlockDelete(blockIndex);
                }}
              ></Button>
            </div>
            <div className=" tw-flex tw-items-center tw-gap-2">
              <>
                Width
                <InputNumber
                  disabled={!blocks.custom_width}
                  suffix={blocks.width ? "%" : null}
                  style={{ width: "60px" }}
                  max={100 - otherWidth!}
                  min={15}
                  placeholder="auto"
                  value={blocks.width}
                  onChange={(e) => onCustomWidthChange(e as number, blockIndex)}
                />
              </>
            </div>
          </div>
        )}
      </div>
    </ContentCardContainer>
  );
};

export default BlockFullSize;
