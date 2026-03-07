import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  FileText,
  Bell,
  Briefcase,
  Settings,
  Clock,
  LogOut,
  Image as ImageIcon,
  Mic,
  Video,
  Search,
  Link,
  Video as VideoIcon,
  Award,
  Youtube as YoutubeIcon
} from "lucide-react";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/admin", icon: <Home size={20} /> },
    { name: "Live Classes (Zoom)", path: "/admin/live-classes", icon: <VideoIcon size={20} /> },
    { name: "Courses", path: "/admin/courses", icon: <Link size={20} /> },
    { name: "YouTube", path: "/admin/youtube", icon: <YoutubeIcon size={20} /> },
    { name: "Classes", path: "/admin/classes", icon: <BookOpen size={20} /> },
    { name: "Students", path: "/admin/students", icon: <Users size={20} /> },
    {
      name: "Attendances",
      path: "/admin/attendances",
      icon: <Calendar size={20} />,
    },
    { name: "Fees", path: "/admin/fees", icon: <DollarSign size={20} /> },
    {
      name: "Test Results",
      path: "/admin/test-results",
      icon: <FileText size={20} />,
    },
    { name: "Term Exam", path: "/admin/term-exam", icon: <Award size={20} /> },
    { name: "Circulars", path: "/admin/circulars", icon: <Bell size={20} /> },
    { name: "Staffs", path: "/admin/staffs", icon: <Briefcase size={20} /> },
    { name: "HomeWork", path: "/admin/homework", icon: <BookOpen size={20} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
    {
      name: "Routine Management",
      path: "/admin/routine",
      icon: <Clock size={20} />,
    },
    {
      name: "AI Image Editor",
      path: "/admin/ai-image",
      icon: <ImageIcon size={20} />,
    },
    { name: "AI Voice App", path: "/admin/ai-voice", icon: <Mic size={20} /> },
    {
      name: "AI Video Gen",
      path: "/admin/ai-video",
      icon: <Video size={20} />,
    },
    { name: "AI Search", path: "/admin/ai-search", icon: <Search size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#1e3a8a] text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold">Institution Panel</h1>
        </div>
        <Bell size={24} />
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        flex flex-col h-full
      `}
      >
        <div className="p-6 flex flex-col items-center border-b">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <ImageIcon size={32} className="text-gray-400" />
          </div>
          <h2 className="text-center font-bold text-sm text-[#1e3a8a]">
            DINESHKUMAR AGARAM DHINES
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                  ${
                    location.pathname === item.path
                      ? "bg-blue-50 text-[#1e3a8a]"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#1e3a8a]"
                  }
                `}
              >
                <span className="mr-3 text-[#1e3a8a]">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-md transition-colors"
          >
            <LogOut size={20} className="mr-3 text-[#1e3a8a]" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex bg-[#1e3a8a] text-white p-4 items-center justify-between shadow-md">
          <h1 className="text-xl font-semibold">Institution Panel</h1>
          <Bell size={24} />
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-blue-50 to-pink-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
