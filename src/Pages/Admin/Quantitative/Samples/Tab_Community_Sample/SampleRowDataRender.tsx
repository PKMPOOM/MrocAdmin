import { useEffect, useState } from "react";
import { Sample, useUpdateSampleTags } from "../api";
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Select,
  Space,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
const { Text } = Typography;
import { EditOutlined } from "@ant-design/icons";

const options = [
  {
    value: "Most used",
    label: "Most used",
  },
  {
    value: "Digital marketing",
    label: "Digital marketing",
  },
  {
    value: "New",
    label: "New",
  },
  {
    value: "Todo",
    label: "Todo",
  },
];

type Props = {
  recordData: Sample;
  refetchFn: () => void;
};

function Sampledata({ recordData, refetchFn }: Props) {
  const {
    SampleNotes,
    Exclusion,
    QuestionIDs,
    SampleScript,
    isactive,
    Parameters,
    tags: initialTags,
  } = recordData;

  const [TagList, setTagList] = useState<string[]>([]);

  useEffect(() => {
    if (initialTags) {
      setTagList(initialTags);
    }
  }, [initialTags]);

  const isTagsChange = TagList !== initialTags;

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Notes",
      children: SampleNotes,
    },
    {
      key: "2",
      label: "parameters",
      children: Parameters,
    },
    {
      key: "3",
      label: "Exclusion tags",
      children: Exclusion,
    },
    {
      key: "4",
      label: "Question IDs",
      children: QuestionIDs,
    },

    {
      key: "6",
      label: "Sample script",
      children: SampleScript,
    },
    {
      key: "7",
      label: "Is Active",
      children: <Text strong={true}> {isactive ? "Yes" : "No"} </Text>,
    },
    {
      key: "5",
      label: "Tags",
      span: 3,
      children: (
        <Space.Compact
          style={{
            width: "100%",
          }}
        >
          <Select
            value={TagList}
            mode="tags"
            style={{
              width: "100%",
            }}
            onChange={(value) => setTagList(value)}
            tokenSeparators={[","]}
            options={options}
          />
          {isTagsChange && (
            <Button
              disabled={!isTagsChange}
              onClick={() => {
                setTagList(initialTags ? initialTags : []);
              }}
            >
              Undo
            </Button>
          )}
          <Button
            disabled={!isTagsChange}
            type={isTagsChange ? "primary" : "default"}
            onClick={() => {
              useUpdateSampleTags(recordData.id, TagList).then(() => {
                refetchFn();
              });
            }}
          >
            Save
          </Button>
        </Space.Compact>
      ),
    },
  ];

  return (
    <>
      <Descriptions items={items} />
      <div className=" tw-flex tw-gap-2">
        <Link to={`/admin/Quantitative/Samples/${recordData.id}`}>
          <Button icon={<EditOutlined />} type={"primary"}>
            Edit
          </Button>
        </Link>
        <Button>Export</Button>
        <Button danger type={"default"}>
          Thawed
        </Button>
      </div>
    </>
  );
}

export default Sampledata;
