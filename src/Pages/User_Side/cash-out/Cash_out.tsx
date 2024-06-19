import { Typography, Button, Row, Col, Form, SelectProps } from "antd";
import { Link } from "react-router-dom";
import RedeemCard from "../../../Components/User_side/Redeem/RedeemCard";
import { FaCreditCard } from "react-icons/fa6";
import { useRedeemStore } from "../../../Store/useRedeemStore";
import RedeemSumarry from "../../../Components/User_side/Redeem/RedeemSumarry";
import CharitySelect from "../../../Components/User_side/Redeem/CharitySelect";
import E_Transfer from "../../../Components/User_side/Redeem/E_Transfer";
import { LeftOutlined } from "@ant-design/icons";
import { useAuth } from "../../../Context/Auth/AuthContext";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Reward } from "../../Admin/EngagementTools/RewardSettings/RewardSettings";

const { Title, Text } = Typography;

function Cash_out() {
  const [
    activeRedeemCard,
    SetGiftCardValue,
    SetCellularNumber,
    SetCellularCode,
    SetPointUsed,
    SetSelectedCharity,
    selectedCharity,
    pointUsed,
    activeUserData,
    giftCardValue,
    cellularCode,
    cellularNumber,
  ] = useRedeemStore((state) => [
    state.activeRedeemCard,
    state.SetGiftCardValue,
    state.SetCellularNumber,
    state.SetCellularCode,
    state.SetPointUsed,
    state.SetSelectedCharity,
    state.selectedCharity,
    state.pointUsed,
    state.activeUserData,
    state.giftCardValue,
    state.cellularCode,
    state.cellularNumber,
  ]);
  const [form] = Form.useForm();
  const { AuthUser, Axios } = useAuth();

  const onSubmit = () => {
    const data = {
      // user data
      userData: activeUserData,
      // redeem data
      selectedRedeem: activeRedeemCard,
      pointsUsed: pointUsed,
      Select_charity: selectedCharity
        .filter((charity) => charity)
        .map((activeChar) => ({
          id: activeChar.id,
          name: activeChar.name,
          point: activeChar.points,
        })),
      giftCardValue: giftCardValue,
      callularnumber: cellularCode
        ? `${cellularCode?.split(".")[0]}${cellularNumber}`
        : undefined,
    };
    alert(JSON.stringify(data, null, 2));
  };

  const fetchGiftCard = async () => {
    const res = await Axios.get("/reward/list");
    return res.data;
  };

  const { data: giftCardList } = useQuery<Reward[]>({
    queryKey: ["marketplaceItems"],
    queryFn: fetchGiftCard,
    refetchOnWindowFocus: false,
  });

  const fetchcharities = async () => {
    const res = await Axios.get("/charity/select_list");
    return res.data;
  };

  const { data: charityData } = useQuery<SelectProps["options"]>({
    queryFn: fetchcharities,
    queryKey: ["charitySelectList"],
    refetchOnWindowFocus: false,
    enabled: activeRedeemCard === "Donate to charity",
  });

  function clearGiftCard() {
    form.setFieldsValue({ Gift_card: null });
    SetGiftCardValue(undefined);
  }

  function clearCharity() {
    SetSelectedCharity([]);
    form.setFieldsValue({
      Select_charity: [],
    });

    if (selectedCharity) {
      selectedCharity.map((item) => {
        const updatedValue: { [key: string]: any } = {};
        updatedValue[item.id] = null;

        form.setFieldsValue(updatedValue);
      });
    }
  }

  function clearCellular() {
    SetCellularNumber(undefined);
    SetCellularCode(undefined);
  }

  useEffect(() => {
    if (activeRedeemCard === "Gift card") {
      clearCharity();
      clearCellular();
    }
    if (activeRedeemCard === "Donate to charity") {
      clearGiftCard();
      clearCellular();
    }
    SetPointUsed(0);
  }, [activeRedeemCard, charityData]);

  return (
    <div className="tw-overflow-x-hidden tw-w-screen">
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        requiredMark="optional"
      >
        <div className="tw-px-40 tw-mt-5">
          <Link to={"/"}>
            <Button icon={<LeftOutlined />} type="link">
              Back
            </Button>
          </Link>
        </div>
        <div className="tw-flex tw-justify-center tw-gap-4 tw-pt-10 tw-px-40 ">
          <div className="tw-w-3/5 tw-flex tw-flex-col tw-gap-4">
            <div className="tw-outline tw-outline-1 tw-flex tw-items-end tw-gap-4 tw-outline-[#dfdfdf] tw-p-5 tw-rounded-lg">
              <Title style={{ marginBottom: 0 }} level={1}>
                {AuthUser?.points}
              </Title>
              <Text>Points in your account</Text>
            </div>
            <Row gutter={16}>
              <Col span={16}>
                <div className="tw-flex ">
                  <RedeemCard
                    icon={<FaCreditCard />}
                    label="Gift card"
                    type="radio"
                    marketplaceItems={(giftCardList && giftCardList) || []}
                  />
                </div>
              </Col>
              <Col span={8}>
                <div className="tw-flex tw-flex-col tw-gap-4">
                  <RedeemCard
                    icon={<FaCreditCard />}
                    label="Cheque"
                    type="basic"
                  />
                  <RedeemCard
                    icon={<FaCreditCard />}
                    label="Donate to charity"
                    type="basic"
                  />
                  <RedeemCard
                    icon={<FaCreditCard />}
                    label="E-transfer"
                    type="basic"
                  />
                  <RedeemCard
                    icon={<FaCreditCard />}
                    label="Paypal"
                    type="basic"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              {activeRedeemCard === "Donate to charity" && (
                <CharitySelect charityList={charityData} />
              )}
              {activeRedeemCard === "E-transfer" && <E_Transfer />}
            </Row>
          </div>
          <RedeemSumarry />
        </div>
      </Form>
    </div>
  );
}

export default Cash_out;
