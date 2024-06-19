import { useSectionEditorStore } from "../../../../../Store/useSectionEditorStore";
import BlockFull from "./Block/BlockFull";

const SectionRowEditor = () => {
  const [SectionData] = useSectionEditorStore((state) => [state.sectionData]);

  let SumWidth = 0;

  if (SectionData?.blocks) {
    // all custom size content width
    const allContentSumWidth = SectionData.blocks.reduce((acc, current) => {
      if (current.width) {
        return acc + current.width;
      }
      return acc;
    }, 0);

    SumWidth = allContentSumWidth;
  }

  const maxContentAllowed = SectionData?.type === "hero" ? 1 : 4;

  return (
    <div className=" tw-flex tw-flex-col lg:tw-flex-row tw-w-full tw-max-w-7xl  ">
      {SectionData?.blocks.map((block, index) => {
        const contentLength = SectionData?.blocks?.length;
        const isLastIndex = contentLength === index + 1;
        const isFirstIndex = index === 0;
        const otherWidth = SectionData.blocks
          .filter((item) => item.id !== block.id)
          .reduce((acc, current) => {
            if (current.width) {
              return acc + current.width;
            }
            return acc + 15;
          }, 0);

        const autoWidthAmount = SectionData.blocks.filter(
          (item) => item.width === null
        ).length;

        const contentLimitReach = contentLength === maxContentAllowed;

        return (
          <BlockFull
            key={block.id}
            blocks={block}
            indexData={{ isLastIndex, isFirstIndex, contentLimitReach }}
            otherWidth={otherWidth}
            index={index}
            SumWidth={SumWidth}
            autoWidthAmount={autoWidthAmount}
          />
        );
      })}
    </div>
  );
};

export default SectionRowEditor;
