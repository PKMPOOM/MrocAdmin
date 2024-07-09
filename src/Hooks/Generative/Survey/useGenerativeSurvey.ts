import { useCallback, useState } from "react";
import {
  GenQuestionList,
  GenQuestionListSchema,
} from "~/src/Pages/Admin/Quantitative/Survey/SmartCreate/type";

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

    let data = "";

    eventSource.onmessage = function (event) {
      if (event.data === "[DONE]") {
        setIsStreaming(false);
        setisStreamingDone(true);
        setGeneratedCount((prev) => prev + 1);
        eventSource.close();
      } else {
        setRawData((prev) => prev + event.data);
        data += event.data;

        const endIndex = data.indexOf("}");
        if (endIndex !== -1) {
          const startIndex = data.indexOf("{");

          const jsonObject = data.slice(startIndex, endIndex + 1); // Extract the JSON object
          data = data.slice(endIndex + 1); // Remove the extracted JSON object from the accumulated data
          setRawData(data); // remove the extracted JSON object from the accumulated data state

          try {
            const parsedObject = JSON.parse(jsonObject);
            const { success, data } =
              GenQuestionListSchema.safeParse(parsedObject);

            if (success) {
              setParsedData((prev) => [...prev, data]);
            }
          } catch (err) {
            console.error("Error while parsing JSON:", err);
          }
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
    parsedData,
    setParsedData,
    IsStreaming,
    isStreamingDone,
    resetGeneration,
    GeneratedCount,
  };
};

export const useGenerativeSurvey = () => {
  const [AIModel, setAIModel] = useState("gpt-3.5-turbo");

  return {
    AIModel,
    setAIModel,
    useEventSource: useEventSourceQuestion,
  };
};
