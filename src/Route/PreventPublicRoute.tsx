import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/Auth/AuthContext";

const PreventPublicRoute = () => {
  const { AuthUser } = useAuth();

  return !AuthUser ? <Outlet /> : <Navigate to={"/admin/Dashboard"} />;
};

export default PreventPublicRoute;
