import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingFallback from "./Components/Global/Suspense/LoadingFallback";
import { AuthProvider } from "./Context/Auth/AuthContext";
import ApplicationProvider from "./Context/Theme/ApplicationProvider";
import AdminLayoutRouteMemo from "./Route/AdminLayoutRoute";
import OnboardRoute from "./Route/OnboardRoute";
import PreventPublicRoute from "./Route/PreventPublicRoute";
import UserLayoutRoute from "./Route/UserLayoutRoute";

const GenerativeCreate = React.lazy(
  () => import("./Pages/Admin/Quantitative/Survey/SmartCreate/SmartCreatePage")
);

const Dashboard = React.lazy(() => import("./Pages/Admin/Dashboard/Dashboard"));
const SurveyListPage = React.lazy(
  () => import("./Pages/Admin/Quantitative/Survey/SurveyListPage")
);
const SurveyEditor = React.lazy(
  () => import("./Pages/Admin/Quantitative/Survey/SurveyEditor/SurveyEditor")
);
const DiscussionList = React.lazy(
  () => import("./Pages/Admin/Qualitative/DiscussionListPage")
);
const DiscussionPage = React.lazy(
  () => import("./Pages/Admin/Qualitative/Discussions/[ID]/DiscussionPage")
);
const Userpage = React.lazy(
  () => import("./Pages/Admin/User/Show_user/Show_user")
);
const Configuration = React.lazy(
  () => import("./Pages/Admin/System/Configuration/Configuration")
);
const Admin404 = React.lazy(() => import("./Pages/Admin404"));
const UserDashboard = React.lazy(
  () => import("./Pages/User_Side/UserFeeds/UserDashboard")
);
const Cash_out = React.lazy(
  () => import("./Pages/User_Side/cash-out/Cash_out")
);
const SingleContent = React.lazy(
  () => import("./Pages/User_Side/Content/[id]/SingleContent")
);
const Login = React.lazy(() => import("./Components/Login/LoginForm"));
const SignupForm = React.lazy(() => import("./Components/Login/SignUpForm"));
const CreateNewUser = React.lazy(
  () => import("./Components/Login/CreateNewUser")
);
const ResultPage = React.lazy(() => import("./Components/Login/ResultPage"));
const Onboarding = React.lazy(() => import("./Pages/Onboarding/Onboarding"));
const Invite_User = React.lazy(
  () => import("./Pages/Admin/User/Invite_user/Invite_User")
);
const Page404 = React.lazy(() => import("./Pages/404"));
const ContainerLayout = React.lazy(() => import("./Pages/ContainerLayout"));
const ManageAbuse = React.lazy(
  () => import("./Pages/Admin/EngagementTools/ManageAbuse/ManageAbuse")
);
const Achievements = React.lazy(
  () => import("./Pages/Admin/EngagementTools/Achievements/Achievements")
);
const AchieleventReward = React.lazy(
  () =>
    import("./Pages/Admin/EngagementTools/Achievements/[id]/AchieleventReward")
);
const UserData = React.lazy(
  () => import("./Pages/Admin/User/Show_user/[id]/UserData")
);
const RewardSettings = React.lazy(
  () => import("./Pages/Admin/EngagementTools/RewardSettings/RewardSettings")
);
const ManageCharities = React.lazy(
  () => import("./Pages/Admin/EngagementTools/ManageCharities/ManageCharities")
);
const UserFeedSettings = React.lazy(
  () => import("./Pages/Admin/System/UserFeedSettings/UserFeedSettings")
);
const SectionEditor = React.lazy(
  () =>
    import(
      "./Pages/Admin/System/UserFeedSettings/Subtab/Section/[id]/SectionEditor"
    )
);
const BlogEditorPage = React.lazy(
  () =>
    import(
      "./Pages/Admin/System/UserFeedSettings/Subtab/Content/[id]/BlogEditorPage"
    )
);
const SurveyUser = React.lazy(
  () => import("./Pages/User_Side/survey/[id]/Survey.user")
);
const SurveyPreview = React.lazy(
  () => import("./Pages/User_Side/survey/preview/[id]/Survey.preview")
);
const SampleListPage = React.lazy(
  () => import("./Pages/Admin/Quantitative/Samples/SamplePage")
);
const SampleEditor = React.lazy(
  () => import("./Pages/Admin/Quantitative/Samples/[id]/SampleEditor")
);
const LibraryPage = React.lazy(
  () => import("./Pages/Admin/Library/LibraryPage")
);
const StylePage = React.lazy(
  () => import("./Pages/Admin/System/Style/StylePage")
);
const StyleEditor = React.lazy(
  () => import("./Pages/Admin/System/Style/[id]/StyleEditor")
);

