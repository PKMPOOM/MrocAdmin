import { appAPI } from "~/utils/fetchUtils";

const surveyAPI = new appAPI("/generative");

export const getTextResponse = () => {
  return surveyAPI.basicFetch("/survey");
};
export const getTestSurveyQuestion = () => {
  return surveyAPI.basicFetch("/test");
};
