import { Button, InputNumber, Modal, Space } from "antd";
import React, { useState, useContext } from "react";
import { useAuth } from "../../../Context/Auth/AuthContext";
import { userDataContext } from "../../../Pages/Admin/User/Show_user/[id]/UserData";

const AddPointsModal = React.memo(() => {
  const [Loading, setLoading] = useState(false);
  const [Points, setPoints] = useState(0);
  const { Axios, notificationApi } = useAuth();
  const { PointsModalOpen, setPointsModalOpen, userData, refetchUserData } =
    useContext(userDataContext);
  const onFinish = async (amount: number) => {
    console.log(amount);
    setLoading(true);
    await Axios.post(`/user/${userData?.id}/addpoints/`, {
      amount,
    })
      .then(() => {
        setLoading(false);
        onCancel();
        notificationApi.success({
          message: "Points added",
        });
        refetchUserData();
      })
      .catch(() => {
        setLoading(false);
        refetchUserData();
      });
  };

  const onCancel = () => {
    setPointsModalOpen(false);
  };

  return (
    <Modal
      open={PointsModalOpen}
      footer={null}
      title="Add points"
      onCancel={onCancel}
    >
      <Space.Compact block>
        <InputNumber
          value={Points}
          onChange={(e) => {
            setPoints((e && e) || 0);
          }}
          style={{ width: "100%" }}
          placeholder="Add Points"
          min={0}
        />
        <Button
          type="primary"
          htmlType="submit"
          loading={Loading}
          onClick={() => {
            onFinish(Points);
          }}
        >
          Add
        </Button>
      </Space.Compact>
    </Modal>
  );
});

export default AddPointsModal;
