import { create } from "zustand";
import { User } from "../Pages/Admin/User/Show_user/Show_user";

export type SurveySubtabs = "Mroc" | "Deciopher" | string;

type State = {
  surveySubTabs: SurveySubtabs;
  userData: User | undefined;
};

type Action = {
  setSurveySubTabs: (event: SurveySubtabs) => void;
  setUserData: (event: User) => void;
};

export const useUserPageStore = create<State & Action>((set) => ({
  surveySubTabs: "Mroc",
  setSurveySubTabs: (event) => set(() => ({ surveySubTabs: event })),

  userData: undefined,
  setUserData: (event) => set(() => ({ userData: event })),
}));
