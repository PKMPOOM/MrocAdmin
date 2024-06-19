import { appAPI } from "~/utils/fetchUtils";
import { UserFeedSectionProps } from "../../../Interface/User/UserDashboardTypes";

const userFeedAPI = new appAPI("/feed");

export const getUserFeeds = () => {
  return userFeedAPI.get<UserFeedSectionProps[]>();
};

export const getSiteMeta = () => {
  return userFeedAPI.get<TsiteMeta>("/site-meta");
};

export type TsiteMeta = {
  footer: TfooterPreview[];
  socialLinks: socialLinksList[];
};

export type TfooterPreview = {
  id: string;
  title: string;
  blog: {
    id: string;
  };
};

export type socialLinksList = {
  id: string;
  title: string;
  soclialLinks: {
    id: string;
    alt_text: string;
    url: string;
    icon: string;
  };
};
