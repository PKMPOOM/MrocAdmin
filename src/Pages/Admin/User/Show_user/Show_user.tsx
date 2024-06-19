import { useState, createContext } from "react";

import { Space, Checkbox, Input, Segmented, Typography } from "antd";
import { BarsOutlined, AppstoreOutlined } from "@ant-design/icons";
import Listview from "../../../../Components/Users/Show_User/ListView";
import Cardview from "../../../../Components/Users/Show_User/CardView";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../Context/Auth/AuthContext";
import LoadingFallback from "../../../../Components/Global/Suspense/LoadingFallback";
import { Dayjs } from "dayjs";

const { Title } = Typography;

type contextValue = {};

export type User = {
  id: string;
  email: string;
  activate: boolean;
  onboarded: boolean;
  created_at: Dayjs;
  last_login: Dayjs;
  points: number;
  role: "admin" | "user";
  username: string;
  first_name: string;
  last_name: string;
  gender: string;
  Region: string;
  avatar?: string;
  flags: {
    id: string;
    name: string;
  }[];
};

export const UserPageContext = createContext({} as contextValue);

function Userpage() {
  const [View, setView] = useState<"List" | "Card">(
    JSON.parse(localStorage.getItem("view") || "null") || "List"
  );
  const [SearchKey, setSearchKey] = useState("");
  const { Axios } = useAuth();

  const fetchUserList = async () => {
    const res = await Axios.get("/user");
    return res.data;
  };

  const { data: userList } = useQuery<User[]>({
    queryKey: ["userList"],
    queryFn: fetchUserList,
    refetchOnWindowFocus: false,
  });

  if (!userList) {
    return <LoadingFallback />;
  }

  const setPageView = (view: "List" | "Card") => {
    window.localStorage.setItem("view", JSON.stringify(view));
    setView(view);
  };

  const filteredList = userList.filter((item) => {
    return SearchKey === ""
      ? item
      : Object.entries(item).some((value) =>
          value
            .toString()
            .toLocaleLowerCase()
            .includes(SearchKey.toLocaleLowerCase())
        );
  });

  return (
    <>
      <UserPageContext.Provider value={{}}>
        <div className="tw-flex tw-flex-row tw-items-center ">
          <div className="tw-flex tw-flex-row tw-items-center ">
            <Title level={3}>Invite users</Title>
          </div>
        </div>
        <Space size="middle" direction="vertical">
          <Space size={"large"}>
            <Space size={"small"}>
              Active filter
              <Checkbox defaultChecked={true}>Active</Checkbox>
              <Checkbox defaultChecked={true}>Inactive</Checkbox>
              <Checkbox defaultChecked={true}>Activated</Checkbox>
            </Space>
          </Space>
          <Space size={16}>
            <Segmented
              value={View}
              onChange={(e) => {
                setPageView(e as "List" | "Card");
              }}
              options={[
                {
                  value: "List",
                  icon: <BarsOutlined />,
                },
                {
                  value: "Card",
                  icon: <AppstoreOutlined />,
                },
              ]}
            />
            <Input.Search
              onChange={(e) => {
                setSearchKey(e.target.value);
              }}
            />
          </Space>
        </Space>
        {/*//! Title section */}
        <div className="tw-h-[calc(100vh-218px)] tw-mt-6 ">
          {View === "List" ? (
            <Listview data={filteredList} />
          ) : (
            <Cardview data={filteredList} />
          )}
        </div>
      </UserPageContext.Provider>
    </>
  );
}

export default Userpage;
