import { create } from "zustand";
import {
  Discussion_MainTab,
  Discussion_ReportSubTab,
  UserParticipate_SubTab,
} from "../Interface/DiscussionThreadInterfaces";

type State = {
  activeDiscussionTab: Discussion_MainTab;
  activeReportTab: Discussion_ReportSubTab;
  activeUserParticipateSubtab: UserParticipate_SubTab;
};

type Action = {
  setActiveDiscussionTab: (tab: Discussion_MainTab) => void;
  setActiveReportTab: (tab: Discussion_ReportSubTab) => void;
  setActiveUserParticipateSubtab: (tab: UserParticipate_SubTab) => void;
};

export const useDiscussionStore = create<State & Action>((set) => ({
  activeDiscussionTab: "discussion",
  setActiveDiscussionTab: (tab) => set(() => ({ activeDiscussionTab: tab })),

  activeReportTab: "sentiment_analysis",
  setActiveReportTab: (reportab) => set(() => ({ activeReportTab: reportab })),

  activeUserParticipateSubtab: "invite_users",
  setActiveUserParticipateSubtab: (reportab) =>
    set(() => ({ activeUserParticipateSubtab: reportab })),
}));
