import { useCallback, useState } from "react";
import { getInitBlock } from "~/component/Global/CustomEditor/utils";
import { TAnswer, answerSchema } from "~/interface/SurveyEditorInterface";
import { v4 as uuidv4 } from "uuid";

const generateAnswerFormat = (
  label: string,
  index: number,
  questionID: string
): TAnswer => {
  return {
    id: uuidv4(),
    key: index,
    label: JSON.stringify(getInitBlock(label.trim())),
    index: index,
    exclusive: false,
    forceopenendresponse: false,
    openend: false,
    number_only: false,
    ai_categorize: false,
    ai_categorize_list: [],
    questionsId: questionID,
    openEndDirection: "vertical",
  };
};

const useEventSourceAnswer = () => {
  const [rawData, setRawData] = useState("");
  const [IsStreaming, setIsStreaming] = useState(false);
  const [isStreamingDone, setisStreamingDone] = useState(false);
  const [GeneratedCount, setGeneratedCount] = useState(0);
  const [GenAnswerList, setGenAnswerList] = useState<TAnswer[]>([]);

  const resetGeneration = () => {
    setGenAnswerList([]);
    setRawData("");
    setIsStreaming(false);
    setisStreamingDone(false);
    setGeneratedCount(0);
  };

  const StartEventSource = useCallback(async (url: string, qid: string) => {
    setRawData("");
    setIsStreaming(true);
    setisStreamingDone(false);
    setGenAnswerList([]);

    const eventSource = new EventSource(url, {
      withCredentials: true,
    });

    let data = "";
    let index = 0;

    eventSource.onmessage = function (event) {
      if (event.data === "[DONE]") {
        setIsStreaming(false);
        setisStreamingDone(true);
        setGeneratedCount((prev) => prev + 1);
        eventSource.close();
      } else {
        setRawData((prev) => prev + event.data);
        data += event.data;
        // window.scrollTo(0, document.body.scrollHeight);

        const separateIndex = data.indexOf(",");
        if (separateIndex !== -1) {
          const extractedData = data.slice(0, separateIndex);
          data = data.slice(separateIndex + 1);
          const newQuestion = generateAnswerFormat(
            extractedData.replace(/\,/g, ""),
            index,
            qid
          );
          const parsed = answerSchema.parse(newQuestion);
          setRawData(data);
          setGenAnswerList((prev) => [...prev, parsed]);
          index += 1;
        }
      }
    };

    eventSource.onerror = function () {
      eventSource.close();
      setisStreamingDone(true);
      setIsStreaming(false);
    };
  }, []);

  return {
    StartEventSource,
    rawData,
    IsStreaming,
    isStreamingDone,
    resetGeneration,
    GeneratedCount,
    GenAnswerList,
  };
};

export const useGenerativeAnswer = () => {
  const [AIModel, setAIModel] = useState("gpt-3.5-turbo");

  return {
    AIModel,
    setAIModel,
    useEventSource: useEventSourceAnswer,
  };
};
