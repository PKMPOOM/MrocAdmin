import {
  DollarCircleOutlined,
  FlagOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  ConfigProvider,
  Dropdown,
  Tabs,
  Tag,
  Typography,
  theme,
} from "antd";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingFallback from "../../../../../Components/Global/Suspense/LoadingFallback";
import AddPointsModal from "../../../../../Components/Users/Show_User/AddPointsModal";
import { useAuth } from "../../../../../Context/Auth/AuthContext";
import { User } from "../Show_user";
import Subtab_Survey from "./Survey/Subtab_Survey";
import { getUserByID } from "./api";
import Subtab_General from "./General/Subtab_General";
import { TabItem } from "~/interface/DiscussionThreadInterfaces";
import { useUserPageStore } from "~/store/useUserPageStore";
dayjs.extend(localizedFormat);

const { Title } = Typography;
const { useToken } = theme;

type TabNameList =
  | "general"
  | "sample"
  | "surveys"
  | "discussions"
  | "posts"
  | "badges"
  | "user_data"
  | "logins"
  | "rewards"
  | "referals";

const items: TabItem<TabNameList>[] = [
  {
    key: "general",
    label: `General`,
    children: <Subtab_General />,
  },
  {
    key: "sample",
    label: `Samples`,
    children: `Samples`,
  },
  {
    key: "surveys",
    label: `Surveys`,
    children: <Subtab_Survey />,
  },
  {
    key: "discussions",
    label: `Discussions`,
    children: `Discussions`,
  },
  {
    key: "posts",
    label: `Posts`,
    children: `Posts`,
  },
  {
    key: "badges",
    label: `Badgs`,
    children: `Badgs`,
  },
  {
    key: "user_data",
    label: `User Data`,
    children: `User Data`,
  },
  {
    key: "logins",
    label: `Logins`,
    children: `Logins`,
  },
  {
    key: "rewards",
    label: `Rewards`,
    children: `Rewards`,
  },
  {
    key: "referals",
    label: `Referals`,
    children: `Referals`,
  },
];

type UserDataContext = {
  PointsModalOpen: boolean;
  setPointsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: User;
  refetchUserData: any;
};

export const userDataContext = createContext({} as UserDataContext);

const UserData = React.memo(() => {
  const { Axios } = useAuth();
  const { token } = useToken();
  const { id } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const tab = searchParams.get("tab");
  const url = new URL(window.location.href);
  const [PointsModalOpen, setPointsModalOpen] = useState(false);

  const [setUserData, userData, surveySubTabs] = useUserPageStore((state) => [
    state.setUserData,
    state.userData,
    state.surveySubTabs,
  ]);
  const { data, mutate: refetchUserData } = getUserByID(id);

  useEffect(() => {
    if (!tab) {
      url.searchParams.append("tab", "general");
      window.history.pushState({}, "", url.toString());
    }
  }, []);

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data]);

  const redirect = (key: TabNameList) => {
    switch (key) {
      case "surveys":
        url.searchParams.set("tab", key);
        url.searchParams.set("subtab", surveySubTabs);
        break;
      default:
        url.searchParams.set("tab", key);
        url.searchParams.delete("subtab");
        break;
    }
    window.history.pushState({}, "", url.toString());
  };

  if (!userData) {
    return <LoadingFallback />;
  }

  const flagUser = async (flag: string) => {
    await Axios.post(`/user/${userData.id}/flag`, { flag });
    refetchUserData();
  };

  const contextValue = {
    PointsModalOpen,
    setPointsModalOpen,
    userData,
    refetchUserData,
  };

  return (
    <userDataContext.Provider value={contextValue}>
      <div className="tw-flex tw-flex-col tw-gap-2 tw-items-stretch ">
        <Link to={`/admin/users/showuser`}>
          <Button icon={<LeftOutlined />} type="text">
            Back
          </Button>
        </Link>

        <div className="tw-bg-gradient-to-r tw-from-cyan-500 tw-to-blue-500 tw-w-full tw-h-[150px] tw-flex tw-flex-col tw-relative tw-mb-[75px] tw-rounded-md">
          <div className="tw-absolute tw--bottom-12 tw-left-5 tw-flex tw-flex-row tw-gap-4 tw-items-end ">
            <Avatar
              shape="square"
              size={150}
              style={{
                border: "3px solid white",
                backgroundColor: token.colorPrimaryBg,
                color: token.colorPrimaryText,
                display: "flex",
                alignItems: "center",
              }}
            >
              <p>
                {!userData.avatar && userData.username.charAt(0).toUpperCase()}
              </p>
            </Avatar>
            <div className="tw-mb-1 tw-flex tw-flex-row tw-items-center tw-gap-2 ">
              <Title style={{ marginBottom: 4 }} level={3}>
                {userData?.username}
              </Title>
              <div className="tw-flex tw-items-center">
                {userData.role === "admin" && (
                  <Tag bordered={false} color="blue">
                    Admin
                  </Tag>
                )}
                {userData.flags &&
                  userData.flags.map((item) => (
                    <Tag key={item.id} bordered={false} color="orange">
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </Tag>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="tw-flex tw-flex-row tw-justify-between tw-mb-4 tw-w-full ">
          <div className="tw-flex tw-gap-2 tw-w-full ">
            <Button
              icon={<DollarCircleOutlined />}
              type="primary"
              onClick={() => {
                setPointsModalOpen(true);
              }}
            >
              Add points
            </Button>
            <Button type="dashed">Add to clipboard</Button>
            <Button type="dashed">Send password reset link</Button>
            <Button type="dashed">verify</Button>
            <Button type="dashed">Deactivate</Button>
          </div>
          <div className="tw-flex tw-gap-2">
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: token.colorWarning,
                },
              }}
            >
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "spam",
                      label: "Spam",
                    },
                    {
                      key: "inappropriate_content",
                      label: "Inappropriate Content",
                    },
                    {
                      key: "noisy_behavior",
                      label: "Noisy Behavior",
                    },
                    {
                      key: "harassment",
                      label: "Harassment",
                    },
                    {
                      key: "misinformation",
                      label: "Misinformation",
                    },
                  ],
                  onClick: ({ key }) => {
                    flagUser(key);
                  },
                }}
                placement="bottomLeft"
              >
                <Button type="primary" ghost icon={<FlagOutlined />}>
                  Flag user
                </Button>
              </Dropdown>
            </ConfigProvider>
            <Button type="primary" danger>
              Delete User
            </Button>
          </div>
        </div>

        <Tabs
          items={items}
          defaultActiveKey={tab ? tab : "general"}
          onTabClick={(e) => {
            redirect(e as TabNameList);
          }}
        />
        <AddPointsModal />
      </div>
    </userDataContext.Provider>
  );
});

export default UserData;
