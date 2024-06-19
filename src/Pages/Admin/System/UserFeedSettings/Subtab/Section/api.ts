import useSWR from "swr";
import {
  BlockEditorSectionProps,
  simplifiedBlogProps,
} from "../../../../../../Interface/User/UserDashboardTypes";
import {
  fetchDELETE,
  fetchPOST,
  fetchPUT,
} from "../../../../../../Utils/fetchUtils";

export const getSectionList = () => {
  return useSWR<BlockEditorSectionProps[]>("/feed_settings/section/list");
};

export const updateSectionList = (
  elementID: string,
  sourceIndex: number,
  destIndex: number
) => {
  return fetchPUT(`/feed_settings/section/list`, {
    elementID,
    sourceIndex,
    destIndex,
  });
};

export const getSectionById = (paramID: string | undefined) => {
  return useSWR<BlockEditorSectionProps>(`/feed_settings/section/${paramID}`);
};

export const createNewSection = (sectionFormsData: any) => {
  return fetchPOST(`/feed_settings/section`, sectionFormsData);
};

export const updateSection = (sectionId: string, sectionFormsData: any) => {
  return fetchPUT(`/feed_settings/section/${sectionId}`, sectionFormsData);
};

export const useDeleteSection = (sectionId: string, index: number) => {
  return fetchDELETE(`/feed_settings/section/${sectionId}?index=${index}`);
};

export const getSimplifiedContentList = () => {
  let param = "list?simplified=true";

  return useSWR<{
    data: simplifiedBlogProps[];
    count: number;
  }>(`/feed_settings/content/${param}`);
};
