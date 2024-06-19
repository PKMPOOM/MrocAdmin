import type { MenuProps } from "antd";
import { Badge, Dropdown } from "antd";
import { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa6";
import useSWR from "swr";
import { NotificationQueryResponse } from "../../../Interface/User/UserDashboardTypes";
import NotificationListComponent from "./NotificationListComponent";

function BellNotification() {
  const [Items, setItems] = useState<MenuProps["items"]>(undefined);
  const [SubDropdownOpen, setSubDropdownOpen] = useState(false);

  const { data, isLoading } = useSWR<NotificationQueryResponse[]>(
    "https://64ace59b9edb4181202fec6b.mockapi.io/Noti_list"
  );

  useEffect(() => {
    const newData = data?.map(
      ({ action, dateTime, id, image, target, who }, index) => {
        return {
          key: index.toString(),
          label: (
            <NotificationListComponent
              who={who}
              action={action}
              target={target}
              time={dateTime}
              image={image}
              key={id}
              SubDropdownOpen={SubDropdownOpen}
              setSubDropdownOpen={setSubDropdownOpen}
            />
          ),
        };
      }
    );
    setItems(newData);
  }, []);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log(e);
  };

  const empty: MenuProps["items"] | undefined = [
    {
      key: "0",
      disabled: true,
      label: (
        <NotificationListComponent
          who={"nothing to show"}
          action={"nothing to show"}
          target={"nothing to show"}
          time={"nothing to show"}
          image={"nothing to show"}
          key={"none"}
        />
      ),
    },
  ];

  return (
    <Dropdown
      trigger={["click"]}
      menu={{
        onClick: handleMenuClick,
        items: Items && Items?.length > 0 ? Items : empty,
        style: { width: "300px", overflowY: "auto", maxHeight: "600px" },
      }}
      placement="bottom"
    >
      <div className="tw-cursor-pointer hover:tw-bg-gray-100 tw-flex tw-p-1 tw-rounded-full">
        <Badge size="small" count={!isLoading ? Items && Items.length : 0}>
          <FaRegBell size={17} />
        </Badge>
      </div>
    </Dropdown>
  );
}

export default BellNotification;
