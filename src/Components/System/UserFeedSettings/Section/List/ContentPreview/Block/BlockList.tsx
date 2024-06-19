import React from "react";
import styled from "styled-components";
import { useThemeContext } from "../../../../../../../Context/Theme/ApplicationProvider";
import { DiscussionFullType } from "../../../../../../../Interface/DiscussionThreadInterfaces";
import { SurveylistTypes } from "../../../../../../../Interface/SurveyEditorInterface";
import {
  BlocksProps,
  simplifiedBlogProps,
} from "../../../../../../../Interface/User/UserDashboardTypes";
import { useSectionEditorStore } from "../../../../../../../Store/useSectionEditorStore";
import DescValue from "../../../../../../Global/Utils/DescValue";
import BlogDisplayer from "../../../[id]/Block/Content/Blog/BlogDisplayer";
import DiscussionDisplayer from "../../../[id]/Block/Content/Discussion/DiscussionDisplayer";
import SurveyDisplayer from "../../../[id]/Block/Content/Survey/SurveyDisplayer";

const ContentCardContainer = styled.div<{
  $otherWidth: number;
  $space: number | undefined;
  $color: string;
  $borderColor: string;
}>`
  padding: 8px;
  border-radius: 8px;
  max-width: 100%;
  /* min-height: 100%; */
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

type Props = {
  blocks: BlocksProps<
    simplifiedBlogProps[],
    SurveylistTypes[],
    DiscussionFullType[]
  >;
  widthData: {
    SumWidth: number;
    autoWidthAmount: number;
  };
};

const BlockList = ({ blocks, widthData }: Props) => {
  const { SumWidth, autoWidthAmount } = widthData;
  const { token } = useThemeContext();

  const BlockContentHeight = useSectionEditorStore(
    (state) => state.BLOCKCONTENTHEIGHT
  );
  const ContentMap: { [key: string]: React.ReactNode } = {
    blog: (
      <BlogDisplayer blog={blocks.blog} displayType={blocks.display_type} />
    ),
    survey: (
      <SurveyDisplayer
        survey={blocks.surveys}
        displayType={blocks.display_type}
      />
    ),

    discussion: (
      <DiscussionDisplayer
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
        <div
          style={{
            minHeight: `${BlockContentHeight}px`,
          }}
          className="  tw-flex tw-gap-3 tw-p-3 tw-flex-col lg:tw-flex-row tw-flex-wrap tw-flex-1 "
        >
          {ContentMap[blocks.content_type]}
        </div>

        <div className=" tw-mt-auto tw-p-2 tw-gap-1  tw-min-h-[60px]  tw-transition-all tw-duration-150  tw-z-10 tw-flex tw-w-full ">
          <DescValue keyValue="Display" value={blocks.display_type} />
          <DescValue
            keyValue="Width"
            value={blocks.width ? `${blocks.width}%` : "auto"}
          />
          <DescValue keyValue="Content" value={blocks.content_type} />
        </div>
      </div>
    </ContentCardContainer>
  );
};

export default BlockList;
