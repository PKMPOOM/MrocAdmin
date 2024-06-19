import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import { Suspense, memo, useRef, useState } from "react";
import {
  ImperativePanelHandle,
  PanelResizeHandle,
} from "react-resizable-panels";
import { Navigate, Outlet } from "react-router-dom";
import { NavbarMemo } from "../Components/Global/Navbar/Navbar";
import Sidemenu from "../Components/Global/Sidemenu";
import LoadingFallback from "../Components/Global/Suspense/LoadingFallback";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "../Components/ui/resizable";
import { useAuth } from "../Context/Auth/AuthContext";
import { useThemeContext } from "../Context/Theme/ApplicationProvider";
import { cn } from "../lib/utils";
import { GripVertical } from "lucide-react";
const { Sider, Content } = Layout;

const AdminLayoutRoute = () => {
  const { AuthUser, IsOnboard } = useAuth();
  const { token } = useThemeContext();
  const [collapse, setCollapse] = useState<boolean>(
    JSON.parse(localStorage.getItem("sideNav") || "null") || false
  );

  const ref = useRef<ImperativePanelHandle>(null);

  const setSideNavCollapse = (collapse: boolean) => {
    localStorage.setItem("sideNav", JSON.stringify(collapse));
    setCollapse(collapse);
  };

  if (!AuthUser) {
    return <Navigate to={"/login"} />;
  }

  if (IsOnboard === false) {
    return <Navigate to={"/onboarding"} />;
  }

  if (AuthUser.role !== "admin") {
    return <Navigate to={"/"} />;
  }

  const toggleCollapse = () => {
    const panelGroup = ref.current;
    if (panelGroup) {
      if (collapse) {
        setSideNavCollapse(false);
        panelGroup.resize(14.3);
      } else if (!collapse) {
        setSideNavCollapse(true);
        panelGroup.collapse();
      }
    }
  };

  const collpseSideNav = () => {
    const panelGroup = ref.current;
    if (panelGroup) {
      setSideNavCollapse(true);
      panelGroup.collapse();
    }
  };

  return (
    <Layout>
      <NavbarMemo />
      <Layout
        style={{
          height: "calc(100vh - 40px)",
          backgroundColor: "white",
          overflow: "hidden",
        }}
      >
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            ref={ref}
            defaultSize={collapse ? 0 : 14.3} // collapsed 0 will based on children size
            collapsedSize={0}
            collapsible={true}
            minSize={14.3}
            maxSize={50}
            onCollapse={() => {
              setSideNavCollapse(true);
            }}
            onExpand={() => {
              setSideNavCollapse(false);
            }}
            className={cn(`tw-relative ${collapse ? "" : "tw-min-w-[230px]"} `)}
            style={{
              overflow: "visible",
            }}
          >
            <Sider
              width="100%"
              collapsedWidth="50"
              collapsed={collapse}
              theme="light"
              style={{
                position: "relative",
              }}
            >
              <Sidemenu
                collpseSideNav={collpseSideNav}
                collapse={collapse}
                setSideNavCollapse={setSideNavCollapse}
              />
            </Sider>
          </ResizablePanel>
          <PanelResizeHandle
            style={{
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
            className="tw-relative tw-items-center tw-justify-start tw-z-50 "
          >
            <Button
              shape="circle"
              icon={
                collapse ? (
                  <RightOutlined style={{ fontSize: "10px" }} />
                ) : (
                  <LeftOutlined style={{ fontSize: "10px" }} />
                )
              }
              size="small"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: "16px",
                zIndex: 9999,
                left: "-12px",
              }}
              onClick={toggleCollapse}
            />
            <div
              style={{
                left: "-6px",
              }}
              className=" tw-absolute tw-z-10 tw-flex tw-top-1/2 tw-h-5 tw-w-3 tw-items-center tw-justify-center tw-rounded-sm tw-border tw-bg-border"
            >
              <GripVertical className="tw-h-2.5 tw-w-2.5" />
            </div>
          </PanelResizeHandle>
          <ResizablePanel
            className={cn(`tw-relative tw-z-40`)}
            style={{
              overflow: "visible",
            }}
          >
            <Content
              style={{
                padding: "24px 0px 0px 0px",
                overflow: "auto",
                backgroundColor: token.colorBgElevated,
              }}
            >
              <Suspense fallback={<LoadingFallback />}>
                <Outlet />
              </Suspense>
            </Content>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Layout>
    </Layout>
  );
};

export const AdminLayoutRouteMemo = memo(AdminLayoutRoute);

export default AdminLayoutRoute;
