import { Select, Form, Typography, InputNumber, SelectProps } from "antd";
import { useRedeemStore } from "../../../Store/useRedeemStore";
import { useAuth } from "../../../Context/Auth/AuthContext";
import { Link } from "react-router-dom";
import { LinkOutlined } from "@ant-design/icons";
const { Title } = Typography;

const options: SelectProps["options"] = [];

for (let i = 0; i < 100; i++) {
  const value = `Charity ${i}`;
  options.push({
    label: value,
    value,
    disabled: i === 10,
  });
}

type CharitySelectProps = {
  charityList: SelectProps["options"];
};

function CharitySelect({ charityList }: CharitySelectProps) {
  const [
    activeRedeemCard,
    SetSelectedCharity,
    selectedCharity,
    AddPointsToCharity,
    UpdatecharityPointsUsed,
  ] = useRedeemStore((state) => [
    state.activeRedeemCard,
    state.SetSelectedCharity,
    state.selectedCharity,
    state.AddPointsToCharity,
    state.UpdatecharityPointsUsed,
  ]);

  const { AuthUser } = useAuth();

  const onchange = (event: string[]) => {
    const selectedList = charityList
      ?.filter((list) =>
        event.some((current) => current.includes(list.value as string))
      )
      .map((item) => ({
        id: item.value as string,
        name: item.label as string,
        points: 0,
      }));

    SetSelectedCharity(selectedList);
    UpdatecharityPointsUsed();
  };

  return (
    <div className="tw-w-full tw-p-4 tw-rounded-lg tw-outline tw-outline-1 tw-outline-[#dfdfdf]">
      <Title level={5}>
        Please select the charity you would like to donate your points to
      </Title>
      <div className="tw-flex tw-gap-4 tw-mb-4">
        <Form.Item
          name="Select_charity"
          rules={[
            {
              required: activeRedeemCard === "Donate to charity",
            },
          ]}
          style={{ marginBottom: 0, width: "100%", marginTop: "24px" }}
          label="Select charity"
        >
          <Select
            onChange={onchange}
            options={charityList ? charityList : undefined}
            mode="multiple"
          />
        </Form.Item>
      </div>
      <div className="tw-grid tw-grid-cols-1 tw-gap-2 xl:tw-grid-cols-2 2xl:tw-grid-cols-3 ">
        {selectedCharity?.map((item) => (
          <div
            key={item.id}
            className="tw-transition-all tw-duration-150 tw-rounded-md tw-border tw-border-slate-200 tw-p-2 tw-border-solid tw-flex hover:tw-bg-blue-50/50 "
          >
            <Form.Item
              name={item.id}
              label={
                <div className="tw-flex tw-gap-2 tw-items-baseline ">
                  <span className="tw-text-lg">{item.name}</span>
                  <Link
                    target="_blank"
                    rel="noreferer"
                    to={`/charity/${item.id}`}
                  >
                    <div className="tw-group tw-flex tw-gap-1 tw-overflow-hidden">
                      <LinkOutlined />
                      <div className="group-hover:tw-translate-y-0 tw-translate-y-1 tw-opacity-0 group-hover:tw-opacity-100 tw-overflow-hidden tw-transition-all tw-duration-150 ">
                        Details
                      </div>
                    </div>
                  </Link>
                </div>
              }
              style={{
                marginBottom: "0px",
                width: "100%",
              }}
              validateTrigger="onBlur"
              preserve={false}
              rules={[
                {
                  required: activeRedeemCard === "Donate to charity",
                  message: "Donation points cannot be blank",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue(item.id) > 100) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Minimum 100 points"));
                  },
                }),
              ]}
            >
              <InputNumber
                suffix={"points"}
                max={AuthUser?.points}
                style={{ width: "100%" }}
                onChange={(e) => {
                  AddPointsToCharity(item.name, e as number);
                  UpdatecharityPointsUsed();
                }}
              />
            </Form.Item>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharitySelect;
