import { useEffect } from "react";
import { ConfigProvider, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { sideMenuItems } from "../../Constant/SidemenuList";
import "../../App.css";

const Sidemenu = ({
  collapse,
  setSideNavCollapse,
  collpseSideNav: coaalpseSideNav,
}: {
  collapse: boolean;
  setSideNavCollapse: (collapse: boolean) => void;
  collpseSideNav: () => void;
}) => {
  const navigate = useNavigate();

  let path = "";
  let openKey = "";
  const { pathname } = window.location;

  switch (true) {
    case pathname === "/admin/Dashboard":
      path = "/Dashboard";
      break;
    case pathname.includes("/Survey"):
      path = "/Quantitative/Survey";
      break;
    case pathname.includes("/Samples"):
      path = "/Quantitative/Samples";
      break;
    case pathname.includes("/showuser"):
      path = "/users/showuser";
      break;
    case pathname.includes("config"):
      path = "/system/config";
      break;
    case pathname.includes("style"):
      path = "/system/style";
      break;
    case pathname.includes("SMS"):
      path = "/EngagementTools/SMS";
      break;
    case pathname.includes("Achievements"):
      path = "/EngagementTools/Achievements";
      break;
    case pathname.includes("Discussions"):
      path = "/Qualitative/Discussions";
      break;
    default:
      path = pathname.slice(6);
  }

  switch (true) {
    case pathname.includes("/Qualitative"):
      openKey = "/Qualitative";
      break;
    case pathname.includes("/Quantitative"):
      openKey = "/Quantitative";
      break;
    case pathname.includes("/EngagementTools"):
      openKey = "/EngagementTools";
      break;
    case pathname.includes("/users"):
      openKey = "/users";
      break;
    case pathname.includes("/system"):
      openKey = "/system";
      break;
    case pathname.includes("/expdata"):
      openKey = "/expdata";
      break;
  }

  const onClick = ({ key }: { key: string }) => {
    switch (key) {
      case "/Quantitative/Survey":
        navigate(`/admin${key}`);
        coaalpseSideNav();
        break;
      case "/touser":
        window.location.href = "/";
        break;
      default:
        navigate(`/admin${key}`);
        break;
    }
  };

  useEffect(() => {
    switch (true) {
      case window.location.pathname.includes("/Survey"):
        setSideNavCollapse(true);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tw-h-[96vh] tw-overflow-hidden hover:tw-overflow-y-auto">
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              subMenuItemBg: "#fff",
            },
          },
        }}
      >
        <Menu
          style={{
            height: "auto",
            width: collapse ? "50px" : "100%",
            paddingTop: "30px",
            borderInlineEnd: "none",
          }}
          theme="light"
          defaultSelectedKeys={[path]}
          defaultOpenKeys={collapse === false ? [openKey] : undefined}
          mode="inline"
          items={sideMenuItems}
          onClick={onClick}
        />
      </ConfigProvider>
    </div>
  );
};

export default Sidemenu;
