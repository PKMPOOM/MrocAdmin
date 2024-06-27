import { DeleteTwoTone, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Typography } from "antd";
import { produce } from "immer";
import React, { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  Pages,
  QueryResponse,
} from "../../../../Interface/SurveyEditorInterface";
import {
  useDeleteSinglePageMutation,
  useUpdatePageHeaderMutation,
} from "../QuestionTree/page.api";
import Question_Active from "./Question_Active";
import Question_Preview from "./Question_Preview";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";
import { useAuth } from "~/context/Auth/AuthContext";

const { Title } = Typography;
type PageProps = {
  pages: Pages;
  pIndex: number;
};

//todo add delete page mutation
function PageContainer({ pages, pIndex }: PageProps) {
  const [activeQuestion, surveyMeta, SetActiveQuestion] = useSurveyEditorStore(
    useShallow((state) => [
      state.activeQuestion,
      state.surveyMeta,
      state.SetActiveQuestion,
    ])
  );
  const { notificationApi } = useAuth();
  const { trigger: UpdatePageHeaderMutation } =
    useUpdatePageHeaderMutation(surveyMeta);
  const { trigger: deleteSinglePage } = useDeleteSinglePageMutation(surveyMeta);

  useEffect(() => {
    if (pIndex === 0 && pages.questions[0]?.id) {
      SetActiveQuestion(0, 0, pages.questions[0].id);
    }
  }, []);

  return (
    <div
      key={pages.id}
      style={{
        position: "relative",
        backgroundColor: "white",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        outline: "1px solid #DFDFDF",
        borderRadius: "4px",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
          marginBottom: 16,
        }}
      >
        <Title
          editable={{
            onChange: (value) => {
              UpdatePageHeaderMutation(
                {
                  pageID: pages.id,
                  value: value,
                },
                {
                  optimisticData: (currentData: any) => {
                    const nextState = produce(
                      currentData,
                      (draftState: QueryResponse) => {
                        const { questionlist } = draftState;
                        questionlist[pIndex].header = value;
                      }
                    );
                    return nextState;
                  },
                }
              );
            },
          }}
          level={5}
        >
          {pages.header}
        </Title>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "8px",
          }}
        >
          <Popconfirm
            icon={
              <QuestionCircleOutlined
                style={{
                  color: "red",
                }}
              />
            }
            placement="left"
            title="Delete this page"
            description="Are you sure to delete this page?"
            onConfirm={() => {
              deleteSinglePage(pages.id, {
                optimisticData: (currentData: any) => {
                  const nextState = produce(
                    currentData,
                    (draftState: QueryResponse) => {
                      draftState.questionlist.splice(pIndex, 1);
                    }
                  );
                  return nextState;
                },
                rollbackOnError: () => {
                  notificationApi.error({
                    message: "Error",
                    description: "Error deleting page",
                  });
                  return true;
                },
              });
            }}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
            }}
          >
            <Button
              icon={<DeleteTwoTone twoToneColor="red" />}
              type="text"
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      </div>

      {pages.questions.map((question, qIndex) => {
        const isActiveQuestion = activeQuestion.id === question.id;

        return (
          <div key={question.id}>
            {isActiveQuestion ? (
              <Question_Active
                pageID={pages.id}
                pageSize={pages.questions.length}
                question={question}
                pIndex={pIndex}
                qIndex={qIndex}
              />
            ) : (
              <Question_Preview
                pageSize={pages.questions.length}
                question={question}
                pIndex={pIndex}
                qIndex={qIndex}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(PageContainer);
