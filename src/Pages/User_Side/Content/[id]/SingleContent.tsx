import { Button } from "antd";
import parse from "html-react-parser";
import { Link, useParams } from "react-router-dom";
import LoadingFallback from "../../../../Components/Global/Suspense/LoadingFallback";
import { getSingleContentData } from "./api";
import ErrorFallback from "~/component/Global/Suspense/ErrorFallback";
import Page404 from "~/src/Pages/404";

function SingleContent() {
  const { id } = useParams();

  if (!id) {
    return <>404</>;
  }

  const { data: content, isLoading, error } = getSingleContentData(id);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (error) {
    return <ErrorFallback errorTitle="Error loading content" />;
  }

  if (!content) {
    return <Page404 />;
  }

  return (
    <div className="tw-w-full tw-flex tw-justify-center tw-h-full tw-items-start ">
      <div className="tw-flex tw-flex-col tw-w-full lg:tw-flex-initial 2xl:tw-max-w-6xl tw-px-6 tw-justify-stretch tw-mx-7 tw-py-6 tw-gap-4">
        <div>
          <Link to={"/"}>
            <Button>Back</Button>
          </Link>
        </div>
        {content.image_url ? (
          <img
            className="tw-h-56 tw-w-full lg:tw-h-96 tw-aspect-video tw-overflow-hidden tw-object-cover tw-rounded-md"
            src={content.image_url || undefined}
          />
        ) : (
          <div className=" tw-h-56 tw-w-full tw-justify-center tw-flex tw-items-center lg:tw-h-96 tw-aspect-video tw-overflow-hidden tw-object-cover tw-rounded-md tw-bg-gradient-to-bl tw-from-cyan-500 tw-to-blue-500">
            <div className=" tw-text-white tw-text-2xl tw-font-semibold">
              {content.title.toUpperCase()}
            </div>
          </div>
        )}
        <div className="no-tailwindcss-base">{parse(content.html_content)}</div>
      </div>
    </div>
  );
}

export default SingleContent;
