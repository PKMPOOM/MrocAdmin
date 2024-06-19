import useSWR from "swr";
import { axiosInstance } from "../../../../../../Utils/axiosInstance";
import { BlogProps } from "../../../../../../Interface/User/UserDashboardTypes";

const fetchContentList = async () => {
  const response = await axiosInstance.get<{
    data: BlogProps[];
    count: number;
  }>("/feed_settings/content/list");

  const formattedData = response.data.data.map((item, index) => ({
    //add key
    ...item,
    key: index,
  }));

  console.log(formattedData);

  return formattedData;
};

export const getContentList = () => {
  return useSWR("/feed_settings/content/list", fetchContentList);
};
