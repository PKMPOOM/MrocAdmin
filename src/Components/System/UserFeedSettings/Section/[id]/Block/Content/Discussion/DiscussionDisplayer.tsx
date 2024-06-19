import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { DiscussionFullType } from "../../../../../../../../Interface/DiscussionThreadInterfaces";
import { DisplayType } from "../../../../../../../../Interface/User/UserDashboardTypes";
import { useSectionEditorStore } from "../../../../../../../../Store/useSectionEditorStore";
import DiscussionCard from "./Card/DiscussionCard";
import DiscussionList from "./List/DiscussionList";

type Props = {
  discussion: DiscussionFullType[];
  displayType: DisplayType;
  blockIndex?: number;
};

const DiscussionDisplayer = ({
  discussion,
  blockIndex = 0,
  displayType,
}: Props) => {
  const [setIndexData, setDiscussionDrawerOpen] = useSectionEditorStore(
    (state) => [state.setIndexData, state.setDiscussionDrawerOpen]
  );

  if (discussion?.length === 0) {
    return (
      <div className=" tw-w-full tw-flex tw-justify-center tw-items-center tw-flex-1">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIndexData({
              activeBlockIndex: blockIndex,
              activeContentIndex: 0,
            });
            setDiscussionDrawerOpen(true);
          }}
        >
          Discussion
        </Button>
      </div>
    );
  }

  switch (displayType) {
    case "card":
      return discussion?.map((item, discussionIndex) => {
        const isLastIndex = discussion?.length === discussionIndex + 1;
        const isFirstIndex = discussionIndex === 0;
        return (
          <DiscussionCard
            key={item.id + discussionIndex}
            discussion={item}
            indexData={{
              isLastIndex,
              isFirstIndex,
              blockIndex,
              discussionIndex,
            }}
          />
        );
      });
    case "list":
      return (
        <DiscussionList
          discussionList={discussion}
          indexData={{
            blockIndex: blockIndex,
          }}
        />
      );
  }
};

export default DiscussionDisplayer;
