import { Skeleton } from "antd";
export default function Skelton() {
  return (
    <div className="tw-w-full tw-flex-col tw-h-full tw-gap-4 tw-flex tw-px-8">
      <Skeleton.Input active />
      <div className="tw-mt-5 tw-flex tw-flex-col tw-gap-2 tw-mb-4">
        <Skeleton.Input active block />
        <div className="tw-w-4/5">
          <Skeleton.Input active block />
        </div>
      </div>
      <div className="tw-flex tw-flex-col tw-gap-4">
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </div>
    </div>
  );
}
