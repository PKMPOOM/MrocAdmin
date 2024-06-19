import { Card, Col, Row } from "antd";

function DesignUpdate() {
  return (
    <Row gutter={16}>
      <Col span={4}>
        <Card title="Overall stack">
          FrontEnd: react-router-dom,React, ChartJS, DayJS, Zustand, Ant
          Design,TanStack Query <br />
          <br />
          Backend: Prisma, Cockroach DB, Node js, Express js, jwt, bcrypt
        </Card>
      </Col>
      <Col span={20}>
        <Card title="Changelog">Rewrite everything in Typescript</Card>
      </Col>
    </Row>
  );
}

export default DesignUpdate;
