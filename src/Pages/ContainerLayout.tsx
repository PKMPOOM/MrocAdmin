import { Outlet } from "react-router-dom";

function ContainerLayout() {
  return (
    <div className="  tw-h-[calc(100vh-64px)] tw-px-6 tw-flex tw-flex-col tw-gap-4 tw-overflow-auto ">
      <Outlet />
    </div>
  );
}

export default ContainerLayout;
