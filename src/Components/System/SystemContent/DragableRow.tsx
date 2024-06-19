import { HolderOutlined } from "@ant-design/icons";
import { theme } from "antd";
import { Draggable } from "react-beautiful-dnd";
import { customColumn } from "./api";
import DescValue from "~/component/Global/Utils/DescValue";
const { useToken } = theme;

type Props = {
  index: number;
  items: {
    id: string;
    [key: string]: any;
  };
  FilterStatus: string[];
  columnNames: customColumn[];
  shouldDisplay: boolean;
  action?: JSX.Element;
  customColsWidth: string[];
};

const DragableRow = ({
  items,
  customColsWidth,
  columnNames,
  shouldDisplay,
  action,
  index,
}: Props) => {
  const { token } = useToken();

  return (
    <Draggable draggableId={items.id} index={index} key={items.id}>
      {(provided, { isDragging }) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div
            style={{
              border: `1px solid ${token.colorBorder}`,
              display: shouldDisplay ? "flex" : "none",
              backgroundColor: "white",
            }}
            className={`tw-p-2 tw-gap-2 tw-rounded-md tw-transition-all tw-duration-150 tw-my-1    ${
              isDragging ? "tw-shadow-2xl -tw-rotate-1 tw-origin-top-left" : ""
            }`}
          >
            <div
              {...provided.dragHandleProps}
              className="tw-items-center tw-pt-1 tw-flex  "
              style={{
                cursor: "move",
              }}
            >
              <HolderOutlined />
            </div>
            <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full tw-items-center ">
              <div className="tw-flex tw-gap-4 tw-items-center tw-w-full  ">
                <div
                  style={{
                    gridTemplateColumns: `${customColsWidth.join(" ")}`,
                  }}
                  className="tw-grid tw-w-full tw-gap-2  tw-items-center "
                >
                  {columnNames.map(({ dataIndex, title, key, render }) => {
                    if (render) {
                      return <div key={key}>{render(items)}</div>;
                    }
                    return (
                      <DescValue
                        key={key}
                        keyValue={title ?? ""}
                        value={
                          typeof items[dataIndex ? dataIndex : ""] !==
                            "object" && !render
                            ? items[dataIndex ? dataIndex : ""]
                            : null
                        }
                      />
                    );
                  })}
                </div>

                <div className="tw-flex tw-gap-2">{action}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DragableRow;
