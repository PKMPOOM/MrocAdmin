import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { LoadingOutlined } from "@ant-design/icons";
import { GlobalToken, message, notification, theme } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";
import axios, { AxiosInstance } from "axios";
import { useNavigate } from "react-router-dom";
import { SWRConfig } from "swr";
import { MessageInstance } from "antd/es/message/interface";

const { useToken } = theme;

type userStruct = {
  id: string;
  email: string;
  role: "admin" | "user";
  onboarded: boolean;
  user_name: string;
  points: number;
  fist_name: string;
  last_name: string;
};

interface AuthContextType {
  AuthUser: userStruct | null;
  accessToken: string | null;
  SignUpErrorText: string;
  Loading: boolean;
  Fetching: boolean;
  IsOnboard: boolean;
  LoginErrorText: string;
  setIsOnboard: any;
  token: GlobalToken;
  Axios: AxiosInstance;
  notificationApi: NotificationInstance;
  messageAPI: MessageInstance;
  SignUp: (
    Email: string,
    Password: string,
    confirmPassword: string
  ) => Promise<void>;
  Login: (Email: string, Password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [AuthUser, setAuthUser] = useState<AuthContextType["AuthUser"]>(null);
  const [SignUpErrorText, setSignUpErrorText] = useState("");
  const [LoginErrorText, setLoginErrorText] = useState("");
  const [Loading, setLoading] = useState(true);
  const [Fetching, setFetching] = useState(false);
  const [IsOnboard, setIsOnboard] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [notificationApi, NoticontextHolder] = notification.useNotification({
    placement: "topRight",
  });
  const [messageAPI, messaageContextHolder] = message.useMessage();

  const Axios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { token } = useToken();

  async function signOut() {
    localStorage.removeItem("lid");
    navigate("/login");
    setAuthUser(null);
  }

  async function Login(Email: string, Password: string) {
    setLoading(true);
    setFetching(true);
    setLoginErrorText("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AUTH_API_URL}/login`,
        {
          Email,
          Password,
        }
      );

      setAccessToken(response.data.accessToken);
      setAuthUser(response.data.userData);

      const token = response.data.accessToken.split(".");
      const expirationTime = new Date().getTime() + 3600000; // Assuming token is valid for 1 hour
      localStorage.setItem(
        "lid",
        JSON.stringify({
          k: token[0],
          u: token[1],
          y: token[2],
          et: expirationTime,
        })
      );

      setIsOnboard(response.data.userData.onborded);
      navigate("/admin/Dashboard");
      setLoading(false);
      setFetching(false);
    } catch (err: any) {
      notificationApi.error({
        message: "Error",
        description: "Eorror while logging in",
      });
      setLoading(false);
      setFetching(false);
    }
  }

  async function SignUp(Email: string, Password: string, passwordref: string) {
    switch (true) {
      case Password === passwordref:
        setSignUpErrorText("");
        try {
          setLoading(true);

          await axios.post(`${import.meta.env.VITE_AUTH_API_URL}/signup`, {
            Email,
            Password,
          });

          setFetching(false);
          setLoading(false);

          navigate("/success");
        } catch (err: any) {
          notificationApi.error({
            message: "Error",
            description: "Error while signing up",
          });
          setSignUpErrorText(err.response.data);
          console.log(err.response.data);
        }
        break;
      case Password !== passwordref:
        setSignUpErrorText("Password not match");
        break;

      default:
        break;
    }
  }

  async function Verifytoken(token: string) {
    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_AUTH_API_URL}/reverify`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAuthUser(response.data);
      setAccessToken(token);
      setIsOnboard(response.data.onborded);

      setLoading(false);
    } catch (error) {
      localStorage.removeItem("lid");
      setLoading(false);
      navigate("/login");
      setAuthUser(null);
    }
  }

  useEffect(() => {
    const storedToken = JSON.parse(localStorage.getItem("lid") || "null");

    if (storedToken !== null) {
      const joinedString =
        storedToken.k + "." + storedToken.u + "." + storedToken.y;
      Verifytoken(joinedString);
    } else {
      setLoading(false);
    }
  }, []);

  const fetcher = (url: string) => Axios.get(url).then((resp) => resp.data);

  const value: AuthContextType = {
    AuthUser,
    accessToken,
    SignUpErrorText,
    Loading,
    Axios,
    SignUp,
    Login,
    Fetching,
    signOut,
    LoginErrorText,
    IsOnboard,
    setIsOnboard,
    token,
    notificationApi,
    messageAPI,
  };

  return (
    <AuthContext.Provider value={value}>
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: false,
          refreshInterval: 0,
        }}
      >
        {NoticontextHolder}
        {messaageContextHolder}
        {!Loading ? (
          children
        ) : (
          <div className="tw-w-screen tw-h-screen tw-flex tw-gap-5 tw-justify-center tw-items-center tw-flex-col">
            <LoadingOutlined
              style={{ fontSize: 60, color: token.colorPrimary }}
            />
            Loading..
          </div>
        )}
      </SWRConfig>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
