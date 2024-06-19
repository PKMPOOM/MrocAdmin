import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/Auth/AuthContext";
import { NavbarMemo } from "../Components/Global/Navbar/Navbar";
import { Layout } from "antd";
const { Content } = Layout;

const OnboardRoute = () => {
  const { AuthUser, IsOnboard } = useAuth();

  if (AuthUser && IsOnboard) {
    return <Navigate to={"/admin/Dashboard"} />;
  }

  return (
    <div>
      <Layout>
        <NavbarMemo />
        <Layout
          style={{
            backgroundColor: "white",
            overflow: "hidden",
            display: "flex",
          }}
        >
          <Content
            style={{
              height: "calc(100vh - 40px)",
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
};

export default OnboardRoute;
