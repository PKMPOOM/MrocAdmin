import { siteContentTableProps, systemContentAPI } from "../api";

export const getSystemSiteContent = (tab: string | null) => {
  const shouldFetch = tab === "site_contents";
  return systemContentAPI.get<siteContentTableProps[]>(
    "/site-contents",
    shouldFetch
  );
};

export const createNewSiteContent = (data: any) => {
  return systemContentAPI.post("/site-contents", data);
};

export const updateSiteContent = (id: string, data: any) => {
  return systemContentAPI.put(`/site-contents/${id}`, data);
};

export const deleteSiteContent = (id: string, index: number) => {
  return systemContentAPI.delete(`/site-contents/${id}/${index}`);
};

export const updateSiteContentOrder = (
  elementID: string,
  sourceIndex: number,
  destIndex: number
) => {
  return systemContentAPI.put(`/site-contents/${elementID}/reorder`, {
    elementID,
    sourceIndex,
    destIndex,
  });
};
