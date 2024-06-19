import useSWR from "swr";
import { fetchDELETE, fetchPOST, fetchPUT } from "../../../../Utils/fetchUtils";

export interface WhiteListData {
  id: string;
  pkWhitelist: number;
  url: string;
  GET: boolean;
  POST: boolean;
  PUT: boolean;
  DELETE: boolean;
  required: boolean;
}

export type FormSchema = {
  url: string;
  methods: string[];
};

export const createWhitelist = ({ url, methods }: FormSchema) => {
  return fetchPOST("/whitelist", { url, methods });
};

export const getWhitelist = () => {
  return useSWR<WhiteListData[]>("/whitelist");
};

export const updateOperation = (
  id: string,
  operation: "GET" | "POST" | "PUT" | "DELETE",
  value: boolean
) => {
  return fetchPUT(`/whitelist/${id}/${operation}`, { value: !value });
};

export const deleteWhitelist = (id: string) => {
  return fetchDELETE(`/whitelist/${id}`);
};
