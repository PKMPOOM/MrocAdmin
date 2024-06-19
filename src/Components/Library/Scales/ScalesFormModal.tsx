import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { useAuth } from "../../../Context/Auth/AuthContext";
import {
  useCreateNewScale,
  useGetScaleData,
  useUpdateScale,
} from "../../../Pages/Admin/Library/Subtab/Scales/api";

type ModalProps = {
  ModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ActiveScalesId: string | undefined;
  setActiveScalesId: React.Dispatch<React.SetStateAction<string | undefined>>;
  refetchFn: () => void;
};

type FormSchema = {
  name: string;
  Raw_text: string;
  Raw_precodes: string;
  scaleData: {
    Precode: string;
    Text: string;
  }[];
};

function ScalesFormModal({
  ModalOpen,
  setModalOpen,
  ActiveScalesId,
  refetchFn,
  setActiveScalesId,
}: ModalProps) {
  const { notificationApi } = useAuth();
  const [form] = Form.useForm<FormSchema>();
  const { data: scaleData } = useGetScaleData(ActiveScalesId);
  const [BulkEditMode, setBulkEditMode] = useState(false);
  const [SavedRefState, setSavedRefState] = useState<FormSchema["scaleData"]>(
    []
  );
  const [isModalLoading, setisModalLoading] = useState(false);

  const isEditing = ActiveScalesId !== undefined;

  useEffect(() => {
    if (scaleData) {
      const scaleList = scaleData.scaleData.map((item) => ({
        Precode: item.Precode,
        Text: item.Text,
      }));

      form.setFieldsValue({
        name: scaleData.Name,
        scaleData: scaleList,
      });
    }
  }, [scaleData]);

  const scaleDataRef = Form.useWatch("scaleData", form);
  const rawPrecodesRef = Form.useWatch("Raw_precodes", form);
  const rawTextRef = Form.useWatch("Raw_text", form);

  const PrecodesRaw = scaleDataRef
    ?.map((item) => {
      if (item.Precode && item.Precode !== undefined) {
        return item.Precode;
      }
    })
    .join("\n");

  const TextRaw = scaleDataRef
    ?.map((item) => {
      if (item.Text && item.Text !== undefined) {
        return item.Text;
      }
    })
    .join("\n");

  const onFinish = async (values: FormSchema) => {
    setisModalLoading(true);
    try {
      if (isEditing) {
        await useUpdateScale(ActiveScalesId, values);
      } else {
        await useCreateNewScale(values);
      }
      notificationApi.success({
        message: " Success",
        description: "Create Third Party Sample Success",
      });
      setModalOpen(false);
      form.resetFields();
      setActiveScalesId(undefined);
      refetchFn();
    } catch (error) {
      notificationApi.error({
        message: " Failed",
        description: "Create Third Party Sample Failed",
      });
    }
    setisModalLoading(false);
  };

  const saveBulkEdit = () => {
    const rawPrecodes = rawPrecodesRef?.split("\n");
    const rawText = rawTextRef?.split("\n");
    const rawScaleData = rawPrecodes?.map((item, index) => {
      return {
        Precode: item,
        Text: rawText?.[index],
      };
    });

    form.setFieldsValue({
      scaleData: rawScaleData,
    });
    setBulkEditMode(false);
  };

  const initBulkEdit = () => {
    setSavedRefState(scaleDataRef);
    setBulkEditMode(true);
    form.setFieldsValue({
      Raw_precodes: PrecodesRaw,
      Raw_text: TextRaw,
    });
  };

  const undoBulkEdit = () => {
    setBulkEditMode(false);
    form.setFieldsValue({
      scaleData: SavedRefState,
    });
  };

  const onCancel = () => {
    setModalOpen(false);
    setActiveScalesId(undefined);
    form.resetFields();
  };

  return (
    <Modal onCancel={onCancel} open={ModalOpen} footer={null}>
      <Form
        layout="vertical"
        form={form}
        requiredMark="optional"
        onFinish={onFinish}
      >
        <Form.Item<FormSchema>
          label={"Scale Name"}
          style={{
            marginBottom: 8,
          }}
          name={"name"}
          rules={[
            {
              required: true,
              message: "Please input name",
            },
          ]}
        >
          <Input placeholder="Sample name" />
        </Form.Item>

        <div className="tw-max-h-[1000px] tw-overflow-auto tw-mb-5">
          {!BulkEditMode ? (
            <Form.List name="scaleData">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className=" tw-flex tw-gap-2 tw-items-end  ">
                      <Form.Item
                        style={{
                          marginBottom: 0,
                          marginTop: 8,
                          width: "30%",
                        }}
                        {...restField}
                        name={[name, "Precode"]}
                        label={
                          index === 0 ? (
                            <p className=" tw-font-semibold">Precodes</p>
                          ) : null
                        }
                        rules={[
                          { required: true, message: "Missing precodes" },
                        ]}
                      >
                        <Input placeholder="Precodes" />
                      </Form.Item>
                      <Form.Item
                        style={{
                          marginBottom: 0,
                          marginTop: 8,
                          width: "70%",
                        }}
                        {...restField}
                        name={[name, "Text"]}
                        label={
                          index === 0 ? (
                            <p className=" tw-font-semibold">Text</p>
                          ) : null
                        }
                        rules={[{ required: true, message: "Missing label" }]}
                      >
                        <Input placeholder="Label" />
                      </Form.Item>
                      <div className=" tw-w-10">
                        <Button
                          type="text"
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                        />
                      </div>
                    </div>
                  ))}
                  <div className=" tw-col-span-2 tw-mt-2">
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add({ Precode: "", Text: "" })}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add field
                      </Button>
                    </Form.Item>
                  </div>
                </>
              )}
            </Form.List>
          ) : (
            <div className=" tw-flex tw-gap-2">
              <Form.Item style={{ width: "100%" }} name={"Raw_precodes"}>
                <Input.TextArea rows={10} />
              </Form.Item>
              <Form.Item style={{ width: "100%" }} name={"Raw_text"}>
                <Input.TextArea rows={10} />
              </Form.Item>
            </div>
          )}
        </div>

        <div className=" tw-flex tw-gap-2 tw-justify-between">
          <div className=" tw-flex tw-gap-2">
            {BulkEditMode ? (
              <Button onClick={undoBulkEdit}>Back</Button>
            ) : (
              <Button onClick={initBulkEdit}>Bulk Edit</Button>
            )}
          </div>
          <div className=" tw-flex tw-gap-2">
            {!BulkEditMode ? (
              <>
                <Button onClick={onCancel} type="text">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isModalLoading}
                >
                  {isEditing ? "Update" : "Create"}
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={saveBulkEdit}>
                Save
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default ScalesFormModal;
