import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Form, Input, Radio, Select } from "antd";
import dayjs from "dayjs";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ErrorFallback from "../../../../../../../Components/Global/Suspense/ErrorFallback";
import LoadingFallback from "../../../../../../../Components/Global/Suspense/LoadingFallback";
import DescValue from "../../../../../../../Components/Global/Utils/DescValue";
import AddBlockDropdown from "../../../../../../../Components/System/UserFeedSettings/Section/AddBlockDropdown";
import AddContentDrawer from "../../../../../../../Components/System/UserFeedSettings/Section/[id]/Block/Drawer/AddContentDrawer";
import AddDiscussionDrawer from "../../../../../../../Components/System/UserFeedSettings/Section/[id]/Block/Drawer/AddDiscussionDrawer";
import AddSurveyDrawer from "../../../../../../../Components/System/UserFeedSettings/Section/[id]/Block/Drawer/AddSurveyDrawwer";
import SectionRowEditor from "../../../../../../../Components/System/UserFeedSettings/Section/[id]/SectionRowEditor";
import { useAuth } from "../../../../../../../Context/Auth/AuthContext";
import { StatusOption } from "../../../../../../../Interface/SurveyEditorInterface";
import { useSectionEditorStore } from "../../../../../../../Store/useSectionEditorStore";
import { getSectionById, updateSection } from "../api";
import { useThemeContext } from "../../../../../../../Context/Theme/ApplicationProvider";

const StatusOptions: StatusOption[] = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Draft",
    label: "Draft",
  },
];

type SectionForm = {
  title: string;
  status: "Active" | "Draft" | "Closed";
  display_title: boolean;
  type: "hero" | "card";
};

const SectionEditor = () => {
  const { id: paramID } = useParams();
  const [sectionForm] = Form.useForm<SectionForm>();
  const { notificationApi } = useAuth();
  const { token } = useThemeContext();
  const [Loading, setLoading] = useState(false);

  const [
    setSectionData,
    sectionData,
    removedContent,
    removedContentReset,
    onChangeSectionType,
    SectionListData,
  ] = useSectionEditorStore((state) => [
    state.setSectionData,
    state.sectionData,
    state.removedContent,
    state.removedBlockReset,
    state.onChangeSectionType,
    state.sectionListData,
  ]);

  const { data, isLoading, error, mutate } = getSectionById(paramID);

  useEffect(() => {
    if (data) {
      sectionForm.setFieldsValue({
        title: data.title,
        status: data.status,
        display_title: data.display_title,
        type: data.type,
      });
      setSectionData(data);
      removedContentReset();
    }
  }, [data]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <ErrorFallback errorTitle="Error loading Section data" retryFn={mutate} />
    );
  }

  const onFinish = async (sectionFormsData: any) => {
    const remain_blocks = sectionData?.blocks.map((block) => {
      const nextState = produce(block, (draftstate) => {
        switch (block.content_type) {
          case "blog":
            const blogdataindex = draftstate.blog.map((item) => item.id);
            return { ...block, content_order: blogdataindex };
          case "discussion":
            const discussiondataindex = draftstate.discussions.map(
              (item) => item.id
            );
            return { ...block, content_order: discussiondataindex };
          case "survey":
            const surveydataindex = draftstate.surveys.map((item) => item.id);
            return { ...block, content_order: surveydataindex };
        }
      });

      return nextState;
    });

    const updateSectionData = {
      ...sectionFormsData,
      remove_blocks_id: removedContent,
      index: SectionListData?.length,
      remain_blocks: remain_blocks,
      content_order: sectionData?.blocks.map((item) => item.id),
      width_order: sectionData?.blocks
        .map((item) => item.width)
        .map((number) => (number === null ? 0 : number)),
    };

    setLoading(true);
    try {
      await updateSection(sectionData?.id!, updateSectionData);
      notificationApi.success({
        message: "Section Created",
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const contentLength = sectionData?.blocks?.length;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Breadcrumb
        items={[
          {
            title: (
              <Link to={"/admin/Dashboard"}>
                <HomeOutlined />
              </Link>
            ),
          },
          {
            title: (
              <Link to={"/admin/system/newsfeed?tab=section"}>
                <UserOutlined />
                <span>User Feed Settings</span>
              </Link>
            ),
          },
          {
            title: isLoading ? "Loading" : sectionData?.title,
          },
        ]}
      />

      <Form
        wrapperCol={{ flex: "auto" }}
        form={sectionForm}
        title="Site Settings"
        layout="vertical"
        requiredMark="optional"
        onFinish={onFinish}
        initialValues={{
          type: "card",
          status: "Draft",
          display_title: false,
        }}
      >
        <div className="tw-flex tw-gap-2 tw-justify-end ">
          {sectionData && (
            <div className="tw-grid tw-grid-cols-2 tw-w-full">
              <DescValue keyValue="Id" value={sectionData.id} />
              <DescValue
                keyValue="Date created"
                value={dayjs(sectionData.date_created).format("DD MMM YYYY")}
              />
            </div>
          )}

          <div className="tw-flex tw-gap-2 tw-justify-end ">
            <Link to={"/admin/system/newsfeed"}>
              <Button>Back</Button>
            </Link>
            <Button loading={Loading} htmlType="submit" type="primary">
              {"Save"}
            </Button>
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-4 tw-gap-2 ">
          <Form.Item<SectionForm>
            label="Title"
            name={"title"}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<SectionForm>
            label="Display Type"
            name={"type"}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={[
                {
                  value: "hero",
                  label:
                    contentLength && contentLength > 1 ? (
                      <p>
                        Hero{" "}
                        <span className="tw-text-red-400 tw-bg-red-50 tw-px-1 tw-rounded tw-border tw-border-red-400">
                          Only 1 content allowed
                        </span>
                      </p>
                    ) : (
                      "Hero"
                    ),
                  disabled: contentLength ? contentLength > 1 : false,
                },
                {
                  value: "card",
                  label: "Card",
                },
              ]}
              onChange={(e) => onChangeSectionType(e)}
            />
          </Form.Item>
          <Form.Item<SectionForm>
            label="Status"
            name={"status"}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select options={StatusOptions} />
          </Form.Item>
          <Form.Item<SectionForm>
            label="Show Title"
            name={"display_title"}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      </Form>

      <div
        style={{
          border: `1px solid ${token.colorBorder}`,
        }}
        className="tw-rounded-xl tw-relative tw-min-h-[350px] tw-flex tw-gap-3 tw-w-full tw-p-3 tw-justify-center tw-items-start "
      >
        {sectionData?.blocks?.length === 0 && (
          <div className="tw-mt-28 tw-absolute ">
            <AddBlockDropdown
              buttonSize="middle"
              index={0}
              sectionID={sectionData.id}
              label="Add Block"
            />
          </div>
        )}

        <SectionRowEditor />
        <AddContentDrawer />
        <AddDiscussionDrawer />
        <AddSurveyDrawer />
      </div>
    </div>
  );
};

export default SectionEditor;
