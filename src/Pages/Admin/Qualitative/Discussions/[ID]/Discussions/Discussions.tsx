import React from "react";

import DiscussionThread from "../../../../../../Components/Discussion/DiscussionThread";

const Discussions = React.memo(() => {
  return (
    <div className="tw-flex tw-gap-2">
      {/* Left side  */}

      <div className="tw-w-3/12">
        <div>comment list sort by time</div>
      </div>

      {/* Right side  */}
      <DiscussionThread />
    </div>
  );
});

export default Discussions;
