import { DownOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Dropdown,
  Radio,
  Select,
  Table,
  TimeRangePickerProps,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import {
  getProfileSurveyGroupBySurvey,
  getProfileSurveyGroupByUser,
  getProfileSurveyNameList,
} from "./api";
import IsBetween from "dayjs/plugin/isBetween";
import _ from "lodash";
import Papa from "papaparse";
import ProfileSurveyDataDisplayer from "~/component/Users/Show_User/Manage_profile_survey/ProfileSurveyData";
dayjs.extend(IsBetween);

const { Title } = Typography;
const { RangePicker } = DatePicker;

type GroupByOptions = "user" | "survey";
type queryType = {
  page: number;
  pageSize: number;
  sort: "asc" | "desc";
  sortBy: string;
  groupBy: GroupByOptions;
  filter: {
    selected: string[];
    dateRange: [Dayjs | undefined, Dayjs | undefined];
  };
};

const initQuery: queryType = {
  page: 1,
  pageSize: 10,
  sort: "asc",
  sortBy: "id",
  groupBy: "survey",
  filter: {
    selected: ["all"],
    dateRange: [undefined, undefined],
  },
};

const dropdownItem = [
  {
    label: "Add Points",
    key: "add_points",
  },
  {
    label: "Add to Discussion or Survey",
    key: "add_to_discussion_or_survey",
  },
  {
    label: "Create Email Campaign",
    key: "create_email_campaign",
  },
  {
    label: "Send Activation Link",
    key: "sending_activation_link",
  },
  {
    label: "Send First Login Reminder",
    key: "send_first_login_reminder",
  },
  {
    label: "Copy to Clipboard",
    key: "copy_to_clipboard",
  },
  {
    label: "Clear Clipboard",
    key: "clear_clipboard",
  },
  {
    label: "Copy Random users to Clipboard",
    key: "copy_random_users_to_clipboard",
  },
];

const dropdownItem2 = [
  {
    label: "Export selected",
    key: "export_selected",
  },
];

const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Last 7 Days", value: [dayjs().subtract(7, "d"), dayjs()] },
  { label: "Last 14 Days", value: [dayjs().subtract(14, "d"), dayjs()] },
  { label: "Last 30 Days", value: [dayjs().subtract(30, "d"), dayjs()] },
  { label: "Last 1 Year", value: [dayjs().subtract(365, "d"), dayjs()] },

  {
    label: "Until last year",
    value: [dayjs().subtract(100, "y"), dayjs().subtract(365, "d")],
  },
  {
    label: "Until last month",
    value: [dayjs().subtract(100, "y"), dayjs().subtract(1, "M")],
  },
  {
    label: "Until last week",
    value: [dayjs().subtract(100, "y"), dayjs().subtract(7, "d")],
  },
];

export type ProfileSurveyGroupBySurvey = {
  id: string;
  key: number;
  name: string;
  latestActivity: Date;
  latestUser: string;
  surveyResponse: {
    [key in string]: GroupBySurveyData[];
  };
};

export interface GroupBySurveyData {
  date_create: string;
  User: User;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export type ProfileSurveyGroupByUser = {
  id: string;
  key: number;
  email: string;
  username: string;
  surveyResponse: {
    [key in string]: GroupByUserData[];
  };
};

export type GroupByUserData = {
  date_create: string;
  surveys: {
    name: string;
  };
};

const profileSurveyGroupBySurveyColumns: ColumnsType<ProfileSurveyGroupBySurvey> =
  [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      width: 50,
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      width: 200,
      render: () => (
        <div className=" tw-flex tw-gap-2 ">
          <Button>Export</Button>
        </div>
      ),
    },
    Table.EXPAND_COLUMN,
  ];

const profileSurveyGroupByUserColumns: ColumnsType<ProfileSurveyGroupByUser> = [
  {
    title: "ID",
    dataIndex: "key",
    key: "key",
    width: 50,
    sorter: (a, b) => a.key - b.key,
  },
  {
    title: "Name",
    dataIndex: "username",
    key: "username",
    render: (_, record) => (
      <div className=" tw-flex tw-gap-2 ">
        <div className="">{record.username} | </div>
        <div className="">{record.email}</div>
      </div>
    ),
  },
  {
    width: 200,
    render: () => (
      <div className=" tw-flex tw-gap-2 ">
        <Button>Export</Button>
      </div>
    ),
  },
  Table.EXPAND_COLUMN,
];

