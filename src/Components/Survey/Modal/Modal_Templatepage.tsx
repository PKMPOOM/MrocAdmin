import { Anchor, Col, Input, Typography } from "antd";
import TemplateCard from "./TemplateCard";
const { Title } = Typography;

function Modal_Templatepage() {
  return (
    <div className="tw-flex tw-gap-4 tw-mt-6">
      <Col flex={"250px"}>
        <Input.Search className="tw-mb-4" />
        <Anchor
          items={[
            {
              key: "part-1",
              href: "#part-1",
              title: "Customer Experiences",
            },
            {
              key: "part-2",
              href: "#part-2",
              title: "Human resources",
            },
          ]}
        />
      </Col>
      {/* list of template */}
      <Col flex={"auto"}>
        <div className="tw-flex tw-gap-10 tw-items-center tw-mb-4 ">
          <TemplateCard
            size={"Large"}
            label={"Create New Survey From Scratch"}
          />
        </div>
        <div className="tw-flex tw-flex-col tw-gap-4">
          <div id="part-1">
            <Title level={4}> Customer Experiences </Title>
            <div
              className="tw-flex tw-flex-row tw-flex-wrap tw-gap-4 tw-mt-4"
              id="#part-1"
            >
              {Array(5)
                .fill("Customer Experiences")
                .map((item, index) => (
                  <div key={index}>
                    <TemplateCard size={"Small"} label={`${item} ${index}`} />
                  </div>
                ))}
            </div>
          </div>
          <div id="part-2">
            <Title level={4}> Human Resources </Title>
            <div
              className="tw-flex tw-flex-row tw-flex-wrap tw-gap-4 tw-mt-4"
              id="#part-2"
            >
              {Array(5)
                .fill("Human Resources")
                .map((item, index) => (
                  <div key={index}>
                    <TemplateCard size={"Small"} label={`${item} ${index}`} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Col>
    </div>
  );
}

export default Modal_Templatepage;
