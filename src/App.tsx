import { useState, useEffect } from "react"; // இதைச் சேர்த்துள்ளேன்
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WebView from "./pages/WebView";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminHome from "./pages/Admin/Home";
import Classes from "./pages/Admin/Classes";
import Students from "./pages/Admin/Students";
import Homework from "./pages/Admin/Homework";
import Fees from "./pages/Admin/Fees";
import Settings from "./pages/Admin/Settings";
import Courses from "./pages/Admin/Courses";
import TermExam from "./pages/Admin/TermExam";
import LiveClasses from "./pages/Admin/LiveClasses";
import Youtube from "./pages/Admin/Youtube";
import Attendances from "./pages/Admin/Attendances";
import Staffs from "./pages/Admin/Staffs";
import Subjects from "./pages/Admin/Subjects";
import Timetable from "./pages/Admin/Timetable";
import StudentDashboard from "./pages/Student/Dashboard";
import StaffDashboard from "./pages/Staff/Dashboard";
import { initDB } from "./lib/db";

// Initialize mock database
initDB();

export default function App() {
  // --- சேர்த்துள்ள மாற்றம் ஆரம்பம் ---
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // பிரவுசர் லோட் ஆகும் வரை திரையில் எதுவும் காட்டாது (வெள்ளை திரை வராது)
  }
  // --- சேர்த்துள்ள மாற்றம் முடிவு ---

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/webview" element={<WebView />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />

        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="students" element={<Students />} />
          <Route path="homework" element={<Homework />} />
          <Route path="fees" element={<Fees />} />
          <Route path="settings" element={<Settings />} />
          <Route path="courses" element={<Courses />} />
          <Route path="term-exam" element={<TermExam />} />
          <Route path="live-classes" element={<LiveClasses />} />
          <Route path="youtube" element={<Youtube />} />
          <Route path="classes" element={<Classes />} />
          <Route path="attendances" element={<Attendances />} />
          <Route
            path="test-results"
            element={
              <div className="p-6 text-center text-gray-500">
                Test Results Coming Soon
              </div>
            }
          />
          <Route path="circulars" element={<div className="p-6 text-center text-gray-500">Circulars Management Coming Soon</div>} />
          <Route path="staffs" element={<Staffs />} />
          <Route path="subjects-grades" element={<Subjects />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="routine" element={<div className="p-6 text-center text-gray-500">Routine Management Coming Soon</div>} />
        </Route>
      </Routes>
    </Router>
  );
}