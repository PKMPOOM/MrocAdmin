import { produce } from "immer";
import { pickBy } from "lodash";
import useSWRMutation from "swr/mutation";
import { v4 as uuidv4 } from "uuid";
import { questionAPI } from "./question.api";
import { appAPI } from "~/utils/fetchUtils";
import { TSelectedTree, TSurveyMeta } from "~/store/useSurveyEditorStore";
import { QueryResponse } from "~/interface/SurveyEditorInterface";
import { useAuth } from "~/context/Auth/AuthContext";

export const pageAPI = new appAPI("/page");

export const useAddPageMutation = (surveyMeta: TSurveyMeta) => {
  const updaterFn = async () => {
    return await pageAPI.post(`/`, {
      surveyID: surveyMeta.surveyID,
    });
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn, {
    revalidate: true,
    optimisticData: (data) => {
      const nextState = produce(data, (draftState: QueryResponse) => {
        draftState.questionlist.push({
          key: (draftState.questionlist.length + 1).toString(),
          id: uuidv4(),
          header: "New page",
          questions: [],
          isselected: false,
          surveysIdsurveys: surveyMeta.surveyID,
        });
      });
      return nextState;
    },
  });
};

export type TQuestionsToDelete = {
  pageID: string;
  id: string;
  index: number;
};

export const useDeleteMultiplePagesMutation = (
  surveyMeta: TSurveyMeta,
  selectedTree: TSelectedTree
) => {
  const { notificationApi } = useAuth();

  const updaterFn = async () => {
    // extract pages id for backend payload
    const allPagesIdsToDelete = Object.keys(selectedTree).filter((key) => {
      if (selectedTree[key].pageSelected === true) {
        return selectedTree[key];
      }
    });

    const allQuestionsToDelete = pickBy(selectedTree, (x) => !x.pageSelected); // extract questions id for backend payload, filter out deleting pages
    const questionsToDelete: TQuestionsToDelete[] = Object.keys(
      allQuestionsToDelete
    )
      .map((key) =>
        allQuestionsToDelete[key].selectedQuestions.map((x) => ({
          ...x,
          pageID: key,
        }))
      )
      .flat();

    return await Promise.all([
      allPagesIdsToDelete.length > 0 &&
        pageAPI.delete(null, {
          data: {
            SelectedPages: allPagesIdsToDelete,
          },
        }),
      questionsToDelete.length > 0 &&
        questionAPI.delete(null, {
          data: {
            SelectedQuestions: questionsToDelete,
          },
        }),
    ]);
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn, {
    revalidate: true,
    rollbackOnError() {
      notificationApi.error({
        message: "Error",
        description: "Error deleting pages",
      });
      return true;
    },
  });
};

type useUpdatePageHeaderMutationProps = {
  pageID: string;
  value: string;
};

export const useUpdatePageHeaderMutation = (surveyMeta: TSurveyMeta) => {
  const { notificationApi } = useAuth();

  const updaterFn = async (
    _questionID: string,
    { arg }: { arg: useUpdatePageHeaderMutationProps }
  ) => {
    return await pageAPI.put(`/${arg.pageID}`, {
      value: arg.value,
    });
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn, {
    revalidate: true,
    rollbackOnError: () => {
      notificationApi.error({
        message: "Error",
        description: "Error updating page header",
      });

      return true;
    },
  });
};

export const useDeleteSinglePageMutation = (surveyMeta: TSurveyMeta) => {
  const updaterFn = async (_questionID: string, { arg }: { arg: string }) => {
    return await pageAPI.delete(null, {
      data: {
        SelectedPages: [arg],
      },
    });
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn);
};
