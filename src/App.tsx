/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
import StudentDashboard from "./pages/Student/Dashboard";
import ImageEditor from "./pages/AI/ImageEditor";
import VoiceApp from "./pages/AI/VoiceApp";
import VideoGenerator from "./pages/AI/VideoGenerator";
import SearchGrounding from "./pages/AI/SearchGrounding";
import { initDB } from "./lib/db";

// Initialize mock database
initDB();

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/webview" element={<WebView />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="students" element={<Students />} />
          <Route path="homework" element={<Homework />} />
          <Route path="fees" element={<Fees />} />
          <Route path="settings" element={<Settings />} />
          <Route path="ai-image" element={<ImageEditor />} />
          <Route path="ai-voice" element={<VoiceApp />} />
          <Route path="ai-video" element={<VideoGenerator />} />
          <Route path="ai-search" element={<SearchGrounding />} />
          <Route path="courses" element={<Courses />} />
          <Route path="term-exam" element={<TermExam />} />
          <Route path="live-classes" element={<LiveClasses />} />
          <Route path="youtube" element={<Youtube />} />
          {/* Placeholders for other routes */}
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
          <Route
            path="circulars"
            element={
              <div className="p-6 text-center text-gray-500">
                Circulars Management Coming Soon
              </div>
            }
          />
          <Route
            path="staffs"
            element={
              <div className="p-6 text-center text-gray-500">
                Staff Management Coming Soon
              </div>
            }
          />
          <Route
            path="routine"
            element={
              <div className="p-6 text-center text-gray-500">
                Routine Management Coming Soon
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
