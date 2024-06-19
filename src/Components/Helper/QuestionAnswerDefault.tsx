import { ReactNode } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { FaListUl, FaList, FaFont, FaClock } from "react-icons/fa";
import { Answer, Question } from "../../Interface/SurveyEditorInterface";

interface QuestionType {
  value: string;
  label: string;
  icon: ReactNode;
  content: string;
}

export const availableQuestionType: QuestionType[] = [
  {
    value: "single_select",
    label: "Single select",
    icon: <FaListUl />,
    content: "test content",
  },
  {
    value: "multi_select",
    label: "Multi select",
    icon: <FaList />,
    content: "test content",
  },
  {
    value: "slider",
    label: "Slider",
    icon: <PlusOutlined />,
    content: "test content",
  },
  {
    value: "file_upload",
    label: "File upload",
    icon: <FaClock />,
    content: "test content",
  },
  {
    value: "text_area",
    label: "Text area",
    icon: <FaFont />,
    content: "test content",
  },
];

export const questionTemplate: Question = {
  index: 0,
  id: "",
  key: 0,
  label: "",
  type: "",
  precodesallowed: 100,
  presetanswer: false,
  POisselected: false,
  POselectedoption: "shuffle",
  shuffleby: undefined,
  sortdir: "asc",
  pageIdpage: "",
  answers: [],
  isselected: false,
  isrequired: false,
  forcequestionresponse: false,
};

export const answerTemplate: Answer = {
  id: "",
  key: 0,
  label: "New precode",
  exclusive: false,
  forceopenendresponse: false,
  openend: false,
  questionsId: "",
  ai_categorize: false,
  ai_categorize_list: [],
  index: 0,
  number_only: false,
  openEndDirection: "horizontal",
};
