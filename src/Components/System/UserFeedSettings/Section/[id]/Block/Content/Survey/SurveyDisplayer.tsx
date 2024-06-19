import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { SurveylistTypes } from "../../../../../../../../Interface/SurveyEditorInterface";
import { DisplayType } from "../../../../../../../../Interface/User/UserDashboardTypes";
import { useSectionEditorStore } from "../../../../../../../../Store/useSectionEditorStore";
import SurveyCard from "./Card/SurveyCard";
import SurveyList from "./List/SurveyList";

type Props = {
  survey: SurveylistTypes[];
  displayType: DisplayType;
  blockIndex?: number;
};

const SurveyDisplayer = ({ survey, blockIndex = 0, displayType }: Props) => {
  const [setIndexData, setSurveyDrawerOpen] = useSectionEditorStore((state) => [
    state.setIndexData,
    state.setSurveyDrawerOpen,
  ]);

  if (survey?.length === 0) {
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
            setSurveyDrawerOpen(true);
          }}
        >
          Survey
        </Button>
      </div>
    );
  }

  switch (displayType) {
    case "card":
      return survey?.map((item, surveyIndex) => {
        const isLastIndex = survey?.length === surveyIndex + 1;
        const isFirstIndex = surveyIndex === 0;
        return (
          <SurveyCard
            key={item.id + surveyIndex}
            survey={item}
            indexData={{
              isLastIndex,
              isFirstIndex,
              blockIndex,
              surveyIndex,
            }}
          />
        );
      });
    case "list":
      return (
        <SurveyList
          surveyList={survey}
          indexData={{
            blockIndex: blockIndex,
          }}
        />
      );
  }
};

export default SurveyDisplayer;
