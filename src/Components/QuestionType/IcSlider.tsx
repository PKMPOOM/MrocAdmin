import { Slider } from "antd";
import { Answer } from "../../Interface/SurveyEditorInterface";

type SliderProps = {
  scale: Answer[];
};

type SliderMarks = {
  [key: string]: string;
};

function ICSlider({ scale }: SliderProps) {
  const sliderMarks: SliderMarks = {};

  const length = scale.length;

  for (let i = 0; i < length; i++) {
    const key = (100 / (length - 1)) * i;

    sliderMarks[key.toFixed(0)] = scale[i].label;
  }

  // console.log(sliderMarks);

  return (
    <div className=" tw-px-10">
      <Slider step={null} marks={sliderMarks} />
    </div>
  );
}

export default ICSlider;
