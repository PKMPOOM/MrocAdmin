import { DiscussionFullType } from "../DiscussionThreadInterfaces";
import { SurveylistTypes } from "../SurveyEditorInterface";

export type NotificationQueryResponse = {
  dateTime: string;
  target: string;
  action: string;
  image: string;
  id: string;
  who: string;
};

export type SectionType = "hero" | "card";
export type DisplayType = "list" | "card" | "story" | "carousel" | "hero";
export type BlockType = "survey" | "discussion" | "blog";

// Block editor page Block props
export type BlockEditorSectionProps = SectionProps<SimplifiedBlockProps[]>;
export type UserFeedSectionProps = SectionProps<FullBlockProps[]>;

export type SimplifiedBlockProps = BlocksProps<
  simplifiedBlogProps[],
  SurveylistTypes[],
  DiscussionFullType[]
>;

export type FullBlockProps = BlocksProps<
  BlogProps[], // full schema
  SurveylistTypes[],
  DiscussionFullType[]
>;

// top level of section data
export type SectionProps<T> = {
  id: string;
  type: SectionType;
  title: string;
  display_title: boolean;
  date_created: Date;
  status: "Active" | "Closed" | "Draft";
  index: number;
  mode?: "light" | "dark";
  extra?: string;
  width_order?: number[];
  content_order?: string[];
  blocks: T;
  _count?: {
    [key: string]: number;
  };
};

export type BlocksProps<BlogGeneric, SurveyGeneric, DuscussionGeneric> = {
  id: string;
  display_type: DisplayType;
  content_type: BlockType;
  userId: string;
  blog: BlogGeneric;
  discussions: DuscussionGeneric;
  surveys: SurveyGeneric;
  custom_width: boolean;
  width: number | null;
  content_order: string[];
};

export interface BlogProps {
  id: string;
  date_created: Date;
  image_url: string;
  status: "Active" | "Closed" | "Draft";
  title: string;
  href: string;
  // end of simplified schema
  key?: number;
  index: number;
  text: string;
  html_content: string;
  _count?: {
    [key: string]: number;
  };
}

export type simplifiedBlogProps = Pick<
  BlogProps,
  "id" | "date_created" | "image_url" | "status" | "title" | "href"
>;
