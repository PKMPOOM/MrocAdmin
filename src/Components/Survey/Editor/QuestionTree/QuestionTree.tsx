import {
  HolderOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Popconfirm,
  Row,
  Spin,
  Typography,
  theme,
} from "antd";
import { produce } from "immer";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useShallow } from "zustand/react/shallow";
import "../../../../App.css";
import { QueryResponse } from "../../../../Interface/SurveyEditorInterface";
import { useAddPageMutation, useDeleteMultiplePagesMutation } from "./page.api";
import {
  TSelectedQuestion,
  useSurveyEditorStore,
} from "~/store/useSurveyEditorStore";

const { Text } = Typography;
const { useToken } = theme;

const QuestionTree = () => {
  const [
    surveyMeta,
    surveyData,
    activeQuestion,
    SetActiveQuestion,
    SetSelectedPages,
    SelectedTree,
    setSelectedTree,
  ] = useSurveyEditorStore(
    useShallow((state) => [
      state.surveyMeta,
      state.surveyData,
      state.activeQuestion,
      state.SetActiveQuestion,
      state.SetSelectedPages,
      state.SelectedTree,
      state.setSelectedTree,
    ])
  );

  const { questionlist } = surveyData || ({} as QueryResponse);

  const scrollTo = (id: string) => {
    const section = document.querySelector(id);
    if (section) {
      section?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  const { token } = useToken();
  const { trigger: addNewPageMutation } = useAddPageMutation(surveyMeta);
  const { trigger: delteSelectedPages, isMutating } =
    useDeleteMultiplePagesMutation(surveyMeta, SelectedTree);

  const deleteSelectedPages = async () => {
    await delteSelectedPages();
    SetActiveQuestion(
      activeQuestion.page,
      activeQuestion.question,
      activeQuestion.id
    );
    clearSelectedTree();
  };

  const onPageSelectChange = (event: boolean, PageID: string) => {
    const currentPageQuestionIds = surveyData?.questionlist
      .find((item) => item.id === PageID)
      ?.questions.map((item) => ({
        id: item.id,
        index: item.index,
      }));

    const nextState = produce(SelectedTree, (draftState) => {
      switch (event) {
        case true:
          if (!draftState[PageID]) {
            draftState[PageID] = {
              pageSelected: event,
              selectedQuestions: currentPageQuestionIds || [],
            };
          } else {
            draftState[PageID].pageSelected = event;
            draftState[PageID].selectedQuestions = currentPageQuestionIds || [];
          }
          break;
        case false:
          delete draftState[PageID];
          break;

        default:
          break;
      }
    });

    setSelectedTree(nextState);
  };

  const clearSelectedTree = () => {
    setSelectedTree({});
  };

  const onQuestionSelectChange = (
    event: boolean,
    shouldSelectPage: boolean,
    PageID: string,
    QuestionData: TSelectedQuestion
  ) => {
    const nextState = produce(SelectedTree, (draftState) => {
      switch (event) {
        case true:
          // if pageID is not present in object then add it
          // pageSelect are false because pageID is not present meaning no question has been selected
          // then this is the first question to be selected
          if (!draftState[PageID]) {
            draftState[PageID] = {
              pageSelected: false,
              selectedQuestions: [QuestionData],
            };
            draftState[PageID].pageSelected = shouldSelectPage;
          } else {
            draftState[PageID].selectedQuestions.push(QuestionData);
            draftState[PageID].pageSelected = shouldSelectPage;
          }
          break;
        case false:
          if (draftState[PageID]) {
            draftState[PageID].selectedQuestions = draftState[
              PageID
            ].selectedQuestions.filter((item) => item.id !== QuestionData.id);

            draftState[PageID].pageSelected = shouldSelectPage;

            if (draftState[PageID].selectedQuestions.length === 0) {
              delete draftState[PageID];
            }
          }
          break;

        default:
          break;
      }
    });
    setSelectedTree(nextState);
  };

  const selectedPageLength = Object.values(SelectedTree).filter(
    (item) => item.pageSelected
  ).length;
  const selectedQuestionLength = Object.values(SelectedTree).reduce(
    (acc, item) => {
      return acc + item.selectedQuestions.length;
    },
    0
  );

  return (
    <Spin
      spinning={isMutating}
      indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
    >
      <div
        className="tw-overflow-y-hidden hover:tw-overflow-y-auto tw-overflow-x-hidden tw-flex tw-flex-col tw-gap-4"
        id="scrolltest_3"
        style={{
          borderRight: "1px solid rgba(5, 5, 5, 0.06)",
          padding: "8px",
          height: "calc(100vh - 190px)",
          width: "204px",
        }}
      >
        {/* header */}
        <div className="thinScrollbar tw-flex tw-justify-center tw-mt-3 ">
          Question tree
        </div>
        {/* button block */}
        <Row
          gutter={8}
          style={{
            width: "197px",
          }}
        >
          <Col span={12}>
            <Button
              block
              onClick={clearSelectedTree}
              disabled={Object.keys(SelectedTree).length === 0}
            >
              Clear
            </Button>
          </Col>
          <Col span={12}>
            <Popconfirm
              disabled={Object.keys(SelectedTree).length === 0}
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: "red",
                  }}
                />
              }
              placement="topRight"
              title="Delete selected?"
              description={
                <div>
                  <p>Are you sure to delete selected total of</p>
                  <p
                    style={{
                      color: token.colorErrorText,
                    }}
                  >
                    {selectedPageLength > 0
                      ? `${selectedPageLength} page${
                          selectedPageLength > 1 ? "s" : ""
                        }`
                      : ""}
                  </p>
                  <p
                    style={{
                      color: token.colorErrorText,
                    }}
                  >
                    {selectedQuestionLength > 0
                      ? `${selectedQuestionLength} question${
                          selectedQuestionLength > 1 ? "s" : ""
                        }`
                      : ""}
                  </p>
                </div>
              }
              onConfirm={deleteSelectedPages}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{
                danger: true,
              }}
            >
              <Button
                block
                danger
                type="primary"
                disabled={Object.keys(SelectedTree).length === 0}
              >
                Delete
              </Button>
            </Popconfirm>
          </Col>
        </Row>

        {/* Question tree */}

        <div className=" tw-flex tw-gap-1 tw-flex-col">
          {questionlist?.map((pages, pIndex) => {
            const allSelectedQuestionData: TSelectedQuestion[] =
              pages.questions.map((question) => ({
                id: question.id,
                index: question.index,
              }));
            const isWholePageSelected =
              SelectedTree[pages.id]?.pageSelected === true;

            const isSomeQuestionSelected = allSelectedQuestionData.some(
              (data) => SelectedTree[pages.id]?.selectedQuestions.includes(data)
            );

            return (
              <div
                key={pIndex}
                style={{
                  backgroundColor: isWholePageSelected
                    ? token.colorPrimaryBg
                    : "white",
                  display: "flex",
                  padding: "8px",
                  gap: "8px",
                  flexDirection: "column",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  width: "188px",
                  outline: isWholePageSelected
                    ? `1px solid ${token.colorPrimary}`
                    : "1px solid #DEDEDF",
                }}
              >
                <div className="tw-flex tw-flex-row tw-gap-2 tw-max-w-full tw-overflow-hidden ">
                  <Checkbox
                    indeterminate={
                      isSomeQuestionSelected && !isWholePageSelected
                    }
                    checked={isWholePageSelected}
                    onChange={(event) => {
                      SetSelectedPages(event.target.checked, pages.id);
                      onPageSelectChange(event.target.checked, pages.id);
                    }}
                  >
                    <Text ellipsis={true}>{pages.header}</Text>
                  </Checkbox>
                </div>

                <Droppable droppableId={pages.id}>
                  {(provided, snapshot) => (
                    <div
                      style={{
                        minHeight: "30px",
                        borderRadius: "2px",
                        outline: snapshot.isDraggingOver
                          ? `5px solid ${token.colorPrimaryBg}`
                          : "",
                        backgroundColor: snapshot.isDraggingOver
                          ? token.colorPrimaryBg
                          : undefined,
                      }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div className="tw-flex tw-flex-col tw-gap-2">
                        {pages.questions.map((question, qIndex) => {
                          const isQuestionActive =
                            activeQuestion.id === question.id;

                          const isQuestionSelected = SelectedTree[
                            pages.id
                          ]?.selectedQuestions.some(
                            (element) =>
                              element.id === question.id &&
                              element.index === question.index
                          );

                          switch (question.type) {
                            case "page_break":
                              return (
                                <Draggable
                                  draggableId={question.id}
                                  key={question.id}
                                  index={qIndex}
                                >
                                  {(provided) => (
                                    <div
                                      {...provided.dragHandleProps}
                                      {...provided.draggableProps}
                                      ref={provided.innerRef}
                                      className=" tw-rounded tw-px-2"
                                    >
                                      <Divider
                                        style={{
                                          marginBottom: -4,
                                          marginTop: -4,
                                        }}
                                      >
                                        <Text style={{ fontWeight: 400 }}>
                                          Page Break
                                        </Text>
                                      </Divider>
                                    </div>
                                  )}
                                </Draggable>
                              );

                            default:
                              return (
                                <Draggable
                                  draggableId={`${question.id}`}
                                  key={question.id}
                                  index={qIndex}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      key={question.id}
                                      {...provided.draggableProps}
                                      ref={provided.innerRef}
                                    >
                                      <div
                                        onClick={async () => {
                                          SetActiveQuestion(
                                            pIndex,
                                            qIndex,
                                            question.id
                                          );
                                          // wait 100 ms for state change
                                          setTimeout(() => {
                                            scrollTo(
                                              `#Q${pIndex + 1}${qIndex + 1}`
                                            );
                                          }, 100);
                                        }}
                                        style={{
                                          flex: "0 1 auto",
                                          outline: `1px solid ${
                                            isQuestionActive ||
                                            isWholePageSelected ||
                                            isQuestionSelected
                                              ? token.colorPrimary
                                              : "#DEDEDF"
                                          }`,
                                          borderRadius: "2px",
                                          padding: "4px",
                                          display: "flex",
                                          flexDirection: "row",
                                          gap: "8px",
                                          cursor: "pointer",
                                          backgroundColor:
                                            isQuestionActive ||
                                            isWholePageSelected ||
                                            isQuestionSelected
                                              ? token.colorPrimaryBg
                                              : "#FFFFFF",
                                          boxShadow: snapshot.isDragging
                                            ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
                                            : undefined,
                                          position: "relative",
                                        }}
                                      >
                                        <Checkbox
                                          onChange={(event) => {
                                            // SelectedQuestions.length will have 1 less count than allQuestionIds.length because of the js behind the scence thing
                                            // so we need to check if the last question is selected and the event is true then we need to select the whole page
                                            // event.target.check have to be true because if it is false then it means we are unselecting the question
                                            const isLastQuestionIsBeingSelected =
                                              SelectedTree[pages.id]
                                                ?.selectedQuestions.length ===
                                              allSelectedQuestionData.length -
                                                1;

                                            const isOnlyQuestionSelected =
                                              allSelectedQuestionData.length ===
                                                1 &&
                                              event.target.checked === true;

                                            const shouldSelectPage =
                                              (isLastQuestionIsBeingSelected &&
                                                event.target.checked ===
                                                  true) ||
                                              isOnlyQuestionSelected;

                                            onQuestionSelectChange(
                                              event.target.checked,
                                              shouldSelectPage,
                                              pages.id,
                                              {
                                                id: question.id,
                                                index: question.index,
                                              }
                                            );
                                          }}
                                          checked={
                                            isWholePageSelected ||
                                            isQuestionSelected
                                          }
                                          style={{ zIndex: "99" }}
                                        />
                                        <div
                                          {...provided.dragHandleProps}
                                          className=" tw-opacity-50  tw-flex tw-items-center "
                                        >
                                          <HolderOutlined />
                                        </div>

                                        <Text
                                          style={{
                                            width: "100%",
                                            color:
                                              isQuestionActive ||
                                              isWholePageSelected
                                                ? token.colorPrimary
                                                : "#000000",
                                          }}
                                          ellipsis={true}
                                        >
                                          <span title={question.label}>
                                            {question.label}
                                          </span>
                                        </Text>
                                        <div
                                          className="tw-opacity-0 hover:tw-opacity-100"
                                          style={{
                                            position: "absolute",
                                            zIndex: 9999,
                                            bottom: "-12px",
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            // alignContent: "center",
                                          }}
                                        >
                                          {pages.questions[qIndex + 1]?.type ===
                                            "page_break" ||
                                          pages.questions.length - 1 ===
                                            qIndex ? null : (
                                            <div
                                              // onClick={handleAddPageBreak(
                                              //   pIndex,
                                              //   qIndex
                                              // )}
                                              className="tw-rounded-md tw-h-1 tw-bg-blue-500 tw-flex tw-items-center tw-justify-center tw-p-2"
                                            >
                                              <Text
                                                style={{
                                                  fontWeight: 400,
                                                  color: "white",
                                                }}
                                              >
                                                Break
                                              </Text>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                          }
                        })}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>

        <Button
          icon={<PlusOutlined />}
          type="link"
          style={{
            width: "188px",
          }}
          onClick={async () => {
            addNewPageMutation();
          }}
        >
          Add Page
        </Button>
        <div className=" tw-mt-auto">
          <Button
            // icon={<PlusOutlined />}
            type="primary"
            style={{
              width: "188px",
            }}
            onClick={async () => {
              // addNewPageMutation();
            }}
          >
            End page
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default QuestionTree;
