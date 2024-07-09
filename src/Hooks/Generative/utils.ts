import { Block } from "@blocknote/core";
import { GenQuestionList } from "~/src/Pages/Admin/Quantitative/Survey/SmartCreate/type";

export const formatGenerativeQuestion = (
  questionList: GenQuestionList[],
  pageID?: string
) => {
  const formattedQuestionData: GenQuestionList[] = questionList.map(
    (item, Qindex) => {
      return {
        label: item.label,
        answer: item.answer.map((item, Andex) => {
          const newAnswerData: Block[] = [
            {
              id: `${pageID ?? "id"}-${Qindex}${Andex}`,
              type: "paragraph",
              props: {
                textColor: "default",
                backgroundColor: "default",
                textAlignment: "left",
              },
              content: [{ type: "text", text: item, styles: {} }],
              children: [],
            },
          ];

          return JSON.stringify(newAnswerData);
        }),
        type: item.type,
      };
    }
  );

  return formattedQuestionData;
};
