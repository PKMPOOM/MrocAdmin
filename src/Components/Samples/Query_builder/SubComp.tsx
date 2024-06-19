import { AntDValueEditor } from "@react-querybuilder/antd";
import { Cascader, Select } from "antd";
import {
  FieldSelectorProps,
  Option,
  ValueEditorProps,
} from "react-querybuilder";
import {
  TmainOption,
  TsubOptions,
  useQueryBuilderStore,
} from "./QueryBuilderStore";

export const CustomCascaderField = (props: FieldSelectorProps) => {
  const [setQueryOptions, fullQueryOptions] = useQueryBuilderStore((state) => [
    state.setQueryOptions,
    state.fullQueryOptions,
  ]);

  /**
   * Loads data for the selected options.
   * @param selectedOptions - The selected options. as string []
   * last element in selectedOptions array is the selected value which should be an uniqe id to fetch more data
   * use this to load data from api
   */

  const loadData = async (selectedOptions: TsubOptions[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    if (targetOption.id) {
      return;
    }

    const dummyData: TsubOptions[] = [
      {
        label: `question 1`,
        name: `q1`,
        isLeaf: selectedOptions.length === 1,
        valueEditorType: "multiselect",
        inputType: "",
        values: [
          {
            name: "region1",
            label: "region 1",
          },
          {
            name: "region2",
            label: "region 2",
          },
          {
            name: "region3",
            label: "region 3",
          },
          {
            name: "region4",
            label: "region 4",
          },
        ],
      },
      {
        label: `question 2`,
        name: `q2`,
        isLeaf: selectedOptions.length === 1,
      },
    ];

    setTimeout(() => {
      setQueryOptions(targetOption.id, dummyData);
    }, 1000);
  };

  const onChange = (value: string) => {
    props.handleOnChange(value);
  };

  return (
    <Cascader
      fieldNames={{ value: "name" }}
      defaultValue={props.value?.split(".")}
      options={fullQueryOptions}
      loadData={loadData}
      onChange={(e) => onChange(e.join("."))}
      //   displayRender={(label) => <div>{label.join(" > ")}</div>}
      changeOnSelect
    />
  );
};

// Function to recursively search for the object
function searchCurrentObjectData(
  data: TmainOption[] | TsubOptions[],
  nameArray: string[]
): TsubOptions | null {
  for (const item of data) {
    if (item.name === nameArray[0]) {
      if (nameArray.length === 1) {
        // Check if item is TsubOptions
        if (item.hasOwnProperty("valueEditorType")) {
          return item as TsubOptions;
        } else {
          return null;
        }
      } else {
        return searchCurrentObjectData(item.children || [], nameArray.slice(1));
      }
    }
  }
  return null;
}

export const CustomValueEditor = (props: ValueEditorProps) => {
  const [fullQueryOptions] = useQueryBuilderStore((state) => [
    state.fullQueryOptions,
  ]);

  const namedList = props.fieldData.name.split(".");
  const currentQueryData = searchCurrentObjectData(fullQueryOptions, namedList);

  if (!currentQueryData) {
    return <AntDValueEditor {...props} />;
  }

  switch (currentQueryData.valueEditorType) {
    case "multiselect":
      const formattedOptions = currentQueryData.values?.map((opt) => {
        return {
          label: opt.label,
          value: (opt as Option<string>).name,
        };
      });
      return (
        <Select
          //   fieldNames={{ value: "name" }}
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Please select"
          onChange={(e) => props.handleOnChange(e.join(","))}
          options={formattedOptions ?? []}
        />
      );
  }

  console.log(currentQueryData);

  //   switch (valueEditorType) {
  //     case "multiselect":
  //       return <div>multi select</div>;

  //     default:
  //       break;
  //   }
};

// const OperatorByIncomingType = (props: OperatorSelectorProps) => {
//   const questionLabel = props.value?.split(" ")[0].split(".")[1];
//   const operatorLabel = props.value?.split(" ")[1] ?? "=";

//   const options = props.options.map((opt) => {
//     return {
//       label: opt.label,
//       value: (opt as Operator<string>).name, //! just to fix ts error i added "as Operator<string>""
//     };
//   });

//   return (
//     <div className=" tw-flex tw-gap-2">
//       <Select
//         style={{
//           width: "100px",
//         }}
//         value={props.value?.split(" ")[0].split(".")[1]}
//         onChange={(e) => {
//           props.handleOnChange(`.${e} ${operatorLabel}`);
//         }}
//         //! should fetch option based on previous field
//         options={[
//           { label: "name", value: "name" },
//           { label: "url", value: "url" },
//         ]}
//         placeholder="Select Field"
//       />
//       <Select
//         style={{
//           width: "100px",
//         }}
//         disabled={!questionLabel}
//         value={operatorLabel}
//         onChange={(e) => {
//           props.handleOnChange(`.${questionLabel} ${e}`);
//         }}
//         options={options}
//         placeholder="Select Operator"
//       />
//     </div>
//   );
// };
