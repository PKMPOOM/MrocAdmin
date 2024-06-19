import { Empty, Typography } from "antd";
import {
  ProfileSurveyGroupBySurvey,
  ProfileSurveyGroupByUser,
} from "~/src/Pages/Admin/User/Manage_profile_survey/ManageProfileSurveyPage";

const { Text } = Typography;

type Props = {
  groupBy: "user" | "survey";
  groupBySurveyData?: ProfileSurveyGroupBySurvey;
  groupByUserData?: ProfileSurveyGroupByUser;
  refetchFn: () => void;
};

function ProfileSurveyDataDisplayer({
  groupBySurveyData,
  groupByUserData,
  groupBy = "survey",
}: Props) {
  const groupBySurveyDataAvailable =
    groupBySurveyData &&
    Object.keys(groupBySurveyData.surveyResponse).length > 0;

  const groupByUserDataAvailable =
    groupByUserData && Object.keys(groupByUserData.surveyResponse).length > 0;

  if (groupBy === "survey") {
    return (
      <div className=" tw-flex tw-flex-col tw-gap-2 tw-max-h-64 tw-overflow-auto tw-pl-8 ">
        {/* <pre>{JSON.stringify(groupBySurveyData, null, 2)}</pre> */}

        {groupBySurveyDataAvailable ? (
          Object.keys(groupBySurveyData.surveyResponse).map((key) => {
            return (
              <div key={key} className=" tw-flex tw-gap-2">
                <div>{key.replaceAll("_", " ")}</div>
                <div>
                  {
                    <div className=" tw-flex tw-flex-col">
                      {groupBySurveyData?.surveyResponse[key].map((item) => (
                        <Text key={item.User.id} type="secondary">
                          - {item.User.username}
                        </Text>
                      ))}
                    </div>
                  }
                </div>
              </div>
            );
          })
        ) : (
          <Empty />
        )}
      </div>
    );
  } else {
    return (
      <div className=" tw-flex tw-flex-col tw-gap-2 tw-max-h-64 tw-overflow-auto tw-pl-8 ">
        {/* <pre>{JSON.stringify(groupByUserData, null, 2)}</pre> */}
        {groupByUserDataAvailable ? (
          Object.keys(groupByUserData.surveyResponse).map((key) => {
            return (
              <div key={key} className=" tw-flex tw-gap-2">
                <div>{key.replaceAll("_", " ")}</div>
                <div>
                  {
                    <div className=" tw-flex tw-flex-col">
                      {groupByUserData &&
                        groupByUserData.surveyResponse[key].map((item) => (
                          <Text key={item.surveys.name} type="secondary">
                            - {item.surveys.name}
                          </Text>
                        ))}
                    </div>
                  }
                </div>
              </div>
            );
          })
        ) : (
          <Empty />
        )}
      </div>
    );
  }
}

export default ProfileSurveyDataDisplayer;
