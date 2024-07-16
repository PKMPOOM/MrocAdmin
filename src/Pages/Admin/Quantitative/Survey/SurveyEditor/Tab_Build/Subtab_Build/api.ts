import useSWRMutation from "swr/mutation";
import { TAnswer } from "~/interface/SurveyEditorInterface";
import { TSurveyMeta } from "~/store/useSurveyEditorStore";
import { appAPI } from "~/utils/fetchUtils";
import { GenQuestionList } from "../../../SmartCreate/type";

const generativePageAPI = new appAPI("/generative");

type SubmitPayload = {
  pageID: string;
  questionList: GenQuestionList[];
};

export const createNewQuestionsFromGenerted = (data: SubmitPayload) => {
  return generativePageAPI.post("/page", data);
};

const createAnswerList = async (answerList: TAnswer[], qID: string) => {
  return generativePageAPI.post("/answerlist", {
    answerList,
    qId: qID,
  });
};

export const createAnswerFromGenerated = (
  surveyMeta: TSurveyMeta,
  qId: string
) => {
  const updaterFn = async (_: string, { arg }: { arg: TAnswer[] }) => {
    return await createAnswerList(arg, qId);
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn);
};

export const updateSurveyInstructions = async (
  instruction: string,
  id: string
) => {
  return generativePageAPI.post("/survey/instructions", { instruction, id });
};
