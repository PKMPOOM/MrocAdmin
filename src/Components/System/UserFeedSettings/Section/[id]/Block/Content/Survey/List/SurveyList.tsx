import {
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Button, Space, Tag } from "antd";
import dayjs from "dayjs";
import { FaArrowRight } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../../../../../../../Context/Auth/AuthContext";
import { SurveylistTypes } from "../../../../../../../../../Interface/SurveyEditorInterface";
import { useSectionEditorStore } from "../../../../../../../../../Store/useSectionEditorStore";
import { ROUTEPATH } from "../../../../../../../../../Utils/RoutePath";
import DescValue from "../../../../../../../../Global/Utils/DescValue";
import { useThemeContext } from "../../../../../../../../../Context/Theme/ApplicationProvider";

type ContentCardProps = {
  surveyList: SurveylistTypes[];
  indexData: {
    blockIndex: number;
  };
};

export default function SurveyList({
  surveyList,
  indexData,
}: ContentCardProps) {
  const { blockIndex } = indexData;
  const { AuthUser } = useAuth();
  const { token } = useThemeContext();
  const { id } = useParams();

  const [
    setSurveyDrawerOpen,
    setIndexData,
    onContentSort,
    onContentDelete,
    BlockContentHeight,
  ] = useSectionEditorStore((state) => [
    state.setSurveyDrawerOpen,
    state.setIndexData,
    state.onContentSort,
    state.onContentDelete,
    state.BLOCKCONTENTHEIGHT,
  ]);

  const onClient = window.location.href.includes("/admin");
  const isAdmin = AuthUser?.role === "admin";
  const isEditingSingleSection = id !== undefined;
  const showEditor = onClient && isAdmin && isEditingSingleSection;

  return (
    <div
      style={{
        border: `1px solid ${token.colorBorder}`,
      }}
      className=" tw-w-full tw-overflow-hidden tw-rounded-md"
    >
      <div
        style={{
          maxHeight: `${BlockContentHeight}px`,
          minHeight: `${BlockContentHeight}px`,
          overflow: "auto",
        }}
        className=" tw-group/list tw-bg-white tw-p-2 tw-rounded-lg tw-w-full tw-flex-1 "
      >
        {surveyList?.map((survey, surveyIndex) => {
          const isLastIndex = surveyList?.length === surveyIndex + 1;
          const isFirstIndex = surveyIndex === 0;
          return (
            <div
              key={survey.id}
              className="tw-group tw-flex-1 tw-flex  tw-basis-44 tw-relative tw-border-b tw-py-2 "
            >
              {isLastIndex && showEditor && (
                <div className=" group-hover/list:tw-opacity-100 tw-opacity-0 tw-absolute -tw-bottom-3 tw-z-40 tw-left-1/2">
                  <Button
                    onClick={() => {
                      setSurveyDrawerOpen(true);
                      setIndexData({
                        activeBlockIndex: blockIndex,
                        activeContentIndex: surveyIndex + 1, // last index + 1
                      });
                    }}
                    type="primary"
                    size={"small"}
                    icon={<PlusOutlined />}
                    shape="circle"
                  />
                </div>
              )}

              {showEditor && (
                <div className="tw-absolute tw-top-0  tw-right-0 tw-p-2  tw-flex tw-z-50 ">
                  <div className="tw-flex tw-gap-1 tw-flex-wrap tw-flex-col tw-w-full ">
                    <div className="tw-flex tw-items-center tw-bg-white tw-rounded  ">
                      <Space.Compact>
                        <Button
                          disabled={isFirstIndex}
                          size={"small"}
                          icon={<UpOutlined />}
                          onClick={() => {
                            setIndexData({
                              activeBlockIndex: blockIndex,
                              activeContentIndex: surveyIndex,
                            });
                            onContentSort(
                              "surveys",
                              surveyIndex,
                              surveyIndex - 1
                            );
                          }}
                        />
                        <Button
                          disabled={isLastIndex}
                          size={"small"}
                          icon={<DownOutlined />}
                          onClick={() => {
                            setIndexData({
                              activeBlockIndex: blockIndex,
                              activeContentIndex: surveyIndex,
                            });
                            onContentSort(
                              "surveys",
                              surveyIndex,
                              surveyIndex + 1
                            );
                          }}
                        />
                        <Button
                          danger
                          size={"small"}
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            setIndexData({
                              activeBlockIndex: blockIndex,
                              activeContentIndex: surveyIndex,
                            });
                            onContentDelete("surveys", surveyIndex);
                          }}
                        />
                      </Space.Compact>
                    </div>
                  </div>
                </div>
              )}

              <div className="  tw-transition-all tw-duration-150 tw-justify-between tw-flex tw-z-20 tw-gap-2 tw-px-2  tw-items-end tw-w-full tw-flex-wrap  ">
                <div className=" tw-flex tw-gap-1 tw-flex-col  ">
                  <div className=" tw-flex tw-basis-0 tw-flex-wrap tw-gap-2 tw-items-center ">
                    <p className="tw-text-slate-800 tw-font-semibold tw-text-base">
                      {survey.name}
                    </p>
                    <Tag color="blue">{survey.points.toString()} Points</Tag>
                  </div>
                  <div className=" tw-flex   tw-w-full">
                    <DescValue
                      keyValue="Created date"
                      value={dayjs(survey.createdate).format("DD MMM YYYY")}
                    />
                  </div>
                </div>
                <div className=" tw-flex tw-items-center">
                  <Link
                    to={`${ROUTEPATH.USER.SURVEY}/${survey.id}`}
                    target={onClient ? "_blank" : "_self"}
                  >
                    <div className=" tw-group/arrow tw-flex tw-gap-2 tw-items-center tw-text-blue-500 tw-cursor-pointer tw-w-fit">
                      <div>View</div>
                      <div className="group-hover/arrow:tw-translate-x-2 tw-translate-x-0 tw-transition-all tw-duration-150 ">
                        <FaArrowRight
                          size={10}
                          style={{ color: token.colorPrimary }}
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
