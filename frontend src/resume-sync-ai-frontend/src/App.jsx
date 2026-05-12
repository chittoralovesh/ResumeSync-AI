import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { userContext } from "./hooks/useAuth";
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Upload from "./pages/Upload";
import InterviewPrep from "./pages/InterviewPrep";
import Profile from "./pages/Profile";
import RootLayout from "./layouts/RootLayout";
import AnimatedBackground from "./animations/AnimatedBackground";
import "./index.css";

function App() {
  const { isAuthenticated } = useContext(userContext);

  return (
    <Router>
      <AnimatedBackground />
      <ToastContainer theme="dark" autoClose={1500} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />
            <Route path="/profile" element={<Profile />} />
          </>
        ) : (
          <Route path="*" element={<Landing />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;