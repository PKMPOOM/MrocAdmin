import { QueryResponse } from "~/interface/SurveyEditorInterface";
import { appAPI } from "~/utils/fetchUtils";

const surveyAPI = new appAPI("/survey");

export const getSurveyData = (
  NewSurvey: boolean,
  surveyID: string | undefined
) => {
  const shouldFetch = !NewSurvey;
  return surveyAPI.get<QueryResponse>(`/${surveyID}`, shouldFetch);
};

export const createNewPage = (surveyID: string) =>
  surveyAPI.post(`/`, {
    surveyID,
  });
