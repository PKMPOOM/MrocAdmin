import { appAPI } from "~/utils/fetchUtils";

const siteContentAPI = new appAPI("/system-content");

export type MetaContent = {
  id: string;
  status: string;
  date_created: Date;
  title: string;
  update_at: Date;
  blog: Blog;
};

export type Blog = {
  title: string;
  id: string;
  href: string;
  image_url: string;
  html_content: string;
  date_created: Date;
};

export const getSingleContentData = (id: string | undefined) => {
  return siteContentAPI.get<MetaContent>(`/site-contents/${id}`);
};
