import Home from "./home/home.jsx";
import Login from "./login/login.jsx";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { usercontext } from "./appcontext.jsx";
import Forgotpassword from "./resetpassword/resetpassword.jsx";
import Uploadpage from "./upload/upload.jsx";
import Analyse from "./analyse/analyse.jsx";
import JdMatch from "./analyse/JdMatch.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";
import OptimizeResume from "./optimize/OptimizeResume.jsx";
import InterviewPrep from "./interview/InterviewPrep.jsx";
import InterviewGuide from "./interview/InterviewGuide.jsx";
import SkillGap from "./skillgap/SkillGap.jsx";
import CoverLetter from "./coverletter/CoverLetter.jsx";
import Profile from "./profile/Profile.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import Styles from "./loadstyle.module.css";
import CustomCursor from "./CustomCursor.jsx";
import NeuralBackground from "./layout/NeuralBackground.jsx";

function App() {

  const { isauthenticated } = useContext(usercontext);

  return (
    <>
      <CustomCursor />
      <NeuralBackground />

      {isauthenticated ? (
        <>
          <ToastContainer
            theme="dark"
            stacked
            autoClose={1500}
          />

          <BrowserRouter>

            <Routes>

              <Route
                path="/"
                element={<Home />}
              />

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/forgotpassword"
                element={<Forgotpassword />}
              />

              <Route
                path="/uploaddoc"
                element={<DashboardLayout><Uploadpage /></DashboardLayout>}
              />

              <Route
                path="/analysereport"
                element={<DashboardLayout><Analyse /></DashboardLayout>}
              />

              {/* NEW JD MATCH ROUTE */}

              <Route
                path="/jdmatch"
                element={<DashboardLayout><JdMatch /></DashboardLayout>}
              />
              {/* NEW DASHBOARD ROUTES (Wrapped in Sidebar Layout) */}
              
              <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
              <Route path="/optimize-resume" element={<DashboardLayout><OptimizeResume /></DashboardLayout>} />
              <Route path="/interview-prep" element={<DashboardLayout><InterviewPrep /></DashboardLayout>} />
              <Route path="/skill-gap" element={<DashboardLayout><SkillGap /></DashboardLayout>} />
              <Route path="/cover-letter" element={<DashboardLayout><CoverLetter /></DashboardLayout>} />
              <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
              <Route path="/interview-guide" element={<DashboardLayout><InterviewGuide /></DashboardLayout>} />

            </Routes>

          </BrowserRouter>
        </>
      ) : (

        <div
          className={Styles.loadani}
          id="animate"
        >

          <div className={Styles.loadanimation}>
            <div className={Styles.capstart}></div>
            <div className={Styles.loadblock}></div>
          </div>

        </div>
      )}
    </>
  );
}

export default App;