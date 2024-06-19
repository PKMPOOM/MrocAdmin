import { Image } from "antd";
import { SurveylistTypes } from "../../../../../../../Interface/SurveyEditorInterface";
import ContainerSimplified from "../Container/ContainerSimplified";

type Props = {
  survey: SurveylistTypes;
};

const SurveySimplified = ({ survey }: Props) => {
  return (
    <ContainerSimplified>
      {false ? (
        <Image
          style={{
            objectFit: "cover",
            height: "80px",
            borderRadius: "4px",
          }}
          // src={survey.image}
        />
      ) : (
        <div className="tw-top-1/2 tw-left-1/2 tw-flex-1 tw-font-semibold tw-text-lg tw-text-white tw-bg-gradient-to-bl tw-from-cyan-500 tw-to-blue-500  tw-flex tw-items-center tw-justify-center">
          <p> {survey.name.toUpperCase()}</p>
        </div>
      )}
      <p className=" tw-border tw-rounded-b-md tw-p-2"> {survey.name}</p>
    </ContainerSimplified>
  );
};

export default SurveySimplified;
