import { appAPI } from "~/utils/fetchUtils";

const surveyAPI = new appAPI("/generative");

export const getTextResponse = () => {
  return surveyAPI.basicFetch("/survey");
};
export const getTestSurveyQuestion = (prompt: string) => {
  return surveyAPI.basicFetch(`/test/${prompt.replace(" ", "_")}`);
};
export const getTestStreamingText = () => {
  return surveyAPI.basicFetch("/streaming");
};
