import { PlusOutlined } from "@ant-design/icons";
import { Button, Col } from "antd";
import { produce } from "immer";
import React, { useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { useShallow } from "zustand/react/shallow";
import LoadingFallback from "~/component/Global/Suspense/LoadingFallback";
import QuestionEditTabs from "~/component/Survey/Editor/QuestionEditorTab/QuestionEditTabs";
import { useAddPageMutation } from "~/component/Survey/Editor/QuestionTree/page.api";
import {
  useAddQuestionOnDrag,
  useSortQuestion,
} from "~/component/Survey/Editor/QuestionTree/question.api";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";
import { questionTemplate } from "../../../../../../../Components/Helper/QuestionAnswerDefault";
import OpeEndCategorizeModal from "../../../../../../../Components/Survey/Editor/Answer/OpeEndCategorizeModal";
import PageContainer from "../../../../../../../Components/Survey/Editor/QuestionPageEditor/QuestionContainer";
import QuestionTree from "../../../../../../../Components/Survey/Editor/QuestionTree/QuestionTree";
import {
  QueryResponse,
  Question,
} from "../../../../../../../Interface/SurveyEditorInterface";

function Subtab_Questions() {
  const [surveyMeta, SurveyData, initializeActiveQuestion] =
    useSurveyEditorStore(
      useShallow((state) => [
        state.surveyMeta,
        state.surveyData,
        state.initializeActiveQuestion,
      ])
    );

  const { questionlist } = SurveyData || ({} as QueryResponse);

  const { trigger: sortQuestionTree } = useSortQuestion(surveyMeta);
  const { trigger: addQuestionOnDrag } = useAddQuestionOnDrag(surveyMeta);
  const { trigger: addPage } = useAddPageMutation(surveyMeta);

  const handleDragDrop = (event: any) => {
    const { source, destination, draggableId } = event;
    //source page index
    const sourcePageIndex = questionlist.findIndex(
      (items) => items.id === source.droppableId
    );
    //destination page index
    const destinationPageIndex = questionlist.findIndex(
      (items) => items.id === destination?.droppableId
    );
    // no destination & drop on same index will return
    if (!destination) {
      return;
    }
    // no changes happened
    if (
      sourcePageIndex === destinationPageIndex &&
      source.index === destination.index
    ) {
      return;
    }

    //! same container sort
    if (source.index < 1000) {
      sortQuestionTree(
        {
          activeQuestionID: draggableId,
          sourcePageID: source.droppableId,
          sourceQuestionIndex: source.index,
          sourcePageIndex: sourcePageIndex,
          destPageID: destination.droppableId,
          destQuestionIndex: destination.index,
          destPageIndex: destinationPageIndex,
        },
        {
          optimisticData: (currentData) => {
            const nextState = produce(
              currentData,
              (draftState: QueryResponse) => {
                const { questionlist } = draftState;
                const [removeObject] = questionlist[
                  sourcePageIndex
                ].questions.splice(source.index, 1);
                questionlist[destinationPageIndex].questions.splice(
                  destination.index,
                  0,
                  removeObject
                );
              }
            );
            return nextState;
          },
        }
      );
    }

    // //! drag from card list
    if (source.index >= 1000) {
      const newQuestion: Question = {
        ...questionTemplate,
        label: `${draggableId}`,
        id: uuidv4(),
        key: 0,
        type: draggableId.toLowerCase().replace(/ /g, "_"),
      };
      addQuestionOnDrag(
        {
          newQuestion: newQuestion,
          destPageID: destination.droppableId,
          destQuestionIndex: destination.index,
          destPageIndex: destinationPageIndex,
        },
        {
          optimisticData: (currentData: any) => {
            const nextState = produce(
              currentData,
              (draftstate: QueryResponse) => {
                const { questionlist } = draftstate;
                questionlist[destinationPageIndex].questions.splice(
                  destination.index,
                  0,
                  newQuestion
                );
              }
            );
            return nextState;
          },
        }
      );
    }
  };

  useEffect(() => {
    initializeActiveQuestion();
  }, []);

  if (!questionlist && !surveyMeta.isCreateNew) {
    return <LoadingFallback />;
  }

  return (
    <DragDropContext onDragEnd={handleDragDrop}>
      <div
        style={{
          width: "100%",
          display: "flex",
          marginTop: "-16px",
          height: "calc(100vh - 190px)",
          overflow: "hidden",
        }}
      >
        <Col
          style={{
            borderRight: "1px solid rgba(5, 5, 5, 0.06)",
            borderLeft: "1px solid rgba(5, 5, 5, 0.06)",
          }}
        >
          <QuestionEditTabs />
        </Col>
        {/* Question tree */}
        <div style={{ width: "220px" }}>
          <QuestionTree />
        </div>
        {/* Page editor */}

        <div
          id="scrolltest_2"
          style={{
            position: "relative",
            flex: "1 1 auto",
            width: "100%",
            borderRight: "1px solid rgba(5, 5, 5, 0.06)",
            backgroundColor: "#F9F9F9", //F9F9F9
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflowY: "scroll",
          }}
        >
          {/* //! question page editor */}
          {questionlist?.length === 0 && (
            <Button
              icon={<PlusOutlined />}
              type="link"
              block
              size="large"
              onClick={async () => {
                addPage();
              }}
            >
              Add Page
            </Button>
          )}
          <div className=" tw-flex tw-flex-col tw-gap-0 tw-pb-96">
            {questionlist?.map((pages, pIndex) => (
              <div key={pages.id}>
                <PageContainer pages={pages} pIndex={pIndex} />
              </div>
            ))}
          </div>
        </div>
        <OpeEndCategorizeModal />
      </div>
    </DragDropContext>
  );
}

export default React.memo(Subtab_Questions);
