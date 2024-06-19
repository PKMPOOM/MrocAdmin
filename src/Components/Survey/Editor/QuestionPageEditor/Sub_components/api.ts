import useSWRMutation from "swr/mutation";
import { answerAPI } from "../../QuestionTree/answer.api";
import { TSurveyMeta } from "~/store/useSurveyEditorStore";
// import { throwMockError } from "@/Utils/mockResponse";

type TUseUpdateOpenEnd = {
  use: boolean;
  aID: string;
  force: boolean;
  allowNumberOnly: boolean;
  useAI: boolean;
  openEndDirection: "vertical" | "horizontal";
};

export const useUpdateOpenEnd = (surveyMeta: TSurveyMeta) => {
  const updaterFn = async (_: string, { arg }: { arg: TUseUpdateOpenEnd }) => {
    // console.log(arg);
    // return throwMockError(1000);

    return await answerAPI.put(`/${arg.aID}`, {
      use: arg.use,
      force: arg.force,
      allowNumberOnly: arg.allowNumberOnly,
      useAI: arg.useAI,
      openEndDirection: arg.openEndDirection,
    });
  };

  return useSWRMutation(surveyMeta.queryKey, updaterFn);
};
