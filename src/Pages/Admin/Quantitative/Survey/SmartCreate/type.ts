import { z } from "zod";
import { StatusOption } from "~/interface/SurveyEditorInterface";

export const GenQuestionListSchema = z.object({
  label: z.string(),
  answer: z.array(z.string()),
  type: z.string(),
  instruction: z.string(),
});

export type GenQuestionList = z.infer<typeof GenQuestionListSchema>;

export const CreateSurveySubmitFormSchema = z.object({
  name: z.string(),
  status: z.enum(["active", "draft"]),
  questionData: z.array(GenQuestionListSchema),
});

export type TSubmitSchema = z.infer<typeof CreateSurveySubmitFormSchema>;

export const SurveyStatusSelectOptions: StatusOption[] = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Draft",
    label: "Draft",
  },
  {
    value: "Closed",
    label: "Closed",
  },
];

export type SubmitPayload = {
  name: string;
  status: string;
  questionData: GenQuestionList[];
};
