import { create } from "zustand";

type State = {
  abuseReportModalOpen: boolean;
  activeCommentID: string;
};

type Action = {
  setAbuseReportModalOpen: (open: boolean) => void;
  setActiveCommentID: (commentID: string) => void;
};

export const useAbuseReportStore = create<State & Action>((set) => ({
  abuseReportModalOpen: false,
  setAbuseReportModalOpen: (open) =>
    set(() => ({ abuseReportModalOpen: open })),

  activeCommentID: "",
  setActiveCommentID: (commentID) => set({ activeCommentID: commentID }),
}));
