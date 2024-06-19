import { Avatar, Button, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import { useThemeContext } from "../../../Context/Theme/ApplicationProvider";
import { User } from "../../../Pages/Admin/User/Show_user/Show_user";
const { Text } = Typography;

export default function Listview({ data }: { data: User[] }) {
  const { token } = useThemeContext();

  return (
    <div className="tw-h-full tw-overflow-y-scroll tw-pb-10">
      {data.map((items, index) => (
        <div
          key={index}
          className="tw-flex tw-p-2 tw-items-center tw-justify-between hover:tw-bg-sky-50 tw-rounded-md tw-transition-all tw-duration-150"
        >
          <div className="tw-flex tw-flex-row tw-gap-4 tw-items-center ">
            <Avatar
              size={"large"}
              src={items.avatar && items.avatar}
              shape="circle"
              style={{
                border: "3px solid white",
                backgroundColor: token.colorPrimaryBg,
                color: token.colorPrimaryText,
                display: "flex",
                alignItems: "center",
              }}
            >
              <p>{!items.avatar && items.username.charAt(0).toUpperCase()}</p>
            </Avatar>

            <div className="tw-flex tw-flex-col">
              <div className="tw-flex tw-gap-4">
                <Text ellipsis={{ tooltip: items.username }}>
                  <strong>{items.username}</strong>
                </Text>
                {items.role === "admin" && (
                  <Tag bordered={false} color="blue">
                    Admin
                  </Tag>
                )}
              </div>
              <Text ellipsis={true}>{items.email}</Text>
            </div>
          </div>
          <div className="tw-mr-4 tw-flex tw-flex-row tw-gap-2 tw-items-center">
            {items.activate ? (
              <Tag color="green">Activated</Tag>
            ) : (
              <Tag color="red">Inactiveted</Tag>
            )}
            <Link to={`/admin/users/showuser/${items.id}`}>
              <Button type="link">View profile</Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
