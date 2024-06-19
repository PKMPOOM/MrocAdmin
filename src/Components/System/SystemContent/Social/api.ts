import { socialLinkTableProps, systemContentAPI } from "../api";

export const getSocialLinkList = () => {
  return systemContentAPI.get<socialLinkTableProps[]>("/social-links");
};

export const createNewSocialLink = (data: any) => {
  return systemContentAPI.post("/social-links", data, undefined, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateSocialLink = (id: string, data: any) => {
  return systemContentAPI.put(`/social-links/${id}`, data, undefined, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteSocialLink = (id: string, index: number) => {
  return systemContentAPI.delete(`/social-links/${id}/${index}`);
};

export const updateSocialLinkOrder = (
  elementID: string,
  sourceIndex: number,
  destIndex: number
) => {
  return systemContentAPI.put(`/social-links/${elementID}/reorder`, {
    elementID,
    sourceIndex,
    destIndex,
  });
};
