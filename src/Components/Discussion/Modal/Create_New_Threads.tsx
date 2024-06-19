import { memo, useContext, useState } from "react";
import { Button, Form, Modal } from "antd";
import Create_Discussion_Form from "./Create_Discussion_Form";
import { DiscussionListContxt } from "../../../Pages/Admin/Qualitative/DiscussionListPage";
import { useAuth } from "../../../Context/Auth/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { UploadFile } from "antd/es/upload";

type NewDiscussionFormSchema = {
  name: string;
  type: string;
  blinded: boolean;
  show_avatar: boolean;
  display_name: string;
  send_email: boolean;
  edit_option: boolean;
  dragger: UploadFile[];
};

const Create_New_Threads = memo(() => {
  const [createDiscussionForm] = Form.useForm();
  const [Loading, setLoading] = useState(false);

  const { Axios } = useAuth();
  const { CreateModalOpen, setCreateModalOpen } =
    useContext(DiscussionListContxt);

  const queryClient = useQueryClient();

  const onSubmit = async (formData: NewDiscussionFormSchema) => {
    setLoading(true);
    const { dragger } = formData;

    try {
      const response = await Axios.post("/discussion", {
        ...formData,
      });

      if (dragger !== undefined && response.status === 200) {
        await Axios.post(
          `/discussion/${response.data.discussionId}/image_upload`,
          {
            file: dragger[0].originFileObj,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
          .then(() => {
            queryClient.invalidateQueries(["discussionlist"]);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
            setCreateModalOpen(false);
          });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Modal
      title="Create New Discussion"
      open={CreateModalOpen}
      footer={null}
      width={1000}
      onCancel={() => {
        setCreateModalOpen(false);
      }}
    >
      <Form
        name="create_new_discussion"
        form={createDiscussionForm}
        layout="vertical"
        requiredMark="optional"
        onFinish={onSubmit}
        initialValues={{
          name: "New Discussion",
          type: "nested",
          blinded: false,
          show_avatar: true,
          display_name: "user_name",
          send_email: false,
          edit_option: false,
        }}
      >
        <Create_Discussion_Form />

        {/* Footer */}

        <div className=" tw-flex tw-flex-row tw-gap-2 tw-mt-4 tw-justify-between">
          <div className=" tw-ml-auto tw-flex tw-gap-2">
            <Button
              onClick={() => {
                setCreateModalOpen(false);
              }}
              type="text"
              htmlType="reset"
            >
              Cancel
            </Button>
            <Button htmlType="submit" type="primary" loading={Loading}>
              Create New Discussion
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
});

export default Create_New_Threads;
