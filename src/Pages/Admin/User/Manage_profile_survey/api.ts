import { SelectProps } from "antd";
import {
  ProfileSurveyGroupBySurvey,
  ProfileSurveyGroupByUser,
} from "./ManageProfileSurveyPage";
import { appAPI } from "~/utils/fetchUtils";

const profileSurveyAPI = new appAPI("/profile-survey");

export const getProfileSurveyGroupBySurvey = (groupBy: string) => {
  const shouldFetch = groupBy === "survey";
  return profileSurveyAPI.get<ProfileSurveyGroupBySurvey[]>(
    `/list?groupBy=${groupBy}`,
    shouldFetch
  );
};
export const getProfileSurveyGroupByUser = (groupBy: string) => {
  const shouldFetch = groupBy === "user";
  return profileSurveyAPI.get<ProfileSurveyGroupByUser[]>(
    `/list?groupBy=${groupBy}`,
    shouldFetch
  );
};

export const getProfileSurveyNameList = () => {
  return profileSurveyAPI.get<SelectProps["options"]>("/name/list");
};
