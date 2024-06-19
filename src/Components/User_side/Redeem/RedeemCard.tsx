import { ReactNode } from "react";
import { useRedeemStore } from "../../../Store/useRedeemStore";
import { theme, Radio, Form, Typography } from "antd";
import type { Reward } from "../../../Pages/Admin/EngagementTools/RewardSettings/RewardSettings";
const { useToken } = theme;
const { Title } = Typography;

type RedeemCardProps = {
  icon: ReactNode;
  label: "Gift card" | "Cheque" | "Donate to charity" | "E-transfer" | "Paypal";
  type: "basic" | "radio";
  marketplaceItems?: Reward[];
};

function RedeemCard({ label, type, marketplaceItems }: RedeemCardProps) {
  const { token } = useToken();
  const [
    ActiveRedeemCard,
    SetActiveRedeemCard,
    SetPointUsed,
    SetGiftCardValue,
  ] = useRedeemStore((state) => [
    state.activeRedeemCard,
    state.SetActiveRedeemCard,
    state.SetPointUsed,
    state.SetGiftCardValue,
  ]);

  const isActiveCard = ActiveRedeemCard === label;

  return (
    <div
      style={{
        flex: "1",
        flexDirection: "column",
        padding: "1rem",
        outline: "1px solid",
        borderRadius: "0.5rem",
        alignItems: "flex-start",
        gap: "0.75rem",
        width: "100%",
        transition: "all 150ms",
        cursor: "pointer",
        outlineColor: isActiveCard ? token.colorPrimary : "#dfdfdf",
      }}
      onClick={() => {
        SetActiveRedeemCard(label);
      }}
    >
      <div className="tw-flex tw-gap-2 tw-items-center">
        <Title
          level={5}
          style={{
            marginBottom: 0,
            color: isActiveCard ? token.colorPrimary : token.colorText,
          }}
        >
          {label}
        </Title>
      </div>
      {type === "radio" ? (
        <>
          {/* <Form disabled={!isActiveCard}> */}
          <Form.Item
            name={"Gift_card"}
            rules={[
              {
                required: ActiveRedeemCard === "Gift card",
                message: "Please select gift card value",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Radio.Group
              style={{
                // backgroundColor: "red",
                width: "100%",
              }}
              disabled={ActiveRedeemCard !== "Gift card"}
              onChange={(e) => {
                SetPointUsed(e.target.value);
                SetGiftCardValue(e.target.value / 10);
              }}
            >
              <div className="tw-flex tw-flex-col tw-gap-2 tw-w-full">
                {marketplaceItems?.map((giftcard) => (
                  <Radio
                    key={giftcard.id}
                    value={giftcard.value}
                    style={{
                      width: "100%",
                      display: "flex",
                    }}
                  >
                    <div className="tw-flex tw-flex-col lg:tw-flex-row tw-justify-between tw-items-center tw-gap-4 ">
                      <div className="tw-flex tw-gap-2 tw-items-center">
                        {giftcard.icon && (
                          <img
                            src={giftcard.icon}
                            alt=""
                            style={{
                              aspectRatio: "1/1",
                              width: "35px",
                            }}
                          />
                        )}

                        <span>{`${giftcard.name}`}</span>
                      </div>
                      <span>({`${giftcard.value} points`}) </span>
                    </div>
                  </Radio>
                ))}
              </div>
            </Radio.Group>
          </Form.Item>
          {/* </Form> */}
        </>
      ) : null}
    </div>
  );
}

export default RedeemCard;
