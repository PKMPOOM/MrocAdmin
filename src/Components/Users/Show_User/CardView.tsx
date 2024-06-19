import { Avatar, Button, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useThemeContext } from "../../../Context/Theme/ApplicationProvider";
import { User } from "../../../Pages/Admin/User/Show_user/Show_user";
const { Text } = Typography;

export default function Cardview({ data }: { data: User[] }) {
  const { token } = useThemeContext();
  return (
    <div style={{ height: "calc(100vh - 250px)" }}>
      <div className="tw-flex tw-flex-row tw-flex-wrap tw-gap-2 tw-overflow-y-scroll tw-px-1 tw-pt-1 tw-pb-6 tw-max-h-full">
        {data.map((items, index) => {
          return (
            <div
              key={index}
              style={{ outline: "1px solid #DEDEDF", height: "fit-content" }}
              className="tw-flex tw-flex-col tw-p-3 tw-rounded-lg "
            >
              <div className="tw-flex tw-flex-row tw-gap-2 tw-items-start ">
                <Avatar
                  size={50}
                  src={items.avatar && items.avatar}
                  shape="square"
                  style={{
                    border: "3px solid white",
                    backgroundColor: token.colorPrimaryBg,
                    color: token.colorPrimaryText,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p>
                    {!items.avatar && items.username.charAt(0).toUpperCase()}
                  </p>
                </Avatar>
                <div className="tw-flex tw-flex-col tw-w-[200px] tw-relative">
                  <div className="tw-flex tw-flex-row tw-items-center tw-w-full tw-justify-between">
                    <Text
                      style={{ marginRight: "8px" }}
                      ellipsis={{ tooltip: items.username }}
                    >
                      <strong>{items.username}</strong>
                    </Text>
                    {items.activate ? (
                      <Tag color="green">Active</Tag>
                    ) : (
                      <Tag color="red">Inactive</Tag>
                    )}
                  </div>
                  <Text style={{ width: "100%" }} ellipsis={true}>
                    {items.email}
                  </Text>
                  <Text style={{ width: "100%" }} ellipsis={true}>
                    {dayjs(items.created_at).format("DD-MMM-YYYY")}
                  </Text>
                </div>
              </div>
              <div className="tw-flex tw-justify-center">
                <Link to={`/admin/users/showuser/${items.id}`}>
                  <Button type="link">View profile</Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
