import React from "react";
import styled from "styled-components";
import { useThemeContext } from "../../../../../Context/Theme/ApplicationProvider";
import { SimplifiedBlockProps } from "../../../../../Interface/User/UserDashboardTypes";
import { useSectionEditorStore } from "../../../../../Store/useSectionEditorStore";
import BlogDisplayer from "../../../../System/UserFeedSettings/Section/[id]/Block/Content/Blog/BlogDisplayer";
import DiscussionDisplayer from "../../../../System/UserFeedSettings/Section/[id]/Block/Content/Discussion/DiscussionDisplayer";
import SurveyDisplayer from "../../../../System/UserFeedSettings/Section/[id]/Block/Content/Survey/SurveyDisplayer";

type Props = {
  blocks: SimplifiedBlockProps;
  SumWidth?: number;
  autoWidthAmount?: number;
  index: number;
  type: "hero" | "card";
};

const ContentCardContainer = styled.div<{
  $otherWidth: number;
  $space: number | undefined;
  $color: string;
  $borderColor: string;
}>`
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

const UserSideBlock = ({
  blocks,
  index: blockIndex,
  SumWidth,
  autoWidthAmount,
}: Props) => {
  const { token } = useThemeContext();

  const [BlockContentHeight] = useSectionEditorStore((state) => [
    state.BLOCKCONTENTHEIGHT,
  ]);

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
      $color={token.colorWarning}
      $otherWidth={RemainingWidth}
    >
      <div className=" tw-bg-white tw-rounded-xl tw-group tw-h-full tw-flex tw-flex-col tw-justify-between">
        {/* Content List */}
        <div
          style={{
            minHeight: `${BlockContentHeight}px`,
          }}
          className="  tw-flex tw-gap-3 tw-p-3  tw-flex-col lg:tw-flex-row tw-flex-wrap tw-flex-1   "
        >
          {ContentMap[blocks.content_type]}
        </div>
      </div>
    </ContentCardContainer>
  );
};

export default UserSideBlock;
