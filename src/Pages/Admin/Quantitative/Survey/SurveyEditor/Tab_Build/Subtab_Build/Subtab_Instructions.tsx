import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import ErrorFallback from "~/component/Global/Suspense/ErrorFallback";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";
import { updateSurveyInstructions } from "./api";
import { useAuth } from "~/context/Auth/AuthContext";

type FormSchema = {
  instructions: string;
};

const Subtab_Instructions = () => {
  const [surveyData] = useSurveyEditorStore(
    useShallow((state) => [state.surveyData])
  );
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const { notificationApi } = useAuth();
  const [form] = Form.useForm();

  if (!surveyData) {
    return <ErrorFallback errorTitle="No Survey Data" />;
  }

  const { instructions } = surveyData.detail;

  const noInstructions = instructions === "";

  useEffect(() => {
    if (instructions) {
      form.setFieldValue("instructions", instructions);
    } else {
      form.setFieldValue("instructions", "");
    }
  }, [instructions]);

  const onFinish = async (event: FormSchema) => {
    try {
      setIsLoading(true);
      await updateSurveyInstructions(event.instructions, surveyData.detail.id);
      notificationApi.success({
        message: "Success",
        description: "Instructions updated",
      });
      setIsLoading(false);
    } catch (error) {
      notificationApi.error({
        message: "Error",
        description: "Failed to update instructions",
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item<FormSchema> label="Instructions" name={"instructions"}>
          <Input.TextArea autoSize={{ maxRows: 30, minRows: 10 }} />
        </Form.Item>
        <div>
          <Button type="primary" htmlType="submit" loading={IsLoading}>
            {noInstructions ? "Add Instructions" : "Update Instructions"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Subtab_Instructions;
