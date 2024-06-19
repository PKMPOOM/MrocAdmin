import { PlusOutlined, RetweetOutlined } from "@ant-design/icons";
import { Button, Drawer, Image, Input } from "antd";
import dayjs from "dayjs";
import { LuArrowUpRight } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useThemeContext } from "../../../../../../../Context/Theme/ApplicationProvider";
import { getSurveyList } from "../../../../../../../Pages/Admin/Quantitative/Survey/api";
import { useSectionEditorStore } from "../../../../../../../Store/useSectionEditorStore";
import ErrorFallback from "../../../../../../Global/Suspense/ErrorFallback";
import DescValue from "../../../../../../Global/Utils/DescValue";

const AddSurveyDrawer = () => {
  const [
    sectionData,
    addSurveyDrawerOpen,
    setAddSurveyDrawerOpen,
    addSurvey,
    indexData,
  ] = useSectionEditorStore((state) => [
    state.sectionData,
    state.surveyDrawerOpen,
    state.setSurveyDrawerOpen,
    state.addSurvey,
    state.indexData,
  ]);

  const { token } = useThemeContext();

  const { data: surveyList, error, mutate } = getSurveyList();

  const onCancel = () => {
    setAddSurveyDrawerOpen(false);
  };

  const BlockDataState = sectionData?.blocks[indexData.activeBlockIndex];
  const filteredBlogList = surveyList?.filter(
    (item) =>
      !BlockDataState?.surveys?.some((current) => current.id === item.id)
  );

  if (error) {
    return (
      <Drawer
        width={"80vw"}
        title="Select Survey"
        footer={null}
        open={addSurveyDrawerOpen}
        onClose={onCancel}
      >
        <ErrorFallback
          errorTitle="Error loading Content List"
          retryFn={mutate}
        />
      </Drawer>
    );
  }

  return (
    <Drawer
      title="Select Survey"
      placement="right"
      size="large"
      onClose={onCancel}
      open={addSurveyDrawerOpen}
    >
      <div className=" tw-flex tw-flex-col tw-gap-2">
        <div className=" tw-flex tw-gap-2">
          <Input.Search
            placeholder="Search"
            onChange={(e) => {
              if (e.target.value === "") {
                mutate();
              }
            }}
          />
          <Button
            onClick={() => {
              mutate();
            }}
            icon={<RetweetOutlined />}
          >
            Refresh
          </Button>
        </div>

        <div className="  tw-h-[calc(100vh-160px)] tw-overflow-y-auto ">
          {filteredBlogList?.map((survey) => {
            return (
              <div
                key={survey.id}
                style={{
                  border: `1px solid ${token.colorBorder}`,
                }}
                className={`tw-group tw-transition-all tw-duration-200 tw-p-2 tw-rounded tw-min-w-full tw-flex tw-gap-2 tw-my-1`}
              >
                <Image
                  style={{
                    aspectRatio: "1/1",
                    objectFit: "cover",
                    height: "80px",
                    borderRadius: "4px",
                  }}
                  src={
                    "https://gfuwezskflleiadzwihe.supabase.co/storage/v1/object/public/Images/system/image-file-4.png"
                  }
                />
                <div className="tw-flex tw-flex-col tw-gap-1 ">
                  <DescValue keyValue="Name" value={survey.name} />
                  <DescValue
                    keyValue="Date created"
                    value={dayjs(survey.createdate).format("DD MMM YYYY")}
                  />

                  {/* <DescValue keyValue="Type" value={content.type} /> */}
                </div>
                <div className="tw-flex tw-gap-4  tw-ml-auto tw-items-center">
                  <div className="group-hover:tw-opacity-100 tw-opacity-0 tw-flex tw-duration-200 tw-transition-all tw-gap-4">
                    <Link target="_blank" to={`/content/${survey.id}`}>
                      <div className=" tw-flex tw-gap-2 tw-items-center">
                        <p>View</p>
                        <LuArrowUpRight />
                      </div>
                    </Link>
                    <Link
                      target="_blank"
                      to={`/admin/system/newsfeed/content/${survey.id}`}
                    >
                      <div className=" tw-flex tw-gap-2 tw-items-center">
                        <p>Edit</p>
                        <LuArrowUpRight />
                      </div>
                    </Link>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      addSurvey(survey);
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Drawer>
  );
};

export default AddSurveyDrawer;
