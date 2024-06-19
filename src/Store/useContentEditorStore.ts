import { create } from "zustand";
import { BlogProps } from "../Interface/User/UserDashboardTypes";

type State = {
  contentData: BlogProps | undefined;
};

type Action = {
  setcontentData: (data: BlogProps) => void;
  //   setCheckBox: (checked: boolean, index: number, width: number) => void;
  //   onCustomWidthChange: (width: number, index: number) => void;
  //   onSort: (index: number, target: number) => void;
  //   onContentDelete: (index: number) => void;
  //   removedContentReset: () => void;
};

export const useContentEditorStore = create<State & Action>((set) => ({
  contentData: undefined,
  setcontentData: (data) => set(() => ({ contentData: data })),
}));
