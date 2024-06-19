import {
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Typography, theme } from "antd";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import ErrorFallback from "../../../../../../Components/Global/Suspense/ErrorFallback";
import LoadingFallback from "../../../../../../Components/Global/Suspense/LoadingFallback";
import SectionList from "../../../../../../Components/System/UserFeedSettings/Section/List/SectionList";
import { useSectionEditorStore } from "../../../../../../Store/useSectionEditorStore";
import NewSectionModal from "./NewSectionModal";
import { getSectionList, updateSectionList } from "./api";

const { useToken } = theme;
const { Text } = Typography;

const Subtab_SectionList = () => {
  const [CreateNewSectionModalOpen, setCreateNewSectionModalOpen] =
    useState(false);
  const [FilterStatus, setFilterStatus] = useState<string[]>([
    "Active",
    "Draft",
  ]);

  const { token } = useToken();

  const [
    setSectionListData,
    SectionListData,
    setSectionData,
    setShowsectionpreview,
    showSectionPreview,
  ] = useSectionEditorStore((state) => [
    state.setSectionListData,
    state.sectionListData,
    state.setSectionData,
    state.setShowsectionpreview,
    state.showSectionPreview,
  ]);

  const { data: sectionList, isLoading, error, mutate } = getSectionList();

  // when on section list page reset current sectionData on store
  useEffect(() => {
    setSectionData(undefined);
    if (sectionList) {
      setSectionListData(sectionList);
    }
  }, [sectionList]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (error || !SectionListData) {
    return (
      <ErrorFallback errorTitle="Error loading Section" retryFn={mutate} />
    );
  }

  // if current software don't have any section
  if (sectionList?.length === 0) {
    return (
      <div className="tw-flex tw-flex-col tw-gap-2 tw-pt-24 tw-justify-center tw-items-center">
        <div className="tw-flex tw-gap-2 tw-flex-col tw-items-center ">
          <Button
            onClick={() => {
              setCreateNewSectionModalOpen(true);
            }}
            icon={<PlusOutlined />}
            type="primary"
          >
            Create New Section
          </Button>

          <Text type="secondary">Create your first section </Text>
        </div>
        <NewSectionModal
          CreateNewSectionModalOpen={CreateNewSectionModalOpen}
          setCreateNewSectionModalOpen={setCreateNewSectionModalOpen}
        />
      </div>
    );
  }

  const onDragDrop = async (event: DropResult) => {
    const sourceIndex = event.source.index;
    const destIndex = event.destination?.index;
    const elementID = event.draggableId;

    if (destIndex === undefined) {
      return;
    }

    if (sourceIndex === destIndex) {
      return;
    }

    const copyState = [...SectionListData];

    const updatedState = produce(SectionListData, (draftState) => {
      const [removeObject] = draftState.splice(sourceIndex, 1);
      draftState.splice(destIndex, 0, removeObject);
    });

    setSectionListData(updatedState);
    await updateSectionList(elementID, sourceIndex, destIndex)
      .then((res) => console.log(res)) // todo add notification on success
      .catch(() => setSectionListData(copyState)); // rollback on error
  };

  return (
    <div>
      <div className="tw-flex tw-flex-col tw-gap-4">
        <div className="tw-flex tw-gap-2 tw-items-stretch">
          <div className="tw-flex tw-gap-2">
            <Button
              onClick={() => {
                setCreateNewSectionModalOpen(true);
              }}
              icon={<PlusOutlined />}
              type="primary"
            >
              Create New Section
            </Button>
          </div>

          <div
            style={{
              border: `1px solid ${token.colorPrimaryBgHover}`,
              backgroundColor: token.colorPrimaryBg,
              borderRadius: "6px",
            }}
            className="tw-flex tw-gap-2 tw-items-center tw-px-4"
          >
            <p className="tw-font-semibold">Section status:</p>
            <Checkbox.Group
              onChange={(e) => setFilterStatus(e as string[])}
              defaultValue={["Active", "Draft"]}
            >
              <Checkbox value={"Active"}>Active</Checkbox>
              <Checkbox value={"Draft"}>Draft</Checkbox>
            </Checkbox.Group>
          </div>

          <div className="tw-ml-auto tw-gap-2 tw-flex">
            <Button
              onClick={() => {
                setShowsectionpreview(!showSectionPreview);
              }}
              icon={
                showSectionPreview === true ? (
                  <EyeOutlined />
                ) : (
                  <EyeInvisibleOutlined />
                )
              }
            >
              Preview
            </Button>
            <Button
              onClick={() => {
                mutate();
              }}
              icon={<RetweetOutlined />}
            >
              Refresh
            </Button>
          </div>
        </div>
        <NewSectionModal
          CreateNewSectionModalOpen={CreateNewSectionModalOpen}
          setCreateNewSectionModalOpen={setCreateNewSectionModalOpen}
        />

        <DragDropContext onDragEnd={onDragDrop}>
          <SectionList
            sectionList={SectionListData}
            FilterStatus={FilterStatus}
            mutate={mutate}
          />
        </DragDropContext>
      </div>
    </div>
  );
};

export default Subtab_SectionList;
