import useSWR from "swr";
import {
  QueryResponse,
  SurveylistTypes,
} from "../../../../Interface/SurveyEditorInterface";
import { appAPI } from "~/utils/fetchUtils";

const surveyAPI = new appAPI("/survey");

export const getSurveyList = () => {
  return useSWR<SurveylistTypes[]>(`/survey/list`);
};

export const getSurveyData = (
  NewSurvey: boolean,
  surveyID: string | undefined
) => {
  const shouldFetch = !NewSurvey;
  return surveyAPI.get<QueryResponse>(`/${surveyID}`, shouldFetch);
};
