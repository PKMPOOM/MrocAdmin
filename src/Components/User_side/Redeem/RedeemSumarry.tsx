import {
  Typography,
  Checkbox,
  Button,
  Divider,
  Form,
  Input,
  Badge,
} from "antd";
import { useAuth } from "../../../Context/Auth/AuthContext";
import { useRedeemStore } from "../../../Store/useRedeemStore";
import { CSSProperties, useEffect, useState } from "react";
import { countriesTelCodelist } from "../../../Constant/CountryCode";
import { EditOutlined } from "@ant-design/icons";

const { Title, Text, Link } = Typography;

function RedeemSumarry() {
  const { AuthUser } = useAuth();
  const [Agreement, setAgreement] = useState(false);
  const [Editing, setEditing] = useState(false);
  const [
    activeRedeemCard,
    selectedCharity,
    pointUsed,
    giftCardValue,
    cellularNumber,
    cellularCode,
    activeUserData,
    setActiveUserData,
  ] = useRedeemStore((state) => [
    state.activeRedeemCard,
    state.selectedCharity,
    state.pointUsed,
    state.giftCardValue,
    state.cellularNumber,
    state.cellularCode,
    state.activeUserData,
    state.setActiveUserData,
  ]);

  const selectedCountry = countriesTelCodelist.filter(
    (item) => item.code === cellularCode?.split(".")[1]
  );

  useEffect(() => {
    setActiveUserData({
      firstName: AuthUser?.fist_name,
      lastName: AuthUser?.last_name,
      MailingAddress: AuthUser?.email,
      cityTown: "city town from API",
      phoneNumber: "phoneNumber from API",
      postalCode: "postalCode from API",
    });
  }, []);

  const [form] = Form.useForm();

  const onEdit = () => {
    setEditing(true);
    form.setFieldsValue({
      first_name: activeUserData.firstName,
      last_name: activeUserData.lastName,
      email: activeUserData.MailingAddress,
      city_town: activeUserData.cityTown,
      phone_number: activeUserData.phoneNumber,
      postal_code: activeUserData.postalCode,
    });
  };

  const onCancelEdit = () => {
    setEditing(false);
    form.setFieldsValue({
      first_name: AuthUser?.fist_name,
      last_name: AuthUser?.last_name,
      email: AuthUser?.email,
      city_town: "city town",
      phone_number: "1234567",
      postal_code: "postal code",
    });
  };

  const onSaveEdit = () => {
    setActiveUserData({
      firstName: firstNameRef,
      lastName: lastNameRef,
      MailingAddress: emailRef,
      cityTown: cityTownRef,
      phoneNumber: phoneNumberRef,
      postalCode: PostalCodeRef,
    });
    setEditing(false);
  };

  const firstNameRef = Form.useWatch("first_name", form);
  const lastNameRef = Form.useWatch("last_name", form);
  const emailRef = Form.useWatch("email", form);
  const cityTownRef = Form.useWatch("city_town", form);
  const phoneNumberRef = Form.useWatch("phone_number", form);
  const PostalCodeRef = Form.useWatch("postal_code", form);

  const formItemStyle: CSSProperties = {
    marginBottom: 8,
  };

  return (
    <div className="tw-w-2/5 tw-outline tw-flex tw-flex-col tw-outline-1 tw-outline-[#dfdfdf] tw-rounded-lg tw-h-[70vh] tw-p-4">
      <div className="tw-flex tw-gap-2 tw-justify-between">
        <Title level={4}>Profile information</Title>
        <Button disabled={Editing} onClick={onEdit} icon={<EditOutlined />}>
          Edit
        </Button>
      </div>

      <div className="tw-flex tw-grow tw-flex-col tw-gap-2 tw-mt-4">
        {/* editing */}
        {Editing && (
          <div className="tw-w-full tw-justify-start ">
            <Form
              form={form}
              labelCol={{
                span: 8,
                style: { justifyContent: "start", display: "flex" },
              }}
              wrapperCol={{ flex: "auto" }}
              layout="horizontal"
              // onFinish={onSaveEdit}
            >
              <Form.Item
                style={formItemStyle}
                name={"first_name"}
                label={"First name"}
              >
                <Input />
              </Form.Item>
              <Form.Item
                style={formItemStyle}
                name={"last_name"}
                label={"Last name"}
              >
                <Input />
              </Form.Item>
              <Form.Item style={formItemStyle} name={"email"} label={"Email"}>
                <Input />
              </Form.Item>
              <Form.Item
                style={formItemStyle}
                name={"city_town"}
                label={"City/Town"}
              >
                <Input />
              </Form.Item>
              <Form.Item
                style={formItemStyle}
                name={"phone_number"}
                label={"Phone number"}
              >
                <Input />
              </Form.Item>
              <Form.Item
                style={formItemStyle}
                name={"postal_code"}
                label={"Postal code"}
              >
                <Input />
              </Form.Item>
              <div className="tw-flex tw-gap-2 tw-justify-end">
                <Button onClick={onCancelEdit}>Cancel</Button>
                <Button
                  type="primary"
                  onClick={() => {
                    onSaveEdit();
                  }}
                >
                  Save
                </Button>
              </div>
            </Form>
          </div>
        )}

        {/* Displaying */}
        {!Editing && (
          <div>
            <div className="tw-flex tw-justify-between">
              <Text>First name</Text>
              <Text>{activeUserData?.firstName}</Text>
            </div>
            <div className="tw-flex tw-justify-between">
              <Text>Last name</Text>
              <Text>{activeUserData?.lastName}</Text>
            </div>
            <div className="tw-flex tw-justify-between">
              <Text>Email</Text>
              <Text>{activeUserData?.MailingAddress}</Text>
            </div>
            <div className="tw-flex tw-justify-between">
              <Text>City/Town</Text>
              <Text>{activeUserData?.cityTown}</Text>
            </div>
            <div className="tw-flex tw-justify-between">
              <Text>Phone number</Text>
              <Text>{activeUserData?.phoneNumber}</Text>
            </div>
            <div className="tw-flex tw-justify-between">
              <Text>Postal code</Text>
              <Text>{activeUserData?.postalCode}</Text>
            </div>

            <Divider />
          </div>
        )}

        <div className="tw-flex tw-justify-between">
          <Text>Selected Rewards</Text>
          <Text>{activeRedeemCard}</Text>
        </div>

        {/* conditional render */}
        {activeRedeemCard === "Gift card" && (
          <>
            <div className="tw-flex tw-justify-between">
              <Text>Gift card value</Text>
              <Text>$ {giftCardValue}</Text>
            </div>
            <div className="tw-flex tw-justify-between">
              <Text>Points used</Text>
              <Text>{pointUsed && pointUsed}</Text>
            </div>
          </>
        )}
        {activeRedeemCard === "Donate to charity" && (
          <>
            <div className="tw-flex tw-justify-between">
              <Text>Selected charity</Text>
              <Text>
                {selectedCharity?.map((items) => (
                  <div key={items.id}>
                    <Badge status="processing" text={items.name} />
                  </div>
                ))}
              </Text>
            </div>
            <div className="tw-flex tw-justify-between">
              <Text>Points used</Text>
              <Text>{pointUsed || 0}</Text>
            </div>
          </>
        )}

        {activeRedeemCard === "E-transfer" && (
          <>
            <div className="tw-flex tw-justify-between">
              <Text>Cellular number</Text>
              <Text>
                {`${cellularCode ? cellularCode.split(".")[0] : "-"}
                ${cellularNumber ? cellularNumber : "-"}`}
              </Text>
            </div>
            <div className="tw-flex tw-justify-between">
              <Text>Cellular phone country</Text>
              <Text>
                {selectedCountry.length > 0 ? selectedCountry[0]?.name : "-"}
              </Text>
            </div>
          </>
        )}
      </div>

      <div className="tw-flex tw-flex-col tw-gap-4">
        <div className="tw-flex tw-justify-center tw-pb-5"></div>
        <div className="tw-flex tw-gap-3 tw-items-start">
          <Checkbox
            onChange={(e) => setAgreement(e.target.checked)}
            style={{ display: "flex", alignItems: "start" }}
          />
          <Text className="">
            By submitting, you have read and accept our purposes for use of your
            data under our
            <Link
              href="https://www.google.co.th/"
              target="_blank"
            >{` Terms and conditions`}</Link>
          </Text>
        </div>

        <Button disabled={!Agreement} type="primary" htmlType="submit">
          Submit redeem request
        </Button>
      </div>
    </div>
  );
}

export default RedeemSumarry;
