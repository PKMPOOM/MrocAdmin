import { useParams } from "react-router-dom";

const Survey = () => {
  const { id } = useParams();

  return <div>Survey.user{id}</div>;
};

export default Survey;
