import { z } from "zod";

export type Discussion_MainTab =
  | "discussion"
  | "distribution"
  | "user_participate"
  | "report"
  | "tags";

export type UserParticipate_SubTab = "invite_users" | "view_list";

export type Discussion_ReportSubTab =
  | "sentiment_analysis"
  | "word_cloud"
  | "member_in_thread"
  | "photos"
  | "videos"
  | "tags_summary";

export type TabItem<TKey> = {
  key: TKey;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
};
// discussion comment
const DiscussionCommentSchema = z.object({
  id: z.string().uuid(),
  key: z.number().int(),
  userId: z.string(),
  message: z.string(),
  created_date: z.string(),
  update_at: z.string(),
  discussionId: z.string().uuid().optional(),
});

// discussion project
export const DiscussionSchema = z.object({
  id: z.string().uuid(),
  key: z.number().int(),
  comments: z.array(DiscussionCommentSchema).nullish(),
  users: z.array(z.string()).nullish(),
  blinded: z.boolean(),
  display_name: z.enum(["user_name", "full_name", "annonymous"]),
  edit_option: z.boolean(),
  show_avatar: z.boolean(),
  send_email: z.boolean(),
  name: z.string(),
  start_thread: z.string(),
  created_date: z.string(),
  update_at: z.string().optional(),
  vote: z.number().int(),
  status: z.enum(["Active", "Draft", "Closed"]),
  image_url: z.string().optional(),
  Category: z.string().optional().nullable(),
  type: z.enum(["nested", "bulletin", "dairy"]),
  owner: z.string(),
  username: z.string(),
});

// discussion list page table
export const DiscussionListTableSchema = z.object({
  created_date: DiscussionSchema.shape.created_date,
  id: DiscussionSchema.shape.id,
  key: DiscussionSchema.shape.key,
  name: DiscussionSchema.shape.name,
  status: DiscussionSchema.shape.status,
  type: DiscussionSchema.shape.type,
  users: DiscussionSchema.shape.users,
  vote: DiscussionSchema.shape.vote,
  _count: z.object({
    comments: z.number(),
  }),
});

// use in single discussion page for full data fetch
export type DiscussionFullType = z.infer<typeof DiscussionSchema>;

// use in list page for simplified fetch
export type DiscussionSimplifiedType = z.infer<
  typeof DiscussionListTableSchema
>;

//use for parse data fetched from api(discussion list)
export const DataSchema = z.union([
  z.array(DiscussionListTableSchema),
  z.undefined(),
]);
