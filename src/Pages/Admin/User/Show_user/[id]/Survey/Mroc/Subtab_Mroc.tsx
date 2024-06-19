import { Card, Statistic, Table, Typography } from "antd";
const { Title } = Typography;

const Subtab_Mroc = () => {
  const columns = [
    {
      key: "status",
      dataIndex: "status",
      title: "Status",
    },
    {
      key: "title",
      dataIndex: "title",
      title: "Title",
    },
    {
      key: "type",
      dataIndex: "type",
      title: "Type",
    },
    {
      key: "date_invited",
      dataIndex: "date_invited",
      title: "Date Invited",
    },
  ];

  const dummyData = [
    {
      status: "Conpleted",
      title: "Pioneer Power Solutions, Inc.",
      type: "Regular",
      date_invited: "12/4/2023",
    },
    {
      status: "Conpleted",
      title: "ROBO Global Robotics and Automation Index ETF",
      type: "Regular",
      date_invited: "4/21/2023",
    },
    {
      status: "Conpleted",
      title: "J. W. Mays, Inc.",
      type: "Regular",
      date_invited: "9/15/2023",
    },
    {
      status: "Conpleted",
      title: "Stag Industrial, Inc.",
      type: "Regular",
      date_invited: "7/15/2023",
    },
    {
      status: "Conpleted",
      title: "NASDAQ TEST STOCK",
      type: "Regular",
      date_invited: "12/27/2023",
    },
    {
      status: "Conpleted",
      title: "MidSouth Bancorp",
      type: "Regular",
      date_invited: "10/31/2023",
    },
    {
      status: "Conpleted",
      title: "AtriCure, Inc.",
      type: "Regular",
      date_invited: "8/9/2023",
    },
    {
      status: "Conpleted",
      title: "Kimco Realty Corporation",
      type: "Regular",
      date_invited: "11/6/2023",
    },
    {
      status: "Conpleted",
      title: "InfraREIT, Inc.",
      type: "Regular",
      date_invited: "3/14/2023",
    },
    {
      status: "Conpleted",
      title: "National Research Corporation",
      type: "Regular",
      date_invited: "4/29/2023",
    },
  ];

  return (
    <div className=" tw-flex tw-flex-col tw-gap-4">
      <Card>
        <div className="tw-flex tw-gap-8">
          <Title level={4}>Mroc </Title>
          <Statistic title="Completed" value={99} />
          <Statistic title="Incomplete" value={99} />
          <Statistic title="Not Started" value={99} />
          <Statistic title="Total" value={99} />
        </div>
      </Card>
      <Table columns={columns} dataSource={dummyData} rowKey="status" />
    </div>
  );
};

export default Subtab_Mroc;
