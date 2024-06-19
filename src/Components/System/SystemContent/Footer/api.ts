import { footerTableProps, systemContentAPI } from "../api";

export const getSystemFooterList = () => {
  return systemContentAPI.get<footerTableProps[]>("/footers");
};

export const createNewFooter = (data: any) => {
  return systemContentAPI.post("/footers", data);
};

export const updateFooter = (id: string, data: any) => {
  return systemContentAPI.put(`/footers/${id}`, data);
};

export const deleteFooter = (id: string, index: number) => {
  return systemContentAPI.delete(`/footers/${id}/${index}`);
};

export const updateFooterOrder = (
  elementID: string,
  sourceIndex: number,
  destIndex: number
) => {
  return systemContentAPI.put(`/footers/${elementID}/reorder`, {
    elementID,
    sourceIndex,
    destIndex,
  });
};
