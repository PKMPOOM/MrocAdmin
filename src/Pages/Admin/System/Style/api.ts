import useSWR from "swr";
import { TthemeData } from "../../../../Store/useTheme";
import { fetchPOST, fetchPUT } from "../../../../Utils/fetchUtils";

export const getStyleList = () => {
  return useSWR<TthemeData[]>("/style/list");
};

export const getStyleData = (id: string | undefined) => {
  const shouldFetch = id !== undefined;
  return useSWR<TthemeData>(() => (shouldFetch ? `/style/${id}` : null));
};

export const setActiveTheme = (id: string) => {
  return fetchPOST(`/style/${id}/set_active`, {});
};

export const createTheme = (postBody: any) => {
  return fetchPOST(`/style`, postBody);
};

export const updateTheme = (id: string | undefined, postBody: any) => {
  if (id === undefined) {
    return Promise.reject("id is undefined");
  }
  return fetchPUT(`/style/${id}`, postBody);
};

export const deleteTheme = (id: string) => {
  return fetchPUT(`/style/${id}/delete`, {});
};

export const uploadThemeImages = (id: string, postBody: any) => {
  return fetchPOST(`/style/${id}/upload_images`, postBody);
};

export const removeCustomTheme = (id: string) => {
  return fetchPUT(`/style/${id}/unset`, {});
};
