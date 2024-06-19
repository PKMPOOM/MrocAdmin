import useSWR from "swr";

export const getSurveyData = (id: string) => {
  return useSWR(`user/survey/${id}`);
};
