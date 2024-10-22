import useSWRMutation from "swr/mutation";
import { TQuestionsToDelete } from "./page.api";
import { appAPI } from "~/utils/fetchUtils";
import { TSurveyMeta } from "~/store/useSurveyEditorStore";
import { useAuth } from "~/context/Auth/AuthContext";
import { Question } from "~/interface/SurveyEditorInterface";

export const questionAPI = new appAPI("/question");

export type QuestionOptionsProps = {
  qID?: string;
  questionType?: string;
  useResponseRequirement?: boolean;
  usePrecodesOption?: boolean;
  presetAnswers?: boolean;
  selectedPrecodesOption?: "shuffle" | "sort" | "none";
  shuffleBy?: string | undefined;
  sortDirection?: "asc" | "dsc";
  forceQuestionResponse?: boolean;
};

export const useUpdateQuestionSettingsMutation = (surveyMeta: TSurveyMeta) => {
  const updaterFn = async (
    _: string,
    { arg }: { arg: QuestionOptionsProps }
  ) => {
    return await questionAPI.put(`/${arg.qID}/options`, arg);
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn, {
    revalidate: true,
    rollbackOnError: true,
  });
};

export type ChangeQuestionTypeMutationProps = {
  surveyMeta: TSurveyMeta;
  qID: string;
};

export const useChangeQuestionTypeMutation = ({
  surveyMeta,
  qID,
}: ChangeQuestionTypeMutationProps) => {
  const updaterFn = async (
    _: string,
    {
      arg,
    }: {
      arg: {
        targetType: string;
      };
    }
  ) => {
    return await questionAPI.put(`/${qID}/type`, {
      questiontype: arg.targetType,
    });
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn, {
    revalidate: true,
    rollbackOnError: true,
  });
};

type sortQuestionProps = {
  // ----------- dragging question id
  activeQuestionID: string;
  //  ----------- source page data
  sourcePageID: string;
  sourceQuestionIndex: number;
  sourcePageIndex: number;
  // ----------- destination page data
  destPageID: string;
  destQuestionIndex: number;
  destPageIndex: number;
};

export const useSortQuestion = (surveyMeta: TSurveyMeta) => {
  const updaterFn = async (_: string, { arg }: { arg: sortQuestionProps }) => {
    return await questionAPI.put(null, {
      activeId: arg.activeQuestionID,
      sourcePageId: arg.sourcePageID,
      sourceItemIndex: arg.sourceQuestionIndex,
      sourcePageIndex: arg.sourcePageIndex,
      destPageId: arg.destPageID,
      destItemIndex: arg.destQuestionIndex,
      destinationPageIndex: arg.destPageIndex,
    });
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn, {
    rollbackOnError: true,
    revalidate: true,
  });
};

type AddQuestionOnClickProps = {
  type: string;
  label: string;
  lastPageId: string;
  lastIndex: number;
  lastpage: number;
};

export const useAddQuestionOnClick = (surveyMeta: TSurveyMeta) => {
  const updaterFn = async (
    _: string,
    { arg }: { arg: AddQuestionOnClickProps }
  ) => {
    return await questionAPI.post(null, {
      questionType: arg.type,
      questionLabel: arg.label,
      pageID: arg.lastPageId,
      index: arg.lastIndex + 1,
    });
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn, {
    rollbackOnError: true,
    revalidate: true,
  });
};

type addQuestionOnDragProps = {
  newQuestion: Question;
  destPageID: number;
  destQuestionIndex: number;
  destPageIndex: number;
};

export const useAddQuestionOnDrag = (surveyMeta: TSurveyMeta) => {
  const updaterFn = async (
    _: string,
    { arg }: { arg: addQuestionOnDragProps }
  ) => {
    return await questionAPI.post("/drop", {
      destPageID: arg.destPageID,
      newQuestion: arg.newQuestion,
      destItemIndex: arg.destQuestionIndex,
    });
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn, {
    rollbackOnError: true,
    revalidate: true,
  });
};

export const useDeleteQuestionMutation = (surveyMeta: TSurveyMeta) => {
  const updaterFn = async (
    _: string,
    {
      arg,
    }: {
      arg: TQuestionsToDelete;
    }
  ) => {
    return questionAPI.delete(null, {
      data: {
        SelectedQuestions: [arg],
      },
    });

    // questionAPI.delete(null, {
    //   data: {
    //     SelectedQuestions: questionsToDelete,
    //   },
    // }),
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn, {
    rollbackOnError: true,
    revalidate: true,
  });
};

type useUpdateQuestionLabelArgs = {
  label: string;
  qID: string;
};

export const useUpdateQuestionLabel = (surveyMeta: TSurveyMeta) => {
  const { notificationApi } = useAuth();
  const updaterFn = async (
    _: string,
    { arg }: { arg: useUpdateQuestionLabelArgs }
  ) => {
    return questionAPI.put(`/${arg.qID}/text`, {
      label: arg.label,
    });
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn, {
    revalidate: true,
    rollbackOnError: () => {
      notificationApi.error({
        message: "Error",
        description: "Error updating question label",
      });

      return true;
    },
  });
};
