import { produce } from "immer";
import { create } from "zustand";
import {
  OverviewSubtab,
  QueryResponse,
  SurveyEditorTabs,
  userparticipatingSubtab,
} from "../Interface/SurveyEditorInterface";

export type TSurveyMeta = {
  isCreateNew: boolean;
  surveyID: "Newsurvey" | string;
  queryKey: string;
};

type TSurveyFetchingStatus = {
  isLoading: boolean;
  isFetching: boolean;
};

type TCategorizerData = {
  modalOpen: boolean;
  answerID: string;
  categorizeList: string[];
  categorizeListRef: string[];
};

export type TSelectedQuestion = {
  id: string;
  index: number;
};
export type TSelectedTree = {
  [key: string]: {
    pageSelected: boolean;
    selectedQuestions: TSelectedQuestion[];
  };
};

type State = {
  SurveyEditorTabs: SurveyEditorTabs;
  SideTabActiveKey: "Questions" | "Edit" | string;
  activeRedeemCard: "Gift card" | "Cheque" | "Donate to charity" | "E-transfer";
  activeBuildTab:
    | "questions"
    | "look&feels"
    | "variables"
    | "translation"
    | string;
  activeOverviewSubtab: OverviewSubtab;
  activeUserparticipatingSubtab: userparticipatingSubtab;
  categorizerData: TCategorizerData;
  surveyMeta: TSurveyMeta;
  surveyData: QueryResponse | undefined;
  activeQuestion: {
    id: string;
    page: number;
    question: number;
  };
  SelectedPages: string[];
  SelectedQuestions: string[];
  SelectedTree: TSelectedTree;
  surveyFetchingStatus: TSurveyFetchingStatus;
};

type Action = {
  SetActiveQuestion: (page: number, question: number, id: string) => void;
  setSurveyMeta: (event: State["surveyMeta"]) => void;
  setSurveyData: (event: QueryResponse) => void;
  SetSelectedPages: (event: boolean, PageID: string) => void;
  ClearSelectedPages: () => void;
  setSelectedQuestions: (event: boolean, QuestionID: string) => void;
  setSelectedTree: (event: State["SelectedTree"]) => void;
  SetActiveRedeemCard: (label: State["activeRedeemCard"]) => void;
  SetSideTabActiveKey: (event: "Questions" | "Edit" | string) => void;
  SetSurveyEditorTabs: (event: SurveyEditorTabs) => void;
  SetActiveBuildTab: (label: State["activeBuildTab"]) => void;
  SetActiveOverviewSubtab: (event: OverviewSubtab) => void;
  setActiveUserparticipatingSubtab: (event: userparticipatingSubtab) => void;
  setOpenEndCategorizeModalOpen: (event: boolean, aID: string) => void;
  setCategorizeListArray: (event: string[]) => void;
  setSurveyFetchingStatus: (event: TSurveyFetchingStatus) => void;
  initializeActiveQuestion: () => void;
};

export type EditorStoreSelector = State & Action;

export const useSurveyEditorStore = create<EditorStoreSelector>((set) => ({
  surveyMeta: {
    isCreateNew: false,
    surveyID: "",
    queryKey: "",
  },
  setSurveyMeta: (event) => set(() => ({ surveyMeta: event })),

  surveyFetchingStatus: {
    isLoading: false,
    isFetching: false,
  },

  setSurveyFetchingStatus: (event) =>
    set(() => ({ surveyFetchingStatus: event })),

  surveyData: undefined,
  setSurveyData: (event) => set(() => ({ surveyData: event })),

  activeQuestion: {
    id: "",
    page: 0,
    question: 0,
  },

  initializeActiveQuestion: () =>
    set((state) => {
      const initState = {
        page: 0,
        question: 0,
        id: "",
      };

      const surveyData = state.surveyData;

      if (!surveyData) {
        return {
          activeQuestion: initState,
        };
      }

      try {
        const localActiveQuestion = localStorage.getItem("activeQuestion");
        if (localActiveQuestion === null) {
          return {
            activeQuestion: initState,
          };
        }
        const parsed = JSON.parse(localActiveQuestion);
        // check if the active question is valid
        if (
          parsed.page >= surveyData.questionlist.length ||
          parsed.question >=
            surveyData.questionlist[parsed.page].questions.length
        ) {
          return {
            activeQuestion: initState,
          };
        }
        return {
          activeQuestion: {
            page: parsed.page,
            question: parsed.question,
            id: parsed.id,
          },
        };
      } catch (error) {
        return {
          activeQuestion: initState,
        };
      }
    }),

  SetActiveQuestion: (page, question, id) => {
    localStorage.setItem(
      "activeQuestion",
      JSON.stringify({ page, question, id })
    );
    return set(
      produce(({ activeQuestion }) => {
        activeQuestion.page = page;
        activeQuestion.question = question;
        activeQuestion.id = id;
      })
    );
  },

  SelectedPages: [],
  ClearSelectedPages: () => set(() => ({ SelectedPages: [] })),
  SetSelectedPages: (event, PageID) =>
    set((state) => {
      if (event === true) {
        return {
          SelectedPages: [...state.SelectedPages, PageID],
        };
      } else {
        return {
          SelectedPages: state.SelectedPages.filter((item) => item !== PageID),
        };
      }
    }),

  SelectedQuestions: [],
  setSelectedQuestions(event, QuestionID) {
    set((state) => {
      if (event === true) {
        return {
          SelectedQuestions: [...state.SelectedQuestions, QuestionID],
        };
      } else {
        return {
          SelectedQuestions: state.SelectedQuestions.filter(
            (item) => item !== QuestionID
          ),
        };
      }
    });
  },

  SelectedTree: {},
  setSelectedTree(event) {
    set(() => ({ SelectedTree: event }));
  },

  activeRedeemCard: "Gift card",
  SetActiveRedeemCard: (label) => set(() => ({ activeRedeemCard: label })),

  SideTabActiveKey: "Questions",
  SetSideTabActiveKey: (event) => set(() => ({ SideTabActiveKey: event })),

  // survey editor main tab nav
  SurveyEditorTabs: "detail",
  SetSurveyEditorTabs: (event) => set(() => ({ SurveyEditorTabs: event })),

  // subtab of build
  activeBuildTab: "questions",
  SetActiveBuildTab: (event) => set(() => ({ activeBuildTab: event })),

  // subtab of overview/open
  activeOverviewSubtab: "overview",
  SetActiveOverviewSubtab: (event) =>
    set(() => ({ activeOverviewSubtab: event })),

  //subtab UserparticipatingSubtab
  activeUserparticipatingSubtab: "invite_users",
  setActiveUserparticipatingSubtab: (event) =>
    set(() => ({ activeUserparticipatingSubtab: event })),

  // all categorize data
  categorizerData: {
    modalOpen: false,
    answerID: "string",
    categorizeList: [],
    categorizeListRef: [],
  },

  // set modal open and set active answer id
  setOpenEndCategorizeModalOpen: (event, aID) =>
    set(
      produce(({ categorizerData }) => {
        categorizerData.modalOpen = event;
        categorizerData.answerID = aID;
      })
    ),

  // set categorize list array onchange
  setCategorizeListArray: (event: string[]) =>
    set(
      produce(({ categorizerData }) => {
        categorizerData.categorizeList = event;
      })
    ),
}));
