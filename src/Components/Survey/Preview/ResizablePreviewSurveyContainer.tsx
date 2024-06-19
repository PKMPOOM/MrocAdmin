import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/component/ui/resizable";
// import { useSurveyPreviewStore } from "@/Pages/User_Side/survey/preview/[id]/Survey.preview.store";
import React from "react";
// import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

type Props = {
  children: React.ReactNode;
};

const ResizablePreviewSurveyContainer = ({ children }: Props) => {
  // const [isDebugMode, setDebugMode] = useSurveyPreviewStore((state) => [
  //   state.isDebugMode,
  //   state.setDebugMode,
  // ]);
  return (
    <ResizablePanelGroup direction="horizontal" className="tw-min-h-[200px]">
      <ResizablePanel maxSize={80} minSize={30} className="tw-bg-slate-100">
        {children}
      </ResizablePanel>

      <ResizableHandle withHandle />
      <ResizablePanel>Two</ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ResizablePreviewSurveyContainer;
