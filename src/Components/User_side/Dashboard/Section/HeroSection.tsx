import dayjs from "dayjs";
import { useAuth } from "../../../../Context/Auth/AuthContext";
import { UserFeedSectionProps } from "../../../../Interface/User/UserDashboardTypes";
import UserSideBlock from "./Block/UserSideBlock";

type Props = {
  SectionData: UserFeedSectionProps;
};

function HeroSection({ SectionData }: Props) {
  const { date_created, display_title, title } = SectionData;
  const { AuthUser } = useAuth();
  const isAdmin = AuthUser?.role === "admin";

  let SumWidth = 0;

  if (SectionData?.blocks) {
    // all custom size content width
    const allContentSumWidth = SectionData.blocks.reduce((acc, current) => {
      if (current.width) {
        return acc + current.width;
      }
      return acc;
    }, 0);

    SumWidth = allContentSumWidth;
  }

  return (
    <div className="tw-my-2 tw-w-full">
      <div className="tw-flex tw-flex-col ">
        {display_title && <p className="tw-text-lg">{title}</p>}
        {isAdmin && display_title && (
          <p className="tw-text-slate-500">
            {dayjs(date_created).format("DD MMM YYYY")}
          </p>
        )}
        <div className="tw-flex tw-justify-center tw-flex-col tw-w-full ">
          {SectionData?.blocks.map((block, index) => {
            const autoWidthAmount = SectionData.blocks.filter(
              (item) => item.width === null
            ).length;

            return (
              <UserSideBlock
                type={SectionData.type} // section type hero | card
                key={block.id}
                blocks={block}
                index={index}
                SumWidth={SumWidth}
                autoWidthAmount={autoWidthAmount}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
