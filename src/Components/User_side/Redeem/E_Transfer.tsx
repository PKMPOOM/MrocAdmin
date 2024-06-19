import { Select, Form, Typography, Space, Input } from "antd";
import { countriesTelCodelist } from "../../../Constant/CountryCode";
import { useRedeemStore } from "../../../Store/useRedeemStore";
const { Title, Text } = Typography;

const newSelectOptions = countriesTelCodelist.map((country) => ({
  label: `+${country.phone}`,
  value: `+${country.phone}.${country.code}.${country.name}`,
}));

function E_Transfer() {
  const [SetCellularNumber, SetCellularCode] = useRedeemStore((state) => [
    state.SetCellularNumber,
    state.SetCellularCode,
  ]);

  return (
    <div className="tw-w-full tw-p-4 tw-rounded-lg tw-outline tw-outline-1 tw-outline-[#dfdfdf]">
      <Title style={{ marginBottom: 0 }} level={5}>
        Please provide your cellular number and select the correct area code
        below.
      </Title>
      <Text>
        Your E-Transfer will arrive by text message to the cellular number you
        provide within 5-7 business days.
      </Text>

      <Form.Item
        style={{
          marginBottom: 0,
          width: "100%",
          marginTop: "24px",
        }}
        label="Cellular number"
      >
        <Space.Compact style={{ width: "100%" }}>
          <Form.Item name={"code"} style={{ width: "20%" }}>
            <Select
              options={newSelectOptions}
              showSearch
              filterOption={(input, option) =>
                (option?.value ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(e) => {
                SetCellularCode(e);
              }}
            />
          </Form.Item>
          <Form.Item
            name={"number"}
            style={{ flex: "1 1 0%" }}
            rules={[
              {
                pattern: /^\d{4,}$/g,
                message: "only number is allowed",
              },
            ]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Cellular munber"
              autoComplete="tel-national"
              onChange={(e) => {
                SetCellularNumber(e.target.value);
              }}
            />
          </Form.Item>
        </Space.Compact>
      </Form.Item>
    </div>
  );
}

export default E_Transfer;
