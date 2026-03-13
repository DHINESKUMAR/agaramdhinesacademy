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
  Youtube as YoutubeIcon,
  Maximize,
  ChevronDown,
  MessageCircle,
  MessageSquare
} from "lucide-react";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    "Classes": true
  });
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSubMenu = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <Home size={18} /> },
    { name: "General Settings", path: "/admin/settings", icon: <Settings size={18} /> },
    { 
      name: "Classes", 
      path: "/admin/classes", 
      icon: <BookOpen size={18} />,
      subItems: [
        { name: "All Classes", path: "/admin/classes" },
        { name: "New Class", path: "/admin/classes?tab=new" }
      ]
    },
    { name: "Subjects", path: "/admin/subjects-grades", icon: <BookOpen size={18} /> },
    { name: "Students", path: "/admin/students", icon: <Users size={18} /> },
    { name: "Employees", path: "/admin/staffs", icon: <Briefcase size={18} /> },
    { name: "Accounts", path: "/admin/accounts", icon: <FileText size={18} /> },
    { name: "Fees", path: "/admin/fees", icon: <DollarSign size={18} /> },
    { name: "Salary", path: "/admin/salary", icon: <DollarSign size={18} /> },
    { name: "Attendance", path: "/admin/attendances", icon: <Calendar size={18} /> },
    { name: "Timetable", path: "/admin/timetable", icon: <Calendar size={18} /> },
    { name: "Homework", path: "/admin/homework", icon: <BookOpen size={18} /> },
    { name: "Behaviour & Skills", path: "/admin/behaviour", icon: <Users size={18} /> },
    { name: "Online Store & POS", path: "/admin/store", icon: <Briefcase size={18} /> },
    { name: "WhatsApp", path: "/admin/whatsapp", icon: <MessageCircle size={18} /> },
    { name: "Messaging", path: "/admin/circulars", icon: <MessageSquare size={18} /> },
    { name: "SMS Services", path: "/admin/sms", icon: <MessageSquare size={18} /> },
    { name: "Live Class", path: "/admin/live-classes", icon: <VideoIcon size={18} /> },
    { name: "Question Paper", path: "/admin/question-paper", icon: <FileText size={18} /> },
    { name: "Exams", path: "/admin/term-exam", icon: <Award size={18} /> },
    { name: "Class Tests", path: "/admin/test-results", icon: <FileText size={18} /> },
    { name: "Courses", path: "/admin/courses", icon: <Link size={18} /> },
    { name: "YouTube", path: "/admin/youtube", icon: <YoutubeIcon size={18} /> },
    { name: "Routine", path: "/admin/routine", icon: <Clock size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f1f4f7] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-[#36c6a1] text-white h-14 flex items-center justify-between px-4 shadow-sm z-40 fixed w-full top-0">
        <div className="flex items-center">
          <div className="w-64 flex items-center justify-between pr-4">
            <div className="flex items-center gap-2 font-bold text-xl tracking-wide">
              <span className="bg-white text-[#36c6a1] rounded-full w-8 h-8 flex items-center justify-center">A</span>
              Agaram
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="hidden md:flex items-center ml-4 space-x-2 text-white/80">
            <button className="p-2 hover:bg-white/10 rounded-md transition-colors"><Search size={18} /></button>
            <button className="p-2 hover:bg-white/10 rounded-md transition-colors"><Maximize size={18} /></button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <button className="bg-[#4285f4] text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
              APP STORE
            </button>
            <button className="bg-[#a4c639] text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
              GOOGLE PLAY
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button className="relative p-1 hover:bg-white/10 rounded-md transition-colors">
              <MessageCircle size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="relative p-1 hover:bg-white/10 rounded-md transition-colors">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-1 rounded-md transition-colors">
              <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                <img src="https://picsum.photos/seed/admin/100/100" alt="Admin" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-medium hidden md:block uppercase">Agaram Dhines</span>
              <ChevronDown size={14} className="hidden md:block" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-14 h-screen overflow-hidden">
        {/* Sidebar */}
        <div
          className={`
          fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#2b3643] shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex flex-col h-full overflow-y-auto custom-scrollbar
        `}
        >
          <div className="px-4 py-2 text-xs font-semibold text-[#5c6e7d] uppercase tracking-wider bg-[#26303b]">
            Menu
          </div>

          <div className="flex-1 py-2">
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.subItems && item.subItems.some(sub => location.pathname === sub.path.split('?')[0]));
                const isExpanded = expandedMenus[item.name];
                
                return (
                  <div key={item.name}>
                    <button
                      onClick={(e) => {
                        if (item.subItems) {
                          toggleSubMenu(item.name, e);
                        } else {
                          navigate(item.path);
                          if (window.innerWidth < 768) setIsSidebarOpen(false);
                        }
                      }}
                      className={`
                        w-full flex items-center px-4 py-3 text-sm transition-colors border-l-4
                        ${
                          isActive
                            ? "bg-[#ff6b6b] text-white border-[#ff6b6b]"
                            : "text-[#8a9fb0] border-transparent hover:bg-[#364150] hover:text-white"
                        }
                      `}
                    >
                      <span className={`mr-3 ${isActive ? "text-white" : "text-[#8a9fb0]"}`}>{item.icon}</span>
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.subItems ? (
                        <span className="text-xs font-bold">{isExpanded ? '-' : '+'}</span>
                      ) : (
                        !isActive && <span className="text-xs text-[#5c6e7d]">+</span>
                      )}
                    </button>
                    
                    {/* Sub Items */}
                    {item.subItems && isExpanded && (
                      <div className="bg-[#26303b] py-1">
                        {item.subItems.map(subItem => {
                          const isSubActive = location.pathname === subItem.path.split('?')[0] && location.search === (subItem.path.split('?')[1] ? `?${subItem.path.split('?')[1]}` : '');
                          return (
                            <button
                              key={subItem.name}
                              onClick={() => {
                                navigate(subItem.path);
                                if (window.innerWidth < 768) setIsSidebarOpen(false);
                              }}
                              className={`
                                w-full flex items-center pl-12 pr-4 py-2 text-sm transition-colors
                                ${isSubActive ? "text-white font-medium" : "text-[#8a9fb0] hover:text-white"}
                              `}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current mr-3 opacity-50"></span>
                              {subItem.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="p-4 bg-[#26303b]">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Search size={16} className="text-gray-500" />
              </div>
              <p className="text-xs font-bold text-gray-800 mb-1">Need More Advance?</p>
              <p className="text-[10px] text-gray-500 mb-3 leading-tight">Check our PRO version. An ultimate education management ERP with all advance features.</p>
              <button className="bg-[#ff6b6b] text-white text-xs px-4 py-1.5 rounded-full font-medium hover:bg-red-500 transition-colors">
                Try Demo
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f1f4f7]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
