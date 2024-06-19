import { simplifiedBlogProps } from "../../../../../../../Interface/User/UserDashboardTypes";
import ContainerSimplified from "../Container/ContainerSimplified";

type Props = {
  blog: simplifiedBlogProps;
};

const BlogSimplified = ({ blog }: Props) => {
  return (
    <ContainerSimplified>
      {blog.image_url ? (
        <div className="tw-bg-gradient-to-bl  tw-from-cyan-500 tw-to-blue-500 tw-w-full tw-flex-col tw-overflow-hidden  tw-relative tw-h-full  tw-flex tw-gap-2 tw-justify-center tw-items-center tw-bg-center tw-bg-cover tw-bg-no-repeat ">
          <img
            style={{
              minWidth: "100%",
              minHeight: "100%",
              objectFit: "cover",
              overflow: "hidden",
              position: "absolute",
            }}
            src={blog.image_url}
          />
        </div>
      ) : (
        <div className="tw-top-1/2 tw-left-1/2 tw-flex-1 tw-font-semibold tw-text-lg tw-text-white tw-bg-gradient-to-bl tw-from-cyan-500 tw-to-blue-500  tw-flex tw-items-center tw-justify-center">
          <p> {blog.title.toUpperCase()}</p>
        </div>
      )}

      <p className=" tw-border tw-rounded-b-md tw-p-2">{blog.title}</p>
    </ContainerSimplified>
  );
};

export default BlogSimplified;
