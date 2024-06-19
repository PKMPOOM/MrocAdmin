import useSWR from "swr";

export const getSingleContentData = (id: string) => {
  return useSWR(`feed/content/${id}`);
};
