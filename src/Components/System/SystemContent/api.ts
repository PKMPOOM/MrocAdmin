import { Dayjs } from "dayjs";
import { simplifiedBlogProps } from "~/interface/User/UserDashboardTypes";
import { appAPI } from "~/utils/fetchUtils";

export type Tcontent = {
  title: string;
  href: string;
  id: string;
  image_url: string;
  date_created: Date | Dayjs;
};

export type Tfooter = {
  title: string;
  href: string; // may remove
  id: string;
  image_url: string;
  date_created: Date | Dayjs;
};

export type TsocialLink = {
  id: string;
  alt_text: string;
  status: "draft" | "active";
  icon: string;
  url: string;
};

export type siteContentType<DynamicContentType = unknown> = {
  id: string;
  status: "draft" | "active";
  title: string;
  date_created: string;
  index: number;
  content?: DynamicContentType;
};

export type customColumn<T = any> = {
  title?: string;
  dataIndex?: string;
  key: string;
  width?: number;
  render?: (record: T) => JSX.Element;
};

export type siteContentTableProps = siteContentType<Tcontent>;
export type footerTableProps = siteContentType<Tfooter>;
export type socialLinkTableProps = siteContentType<TsocialLink>;

export const systemContentAPI = new appAPI("/system-content");
export const contentAPI = new appAPI("/feed_settings");

export const getSystemSiteContent = () => {
  return systemContentAPI.get<siteContentTableProps[]>("/site-contents");
};

// get blog content list
export const getContentList = (shouldFetch: boolean) => {
  let param = "list?simplified=true";

  return contentAPI.get<{
    data: simplifiedBlogProps[];
    count: number;
  }>(`/content/${param}`, shouldFetch);
};
