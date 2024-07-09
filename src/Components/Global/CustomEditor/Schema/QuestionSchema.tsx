import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultProps,
} from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

export const editorTextSize = ["xs", "sm", "base", "lg", "xl"];

const paragraph = createReactBlockSpec(
  {
    type: "paragraph",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
    },
    content: "inline",
  },
  {
    render: (props) => {
      return (
        <div className={"tw-text-base"}>
          <div className={"inline-content"} ref={props.contentRef} />
        </div>
      );
    },
  }
);

const CustomParagraph = createReactBlockSpec(
  {
    type: "paragraph_1",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "1",
        values: editorTextSize,
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const textSize = props.block.props.type;
      return (
        <div
          className={`${
            textSize === "xs"
              ? "tw-text-xs"
              : textSize === "sm"
              ? "tw-text-sm"
              : textSize === "base"
              ? "tw-text-base"
              : textSize === "lg"
              ? "tw-text-lg"
              : textSize === "xl"
              ? "tw-text-xl"
              : ""
          }`}
        >
          <div ref={props.contentRef} />
        </div>
      );
    },
  }
);

export const customQuestionEditorSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    paragraph,
    paragraph_1: CustomParagraph,
  },
});
