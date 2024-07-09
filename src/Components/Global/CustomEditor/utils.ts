import { Block } from "@blocknote/core";

export const getInitBlock = (label: string): Block[] => {
  try {
    const parsedBlock = JSON.parse(label.toString());
    // number are JSON.parse able, so we need to check if it's a number to throw an error then catch it
    if (typeof parsedBlock !== "object") {
      throw new Error("Unexpected number in block content");
    }

    return parsedBlock;
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
