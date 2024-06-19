import { produce } from "immer";
import useSWRMutation from "swr/mutation";
import { v4 as uuidv4 } from "uuid";
import { answerTemplate } from "~/component/Helper/QuestionAnswerDefault";
import { useAuth } from "~/context/Auth/AuthContext";
import { Answer, QueryResponse } from "~/interface/SurveyEditorInterface";
import { TSurveyMeta } from "~/store/useSurveyEditorStore";
import { appAPI } from "~/utils/fetchUtils";

export const answerAPI = new appAPI("/answer");

type addAnswerMutationProps = {
  pIndex: number;
  qIndex: number;
  qID: string;
};

export const addAnswerMutation = (
  surveyMeta: TSurveyMeta,
  indexData: addAnswerMutationProps
) => {
  const { notificationApi } = useAuth();
  const newAnswerID = uuidv4();
  const updaterFn = async () => {
    return await answerAPI.post(null, {
      qID: qID,
      aID: newAnswerID,
    });
  };

  const { pIndex, qIndex, qID } = indexData;

  return useSWRMutation(surveyMeta.queryKey, updaterFn, {
    revalidate: true,
    rollbackOnError: () => {
      notificationApi.error({
        message: "Error",
        description: "Error while adding answer",
      });
      return true;
    },
    optimisticData(currentData: any) {
      const nextState = produce(currentData, (draftState: QueryResponse) => {
        const { questionlist } = draftState;
        const newAnswer: Answer = {
          ...answerTemplate,
          label: `New answer`,
          key: "",
          id: newAnswerID,
        };

        questionlist[pIndex].questions[qIndex].answers.push(newAnswer);
      });
      return nextState;
    },
  });
};

export const deleteAnswerMutation = (surveyMeta: TSurveyMeta) => {
  const updaterFn = async (_questionID: string, { arg }: { arg: string }) => {
    return await answerAPI.delete(`/${arg}`);
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn, {
    revalidate: true,
    rollbackOnError: true,
  });
};

type useUpdateAnswerLabelArgs = {
  label: string;
  aID: string;
};

export const updateAnswerLabel = (surveyMeta: TSurveyMeta) => {
  const updaterFn = async (
    _: string,
    { arg }: { arg: useUpdateAnswerLabelArgs }
  ) => {
    // return throwMockError(0);

    return answerAPI.put(`/${arg.aID}`, {
      label: arg.label,
    });
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn, {
    revalidate: false,
  });
};
