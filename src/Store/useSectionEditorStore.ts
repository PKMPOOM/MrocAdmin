import cloneDeep from "lodash/cloneDeep";
import { v4 as uuid } from "uuid";
import { create } from "zustand";
import { DiscussionFullType } from "../Interface/DiscussionThreadInterfaces";
import { SurveylistTypes } from "../Interface/SurveyEditorInterface";
import {
  BlockEditorSectionProps,
  SectionType,
  SimplifiedBlockProps,
  simplifiedBlogProps,
} from "../Interface/User/UserDashboardTypes";
type contentType = "surveys" | "discussions" | "blog";

type State = {
  // section
  sectionData: BlockEditorSectionProps | undefined;
  sectionListData: BlockEditorSectionProps[] | null;
  showSectionPreview: boolean;
  // drawer
  contentDrawerOpen: boolean;
  surveyDrawerOpen: boolean;
  discussionDrawerOpen: boolean;
  // block
  BLOCKCONTENTHEIGHT: number;
  // content
  removedContent: string[];
  // removedContent: BlockEditorSectionProps["blocks"];
  // index data
  indexData: {
    activeBlockIndex: number;
    activeContentIndex: number;
  };
};

type Action = {
  // section action
  setSectionData: (data: State["sectionData"]) => void;
  initSectionData: () => void;
  onChangeSectionType: (type: SectionType) => void;
  setSectionListData: (event: BlockEditorSectionProps[]) => void;
  setShowsectionpreview: (event: boolean) => void;
  // block action
  useUseBlockCustomWidth: (
    checked: boolean,
    index: number,
    width: number
  ) => void;
  addBlock: (data: SimplifiedBlockProps, index: number) => void;
  onCustomWidthChange: (width: number, index: number) => void;
  onBlockSort: (index: number, target: number) => void;
  onBlockDelete: (index: number) => void;
  removedBlockReset: () => void;
  // drawer
  setContentDrawerOpen: (open: boolean) => void;
  setSurveyDrawerOpen: (open: boolean) => void;
  setDiscussionDrawerOpen: (open: boolean) => void;
  // content action
  addBlog: (data: simplifiedBlogProps) => void;
  addSurvey: (data: SurveylistTypes) => void;
  addDiscussion: (data: DiscussionFullType) => void;
  onContentSort: (
    contentType: contentType,
    index: number,
    target: number
  ) => void;
  onContentDelete: (contentType: contentType, index: number) => void;
  // index data
  setIndexData: (data: State["indexData"]) => void;
};

const initSectionData: State["sectionData"] = {
  id: "",
  blocks: [],
  date_created: new Date(),
  display_title: false,
  index: 100,
  title: "New Section",
  status: "Draft",
  type: "card",
  content_order: [],
};

