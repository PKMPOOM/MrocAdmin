import { Droppable } from "react-beautiful-dnd";
import { KeyedMutator } from "swr";
import { BlockEditorSectionProps } from "../../../../../Interface/User/UserDashboardTypes";
import SectionPreview from "./SectionPreview";

type Props = {
  sectionList: BlockEditorSectionProps[];
  FilterStatus: string[];
  mutate: KeyedMutator<BlockEditorSectionProps[]>;
};

const SectionList = ({ FilterStatus, mutate, sectionList }: Props) => {
  return (
    <Droppable droppableId={"sectionList"}>
      {(provided, snapshot) => (
        <div
          className="tw-flex tw-flex-col tw-h-[calc(100vh-200px)] tw-overflow-y-auto"
          style={{
            backgroundColor: snapshot.isDraggingOver ? "#f7f7f7" : undefined,
            borderRadius: "6px",
          }}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {sectionList.map((items, index) => {
            let SumWidth = 0;

            if (items?.blocks) {
              // all custom size content width
              const allContentSumWidth = items.blocks.reduce((acc, current) => {
                if (current.width) {
                  return acc + current.width;
                }
                return acc;
              }, 0);

              SumWidth = allContentSumWidth;
            }

            const autoWidthAmount = items.blocks.filter(
              (item) => item.width === null
            ).length;

            return (
              <SectionPreview
                key={items.id}
                mutate={mutate}
                items={items}
                index={index}
                FilterStatus={FilterStatus}
                widthData={{
                  SumWidth,
                  autoWidthAmount,
                }}
              />
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default SectionList;
