import { Button, Input, Modal } from "antd";
import React, { useContext, useState } from "react";
import { useAuth } from "../../Context/Auth/AuthContext";
import { inviteEmailList } from "../../Constant/email";
import { ExternalInvitationContext } from "../../Pages/Admin/User/Invite_user/External/Invite_External_Community";
import { FaCopy } from "react-icons/fa6";
import { useThemeContext } from "../../Context/Theme/ApplicationProvider";

const Modal_View_External_Invite_List = React.memo(() => {
  const { Axios } = useAuth();
  const {
    ViewListModalOpen,
    setViewListModalOpen,
    ActiveHistoryData,
    setActiveHistoryData,
  } = useContext(ExternalInvitationContext);
  const [SearchKey, setSearchKey] = useState("");
  const [CoppyText, setCoppyText] = useState("");
  const [Loading, setLoading] = useState(false);
  const { token } = useThemeContext();

  const filteredData = inviteEmailList.filter((item) => {
    return SearchKey === ""
      ? item
      : Object.entries(item).some((value) =>
          value
            .toString()
            .toLocaleLowerCase()
            .includes(SearchKey.toLocaleLowerCase())
        );
  });

  const onCopy = async (event: string) => {
    navigator.clipboard.writeText(event);
    setCoppyText(event);
    setTimeout(() => {
      setCoppyText("");
    }, 2000);
  };

  const PostData = inviteEmailList
    .filter((item) => item.status === "Success")
    .map((item) => item.email);

  const inviteUser = async () => {
    setLoading(true);
    await Axios.post("/invitelist", {
      inviteID: ActiveHistoryData?.id,
      userList: PostData,
    })
      .then(() => {
        setLoading(false);
        setViewListModalOpen(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      width={"700px"}
      onCancel={() => {
        setViewListModalOpen(false);
        setActiveHistoryData(undefined);
      }}
      open={ViewListModalOpen}
      footer={null}
      title="name: user list"
    >
      <Input.Search
        value={SearchKey}
        onChange={(e) => {
          setSearchKey(e.target.value);
        }}
        placeholder="Seach"
      />
      <div className="tw-mt-4 tw-max-h-[700px] tw-min-h-[700px] tw-overflow-auto">
        {filteredData.map((item) => (
          <div
            className="tw-group tw-flex tw-justify-between tw-pr-4 hover:tw-bg-blue-50 tw-rounded-sm tw-transition-all tw-duration-75"
            style={{
              color:
                item.status === "Invalid email"
                  ? token.colorErrorText
                  : item.status === "Existing user"
                  ? token.colorWarningText
                  : token.colorText,
            }}
          >
            <p className="tw-text-sm tw-rounded ">{item.email}</p>
            <div
              onClick={() => {
                onCopy(item.email);
              }}
              className="tw-hidden group-hover:tw-flex tw-cursor-pointer tw-justify-end tw-items-center tw-gap-2 tw-w-[100px]"
            >
              <p className="tw-text-sm">
                {CoppyText === item.email && "coppied"}
              </p>
              <FaCopy />
            </div>
          </div>
        ))}
      </div>
      <div className="tw-flex tw-gap-4 tw-mt-4">
        <div className="tw-flex tw-items-center tw-gap-2 ">
          <div
            onClick={() => {
              if (SearchKey === "Success") {
                setSearchKey("");
              } else {
                setSearchKey("Success");
              }
            }}
            className="tw-cursor-pointer tw-flex tw-gap-1 tw-items-center hover:tw-bg-black/10 tw-p-1 tw-rounded tw-transition-all tw-duration-150"
          >
            <div className="tw-w-4 tw-h-4 tw-bg-black tw-rounded-full" />
            Success
          </div>
        </div>
        <div className="tw-flex tw-items-center tw-gap-2 ">
          <div
            onClick={() => {
              if (SearchKey === "Invalid email") {
                setSearchKey("");
              } else {
                setSearchKey("Invalid email");
              }
            }}
            className="tw-cursor-pointer tw-flex tw-gap-1 tw-items-center hover:tw-bg-red-100 tw-p-1 tw-rounded tw-transition-all tw-duration-150"
          >
            <div className="tw-w-4 tw-h-4 tw-bg-red-500 tw-rounded-full" />
            Invalid email
          </div>
        </div>
        <div className="tw-flex tw-items-center tw-gap-1 ">
          <div
            onClick={() => {
              if (SearchKey === "Existing user") {
                setSearchKey("");
              } else {
                setSearchKey("Existing user");
              }
            }}
            className="tw-cursor-pointer tw-flex tw-gap-2 tw-items-center hover:tw-bg-orange-100 tw-p-1 tw-rounded tw-transition-all tw-duration-150"
          >
            <div className="tw-w-4 tw-h-4 tw-bg-orange-400 tw-rounded-full" />
            Existing user
          </div>
        </div>
      </div>
      <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
        <Button style={{ marginRight: "auto" }}>Revalidate Data</Button>
        <Button
          onClick={() => {
            setViewListModalOpen(false);
          }}
          type="text"
        >
          Cancel
        </Button>

        <Button
          loading={Loading}
          onClick={inviteUser}
          htmlType="submit"
          type="primary"
        >
          Invite
        </Button>
      </div>
    </Modal>
  );
});

export default Modal_View_External_Invite_List;
