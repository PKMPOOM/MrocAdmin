import { appAPI } from "~/utils/fetchUtils";
import { SubmitPayload } from "./type";

const surveyAPI = new appAPI("/generative");

type Response = {
  message: string;
  id: string;
};

export const createNewSurveyFromGenerted = (data: SubmitPayload) => {
  return surveyAPI.post<Response>("/survey", data);
};
