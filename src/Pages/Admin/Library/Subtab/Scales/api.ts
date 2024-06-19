import useSWR from "swr";
import {
  fetchDELETE,
  fetchPOST,
  fetchPUT,
} from "../../../../../Utils/fetchUtils";

export interface Scales {
  id: string;
  key: number;
  Name: string;
  TimeStamp: Date;
  scaleData: ScaleData[];
}

export interface ScaleData {
  id: string;
  key: number;
  Precode: string;
  Text: string;
  scalesId: string;
}

export const useGetScaleList = () => {
  return useSWR<Scales[]>(`/scales/list`);
};

export const useCreateNewScale = (data: any) => {
  return fetchPOST(`/scales`, {
    name: data.name,
    scaleData: data.scaleData,
  });
};

export const useGetScaleData = (id: string | undefined) => {
  const shouldFetch = id !== undefined;
  return useSWR<Scales>(() => (shouldFetch ? `/scales/${id}` : null));
};

export const useUpdateScale = (id: string | undefined, data: any) => {
  return fetchPUT(`/scales/${id}`, data);
};

export const useDeleteScale = (id: string) => {
  return fetchDELETE(`/scales/${id}`);
};

export const useDeleteMultiScale = (list: any) => {
  return fetchDELETE(`/scales`, {
    data: {
      ids: list,
    },
  });
};
