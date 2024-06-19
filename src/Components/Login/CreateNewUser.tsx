import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";

function CreateNewUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const createNewAccount = async () => {
    await axios
      .put(`${import.meta.env.VITE_AUTH_API_URL}/newuser`, {
        id,
      })
      .then(() => {
        navigate("/login");
      });
  };

  useEffect(() => {
    createNewAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tw-w-screen tw-h-screen tw-flex tw-gap-5 tw-justify-center tw-items-center tw-flex-col">
      <LoadingOutlined style={{ fontSize: 60 }} />
      Loading..
    </div>
  );
}

export default CreateNewUser;
