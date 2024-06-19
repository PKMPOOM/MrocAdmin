import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Divider, Dropdown, Space, Tag } from "antd";
import { memo, useEffect, useState } from "react";
import { FaBuildingUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../../Context/Auth/AuthContext";
import { useThemeContext } from "../../../Context/Theme/ApplicationProvider";
import BellNotification from "./BellNotification";
import { ItemType } from "antd/es/menu/interface";

const isOnClientSide = window.location.pathname.includes("/admin");

const initMenu: MenuProps["items"] = [
  {
    icon: <FaBuildingUser />,
    key: isOnClientSide ? "To user" : "To client",
    label: isOnClientSide ? "User dashboard" : "Admin console",
  },
  {
    type: "divider",
  },
  {
    key: "Profile",
    label: "Profile",
    disabled: true,
  },
  {
    key: "Redeem",
    label: <Link to="redeem">Redeem</Link>,
  },
  {
    type: "divider",
  },

  {
    key: "Sign out",
    danger: true,
    label: "Sign out",
  },
];

const Navbar = () => {
  const { AuthUser, signOut } = useAuth();
  const { token } = useThemeContext();
  const [SideMenuList, setSideMenuList] = useState<MenuProps["items"]>();

  const { data } = useSWR<any[]>("/app/menu-list");

  useEffect(() => {
    if (data) {
      const formattedMenu = data?.map((item) => ({
        key: `${uuidv4()}||content/${item.blogId}`,
        label: <Link to={`/content/${item.blogId}`}>{item.title}</Link>,
      }));

      const newGroupMenu: ItemType = {
        key: "site content",
        label: "Site Content",
        type: "group",
        children: formattedMenu,
      };

      const newstate = [...initMenu];

      newstate.splice(
        1,
        0,
        {
          type: "divider",
        },
        newGroupMenu
      );

      setSideMenuList(newstate);
    }
  }, [data]);

  const filteredItems = SideMenuList?.filter((_item, index) => {
    // only admin priv can see admin console menu
    if (index < 2 && AuthUser && AuthUser.role !== "admin") {
      return false;
    }
    return true;
  });

  const onDropDownClick = ({ key }: { key: string }) => {
    switch (key) {
      // general menu list interaction
      case "Sign out":
        signOut();
        break;
      case "To client":
        window.location.href = "/admin/Dashboard";
        break;
      case "To user":
        window.location.href = "/";
        break;
      default:
        console.log("error fallback");
        break;
    }
  };

  return (
    <div
      style={{
        backgroundColor: token.colorBgLayout,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
      className="tw-flex tw-flex-row tw-justify-between tw-px-4 tw-py-1 tw-h-[40px] tw-items-center  "
    >
      <div>
        <a href="/">
          <p style={{ color: token.colorTextHeading }} className="tw-mb-0">
            Insightrix Communities
          </p>
        </a>
      </div>

      <div className="tw-flex tw-items-center ">
        {AuthUser?.role === "admin" && (
          <>
            <Tag bordered={false} color="processing">
              {AuthUser?.role.toUpperCase()}
            </Tag>
            <Divider type="vertical" />
          </>
        )}

        <div className="tw-flex tw-gap-2 tw-items-center ">
          <p style={{ color: token.colorTextDescription, marginBottom: 0 }}>
            Points
          </p>
          <p
            style={{
              color: token.colorTextHeading,
              marginBottom: 0,
              fontWeight: 600,
            }}
          >
            {AuthUser?.points}
          </p>
        </div>

        <Divider type="vertical" />

        <BellNotification />

        <Divider type="vertical" />

        <Dropdown
          overlayStyle={{
            minWidth: "150px",
          }}
          className="tw-cursor-pointer"
          menu={{ items: filteredItems, onClick: onDropDownClick }}
        >
          <Space>
            <p style={{ color: token.colorText, marginBottom: 0 }}>
              {AuthUser?.user_name}
            </p>
            <DownOutlined />
          </Space>
        </Dropdown>
      </div>
    </div>
  );
};

export const NavbarMemo = memo(Navbar);