export const useSectionEditorStore = create<State & Action>((set) => ({
  //  ========== Section ==========
  sectionData: undefined,
  removedContent: [],
  removedBlockReset: () => set(() => ({ removedContent: [] })),
  setSectionData: (data) => set(() => ({ sectionData: data })),
  initSectionData: () => set(() => ({ sectionData: initSectionData })),
  onChangeSectionType: (type) => {
    return set((state) => {
      if (state.sectionData) {
        const newstate = { ...state.sectionData };
        newstate.type = type;

        return { sectionData: newstate };
      }
      return state;
    });
  },
  showSectionPreview: true,
  setShowsectionpreview(event) {
    return set(() => ({ showSectionPreview: event }));
  },

  //  ========== Block ==========
  BLOCKCONTENTHEIGHT: 350,

  addBlock: (
    data = {
      id: uuid(),
      content_type: "blog",
      display_type: "card",
      blog: [],
      surveys: [],
      discussions: [],
      content_order: [],
      custom_width: false,
      width: null,
      userId: "",
    },
    blockIndex
  ) => {
    set((state) => {
      if (state.sectionData) {
        const newstate = { ...state.sectionData };
        newstate.blocks.splice(blockIndex, 0, data);

        return { sectionData: newstate };
      }

      return state;
    });
  },

  useUseBlockCustomWidth: (checked, index, width) => {
    set((state) => {
      if (state.sectionData) {
        const newstate = { ...state.sectionData };
        if (!checked) {
          newstate.blocks[index].width = null;
          newstate.blocks[index].custom_width = false;
        } else {
          newstate.blocks[index].width = width;
          newstate.blocks[index].custom_width = true;
        }
        return { sectionData: newstate };
      }
      return state;
    });
  },

  onCustomWidthChange: (width, index) => {
    return set((state) => {
      if (state.sectionData) {
        const newstate = { ...state.sectionData };
        newstate.blocks[index].width = width;
        return { sectionData: newstate };
      }
      return state;
    });
  },

  onBlockSort: (current, target) =>
    set((state) => {
      if (state.sectionData) {
        const newstate = { ...state.sectionData };

        [newstate.blocks[current], newstate.blocks[target]] = [
          newstate.blocks[target],
          newstate.blocks[current],
        ];

        return { sectionData: newstate };
      }

      return state;
    }),

  onBlockDelete: (index) =>
    set((state) => {
      if (index === -1) {
        return state;
      }

      const removed = state.sectionData?.blocks.splice(index, 1);

      if (removed) {
        return {
          removedContent: [...state.removedContent, removed[0].id],
        };
      }

      return state;
    }),

  // ========== Block Content ==========
  addBlog: (data) => {
    set((state) => {
      if (state.sectionData) {
        const { sectionData } = state;
        const { blocks } = sectionData;
        const updatedBlocks = cloneDeep(blocks);

        updatedBlocks[state.indexData.activeBlockIndex].blog.splice(
          state.indexData.activeContentIndex,
          0,
          data
        );

        return { sectionData: { ...sectionData, blocks: updatedBlocks } };
      }

      return state;
    });
  },

  addSurvey: (data) => {
    set((state) => {
      if (state.sectionData) {
        const { sectionData } = state;
        const { blocks } = sectionData;
        const updatedBlocks = cloneDeep(blocks);

        updatedBlocks[state.indexData.activeBlockIndex].surveys.splice(
          state.indexData.activeContentIndex,
          0,
          data
        );

        return { sectionData: { ...sectionData, blocks: updatedBlocks } };
      }

      return state;
    });
  },

  addDiscussion: (data) => {
    set((state) => {
      if (state.sectionData) {
        const { sectionData } = state;
        const { blocks } = sectionData;
        const updatedBlocks = cloneDeep(blocks);

        updatedBlocks[state.indexData.activeBlockIndex].discussions.splice(
          state.indexData.activeContentIndex,
          0,
          data
        );

        return { sectionData: { ...sectionData, blocks: updatedBlocks } };
      }

      return state;
    });
  },

  onContentDelete: (type, index) =>
    set((state) => {
      if (index === -1 || !state.sectionData) {
        return state;
      }

      const { sectionData } = state;
      const { blocks } = sectionData;
      const updatedBlocks = cloneDeep(blocks);

      updatedBlocks[state.indexData.activeBlockIndex][type].splice(index, 1);

      return { sectionData: { ...sectionData, blocks: updatedBlocks } };
    }),

  onContentSort: (type, current, target) =>
    set((state) => {
      if (!state.sectionData) {
        return state;
      }

      const { sectionData } = state;
      const { blocks } = sectionData;
      const blockIndex = state.indexData.activeBlockIndex;
      const updatedBlocks = cloneDeep(blocks);

      switch (type) {
        case "blog":
          const currentBlog = blocks[blockIndex].blog[current];
          const targetBlock = blocks[blockIndex].blog[target];
          const updatedBlog = cloneDeep(blocks[blockIndex].blog);

          [updatedBlog[current], updatedBlog[target]] = [
            targetBlock,
            currentBlog,
          ];
          updatedBlocks[blockIndex].blog = updatedBlog;

          return { sectionData: { ...sectionData, blocks: updatedBlocks } };

        case "surveys":
          const currentSurvey = blocks[blockIndex].surveys[current];
          const targetSurvey = blocks[blockIndex].surveys[target];
          const updatedSurvey = cloneDeep(blocks[blockIndex].surveys);

          [updatedSurvey[current], updatedSurvey[target]] = [
            targetSurvey,
            currentSurvey,
          ];

          updatedBlocks[blockIndex].surveys = updatedSurvey;

          return { sectionData: { ...sectionData, blocks: updatedBlocks } };

        case "discussions":
          const currentDisscussion = blocks[blockIndex].discussions[current];
          const targetDiscussion = blocks[blockIndex].discussions[target];
          const updatedDiscussion = cloneDeep(blocks[blockIndex].discussions);

          [updatedDiscussion[current], updatedDiscussion[target]] = [
            targetDiscussion,
            currentDisscussion,
          ];

          updatedBlocks[blockIndex].discussions = updatedDiscussion;

          return { sectionData: { ...sectionData, blocks: updatedBlocks } };

        default:
          return state;
      }
    }),

  //  ========== Section list ==========
  sectionListData: null,
  setSectionListData: (data) => set(() => ({ sectionListData: data })),

  // ========== Drawer ==========
  contentDrawerOpen: false,
  setContentDrawerOpen: (open) => set(() => ({ contentDrawerOpen: open })),
  surveyDrawerOpen: false,
  setSurveyDrawerOpen: (open) => set(() => ({ surveyDrawerOpen: open })),
  discussionDrawerOpen: false,
  setDiscussionDrawerOpen: (open) =>
    set(() => ({ discussionDrawerOpen: open })),

  // ========== Block & Content Index Data ==========
  indexData: {
    activeBlockIndex: 0,
    activeContentIndex: 0,
  },

  setIndexData: (indexData) =>
    set((state) => {
      if (
        indexData.activeBlockIndex >= 0 &&
        indexData.activeContentIndex >= 0
      ) {
        return { indexData: indexData };
      }
      return state;
    }),
}));
