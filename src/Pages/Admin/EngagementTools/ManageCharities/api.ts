import useSWR from "swr";
import { Charity } from "./ManageCharities";

export const getCharityList = (params?: string) => {
  if (params === undefined) {
    return useSWR<Charity[]>(`/charity/list`);
  } else {
    return useSWR<Charity[]>(`/charity/list?${params}`);
  }
};
