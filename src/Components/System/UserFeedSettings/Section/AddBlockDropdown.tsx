import { PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import { HTMLProps } from "react";
import { useSectionEditorStore } from "../../../../Store/useSectionEditorStore";
import { DisplayType } from "../../../../Interface/User/UserDashboardTypes";
import { v4 as uuid } from "uuid";

const getDisplayType = (prefix: string): MenuProps["items"] => {
  return [
    {
      key: `${prefix}_card`,
      label: "Card",
    },
    {
      key: `${prefix}_list`,
      label: "List",
      // disabled: true,
    },

    {
      key: `${prefix}_story`,
      label: "Story",
      disabled: true,
    },
    {
      key: `${prefix}_carousel`,
      label: "Carousel",
      disabled: true,
    },
  ];
};

const addCardItemsDropdownList: MenuProps["items"] = [
  {
    key: "add_content",
    label: "Blog",
    children: getDisplayType("blog"),
  },
  {
    key: "add_survey",
    label: "Survey",
    children: getDisplayType("survey"),
  },
  {
    key: "add_discussion",
    label: "Discussion",
    children: getDisplayType("discussion"),
  },
];

type Props = {
  sectionID: string;
  index: number;
  label?: string;
  rotate?: boolean;
  buttonSize?: "small" | "middle" | "large";
} & HTMLProps<HTMLDivElement>;

const AddBlockDropdown = ({
  sectionID,
  label,
  index,
  buttonSize = "small",
  rotate = false,
  ...props
}: Props) => {
  const [addBlock] = useSectionEditorStore((state) => [state.addBlock]);

  const onDropdownClick = (keypath: string[]) => {
    const mainPath = keypath[1];
    const subPath = keypath[0];
    const displayType = subPath.split("_")[1];

    switch (mainPath) {
      case "add_content":
        addBlock(
          {
            id: uuid(),
            display_type: displayType as DisplayType,
            content_type: "blog",
            userId: "string",
            blog: [],
            discussions: [],
            surveys: [],
            custom_width: false,
            width: null,
            content_order: [],
          },
          index
        );
        break;
      case "add_survey":
        addBlock(
          {
            id: uuid(),
            display_type: displayType as DisplayType,
            content_type: "survey",
            userId: "string",
            blog: [],
            discussions: [],
            surveys: [],
            custom_width: false,
            width: null,
            content_order: [],
          },
          index
        );
        break;
      case "add_discussion":
        addBlock(
          {
            id: uuid(),
            display_type: displayType as DisplayType,
            content_type: "discussion",
            userId: "string",
            blog: [],
            discussions: [],
            surveys: [],
            custom_width: false,
            width: null,
            content_order: [],
          },
          index
        );
        break;

      default:
        break;
    }
  };

  return (
    <div {...props}>
      <Dropdown
        menu={{
          items: addCardItemsDropdownList,
          onClick: (e) => {
            onDropdownClick(e.keyPath);
          },
        }}
      >
        <div className={` ${rotate && "lg:-tw-rotate-90"} tw-z-50 `}>
          <Button type="primary" size={buttonSize} icon={<PlusOutlined />}>
            {label}
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default AddBlockDropdown;
