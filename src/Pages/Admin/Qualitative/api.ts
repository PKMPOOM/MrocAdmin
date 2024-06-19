import useSWR from "swr";
// import { DiscussionSimplifiedType } from "../../../Interface/DiscussionThreadInterfaces";

export const getDiscussionList = <T>() => {
  return useSWR<T[]>("/discussion");
};
