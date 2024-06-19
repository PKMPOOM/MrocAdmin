import useSWR from "swr";
import { QueryResponse } from "~/interface/SurveyEditorInterface";

export const getPreviewSurveyData = (id: string | undefined) => {
  const shouldFetch = id !== undefined;
  return useSWR<QueryResponse>(shouldFetch ? `/survey/${id}` : null);
};
