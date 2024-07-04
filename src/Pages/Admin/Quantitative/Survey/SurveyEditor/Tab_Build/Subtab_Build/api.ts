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
