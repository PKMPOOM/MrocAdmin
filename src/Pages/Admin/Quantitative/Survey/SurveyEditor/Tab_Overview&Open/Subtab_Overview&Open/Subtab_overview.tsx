import { useState } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Card, DatePicker, Col, Row, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { EventValue } from "rc-picker/lib/interface";

const { Title } = Typography;

const options = {
  maintainAspectRatio: false,
  responsive: true,

  y: {
    min: 0,
    max: 1250,
    ticks: {
      stepSize: 250,
    },
  },
};

const { RangePicker } = DatePicker;
const fakedetail: {
  item: string;
  value: string;
}[] = [];
for (let i = 0; i < 8; i++) {
  fakedetail.push({
    item: "item",
    value: "value",
  });
}

function Subtab_overview() {
  const initrange = getMonthsBetweenDates(
    dayjs().startOf("year"),
    dayjs().endOf("year")
  );
  const [labels, setlabels] = useState(initrange);

  function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Social",
        data: labels && labels.map(() => getRandomNumber(0, 1000)),
        borderColor: "rgb(22, 119, 255)",
        backgroundColor: "rgba(22, 119, 255, 0.1)",
        tension: 0.1,
        fill: "start",
      },
      {
        label: "Email",
        data: labels && labels.map(() => getRandomNumber(0, 1000)),
        borderColor: "rgb(255, 22, 125)",
        backgroundColor: "rgba(255, 22, 125, 0.1)",
        tension: 0.1,
        fill: "start",
      },
    ],
  };

  function getMonthsBetweenDates(
    startdate: EventValue<Dayjs>,
    enddate: EventValue<Dayjs>
  ) {
    if (enddate && startdate) {
      const startDate = startdate;
      const endDate = enddate;
      const monthsDiff = endDate.diff(startDate, "month");
      const yearMonthArray = [];
      for (let i = 0; i <= monthsDiff; i++) {
        const yearMonthString = startDate.add(i, "month").format("YYYY-MMM");
        yearMonthArray.push(yearMonthString);
      }
      return yearMonthArray;
    } else return;
  }

  return (
    <div className="tw-flex tw-flex-col tw-gap-4 tw-pb-6">
      <Card>
        <div className="tw-flex tw-flex-col tw-gap-4">
          <div className="tw-flex tw-justify-center">
            <RangePicker
              defaultValue={[dayjs().startOf("year"), dayjs().endOf("year")]}
              style={{ width: 400 }}
              format="YYYY-MM"
              onChange={(e) => {
                if (e) {
                  const newlabel = getMonthsBetweenDates(e[0], e[1]);
                  setlabels(newlabel);
                }
              }}
              picker="month"
            />
          </div>

          <div className="tw-h-[300px] tw-w-full ">
            <Line data={data} options={options} />
          </div>
        </div>
      </Card>
      <Row gutter={16}>
        <Col
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
          span={8}
        >
          <Card>
            <Title level={5}>Survey Details</Title>
            <Row gutter={16}>
              <Col span={12}>
                <strong>Item</strong>
              </Col>
              <Col span={12}>
                <strong>Value</strong>
              </Col>
            </Row>
            {fakedetail.map((items, index) => (
              <Row key={index} gutter={16}>
                <Col span={12}>{items.item}</Col>
                <Col span={12}>{items.value}</Col>
              </Row>
            ))}
          </Card>

          <Card>
            <Title level={5}>Structure summary</Title>
            <Row gutter={16}>
              <Col span={12}>
                <strong>Item</strong>
              </Col>
              <Col span={12}>
                <strong>Value</strong>
              </Col>
            </Row>
            {fakedetail.map((items, index) => (
              <Row key={index} gutter={16}>
                <Col span={12}>{items.item}</Col>
                <Col span={12}>{items.value}</Col>
              </Row>
            ))}
          </Card>
        </Col>
        <Col span={16}>
          <Card>
            <Title level={5}>Response sumary</Title>
            <Row gutter={16}>
              <Col span={6}>
                <strong>Item</strong>
              </Col>
              <Col span={18}>
                <strong>Value</strong>
              </Col>
            </Row>
            {fakedetail.map((items, index) => (
              <Row key={index} gutter={16}>
                <Col span={6}>{items.item}</Col>
                <Col span={18}>{items.value}</Col>
              </Row>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Subtab_overview;
