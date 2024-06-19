import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import {
  DisplayType,
  simplifiedBlogProps,
} from "../../../../../../../../Interface/User/UserDashboardTypes";
import { useSectionEditorStore } from "../../../../../../../../Store/useSectionEditorStore";
import BlogCard from "./Card/BlogCard";
import BlogList from "./List/BlogList";

type Props = {
  blog: simplifiedBlogProps[];
  displayType: DisplayType;
  blockIndex?: number;
};

const BlogDisplayer = ({ blog, blockIndex = 0, displayType }: Props) => {
  const [setIndexData, setContentDrawerOpen] = useSectionEditorStore(
    (state) => [state.setIndexData, state.setContentDrawerOpen]
  );

  if (blog?.length === 0) {
    return (
      <div className=" tw-w-full tw-flex tw-justify-center tw-items-center tw-flex-1">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIndexData({
              activeBlockIndex: blockIndex,
              activeContentIndex: 0,
            });
            setContentDrawerOpen(true);
          }}
        >
          Blog
        </Button>
      </div>
    );
  }

  switch (displayType) {
    case "card":
      return blog?.map((item, blogIndex) => {
        const isLastIndex = blog?.length === blogIndex + 1;
        const isFirstIndex = blogIndex === 0;
        return (
          <BlogCard
            key={item.id + blogIndex}
            blog={item}
            indexData={{
              isLastIndex,
              isFirstIndex,
              blogIndex,
              blockIndex,
            }}
          />
        );
      });
    case "list":
      return (
        <BlogList
          blogList={blog}
          indexData={{
            blockIndex: blockIndex,
          }}
        />
      );
  }
};

export default BlogDisplayer;
