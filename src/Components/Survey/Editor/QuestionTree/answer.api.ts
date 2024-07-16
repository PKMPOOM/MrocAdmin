import { Block } from "@blocknote/core";
import { produce } from "immer";
import useSWRMutation from "swr/mutation";
import { v4 as uuidv4 } from "uuid";
import { answerTemplate } from "~/component/Helper/QuestionAnswerDefault";
import { useAuth } from "~/context/Auth/AuthContext";
import { Answer, QueryResponse } from "~/interface/SurveyEditorInterface";
import { TSurveyMeta } from "~/store/useSurveyEditorStore";
import { appAPI } from "~/utils/fetchUtils";

export const answerAPI = new appAPI("/answer");

const createAnswerLabel = (label: string) => {
  const newAnswerTemplate: Block[] = [
    {
      id: "id-00",
      type: "paragraph",
      props: {
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left",
      },
      content: [
        {
          type: "text",
          text: label,
          styles: {},
        },
      ],
      children: [],
    },
  ];

  return JSON.stringify(newAnswerTemplate);
};

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

  const { pIndex, qIndex, qID } = indexData;

  const updaterFn = async () => {
    return await answerAPI.post(null, {
      qID: qID,
      aID: newAnswerID,
      label: createAnswerLabel("New Answer"),
    });
  };

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
          label: createAnswerLabel("New Answer"),
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
    return answerAPI.put(`/${arg.aID}`, {
      label: arg.label,
    });
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn, {
    revalidate: false,
  });
};

export const deleteAllAnswerMutation = (surveyMeta: TSurveyMeta) => {
  const updaterFn = async (_: string, { arg }: { arg: string }) => {
    return await answerAPI.delete(`/all/${arg}`);
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn);
};
