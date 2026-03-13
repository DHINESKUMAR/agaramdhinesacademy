import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { GraduationCap, Globe, LogIn, Mail, Shield, MessageCircle, Users } from "lucide-react";
import { getStudents, getStaffs } from "../lib/db";

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [showStaffLogin, setShowStaffLogin] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/webview");
    } catch (error) {
      console.error(error);
      alert("Google login failed. Please check Firebase configuration.");
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter Username and Password");
      return;
    }

    try {
      const email = `${username}@agaram.com`;
      await signInWithEmailAndPassword(auth, email, password);
      
      const students = await getStudents();
      const student = students.find((s: any) => s.username === username);

      if (student) {
        navigate("/student-dashboard", {
          state: {
            id: student.id,
            username: student.username,
            name: student.name,
            grade: student.grade,
            rollNo: student.rollNo,
            enrolledClasses: student.enrolledClasses || []
          }
        });
      } else {
        alert("zoom வகுப்பிற்கான கட்டணம் செலுத்தியப் பின் இணைக்கப்படுவீர்கள்");
      }
    } catch (error) {
      alert("zoom வகுப்பிற்கான கட்டணம் செலுத்தியப் பின் இணைக்கப்படுவீர்கள்");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === "agaramdhines" && adminPassword === "0756452527Dd") {
      try {
        navigate("/admin");
      } catch (error) {
        alert("Invalid admin credentials");
      }
    } else {
      alert("Invalid admin credentials");
    }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const staffs = await getStaffs();
      const staff = staffs.find((s: any) => s.username === staffUsername && s.password === staffPassword);
      
      if (staff) {
        navigate("/staff-dashboard", {
          state: {
            id: staff.id,
            username: staff.username,
            name: staff.name,
            role: staff.role || "Teacher",
            assignedClasses: staff.assignedClasses || []
          }
        });
      } else {
        alert("Invalid staff credentials");
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <GraduationCap size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-pink-600 mb-2">
          Agaram Dhines Academy
        </h1>
        <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">Home Page</p>
      </div>

      <div className="w-full max-w-md space-y-4 flex flex-col items-center">
        {/* Website Link */}
        <button
          onClick={() => navigate("/webview")}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl font-bold rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
        >
          <Globe size={24} />
          Website Link
        </button>

        {/* Zoom Class Registration */}
        <button
          onClick={() => window.open("https://www.agaramdhines.lk/lp-profile/", "_blank")}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xl font-bold rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
        >
          <LogIn size={24} />
          Zoom Class Registration
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={() => window.open("https://wa.me/94778054232", "_blank")}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
        >
          <MessageCircle size={24} />
          WhatsApp Us (0778054232)
        </button>

        {/* Student Login Section */}
        <div className="w-full bg-white rounded-3xl shadow-xl p-8 mt-4 border border-blue-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">Zoom Class Students ID</h2>
          <p className="text-sm text-blue-600 mb-6 font-medium text-center">(I am Agaram Dhines Academy Student)</p>

          <form
            onSubmit={handleStudentLogin}
            className="flex flex-col space-y-4"
          >
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all text-center font-medium"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all text-center font-medium"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
              Student Login
            </button>
          </form>
        </div>

        {/* Admin and Staff Login Toggles */}
        <div className="flex gap-4 mt-8">
          {!showAdminLogin && (
            <button
              onClick={() => { setShowAdminLogin(true); setShowStaffLogin(false); }}
              className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Shield size={16} />
              Admin Login
            </button>
          )}
          {!showStaffLogin && (
            <button
              onClick={() => { setShowStaffLogin(true); setShowAdminLogin(false); }}
              className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Users size={16} />
              Staff Login
            </button>
          )}
        </div>

        {/* Admin Login Form */}
        {showAdminLogin && (
          <div className="w-full max-w-xs bg-white p-6 rounded-2xl shadow-lg mt-4 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Shield size={18} /> Admin Access
              </h3>
              <button onClick={() => setShowAdminLogin(false)} className="text-gray-400 hover:text-gray-600 text-sm">Close</button>
            </div>
            <form
              onSubmit={handleAdminLogin}
              className="flex flex-col space-y-3"
            >
              <input
                type="text"
                placeholder="Admin Username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-800 bg-gray-50 text-center text-sm"
              />
              <input
                type="password"
                placeholder="Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-800 bg-gray-50 text-center text-sm"
              />
              <button
                type="submit"
                className="w-full py-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors text-sm"
              >
                Login
              </button>
            </form>
          </div>
        )}

        {/* Staff Login Form */}
        {showStaffLogin && (
          <div className="w-full max-w-xs bg-white p-6 rounded-2xl shadow-lg mt-4 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Users size={18} /> Staff Access
              </h3>
              <button onClick={() => setShowStaffLogin(false)} className="text-gray-400 hover:text-gray-600 text-sm">Close</button>
            </div>
            <form
              onSubmit={handleStaffLogin}
              className="flex flex-col space-y-3"
            >
              <input
                type="text"
                placeholder="Staff Username"
                value={staffUsername}
                onChange={(e) => setStaffUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 text-center text-sm"
              />
              <input
                type="password"
                placeholder="Staff Password"
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 text-center text-sm"
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Login
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
