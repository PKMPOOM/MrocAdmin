import { CaretRightOutlined } from "@ant-design/icons";
import { Button, Collapse, theme } from "antd";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import {
  FaBalanceScale,
  FaBan,
  FaCalendarAlt,
  FaCaretSquareDown,
  FaClock,
  FaCogs,
  FaDollarSign,
  FaFont,
  FaGripVertical,
  FaInfoCircle,
  FaList,
  FaListUl,
  FaRegCreditCard,
  FaSlidersH,
  FaSort,
  FaStar,
  FaTachometerAlt,
  FaTextHeight,
  FaTh,
  FaThumbsUp,
  FaTimesCircle,
} from "react-icons/fa";
import { QuestionPanels } from "../../../../../Interface/SurveyEditorInterface";
import QuestionCard from "../QuestionCard";

const panels: QuestionPanels[] = [
  {
    header: "Basic",
    key: "basic",
    questions: [
      {
        index: 0,
        label: "Single select",
        value: "single_select",
        icon: <FaListUl />,
        available: true,
      },
      {
        index: 1,
        label: "Multi select",
        value: "multi_select",
        icon: <FaList />,
        available: true,
      },
      {
        index: 2,
        label: "Text area",
        value: "text_area",
        icon: <FaFont />,
        available: true,
      },
      {
        index: 3,
        label: "Info",
        value: "info",
        icon: <FaInfoCircle />,
        available: false,
      },
      {
        index: 4,
        label: "Dropdown",
        value: "dropdown",
        icon: <FaCaretSquareDown />,
        available: false,
      },
      {
        index: 5,
        label: "Open text list",
        value: "open_text_list",
        icon: <FaFont />,
        available: false,
      },
      {
        index: 6,
        label: "Date",
        value: "date",
        icon: <FaCalendarAlt />,
        available: false,
      },
      {
        index: 7,
        label: "Up or Down",
        value: "up_down",
        icon: <FaThumbsUp />,
        available: false,
      },
      {
        index: 8,
        label: "Input",
        value: "text_area",
        icon: <FaTextHeight />,
        available: false,
      },
      {
        index: 9,
        label: "File upload",
        value: "file_upload",
        icon: <FaClock />,
        available: false,
      },
    ],
  },
  {
    header: "Grid",
    key: "grid",
    questions: [
      {
        index: 10,
        label: "Grid",
        value: "grid",
        icon: <FaTh />,
        available: false,
      },
      {
        index: 11,
        label: "Side by side",
        value: "side_by_side",
        icon: <FaGripVertical />,
        available: false,
      },
    ],
  },
  {
    header: "Slider",
    key: "slider",
    questions: [
      {
        index: 12,
        label: "Slider",
        value: "slider",
        icon: <FaSlidersH />,
        available: true,
      },
      {
        index: 13,
        label: "Rank sort",
        value: "rank_sort",
        icon: <FaSort />,
        available: false,
      },
      {
        index: 14,
        label: "Allocation slider",
        value: "allocation_slider",
        icon: <FaSlidersH />,
        available: false,
      },
      {
        index: 15,
        label: "Text balance",
        value: "text_balance",
        icon: <FaBalanceScale />,
        available: false,
      },
      {
        index: 16,
        label: "Rating",
        value: "rating",
        icon: <FaStar />,
        available: false,
      },
      {
        index: 17,
        label: "NPS",
        value: "nps",
        icon: <FaTachometerAlt />,
        available: false,
      },
    ],
  },
  {
    header: "Other",
    key: "other",
    questions: [
      {
        index: 18,
        label: "Quota",
        value: "quota",
        icon: <FaRegCreditCard />,
        available: false,
      },
      {
        index: 19,
        label: "Screening",
        value: "screening",
        icon: <FaBan />,
        available: false,
      },
      {
        index: 20,
        label: "Executable block",
        value: "exec_block",
        icon: <FaCogs />,
        available: false,
      },
      {
        index: 21,
        label: "Terminate",
        value: "terminate",
        icon: <FaTimesCircle />,
        available: false,
      },
      {
        index: 22,
        label: "Points charger",
        value: "points",
        icon: <FaDollarSign />,
        available: false,
      },
      {
        index: 23,
        label: "Timing",
        value: "timing",
        icon: <FaClock />,
        available: false,
      },
    ],
  },
];

function Subtab_questionlist() {
  const { token } = theme.useToken();
  return (
    <div
      className="tw-overflow-y-hidden hover:tw-overflow-y-auto tw-overflow-x-hidden"
      id="scrolltest"
      style={{
        overflowX: "hidden",
        height: "calc(100vh - 261px)",
        width: "250px",
      }}
    >
      <Collapse
        items={panels.map((items, panelsIndex) => ({
          key: items.key,
          label: items.header,
          children: (
            <Droppable
              droppableId={`list_${items.header}`}
              isDropDisabled={true}
              renderClone={(provided, _, rubric) => {
                const currentCard = items.questions[rubric.source.index - 1000];
                return (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <div
                      style={{
                        outline: `1px solid ${token.colorPrimary}`,
                        color: token.colorPrimary,
                        backgroundColor: token.colorPrimaryBg,
                        padding: 4,
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      <div className="tw-flex tw-flex-row tw-items-center ">
                        <span className="tw-flex tw-items-center">
                          {currentCard.icon}
                        </span>
                        <span className="tw-ml-2"> {currentCard.label}</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            >
              {(provided) => (
                <div
                  key={panelsIndex}
                  ref={provided.innerRef}
                  className="tw-grid tw-grid-cols-2 tw-gap-2"
                >
                  {items.questions.map((card, cardIndex) => (
                    <Draggable
                      key={card.label}
                      draggableId={card.label}
                      index={card.index + 1000}
                    >
                      {(provided, snapshot) => (
                        <div
                          key={cardIndex}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <QuestionCard
                            value={card.value}
                            draging={snapshot.isDragging}
                            display={card.available}
                            label={card.label}
                            icon={card.icon}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          ),
        }))}
        ghost
        style={{ width: "250px" }}
        defaultActiveKey={["basic", "slider"]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      />

      <div className="tw-p-2 tw-flex tw-justify-center">
        <Button
          block
          type="primary"
          ghost
          onClick={() => {
            console.log("open library modal");
          }}
        >
          Import from library
        </Button>
      </div>
    </div>
  );
}

export default React.memo(Subtab_questionlist);
