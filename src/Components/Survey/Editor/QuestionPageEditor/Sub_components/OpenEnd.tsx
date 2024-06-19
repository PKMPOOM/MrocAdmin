import { Checkbox, Dropdown, MenuProps, Radio, Tooltip, theme } from "antd";
import { produce } from "immer";
import React, { useState } from "react";
import { FaAsterisk } from "react-icons/fa";
import { useShallow } from "zustand/react/shallow";
import { useAuth } from "../../../../../Context/Auth/AuthContext";
import { useUpdateOpenEnd } from "./api";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";
import { QueryResponse } from "~/interface/SurveyEditorInterface";

type OpenEndProps = {
  useOpenEnd: boolean;
  forceOpenEnd: boolean;
  numberOnly: boolean;
  pIndex: number;
  qIndex: number;
  aIndex: number;
  aID: string;
  AICategorize: boolean;
  categorizeList: string[];
  openEndDirection: "vertical" | "horizontal";
};

type OpenEndMutationProps = {
  use?: boolean;
  force?: boolean;
  allowNumberOnly?: boolean;
  useAI?: boolean;
  direction?: "vertical" | "horizontal";
};

function OpenEnd({
  useOpenEnd,
  forceOpenEnd,
  numberOnly,
  aID,
  pIndex,
  qIndex,
  aIndex,
  AICategorize,
  categorizeList,
  openEndDirection,
}: OpenEndProps) {
  const [open, setOpen] = useState(false);
  const [setOpenEndCategorizeModalOpen, setCategorizeListArray, surveyMeta] =
    useSurveyEditorStore(
      useShallow((state) => [
        state.setOpenEndCategorizeModalOpen,
        state.setCategorizeListArray,
        state.surveyMeta,
      ])
    );

  const { notificationApi } = useAuth();
  const { token } = theme.useToken();
  const { trigger: updateOpenEndSettings } = useUpdateOpenEnd(surveyMeta);

  const onChange = ({
    use = useOpenEnd,
    force = forceOpenEnd,
    allowNumberOnly = numberOnly,
    useAI = AICategorize,
    direction = openEndDirection,
  }: OpenEndMutationProps) => {
    return updateOpenEndSettings(
      {
        use,
        force,
        allowNumberOnly,
        useAI,
        aID,
        openEndDirection: direction,
      },
      {
        revalidate: false,
        optimisticData: (currentData: any) => {
          const nextState = produce(
            currentData,
            (draftState: QueryResponse) => {
              const { questionlist } = draftState;
              const answer =
                questionlist[pIndex].questions[qIndex].answers[aIndex];
              answer.openend = use;
              answer.forceopenendresponse = force;
              answer.number_only = allowNumberOnly;
              answer.ai_categorize = useAI;
              answer.openEndDirection = direction;
            }
          );
          return nextState;
        },
        rollbackOnError() {
          notificationApi.error({
            message: "Error",
            description: "Error while updating open-end settings",
          });
          return true;
        },
      }
    );
  };

  const onMenuClick = (key: string) => {
    if (key === "categorizer_setup") {
      setOpen(false);
      setOpenEndCategorizeModalOpen(true, aID);
      setCategorizeListArray(categorizeList);
    }
  };

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "force_response",
      label: (
        <Checkbox
          onChange={(e) => {
            onChange({
              force: e.target.checked,
            });
          }}
          checked={forceOpenEnd}
        >
          Force response
        </Checkbox>
      ),
    },
    {
      key: "number_only",
      label: (
        <Checkbox
          onChange={(e) => {
            onChange({
              allowNumberOnly: e.target.checked,
            });
          }}
          checked={numberOnly}
        >
          Number only
        </Checkbox>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "direction",
      type: "group",
      label: "Precodes direction",
      children: [
        {
          key: "direction_radio",
          label: (
            <Radio.Group
              value={openEndDirection}
              onChange={(e) => {
                onChange({
                  direction: e.target.value,
                });
              }}
            >
              <Radio value={"horizontal"}>Horizontal</Radio>
              <Radio value={"vertical"}>Vertical</Radio>
            </Radio.Group>
          ),
        },
      ],
    },
    {
      type: "divider",
    },
    {
      key: "ai",
      type: "group",
      label: "MROC AI",
      children: [
        {
          key: "ai_categorize",
          label: (
            <Checkbox
              onChange={(e) => {
                onChange({
                  useAI: e.target.checked,
                });
              }}
              checked={AICategorize}
            >
              AI categorize
            </Checkbox>
          ),
        },
        {
          key: "categorizer_setup",
          label: "Categorizer setup",
          disabled: !AICategorize,
        },
      ],
    },
  ];

  return (
    <div>
      <div
        style={{
          outline: "rgb(223, 223, 223) solid 1px",
          display: "flex",
          flexDirection: "row",
          borderRadius: "6px",
          paddingInlineStart: 8,
          paddingInlineEnd: 8,
          height: "100%",
        }}
        className="tw-flex tw-flex-row tw-items-center "
      >
        <Tooltip placement="left" title="Open end">
          <Checkbox
            checked={useOpenEnd}
            onChange={(e) => {
              onChange({
                use: e.target.checked,
              });
            }}
          />
        </Tooltip>
        {useOpenEnd ? (
          <Dropdown
            onOpenChange={handleOpenChange}
            open={open}
            placement="bottom"
            menu={{
              items: dropdownItems,
              onClick: ({ key }) => {
                onMenuClick(key);
              },
            }}
          >
            <div className="tw-cursor-pointer tw-rounded tw-flex tw-justify-center tw-ml-1 hover:tw-bg-slate-100">
              <FaAsterisk
                color={forceOpenEnd ? token.colorError : "rgba(0,0,0,.88)"}
              />
            </div>
          </Dropdown>
        ) : null}
      </div>
    </div>
  );
}

export default React.memo(OpenEnd);
