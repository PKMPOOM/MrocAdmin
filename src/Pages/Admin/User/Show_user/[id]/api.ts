import { appAPI } from "~/utils/fetchUtils";
import { User } from "../Show_user";

const userAPI = new appAPI("/user");

export const getUserByID = (id: string | undefined) => {
  return userAPI.get<User>(`/${id}`);
};
