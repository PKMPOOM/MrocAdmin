import { Image } from "antd";
import ContainerSimplified from "../Container/ContainerSimplified";
import { DiscussionFullType } from "../../../../../../../Interface/DiscussionThreadInterfaces";

type Props = {
  discussion: DiscussionFullType;
};

const DiscussionSimplified = ({ discussion }: Props) => {
  return (
    <ContainerSimplified>
      {discussion.image_url ? (
        <Image
          style={{
            aspectRatio: "1/1",
            objectFit: "cover",
            height: "80px",
            borderRadius: "4px",
          }}
          src={discussion.image_url}
        />
      ) : (
        <div className="tw-top-1/2 tw-left-1/2 tw-min-h-[150px] tw-font-semibold tw-text-lg tw-text-white tw-bg-gradient-to-bl tw-from-cyan-500 tw-to-blue-500 tw-h-full tw-flex tw-items-center tw-justify-center">
          <p> {discussion.name.toUpperCase()}</p>
        </div>
      )}
      <p className=" tw-border tw-rounded-b-md tw-p-2">{discussion.name}</p>
    </ContainerSimplified>
  );
};

export default DiscussionSimplified;
