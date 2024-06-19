import { Dropdown, Avatar, MenuProps } from "antd";
import { EllipsisOutlined, SmileOutlined } from "@ant-design/icons";

import dayjs from "dayjs";

type NotiListProps = {
  who?: string;
  image: string;
  time: string;
  target: string;
  action: string;
  SubDropdownOpen?: boolean;
  setSubDropdownOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const items: MenuProps["items"] = [
  {
    label: "Mark as read",
    key: "Mark as read",
  },
  {
    danger: true,
    label: "Remove",
    key: "Remove",
  },
];

function NotificationListComponent({
  who,
  image,
  time,
  target,
  action,
}: NotiListProps) {
  const empty = who === "nothing to show";

  return (
    <div className="tw-w-[270px] tw-flex tw-flex-col tw-my-1">
      <div className="tw-w-full tw-flex tw-justify-between">
        {!empty ? (
          <div className="tw-flex tw-flex-col ">
            <div className="tw-flex tw-gap-2">
              <div>
                <Avatar src={<img src={image} alt="avatar" />} />
              </div>
              <p className="tw-mb-0 tw-text-sm">{`${who} ${action} ${target}`}</p>
              <div className="tw-z-50">
                <Dropdown
                  menu={{
                    items,
                  }}
                  placement="bottomRight"
                >
                  <div className="tw-mr-2 hover:tw-bg-gray-300 tw-px-1 tw-py-1 tw-rounded-full tw-flex tw-items-center ">
                    <EllipsisOutlined />
                  </div>
                </Dropdown>
              </div>
            </div>
            <p className="tw-text-xs tw-ml-auto tw-text-gray-500">
              {dayjs(time).format("DD-MMM")}
            </p>
          </div>
        ) : (
          <div className="tw-flex tw-justify-center tw-mx-auto tw-my-4 ">
            <div className="tw-flex tw-flex-col tw-items-center tw-opacity-700">
              <SmileOutlined style={{ fontSize: 20 }} />
              <p>Nothing to show</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationListComponent;
