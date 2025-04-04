import "@blocknote/mantine/style.css";
import {
  DefaultReactSuggestionItem,
  useBlockNoteEditor,
  useComponentsContext,
} from "@blocknote/react";

import { BsStars } from "react-icons/bs";
import { generativeFeature } from "../BlockNoteCustomEditor";

export function AiGenerateContent() {
  const editor = useBlockNoteEditor();

  const Components = useComponentsContext()!;

  return (
    <Components.FormattingToolbar.Button
      className="tw-bg-red-200"
      mainTooltip={"Ai generated content"}
      onClick={() => {
        const blocks = editor.document;

        if (!blocks[0]) {
          return;
        }

        editor.insertInlineContent([
          "Hello ",
          { type: "text", text: "World", styles: { bold: true } },
        ]);
      }}
    >
      Ai
    </Components.FormattingToolbar.Button>
  );
}
export function AiGenerateContentSlash() {
  const editor = useBlockNoteEditor();

  const Components = useComponentsContext()!;

  return (
    <Components.FormattingToolbar.Button
      className="tw-bg-red-200"
      mainTooltip={"Ai generated content"}
      onClick={() => {
        const blocks = editor.document;

        if (!blocks[0]) {
          return;
        }

        editor.insertInlineContent([
          "Hello ",
          { type: "text", text: "World", styles: { bold: true } },
        ]);
      }}
      //   isSelected={isSelected}
    >
      Ai
    </Components.FormattingToolbar.Button>
  );
}

export const createAiGeneratedQuestion = (
  jsonData?: string,
  generativeFeature?: generativeFeature
): DefaultReactSuggestionItem => ({
  title: "Question generation",

  onItemClick: async () => {
    if (!generativeFeature?.StartEventSource) {
      return;
    }

    if (jsonData === undefined) {
      return;
    }

    const { StartEventSource } = generativeFeature;
    const Url = `${
      import.meta.env.VITE_API_URL
    }/generative/streaming/question/${jsonData
      .replace(/ /g, "_")
      .replace(/\?/g, "")}`;

    await StartEventSource(Url);
  },
  aliases: ["ai copywriter", "ai"],
  group: "Ai",
  badge: "AI",

  icon: <BsStars size={18} />,
  subtext: "Create question copy using Ai technology",
});
