import { useCallback, useState } from "react";
import { GenQuestionList } from "~/src/Pages/Admin/Quantitative/Survey/SmartCreate/type";

const useEventSourceQuestion = () => {
  const [parsedData, setParsedData] = useState<GenQuestionList[]>([]);
  const [rawData, setRawData] = useState("");
  const [IsStreaming, setIsStreaming] = useState(false);
  const [isStreamingDone, setisStreamingDone] = useState(false);
  const [GeneratedCount, setGeneratedCount] = useState(0);

  const resetGeneration = () => {
    setParsedData([]);
    setRawData("");
    setIsStreaming(false);
    setisStreamingDone(false);
    setGeneratedCount(0);
  };

  const StartEventSource = useCallback(async (url: string) => {
    setRawData("");
    setParsedData([]);
    setIsStreaming(true);
    setisStreamingDone(false);

    const eventSource = new EventSource(url, {
      withCredentials: true,
    });

    eventSource.onmessage = function (event) {
      if (event.data === "[DONE]") {
        setIsStreaming(false);
        setisStreamingDone(true);
        setGeneratedCount((prev) => prev + 1);
        eventSource.close();
      } else {
        setRawData((prev) => prev + event.data);
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
    parsedData,
    setParsedData,
    IsStreaming,
    isStreamingDone,
    resetGeneration,
    GeneratedCount,
  };
};

export const useGenerativeQuestion = () => {
  const [AIModel, setAIModel] = useState("gpt-3.5-turbo");

  return {
    AIModel,
    setAIModel,
    useEventSource: useEventSourceQuestion,
  };
};