const WhiteList = React.lazy(
  () => import("./Pages/Admin/System/WhiteList/WhiteList")
);

const ManageProfileSurveyPage = React.lazy(
  () =>
    import("./Pages/Admin/User/Manage_profile_survey/ManageProfileSurveyPage")
);
const SystemContentPage = React.lazy(
  () => import("./Pages/Admin/System/SystemContent/SystemContentPage")
);
const SiteContentPage = React.lazy(
  () => import("./Pages/User_Side/SiteContent/[id]/SiteContent")
);

function App() {
  return (
    <>
      <AuthProvider>
        <ApplicationProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/admin" element={<AdminLayoutRouteMemo />}>
                <Route path="Dashboard" element={<Dashboard />} />

                <Route path="Quantitative">
                  <Route path="Survey" element={<SurveyListPage />} />
                  <Route
                    path="generative-create"
                    element={<GenerativeCreate />}
                  />
                  <Route path="Survey/:id" element={<SurveyEditor />} />
                  <Route path="Samples" element={<SampleListPage />} />
                  <Route path="Samples/:id" element={<SampleEditor />} />
                </Route>

                <Route path="Qualitative">
                  <Route path="Discussions" element={<DiscussionList />} />
                  <Route path="Discussions/:id" element={<DiscussionPage />} />
                </Route>

                <Route path="EngagementTools" element={<ContainerLayout />}>
                  <Route path="ManageAbuse" element={<ManageAbuse />} />
                  <Route path="Achievements" element={<Achievements />} />
                  <Route path="RewardSettings" element={<RewardSettings />} />
                  <Route path="ManageCharities" element={<ManageCharities />} />
                  <Route
                    path="Achievements/:id"
                    element={<AchieleventReward />}
                  />
                </Route>

                <Route path="users" element={<ContainerLayout />}>
                  <Route path="showuser" element={<Userpage />} />
                  <Route path="showuser/:id" element={<UserData />} />

                  <Route path="inviteuser" element={<Invite_User />} />
                  <Route
                    path="manage-profile-surveys"
                    element={<ManageProfileSurveyPage />}
                  />
                </Route>

                <Route path="system" element={<ContainerLayout />}>
                  <Route path="config" element={<Configuration />} />
                  <Route path="newsfeed" element={<UserFeedSettings />} />
                  <Route
                    path="newsfeed/section/:id"
                    element={<SectionEditor />}
                  />
                  <Route
                    path="newsfeed/blog/:id"
                    element={<BlogEditorPage />}
                  />
                  <Route path="style" element={<StylePage />} />
                  <Route path="style/:id" element={<StyleEditor />} />

                  <Route path="whitelist" element={<WhiteList />} />
                  <Route
                    path="system-content"
                    element={<SystemContentPage />}
                  />
                </Route>

                <Route path="library" element={<ContainerLayout />}>
                  <Route path="" element={<LibraryPage />} />
                </Route>

                <Route path="*" element={<Admin404 />} />
              </Route>

              {/* User Route */}
              <Route element={<UserLayoutRoute />}>
                <Route path="/" element={<UserDashboard />} />
                <Route path=":id" element={<SiteContentPage />} />
                <Route path="/content/:id" element={<SingleContent />} />
                <Route path="/redeem" element={<Cash_out />} />
                <Route path="sv">
                  <Route path=":id" element={<SurveyUser />} />
                  <Route path="preview/:id" element={<SurveyPreview />} />
                </Route>
                <Route path="*" element={<Page404 />} />
              </Route>

              {/* login route */}
              <Route element={<PreventPublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/success" element={<ResultPage />} />
                <Route path="/newuser/:id" element={<CreateNewUser />} />
              </Route>

              {/* onboard route */}
              <Route element={<OnboardRoute />}>
                <Route path="/Onboarding" element={<Onboarding />} />
              </Route>
              <Route path="*" element={<Page404 />} />
            </Routes>
          </Suspense>
        </ApplicationProvider>
      </AuthProvider>
    </>
  );
}

export default App;
