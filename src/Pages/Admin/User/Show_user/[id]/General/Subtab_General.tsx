import dayjs from "dayjs";
import DescValue from "~/component/Global/Utils/DescValue";
import { useUserPageStore } from "~/store/useUserPageStore";

const Subtab_General = () => {
  const userData = useUserPageStore((state) => state.userData);
  return (
    <div className=" tw-flex tw-flex-col tw-gap-2">
      <DescValue keyValue="User ID" value={userData?.id} />
      <DescValue keyValue="User Name" value={userData?.username} />
      <DescValue keyValue="Email" value={userData?.email} />
      <DescValue keyValue="Points" value={userData?.points.toString()} />
      <DescValue
        keyValue="Createed Date"
        value={`${dayjs(userData?.created_at).format("DD MMM YYYY")}`}
      />

      <DescValue
        keyValue="Last login"
        value={`${dayjs(userData?.last_login).format("lll")}`}
      />
    </div>
  );
};

export default Subtab_General;
