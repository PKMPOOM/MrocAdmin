import { SettingOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import {
  FaAddressBook,
  FaBolt,
  FaBook,
  FaChartArea,
  FaChartBar,
  FaClipboardList,
  FaClone,
  FaCommentDots,
  FaDatabase,
  FaDesktop,
  FaDollarSign,
  FaEnvelope,
  FaEuroSign,
  FaExclamationCircle,
  FaExternalLinkAlt,
  FaFolder,
  FaHandshake,
  FaHeartbeat,
  FaMailBulk,
  FaNewspaper,
  FaPaintBrush,
  FaPen,
  FaQuestionCircle,
  FaRegClipboard,
  FaRegListAlt,
  FaSearch,
  FaSitemap,
  FaSms,
  FaTag,
  FaThList,
  FaTimes,
  FaTrophy,
  FaUserAlt,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";
type MenuItem = Required<MenuProps>["items"][number];

/* New editable content 
  - create section
    - create content and assign to section
    - content canbe vary eg. news survey discussion blog
  - create badge from loyalty
    - retire badge from this page
    => remove badge from config
    => remove news, 
    => consider remove clipboard
    => key demos to library
    => move scale to library
*/

export const sideMenuItems: MenuItem[] = [
  {
    key: "/Dashboard",
    icon: <FaChartArea />,
    label: "Dashboard",
  },
  {
    key: "/Qualitative",
    icon: <FaCommentDots />,
    children: [
      {
        key: "/Qualitative/ManageCategories",
        icon: <FaRegListAlt />,
        label: "Manage Categories",
      },
      {
        key: "/Qualitative/Discussions",
        icon: <FaRegListAlt />,
        label: "Manage Threads",
      },
      {
        key: "/Qualitative/DiscussionReport",
        icon: <FaChartBar />,
        label: "Discussion Report",
      },
      {
        key: "/Qualitative/Tags",
        icon: <FaTag />,
        label: "Tags",
      },
    ],
    label: "Qualitative",
  },
  {
    key: "/Quantitative",
    icon: <FaThList />,
    children: [
      {
        key: "/Quantitative/Samples",
        icon: <FaUsers />,
        label: "Samples",
      },
      {
        key: "/Quantitative/Survey",
        icon: <FaClipboardList />,
        label: "Survey",
      },
    ],
    label: "Quantitative",
  },
  {
    key: "/EngagementTools",
    icon: <FaHandshake />,
    children: [
      {
        key: "/EngagementTools/EmailCampaign",
        icon: <FaMailBulk />,
        label: "Email Campaign",
      },
      {
        key: "/EngagementTools/SMS",
        icon: <FaSms />,
        label: "SMS",
      },
      {
        key: "/EngagementTools/Achievements",
        icon: <FaTrophy />,
        label: "Acheivements",
      },
      {
        key: "/EngagementTools/EmailTemplates",
        icon: <FaEnvelope />,
        label: "Email Templates",
      },
      {
        key: "/EngagementTools/Pop-ups",
        icon: <FaDesktop />,
        label: "Pop-ups",
      },
      {
        key: "/EngagementTools/News",
        icon: <FaNewspaper />,
        label: "News",
      },
      {
        key: "/EngagementTools/ManageAbuse",
        icon: <FaExclamationCircle />,
        label: "Manage Abuse",
      },
      {
        key: "/EngagementTools/RewardSettings",
        icon: <FaEuroSign />,
        label: "Reward Settings",
      },
      {
        key: "/EngagementTools/ActivitySummary",
        icon: <FaRegListAlt />,
        label: "Activity Summary",
      },
      {
        key: "/EngagementTools/ManageCharities",
        icon: <FaHeartbeat />,
        label: "Manage Charities",
      },
      {
        key: "/EngagementTools/Points",
        icon: <FaDollarSign />,
        label: "Points",
      },
    ],
    label: "Engagement Tools",
  },
  {
    key: "/users",
    icon: <FaUsers />,
    children: [
      {
        key: "/users/showuser",
        icon: <FaUsers />,
        label: "Show Users",
      },
      {
        key: "/users/inviteuser",
        icon: <FaUserPlus />,
        label: "Invite Users",
      },
      {
        key: "/users/optoutuser",
        icon: <FaTimes />,
        label: "Opt Out Users",
      },
      {
        key: "/users/clipboard",
        icon: <FaRegClipboard />,
        label: "Clipboard",
      },
      {
        key: "/users/manage-profile-surveys",
        icon: <FaPen />,
        label: "Manage Profile Survey",
      },
      {
        key: "/users/3rdsample",
        icon: <FaExternalLinkAlt />,
        label: "Third Party Samples",
      },
    ],
    label: "Users",
  },
  {
    key: "/system",
    icon: <FaSitemap />,
    children: [
      {
        key: "/system/config",
        icon: <SettingOutlined />,
        label: "Configurations",
      },
      {
        key: "/system/style",
        icon: <FaPaintBrush />,
        label: "Style",
      },
      {
        key: "/system/system-content",
        icon: <FaSliders />,
        label: "System content",
      },
      {
        key: "/system/newsfeed",
        icon: <FaClone />,
        label: "User News Feed",
      },
      {
        key: "/system/file",
        icon: <FaFolder />,
        label: "File Manager",
      },
      {
        key: "/system/runcals",
        icon: <FaBolt />,
        label: "Run Calculations",
      },
      {
        key: "/system/permissions",
        icon: <FaUsers />,
        label: "Permissions",
      },
      {
        key: "/system/whitelist",
        icon: <FaAddressBook />,
        label: "Whitelist",
      },
      {
        key: "/system/sysemail",
        icon: <FaEnvelope />,
        label: "System Email template",
      },
    ],
    label: "System",
  },
  {
    key: "/expdata",
    icon: <FaDatabase />,
    children: [
      {
        key: "/expdata/txtscr",
        icon: <FaSearch />,
        label: "Text Search",
      },
    ],
    label: "Explore Data",
  },
  {
    key: "/library",
    icon: <FaBook />,
    label: "Library",
  },
  {
    key: "/help",
    icon: <FaQuestionCircle />,
    label: "Helps",
  },
  {
    key: "/touser",
    icon: <FaUserAlt />,
    label: "Back To User",
  },
];
