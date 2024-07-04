export const getTextFromBlock = (label: string) => {
  let questionLabel: string;
  const regex = /"text"\s*:\s*"([^"]+)"/g;
  const matches = [];
  let match;

  while ((match = regex.exec(label)) !== null) {
    matches.push(match[1]);
  }

  if (matches.length === 0) {
    questionLabel = label;
  } else {
    questionLabel = matches.join(" ").replace(/  /g, " ");
  }

  return questionLabel;
};
