import React, { useState, createContext } from "react";
import { Button, Checkbox, Modal, Space, Steps, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import Modal_Templatepage from "./Modal_Templatepage";
const { Title, Paragraph } = Typography;

interface NewSurveyContextType {
  ActiveCard: string;
  setActiveCard: React.Dispatch<React.SetStateAction<string>>;
}
export const NewSurveyContext = createContext<NewSurveyContextType>(
  {} as NewSurveyContextType
);

function QuestionPage() {
  return (
    <>
      <div className="tw-flex tw-flex-row tw-gap-8 tw-mt-6">
        <div className="tw-max-w-sm">
          {/* <SurveyCard padding={"24px"} label={activeCard} /> */}
          <Title className="tw-mt-5" level={5}>
            Template detail & description{" "}
          </Title>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            mattis eros sit amet mi tempus,
          </Paragraph>
        </div>
        <div>
          <Title level={5}>Select question</Title>
          <Space className="mt-5" direction="vertical" size={"middle"}>
            <Checkbox defaultChecked={true}>Question 1</Checkbox>
            <Checkbox defaultChecked={true}>Question 2</Checkbox>
            <Checkbox defaultChecked={true}>Question 3</Checkbox>
            <Checkbox defaultChecked={true}>Question 4</Checkbox>
            <Checkbox defaultChecked={true}>Question 5</Checkbox>
            <Checkbox defaultChecked={true}>Question 6</Checkbox>
            <Checkbox defaultChecked={true}>Question 7</Checkbox>
            <Checkbox defaultChecked={true}>Question 8</Checkbox>
            <Checkbox defaultChecked={true}>Question 9</Checkbox>
            <Checkbox defaultChecked={true}>Question 10</Checkbox>
          </Space>
        </div>
      </div>
    </>
  );
}

const steps = [
  {
    title: "Choose Template",
    description: "adsfasdfasdf",
    content: <Modal_Templatepage />,
  },
  {
    title: "Select Questions",
    content: <QuestionPage />,
  },
];

const items = steps.map((item) => ({
  key: item.title,
  title: item.title,
}));

interface props {
  IsOpen: boolean;
  setIsopen: React.Dispatch<React.SetStateAction<boolean>>;
}
function CreateNewSurvey({ IsOpen, setIsopen }: props) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [ActiveCard, setActiveCard] = useState("");

  const value = {
    ActiveCard,
    setActiveCard,
  };

  const next = () => {
    setCurrent((prev) => prev + 1);
  };
  const prev = () => {
    setCurrent((prev) => prev - 1);
  };

  return (
    <NewSurveyContext.Provider value={value}>
      <Modal
        width={1000}
        footer={[
          <>
            <Button style={{ float: "left" }}> cancel </Button>

            {current > 0 ? (
              <Button
                onClick={() => {
                  prev();
                }}
              >
                Back
              </Button>
            ) : null}

            {current < 1 && ActiveCard !== "Create New Survey From Scratch" ? (
              <Button
                disabled={ActiveCard === ""}
                onClick={() => {
                  next();
                }}
                type="primary"
              >
                next
              </Button>
            ) : null}

            {ActiveCard === "Create New Survey From Scratch" ? (
              <Button
                onClick={() => {
                  navigate("/admin/Quantitative/Survey/Newsurvey?tab=detail");
                }}
                type="primary"
              >
                Create New Survey
              </Button>
            ) : null}
          </>,
        ]}
        onCancel={() => {
          setIsopen(false);
        }}
        open={IsOpen}
        title="Create New Survey"
      >
        <Steps current={current} items={items} />
        <div>{steps[current].content}</div>
      </Modal>
    </NewSurveyContext.Provider>
  );
}

export default CreateNewSurvey;
