import { theme } from "antd";
import React, { ReactNode } from "react";
import { useAuth } from "../../../../Context/Auth/AuthContext";
import { useAddQuestionOnClick } from "../QuestionTree/question.api";
import { produce } from "immer";
import { useShallow } from "zustand/react/shallow";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";
import { QueryResponse } from "~/interface/SurveyEditorInterface";
import { questionTemplate } from "~/component/Helper/QuestionAnswerDefault";
const { useToken } = theme;
type QuestionCardProps = {
  value: string;
  draging: boolean;
  display: boolean;
  label: string;
  icon: ReactNode;
};

function QuestionCard({
  value,
  draging,
  display,
  label,
  icon,
}: QuestionCardProps) {
  const { token } = useToken();
  const { notificationApi } = useAuth();
  const [surveyData, surveyMeta] = useSurveyEditorStore(
    useShallow((state) => [state.surveyData, state.surveyMeta])
  );

  if (surveyData) {
    const { questionlist } = surveyData;
    const lastpage = questionlist?.length - 1;
    const lastPageId = questionlist[questionlist?.length - 1]?.id;
    const lastIndex =
      questionlist[questionlist?.length - 1]?.questions.length - 1;

    const { trigger: addQuestionLastIndex } = useAddQuestionOnClick(surveyMeta);

    return (
      <div
        onClick={async () => {
          if (questionlist.length === 0) {
            notificationApi.error({
              message: "No page found",
            });
          } else {
            addQuestionLastIndex(
              {
                type: value,
                label: label,
                lastpage: lastpage,
                lastPageId: lastPageId,
                lastIndex: lastIndex,
              },
              {
                optimisticData: (currentData: any) => {
                  const nextState = produce(
                    currentData,
                    (draftState: QueryResponse) => {
                      const { questionlist } = draftState;
                      const newQuestion = {
                        ...questionTemplate,
                        label: `New ${label} question`,
                        type: value,
                        answers: [],
                      };
                      questionlist[questionlist.length - 1].questions.push(
                        newQuestion
                      );
                    }
                  );
                  return nextState;
                },
              }
            );
          }
        }}
        style={{
          outline: `1px solid ${token.colorPrimary}`,
          color: token.colorPrimary,
          backgroundColor: token.colorPrimaryBg,
          padding: 4,
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 12,
          display: display ? "flex" : "none",
          boxShadow: draging
            ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
            : undefined,
        }}
      >
        <div className="tw-flex tw-flex-row tw-items-center ">
          <span className="tw-flex tw-items-center">{icon}</span>
          <span className="tw-ml-2"> {label}</span>
        </div>
      </div>
    );
  }

  return <div>Something wrong</div>;
}

export default React.memo(QuestionCard);
