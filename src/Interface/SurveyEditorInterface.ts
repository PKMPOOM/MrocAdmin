import { Dayjs } from "dayjs";
import { ReactNode } from "react";
import { z } from "zod";

export type StatusOption = {
  value: SurveyStatusValue;
  label: string;
};

export type SurveyStatusValue = "Active" | "Draft" | "Closed";

export type SurveyType = "Regular" | "Profile" | "Poll" | "Background";

export type SurveyEditorTabs =
  | "detail"
  | "build"
  | "distribution"
  | "overview"
  | "userparticipating"
  | "data"
  | "report";

export type OverviewSubtab = "overview" | "quota manager";
export type userparticipatingSubtab = "invite_users" | "view_list";

export type QueryResponse = {
  detail: DetailData;
  questionlist: Pages[];
};

export type SurveylistTypes = {
  id: string;
  key: React.Key;
  name: string;
  description: string;
  status: SurveyStatusValue;
  type: SurveyType;
  progressbar: boolean;
  backwardnav: boolean;
  saveresume: boolean;
  openlink: boolean;
  createdate: string;
  surveyexpire: boolean;
  expireddate: null;
  expiredmessage: string;
  completed: number;
  screened: number;
  points: number;
  estimatetime: number;
  usersjoined: number;
  owner: string;
};

export type DetailData = {
  id: string;
  key: React.Key;
  name: string;
  description: string;
  status: SurveyStatusValue;
  type: SurveyType;
  progressbar: boolean;
  backwardnav: boolean;
  saveresume: boolean;
  openlink: boolean;
  createdate: string;
  surveyexpire: boolean;
  expireddate: string | null;
  expiredmessage: string;
  usersjoined: number;
  completed: number;
  screened: number;
  points: number;
  estimatetime: number;
  variable: VariableTypes[];
  usersId: string;
  instructions: string;
};

export type Pages = {
  id: string;
  key: React.Key;
  header: string;
  isselected: boolean;
  surveysIdsurveys: string;
  questions: Question[];
};

export type Question = {
  id: string;
  key: number | null;
  index: number;
  label: string;
  isselected: boolean;
  type: TQuestionType;
  precodesallowed: number;
  presetanswer: boolean;
  isrequired: boolean;
  forcequestionresponse: boolean;
  POisselected: boolean;
  POselectedoption: "sort" | "shuffle" | "none";
  shuffleby: string | undefined;
  sortdir: "asc" | "dsc";
  pageIdpage: string;
  answers: Answer[];
};

export const QuestionTypeSchema = z.union([
  z.literal("single_select"),
  z.literal("multi_select"),
  z.literal("text_area"),
  z.literal("dropdown"),
  z.literal("file_upload"),
  z.literal("info"),
  z.literal("date"),
  z.literal("up_down"),
  z.literal("grid"),
  z.literal("side_by_side"),
  z.literal("slider"),
  z.literal("rank_sort"),
  z.literal("allocation_slider"),
  z.literal("text_balance"),
  z.literal("rating"),
  z.literal("nps"),
  z.literal("quota"),
  z.literal("screening"),
  z.literal("exec_block"),
  z.literal("terminate"),
  z.literal("points"),
  z.literal("timing"),
  z.literal("open_text_list"),
  z.literal("page_break"),
]);

export type TQuestionType = z.infer<typeof QuestionTypeSchema>;

export type Answer = {
  id: string;
  key: number | string;
  label: string;
  index: number;
  exclusive: boolean;
  forceopenendresponse: boolean;
  openend: boolean;
  number_only: boolean;
  ai_categorize: boolean;
  ai_categorize_list: any[];
  questionsId: string;
  openEndDirection: "vertical" | "horizontal";
};

export const answerSchema = z.object({
  id: z.string(),
  key: z.union([z.number(), z.string()]),
  label: z.string(),
  index: z.number(),
  exclusive: z.boolean(),
  forceopenendresponse: z.boolean(),
  openend: z.boolean(),
  number_only: z.boolean(),
  ai_categorize: z.boolean(),
  ai_categorize_list: z.array(z.any()),
  questionsId: z.string(),
  openEndDirection: z.union([z.literal("vertical"), z.literal("horizontal")]),
});

export type TAnswer = z.infer<typeof answerSchema>;

export type QuestionPanels = {
  header: string;
  key: string;
  questions: QuestionCard[];
};

export type QuestionCard = {
  index: number;
  label: string;
  value: TQuestionType;
  icon: ReactNode;
  available: boolean;
};

export type VariableTypes = {
  id: string;
  key: string;
  name: string;
  value: string;
  date_create: string;
};

export type UserParticipateTableData = {
  id: string;
  key: string;
  rule_type:
    | "All user"
    | "That completed a specific survey"
    | "From a previously created sample"
    | "Based on User Survey data"
    | "From a previously imported third party sample";
  include_admin: boolean;
  email_users: boolean;
  details: string;
  executed: true;
  start_date?: Dayjs;
  end_running?: Dayjs;
  sending_reminder_date?: Dayjs;
};
