import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/Auth/AuthContext";
import { NavbarMemo } from "../Components/Global/Navbar/Navbar";
import { Layout } from "antd";
const { Content } = Layout;

function UserLayoutRoute() {
  const { AuthUser, IsOnboard } = useAuth();

  if (!AuthUser) {
    return <Navigate to={"/login"} />;
  }

  if (IsOnboard === false) {
    return <Navigate to={"/Onboarding"} />;
  }

  return (
    <div>
      <Layout>
        <NavbarMemo />
        <Layout
          style={{
            height: "calc(100vh - 40px)",
            backgroundColor: "white",
            overflow: "hidden",
          }}
        >
          <Content
            style={{
              overflow: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default UserLayoutRoute;
