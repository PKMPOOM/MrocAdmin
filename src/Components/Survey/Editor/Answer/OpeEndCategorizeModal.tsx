import { Button, Form, Modal, Select } from "antd";
import { memo, useState } from "react";
import { useAuth } from "../../../../Context/Auth/AuthContext";
import { useSurveyEditorStore } from "~/store/useSurveyEditorStore";

const OpeEndCategorizeModal = () => {
  const [
    categorizerData,
    setOpenEndCategorizeModalOpen,
    setCategorizeListArray,
  ] = useSurveyEditorStore((state) => [
    state.categorizerData,
    state.setOpenEndCategorizeModalOpen,
    state.setCategorizeListArray,
  ]);
  const [Loading, setLoading] = useState(false);
  const { Axios } = useAuth();

  const handleCancel = () => {
    setOpenEndCategorizeModalOpen(false, "");
    setCategorizeListArray([]);
  };

  const PostData = async (postData: string[]) => {
    setLoading(true);
    //todo double check
    await Axios.put(`/answer/${categorizerData.answerID}/categorize/`, {
      data: postData,
    })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        // queryClient.invalidateQueries(["SurveyData", surveyID]);
        setOpenEndCategorizeModalOpen(false, "");
      });
  };

  return (
    <Modal
      open={categorizerData.modalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        layout="vertical"
        initialValues={{
          test: categorizerData.categorizeList,
        }}
      >
        <Form.Item label="Categorize open-end response into">
          <Select
            value={categorizerData.categorizeList}
            onChange={setCategorizeListArray}
            notFoundContent={null}
            mode="tags"
          />
        </Form.Item>
        <div className="tw-flex tw-gap-2 tw-ml-auto tw-justify-end">
          <Button onClick={handleCancel} type="text">
            Cancel
          </Button>
          <Button
            loading={Loading}
            onClick={() => {
              PostData(categorizerData.categorizeList);
            }}
            type="primary"
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default memo(OpeEndCategorizeModal);
