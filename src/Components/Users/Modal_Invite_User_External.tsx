import React, { useContext, useState } from "react";
import { Button, Checkbox, Divider, Form, Input, Modal } from "antd";
import {
  ExternalInvitationContext,
  ExternalUserInvitationDataSchema,
} from "../../Pages/Admin/User/Invite_user/External/Invite_External_Community";
import { useAuth } from "../../Context/Auth/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const Modal_Intive_User_External = React.memo(
  ({ data }: { data: ExternalUserInvitationDataSchema | undefined }) => {
    const [form] = Form.useForm();
    const { setActiveHistoryData, InviteModalOpen, setInviteModalOpen } =
      useContext(ExternalInvitationContext);
    const [Loading, setLoading] = useState(false);
    const { Axios } = useAuth();
    const { AuthUser } = useAuth();
    const queryClient = useQueryClient();

    const formItemStyle = {
      marginBottom: 8,
      width: "100%",
    };

    const NewInvitation = !data ? true : false;

    const closeModal = () => {
      form.setFieldsValue({
        api_key: "",
        form_name: "",
        form_description: "",
        survey_id: "",
        conditions: [],
        extra_conditions: "",
      });
      setActiveHistoryData(undefined);
      setInviteModalOpen(false);
    };

    if (InviteModalOpen && data) {
      form.setFieldsValue({
        api_key: data.api_key,
        form_name: data.name,
        form_description: data.form_description,
        survey_id: data.survey_id,
        conditions: data.conditions,
        extra_conditions: data.extra_conditions,
      });
    }

    const onCreateNew = async (event: ExternalUserInvitationDataSchema) => {
      console.log(event);
      if (NewInvitation) {
        setLoading(true);
        await Axios.post("/invitation", {
          data: event,
        }).then(() => {
          setLoading(false);
        });
        closeModal();
        queryClient.invalidateQueries(["invitationhistory", AuthUser?.id]);
      } else {
        setLoading(true);
        await Axios.put(`/invitation/${data?.id}`, {
          data: event,
        }).then(() => {
          setLoading(false);
        });
        closeModal();
        queryClient.invalidateQueries(["invitationhistory", AuthUser?.id]);
      }
    };

    return (
      <Modal
        width={"700px"}
        onCancel={closeModal}
        open={InviteModalOpen}
        footer={null}
        title="Invite user"
      >
        <Form
          initialValues={{
            api_key: "",
            form_name: "",
            form_description: "",
            survey_id: "",
            conditions: [],
            extra_conditions: "",
          }}
          form={form}
          title="Invite user"
          layout="vertical"
          requiredMark="optional"
          onFinish={onCreateNew}
        >
          <Form.Item
            style={formItemStyle}
            rules={[
              {
                required: true,
                message: "Invitation name cannot be blank",
              },
            ]}
            name={"form_name"}
            label="Name"
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            style={formItemStyle}
            name={"form_description"}
            label="Description"
          >
            <Input.TextArea placeholder="Description" />
          </Form.Item>
          {/* Button */}
          <Divider />
          <div className="tw-flex tw-gap-4 ">
            <div className="tw-flex tw-flex-col tw-w-2/6">
              <Form.Item
                style={formItemStyle}
                name={"survey_id"}
                label="Survey ID"
                rules={[
                  {
                    required: true,
                    message: "Survey ID cannot be blank",
                  },
                ]}
              >
                <Input placeholder="Survey ID" />
              </Form.Item>
              <Form.Item
                style={formItemStyle}
                name={"api_key"}
                label="API Key"
                rules={[
                  {
                    required: true,
                    message: "API Key cannot be blank",
                  },
                ]}
              >
                <Input placeholder="API Key" />
              </Form.Item>
              <Form.Item
                style={formItemStyle}
                name={"conditions"}
                label="Conditions"
                rules={[
                  {
                    required: true,
                    message: "please select at least 1 condition",
                  },
                ]}
              >
                <Checkbox.Group>
                  <div className="tw-flex tw-flex-col tw-gap-1">
                    <Checkbox value={"qualified"}>Qualified</Checkbox>
                    <Checkbox value={"terminated"}>Terminated</Checkbox>
                    <Checkbox value={"overquota"}>Overquota</Checkbox>
                    <Checkbox value={"partials"}>Partials</Checkbox>
                  </div>
                </Checkbox.Group>
              </Form.Item>
            </div>
            <div className="tw-flex tw-w-4/6 ">
              <Form.Item
                style={formItemStyle}
                name={"extra_conditions"}
                label="Extra conditions"
              >
                <Input.TextArea
                  autoSize={{ minRows: 5, maxRows: 10 }}
                  placeholder="Extra conditions"
                />
              </Form.Item>
            </div>
          </div>
          <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
            <Button onClick={closeModal} type="text">
              Cancel
            </Button>
            {data ? (
              <Button loading={Loading} htmlType="submit" type="primary">
                Save
              </Button>
            ) : (
              <Button loading={Loading} htmlType="submit" type="primary">
                Create new
              </Button>
            )}
          </div>
        </Form>
      </Modal>
    );
  }
);

export default Modal_Intive_User_External;
