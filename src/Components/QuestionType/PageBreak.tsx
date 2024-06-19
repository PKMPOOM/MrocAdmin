//tw-import React, { useState, useContext, useId } from "react";
// import { BuildPageContext } from "../../Layout/Pages/Survey/SurveyEditor/SurveyEditorPage";
import { Divider, Typography } from "antd";
// import { v4 as uuidv4 } from "uuid";
const { Text } = Typography;
type PageBreakProps = {
  isBreak: boolean;
  pIndex: number;
  qIndex: number;
};
function PageBreak({ isBreak }: PageBreakProps) {
  return (
    <>
      {isBreak ? (
        <div
          // onClick={handleDeletePageBreak()}
          className="tw-h-6 tw-px-4 tw-flex tw-duration-300 tw-justify-center tw-items-center hover:tw-bg-red-50 tw-rounded-md tw-cursor-pointer"
        >
          <Divider style={{ marginTop: 0, marginBottom: 0 }}>
            <Text style={{ fontWeight: 400 }}>Page Break</Text>
          </Divider>
        </div>
      ) : (
        <div
          // onClick={handleAddPageBreak()}
          className="tw-h-6 tw-px-4 tw-flex tw-opacity-0 hover:tw-opacity-100 tw-duration-300 tw-justify-center tw-items-center hover:tw-bg-slate-50 tw-rounded-md tw-cursor-pointer"
        >
          <div className=" ">Add Page Break</div>
        </div>
      )}
    </>
  );
}

export default PageBreak;