const ManageProfileSurveyPage = () => {
  const [GroupResponseBy, setGroupResponseBy] = useState<GroupByOptions>(
    initQuery.groupBy
  );
  const [Filter, setFilter] = useState<queryType["filter"]>(initQuery.filter);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // ====== fetch data ======
  const { data: dataGroupBySurvey, isLoading: groupBySurveyLoading } =
    getProfileSurveyGroupBySurvey(GroupResponseBy);
  const { data: dataGroupByUser, isLoading: groupByUserLoading } =
    getProfileSurveyGroupByUser(GroupResponseBy);
  // ====== fetch survey name for Select components ======
  const { data: surveyNameList } = getProfileSurveyNameList();

  const nonDateRangeSelected =
    Filter.dateRange[0] === undefined && Filter.dateRange[1] === undefined;

  const onGroupByChange = (value: GroupByOptions) => {
    setGroupResponseBy(value);
  };

  const fullSurveySelectList = useMemo(() => {
    if (surveyNameList) {
      return [
        {
          label: "All",
          value: "all",
        },
        ...surveyNameList,
      ];
    }
  }, [surveyNameList]);

  const setFilterDateRange = (
    start: Dayjs | undefined,
    end: Dayjs | undefined
  ) => {
    setFilter({
      ...Filter,
      dateRange: [start, end],
    });
  };

  const onSelectedSurveyChange = (event: string[]) => {
    switch (true) {
      case event[event.length - 1] === "all":
        setFilter({
          ...Filter,
          selected: ["all"],
        });
        break;
      case event.includes("all") && event.length > 1:
        setFilter({
          ...Filter,
          selected: event.filter((item) => item !== "all"),
        });
        break;
      default:
        setFilter({
          ...Filter,
          selected: event,
        });
        break;
    }
  };

  const filteredGroupBySurveyData = useMemo(() => {
    const filteredSurveyByName = dataGroupBySurvey?.filter((item) => {
      // if all is selected and date range is undefined
      if (Filter.selected.includes("all")) {
        return true;
      }

      return Filter.selected.includes(
        // tolowercase => then make snake case
        item.name.toLowerCase().replace(/\s/g, "_")
      );
    });

    if (!nonDateRangeSelected) {
      if (filteredSurveyByName) {
        return filteredSurveyByName.filter((item) => {
          const dateKeys = Object.keys(item.surveyResponse);
          const start = dayjs(Filter.dateRange[0]);
          const end = dayjs(Filter.dateRange[1]);

          if (start && end) {
            return dateKeys.some((date) => {
              const current = dayjs(date);
              return current.isBetween(start, end, "day", "[]");
            });
          }

          // If start or end is not defined, return false
          return false;
        });
      }
    } else {
      return filteredSurveyByName;
    }
  }, [dataGroupBySurvey, Filter]);

  const filteredGroupByUserData = useMemo(() => {
    const filteredSurveyByUser = dataGroupByUser?.filter((item) => {
      // if all is selected and date range is undefined
      if (Filter.selected.includes("all")) {
        return true;
      }

      // Convert item.surveyResponse to an array of values
      const surveyResponses = Object.values(item.surveyResponse);

      // Use some on the array of survey responses
      return surveyResponses.some((response) => {
        return Filter.selected.includes(
          response[0].surveys.name.toLowerCase().replace(/\s/g, "_")
        );
      });
    });

    if (!nonDateRangeSelected) {
      if (filteredSurveyByUser) {
        return filteredSurveyByUser.filter((item) => {
          const dateKeys = Object.keys(item.surveyResponse);
          const start = dayjs(Filter.dateRange[0]);
          const end = dayjs(Filter.dateRange[1]);

          if (start && end) {
            return dateKeys.some((date) => {
              const current = dayjs(date);
              return current.isBetween(start, end, "day", "[]");
            });
          }

          // If start or end is not defined, return false
          return false;
        });
      }
    } else {
      return filteredSurveyByUser;
    }
  }, [dataGroupByUser, Filter]);

  const dateRegex =
    /^(0[1-9]|[1-2][0-9]|3[01])_(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)_(\d{4})$/;

  const getDateDataHeader = (
    profileSurveyDataGroupByUser: ProfileSurveyGroupByUser[]
  ): string[] => {
    let dateData: string[] = [];

    profileSurveyDataGroupByUser.forEach((item) => {
      // example date key: 1_Jan_2022,2_Jan_2022,3_Jan_2022
      const dateKeys = Object.keys(item.surveyResponse);
      dateKeys.forEach((date) => {
        dateData.push(date);
      });
    });

    // make sure date are unique
    return [...new Set(dateData)].sort();
  };

  const getGeneralDataHeader = (
    profileSurveyDataGroupByUser: ProfileSurveyGroupByUser[]
  ) => {
    if (profileSurveyDataGroupByUser.length === 0) {
      return [];
    }
    const headerKeys = Object.keys(profileSurveyDataGroupByUser[0]);
    return headerKeys.filter((item) => item !== "surveyResponse");
  };

  const getRowData = (item: ProfileSurveyGroupByUser[], header: string[]) => {
    const arrayData: any[][] = [];
    item.forEach((item) => {
      const row = header.map((key) => {
        if (!dateRegex.test(key)) {
          return item[key as keyof typeof item];
        } else {
          const dateKeySearch = Object.keys(item.surveyResponse)
            .map((date) => {
              if (date === key) {
                return date;
              }
            })
            .filter((test) => test !== undefined);

          if (dateKeySearch.length === 0) {
            return undefined;
          }
          if (dateKeySearch[0] === undefined) {
            return undefined;
          }

          const indextest: string = dateKeySearch[0];

          const foundSurvey = item.surveyResponse[indextest].find((survey) => {
            return dayjs(survey.date_create).format("DD_MMM_YYYY") === key;
          });

          return foundSurvey ? foundSurvey.surveys.name : undefined;
        }
      });

      arrayData.push(row);
    });

    return arrayData;
  };

  const exportProfileSurveyDataGroupByUser2 = () => {
    if (!filteredGroupByUserData) {
      return;
    }

    const dateData = getDateDataHeader(filteredGroupByUserData);
    const header = getGeneralDataHeader(filteredGroupByUserData);
    const arrayData: any[][] = [[...header, ...dateData]];
    const rowData = getRowData(
      filteredGroupByUserData,
      arrayData[0] /*header*/
    );
    arrayData.push(...rowData);

    const dataToExport = Papa.unparse(arrayData);

    const blob = new Blob([dataToExport], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const fileName = `ProfileSurvey_Groupby_${GroupResponseBy}.csv`;

    if ((navigator as any).msSaveBlob) {
      (navigator as any).msSaveBlob(blob, fileName);
    } else {
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="  tw-h-[calc(100vh-64px)] tw-flex tw-flex-col tw-gap-2 tw-overflow-auto ">
      <div className="tw-flex tw-flex-row tw-items-center ">
        <Title level={3}>Manage Profile Survey</Title>
      </div>
      <Title level={5}>Filter settings</Title>

      <div className=" tw-w-full tw-flex tw-justify-between">
        <div className=" tw-flex tw-gap-2 tw-flex-col tw-w-2/3">
          <div className=" tw-flex">
            <Select
              value={Filter.selected}
              defaultValue={initQuery.filter.selected}
              style={{ width: "100%" }}
              mode="multiple"
              options={fullSurveySelectList}
              onChange={(e) => onSelectedSurveyChange(e)}
            />
          </div>
          <div className=" tw-flex tw-gap-2 tw-items-center">
            <RangePicker
              allowClear
              presets={rangePresets}
              onChange={(e) => {
                if (e) {
                  setFilterDateRange(dayjs(e[0]), dayjs(e[1]));
                } else {
                  setFilterDateRange(undefined, undefined);
                }
              }}
            />
            <div>
              <Radio.Group
                value={GroupResponseBy}
                onChange={(e) => {
                  onGroupByChange(e.target.value as GroupByOptions);
                }}
              >
                <Radio value={"survey"}>Group by survey</Radio>
                <Radio value={"user"}>Group by user</Radio>
              </Radio.Group>
            </div>
          </div>
        </div>
        <div className=" tw-flex tw-gap-2">
          <Button onClick={exportProfileSurveyDataGroupByUser2}>
            Export .CSV
          </Button>
          <Dropdown.Button
            icon={<DownOutlined />}
            menu={{
              items: GroupResponseBy === "user" ? dropdownItem : dropdownItem2,
            }}
            onClick={(e) => console.log(e)}
          >
            Actions
          </Dropdown.Button>
        </div>
      </div>
      {GroupResponseBy === "user" ? (
        <Table
          rowKey={(record) => record.id}
          loading={groupByUserLoading}
          style={{ marginTop: "24px" }}
          columns={profileSurveyGroupByUserColumns}
          dataSource={filteredGroupByUserData}
          rowSelection={{
            selectedRowKeys,
            onChange: (newSelectedRowKeys: React.Key[]) => {
              setSelectedRowKeys(newSelectedRowKeys);
            },
          }}
          expandable={{
            expandedRowRender: (record) => (
              <>
                <ProfileSurveyDataDisplayer
                  groupBy="user"
                  refetchFn={() => {}}
                  groupByUserData={record}
                />
              </>
            ),
          }}
        />
      ) : null}
      {GroupResponseBy === "survey" ? (
        <Table
          rowKey={(record) => record.id}
          loading={groupBySurveyLoading}
          style={{ marginTop: "24px" }}
          columns={profileSurveyGroupBySurveyColumns}
          dataSource={filteredGroupBySurveyData}
          rowSelection={{
            selectedRowKeys,
            onChange: (newSelectedRowKeys: React.Key[]) => {
              setSelectedRowKeys(newSelectedRowKeys);
            },
          }}
          expandable={{
            expandedRowRender: (record) => (
              <>
                <ProfileSurveyDataDisplayer
                  groupBy="survey"
                  refetchFn={() => {}}
                  groupBySurveyData={record}
                />
              </>
            ),
          }}
        />
      ) : null}
    </div>
  );
};

export default ManageProfileSurveyPage;
