import {
  Block,
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultProps,
  filterSuggestionItems,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  BlockTypeSelectItem,
  blockTypeSelectItems,
  ColorStyleButton,
  createReactBlockSpec,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  SuggestionMenuController,
} from "@blocknote/react";
import { RiText } from "react-icons/ri";
import { useShallow } from "zustand/react/shallow";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";
import { createAiGeneratedQuestion } from "./SlashMenu/AIGeneratedContent";
import { getTextFromBlock } from "~/src/Hooks/Utils/getTextFromBlock";

export const getInitBlock = (label: string): Block[] => {
  try {
    return JSON.parse(label);
  } catch (error) {
    return [
      {
        id: `id-00`,
        type: "paragraph",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [
          {
            type: "text",
            text: label,
            styles: {},
          },
        ],
        children: [],
      },
    ];
  }
};

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
        <div className={" tw-text-base"}>
          <div className={"inline-content"} ref={props.contentRef} />
        </div>
      );
    },
  }
);

const textSize = ["xs", "sm", "base", "lg", "xl"];

const CustomParagraph = createReactBlockSpec(
  {
    type: "paragraph_1",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "1",
        values: textSize,
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

export const customSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    paragraph,
    paragraph_1: CustomParagraph,
  },
});

const customBlockList = (
  editor: BlockNoteEditor<any>
): BlockTypeSelectItem[] => {
  return [
    ...blockTypeSelectItems(editor.dictionary),
    ...textSize.map((el) => ({
      name: `Paragraph ${el}`,
      type: "paragraph_1",
      icon: RiText,
      isSelected: (block: any) => {
        const correctBlock = block.type === "paragraph_1";
        const correctProps = block.props.type === el;

        return correctBlock && correctProps;
      },
      props: {
        type: el,
      },
    })),
  ].filter((el) => {
    const unwantedtypes = [
      "bulletListItem",
      "heading",
      "numberedListItem",
      "checkListItem",
    ];
    if (unwantedtypes.includes(el.type)) {
      return false;
    }
    return true;
  }) satisfies BlockTypeSelectItem[];
};

export type generativeFeature = {
  StartEventSource: (url: string) => Promise<void>;
  rawData: string;
};

type CreateBlcokProps = {
  handleChange: () => void;
  editor: BlockNoteEditor<any>;
  questionIndexData: {
    pIndex: number;
    qIndex: number;
    questionID: string;
  };
  generativeFeature?: generativeFeature;
};

export const CustomBlockNote = ({
  handleChange,
  editor,
  questionIndexData,
  generativeFeature,
}: CreateBlcokProps) => {
  const [setActiveQ, SetSideTabActiveKey, surveyData] = useSurveyEditorStore(
    useShallow((state) => [
      state.SetActiveQuestion,
      state.SetSideTabActiveKey,
      state.surveyData,
    ])
  );

  const allSurveyQuestion = surveyData?.questionlist
    .flatMap((el) => el.questions.map((el) => getTextFromBlock(el.label)))
    .join(", ");

  const allSurveyPageHeader = surveyData?.questionlist
    .map((el) => el.header)
    .join(", ");

  return (
    <BlockNoteView
      onFocus={() => {
        SetSideTabActiveKey("Edit");
        setActiveQ(
          questionIndexData.pIndex,
          questionIndexData.qIndex,
          questionIndexData.questionID
        );
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
      theme={"light"}
      editor={editor}
      linkToolbar={false}
      filePanel={false}
      sideMenu={false}
      slashMenu={false}
      tableHandles={false}
      formattingToolbar={false}
      onChange={handleChange}
    >
      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            <BlockTypeSelect
              key={"blockTypeSelect"}
              items={customBlockList(editor)}
            />
            <FileCaptionButton key={"fileCaptionButton"} />
            <FileReplaceButton key={"replaceFileButton"} />
            <BasicTextStyleButton
              basicTextStyle={"bold"}
              key={"boldStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"italic"}
              key={"italicStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"underline"}
              key={"underlineStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"strike"}
              key={"strikeStyleButton"}
            />

            <ColorStyleButton key={"colorStyleButton"} />
          </FormattingToolbar>
        )}
      />

      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) =>
          filterSuggestionItems(
            [
              createAiGeneratedQuestion(
                `page header list are ${allSurveyPageHeader} and here's all question in this survey ${allSurveyQuestion}`,
                generativeFeature
              ),
            ],
            query
          )
        }
      />
    </BlockNoteView>
  );
};
