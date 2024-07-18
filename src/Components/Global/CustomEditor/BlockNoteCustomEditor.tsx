import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  BlockTypeSelectItem,
  blockTypeSelectItems,
  ColorStyleButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  SuggestionMenuController,
} from "@blocknote/react";
import { RiText } from "react-icons/ri";
import { useShallow } from "zustand/react/shallow";
import { getTextFromBlock } from "~/src/Hooks/Utils/getTextFromBlock";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";
import { editorTextSize } from "./Schema/QuestionSchema";
import {
  AiGenerateContentProps,
  createAiGeneratedQuestion,
} from "./SlashMenu/AIGeneratedContent";
import { useEffect } from "react";

const customBlockList = (
  editor: BlockNoteEditor<any>
): BlockTypeSelectItem[] => {
  return [
    ...blockTypeSelectItems(editor.dictionary),
    ...editorTextSize.map((el) => ({
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
  const [
    setActiveQ,
    SetSideTabActiveKey,
    surveyData,
    activeQuestion,
    initializeActiveQuestion,
  ] = useSurveyEditorStore(
    useShallow((state) => [
      state.SetActiveQuestion,
      state.SetSideTabActiveKey,
      state.surveyData,
      state.activeQuestion,
      state.initializeActiveQuestion,
    ])
  );

  const generationData: AiGenerateContentProps = {
    surveyData:
      surveyData?.questionlist.map((el) => {
        return {
          header: el.header,
          questions: el.questions.map((el) => getTextFromBlock(el.label)),
        };
      }) || [],
    instruction: surveyData?.detail.instructions || "",
    questionType:
      surveyData?.questionlist[activeQuestion.page].questions[
        activeQuestion.question
      ]?.type || "single_select",
  };

  useEffect(() => {
    initializeActiveQuestion();
  }, [questionIndexData.questionID]);

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
        // suggestionMenuComponent={CustomSlashMenu}
        getItems={async (query) =>
          filterSuggestionItems(
            [createAiGeneratedQuestion(generationData, generativeFeature)],
            query
          )
        }
      />
    </BlockNoteView>
  );
};
