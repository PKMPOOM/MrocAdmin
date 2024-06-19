import { Field, RuleGroupType } from "react-querybuilder";
import { create } from "zustand";
import _ from "lodash";

export type TmainOption = {
  name: string;
  label: string;
  id: string;
  isLeaf: boolean;
  children?: TsubOptions[];
};

export type TsubOptions = {
  name?: string | number | null;
  label: React.ReactNode;
  children?: TsubOptions[];
  isLeaf?: boolean;
  id?: string;
} & Partial<Field>;

export type TvalueEditorType =
  | "text"
  | "select"
  | "checkbox"
  | "radio"
  | "textarea"
  | "switch"
  | "multiselect";

const initfullQueryOptions: TmainOption[] = [
  {
    name: "survey_1",
    label: "survey 1",
    id: "survey_1_id",
    isLeaf: false,
    // children: [
    //   {
    //     name: "question_1",
    //     label: "question 1",
    //     children: [
    //       {
    //         name: "region1",
    //         label: "region 1",
    //       },
    //       {
    //         name: "region2",
    //         label: "region 2",
    //       },
    //       {
    //         name: "region3",
    //         label: "region 3",
    //       },
    //       {
    //         name: "region4",
    //         label: "region 4",
    //       },
    //     ],
    //   },
    //   {
    //     name: "question_2",
    //     label: "question 2",
    //     children: [
    //       {
    //         name: "region1",
    //         label: "region 1",
    //       },
    //       {
    //         name: "region2",
    //         label: "region 2",
    //       },
    //       {
    //         name: "region3",
    //         label: "region 3",
    //       },
    //       {
    //         name: "region4",
    //         label: "region 4",
    //       },
    //     ],
    //   },
    // ],
  },
  {
    name: "survey_2",
    label: "survey 2",
    id: "survey_2_id",
    isLeaf: false,
  },
  {
    name: "survey_3",
    label: "survey 3",
    id: "survey_3_id",
    isLeaf: false,
  },
  {
    name: "survey_4",
    label: "survey 4",
    id: "survey_4_id",
    isLeaf: false,
  },
];

type state = {
  Query: RuleGroupType;
  setQuery: (data: state["Query"]) => void;
  fullQueryOptions: TmainOption[];
  setQueryOptions: (targetID: string | undefined, data: TsubOptions[]) => void;
  //   level1Options: level1Option[];
  // getLevel1Options: () => void
};

export const useQueryBuilderStore = create<state>((set) => ({
  Query: {
    combinator: "and",
    rules: [],
  },
  setQuery: (data) => set({ Query: data }),

  /**
   *  this option should've been fetch from database
   */
  fullQueryOptions: initfullQueryOptions,
  setQueryOptions: (targetID, data) => {
    if (targetID === undefined) {
      return;
    }
    set((state) => {
      const target = state.fullQueryOptions.find((e) => e.id === targetID);
      const targetIndex = state.fullQueryOptions.findIndex(
        (e) => e.id === targetID
      );
      if (target) {
        // target.children = data;
        const newState = [...state.fullQueryOptions];
        newState[targetIndex].children = data;
        return { fullQueryOptions: newState };
        // return
      }
      //   return state as is
      return { fullQueryOptions: state.fullQueryOptions };
    });
  },

  //   level1Options: state.fullQueryOptions.filter((e) => e.children),
}));
