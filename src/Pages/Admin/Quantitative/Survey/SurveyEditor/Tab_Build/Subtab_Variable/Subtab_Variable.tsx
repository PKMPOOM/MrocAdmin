import { useState, createContext } from "react";
import { Button, Result, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CreateNewVariable from "../../../../../../../Components/Survey/Modal/CreateNewVariable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VariableTypes } from "../../../../../../../Interface/SurveyEditorInterface";
import { useAuth } from "../../../../../../../Context/Auth/AuthContext";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";

interface VariableContextType {
  IsModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const newVarModalContext = createContext<VariableContextType>(
  {} as VariableContextType
);

function Subtab_Variables() {
  const [surveyID] = useSurveyEditorStore((state) => [
    state.surveyMeta.surveyID,
  ]);
  const { Axios } = useAuth();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const queryClient = useQueryClient();

  const hasSelected = selectedRowKeys.length > 0;
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  //! open or close modal
  const [IsModalOpen, setIsModalOpen] = useState(false);

  //! table col
  const columns: ColumnsType<VariableTypes> = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      width: 50,
    },
    {
      title: "Variable name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Create date",
      dataIndex: "date_create",
      key: "date_create",
      render: (_: any, { date_create }) => (
        <div>{dayjs(date_create).format("DD-MMM-YYYY")}</div>
      ),
      width: 150,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: string, { id }) => (
        <>
          <Button
            onClick={() => {
              console.log("delete", id);
            }}
            danger
            type="text"
            icon={<DeleteOutlined />}
          />
        </>
      ),
      width: 150,
    },
  ];

  const {
    isLoading,
    error: VariableError,
    data: Variables,
  } = useQuery({
    queryKey: [`Variable`, surveyID],
    queryFn: (): Promise<VariableTypes[]> =>
      Axios.get(`survey/${surveyID}/variables`).then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const value: VariableContextType = {
    IsModalOpen,
    setIsModalOpen,
  };

  if (VariableError) {
    return (
      <div className="tw-w-full tw-items-start tw-justify-center tw-h-full tw-flex ">
        <Result
          status="error"
          title="Error loading variable data"
          subTitle="We apologize for the inconvenience, but an error occurred while attempting to load the requested data."
          extra={[
            <>
              <Button
                type="primary"
                key="console"
                onClick={() => {
                  queryClient.refetchQueries({
                    queryKey: [`Variable`, surveyID],
                  });
                }}
              >
                Reload
              </Button>
            </>,
          ]}
        />
      </div>
    );
  }

  return (
    <newVarModalContext.Provider value={value}>
      <div className="tw-flex tw-flex-col tw-gap-4">
        <div className="tw-flex tw-flex-row tw-gap-2">
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            New Variable
          </Button>
          <Button
            onClick={() => {
              // deleteMultiRow();
              // queryClient.refetchQueries({
              //   queryKey: [`Variable`, surveyID],
              //   type: "active",
              // });
            }}
            disabled={!hasSelected}
            icon={<DeleteOutlined />}
            danger
          >
            Delete
          </Button>
          <Button disabled={!hasSelected} icon={<CopyOutlined />} type="dashed">
            Copy
          </Button>
        </div>
        <Table
          loading={isLoading}
          rowSelection={rowSelection}
          pagination={{
            defaultPageSize: 20,
          }}
          scroll={{
            y: "calc(100vh - 400px)",
          }}
          dataSource={Variables}
          columns={columns}
        />
      </div>
      <CreateNewVariable />
    </newVarModalContext.Provider>
  );
}

export default Subtab_Variables;
