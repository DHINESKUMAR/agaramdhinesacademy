import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Book,
  BookOpen,
  DollarSign,
  User,
  Link,
  Video,
  Globe,
  Bell,
  LogOut,
  Calendar,
  Youtube,
  Edit2,
  Check,
  FileText,
  Download
} from "lucide-react";

import { getCourses, getZoomLinks, getYoutubeLinks, getFees, getAttendance, saveAttendance, getClassLinks, getHomework, getStaffs, getTimeTable, getStudents, saveStudents } from "../../lib/db";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("home");
  
  const [courses, setCourses] = useState<any[]>([]);
  const [zoomLinks, setZoomLinks] = useState<any[]>([]);
  const [youtubeLinks, setYoutubeLinks] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [classLinks, setClassLinks] = useState<Record<string, string>>({});
  const [homework, setHomework] = useState<any[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Get student data from login
  const studentData = location.state;
  const [enrolledClasses, setEnrolledClasses] = useState<string[]>(studentData?.enrolledClasses || []);

  useEffect(() => {
    if (!studentData) {
      navigate("/");
      return;
    }
    const loadData = async () => {
      const allCourses = await getCourses();
      const allZoomLinks = await getZoomLinks();
      const allFees = await getFees();
      const allAttendance = await getAttendance();
      const allStaffs = await getStaffs();
      const allTimetable = await getTimeTable();
      
      setCourses(allCourses.filter((c: any) => c.grade === studentData.grade));
      setZoomLinks(allZoomLinks.filter((z: any) => z.grade === studentData.grade));
      setYoutubeLinks(await getYoutubeLinks());
      setFees(allFees.filter((f: any) => f.studentId === studentData.id || f.studentName === studentData.name));
      setAttendance(allAttendance.filter((a: any) => a.studentId === studentData.id));
      setClassLinks(await getClassLinks());
      setStaffs(allStaffs);
      setTimetable(allTimetable.filter((t: any) => t.grade === studentData.grade));
      
      const allHomework = await getHomework();
      setHomework(allHomework.filter((h: any) => h.grade === studentData.grade));
    };
    loadData();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [studentData.grade, studentData.id, studentData.name]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const [displayName, setDisplayName] = useState(studentData.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(displayName);

  const handleSaveName = () => {
    setDisplayName(tempName);
    setIsEditingName(false);
  };

  const formatMonth = (monthStr: string) => {
    if (!monthStr) return "";
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const handleJoinClass = async (linkUrl: string) => {
    if (!linkUrl) {
      alert("No class link available.");
      return;
    }
    
    // Mark attendance automatically
    const today = new Date().toISOString().split('T')[0];
    const allAttendance = await getAttendance();
    const existing = allAttendance.find((a: any) => a.studentId === studentData.id && a.date === today);
    
    if (!existing) {
      allAttendance.push({
        id: Date.now().toString() + studentData.id,
        studentId: studentData.id,
        date: today,
        status: "Present"
      });
      await saveAttendance(allAttendance);
      // Update local state to reflect immediately
      setAttendance([...attendance, { id: Date.now().toString() + studentData.id, studentId: studentData.id, date: today, status: "Present" }]);
    }
    
    alert("Attendance Marked Successfully!");
    window.open(linkUrl, "_blank");
  };

  const navItems = [
    { id: "profile", name: "Profile", icon: <User size={24} /> },
    { id: "home", name: "Home", icon: <Home size={24} /> },
    { id: "subjects", name: "My Subjects", icon: <Book size={24} /> },
    { id: "homework", name: "Homework", icon: <BookOpen size={24} /> },
    { id: "fees", name: "Fees", icon: <DollarSign size={24} /> },
    { id: "website", name: "Website", icon: <Globe size={24} /> },
  ];

  if (!studentData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col font-sans relative">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
            <User size={20} className="text-[#1e3a8a]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">
              {displayName}
            </h1>
            <p className="text-xs text-blue-200">{studentData.grade}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              <Download size={16} />
              <span>Install App</span>
            </button>
          )}
          <Bell size={24} />
          <button
            onClick={() => navigate("/")}
            className="text-red-300 hover:text-red-100"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a 
        href={`https://wa.me/message/SLLBT6FLMFHVL1?text=${encodeURIComponent(`வணக்கம் அகரம் தினேஸ் ஐயா அவர்களே! எனது பிள்ளை பெயர்: ${displayName}, தரம்: ${studentData.grade}, மாவட்டம்: ${studentData.district || 'N/A'}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 flex items-center justify-center"
        title="Contact on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </a>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 bg-transparent pb-20">
        {activeTab !== "home" && (
          <button 
            onClick={() => setActiveTab("home")}
            className="mb-4 text-white font-medium flex items-center hover:underline bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm w-fit"
          >
            ← Back to Home
          </button>
        )}

        {activeTab === "home" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-[#1e3a8a]">
                Welcome to Agaram Dhines Academy
              </h2>
              <p className="text-gray-600">
                Your student dashboard is ready. Access your homework,
                attendance, and fees from the menu below.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setActiveTab("subjects")}
                className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-2">
                  <Book size={24} />
                </div>
                <span className="font-bold text-gray-800">My Subjects</span>
              </div>

              <div
                onClick={() => setActiveTab("courses")}
                className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2">
                  <Link size={24} />
                </div>
                <span className="font-bold text-gray-800">My Courses</span>
              </div>

              <div
                onClick={() => setActiveTab("homework")}
                className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                  <BookOpen size={24} />
                </div>
                <span className="font-bold text-gray-800">Homework</span>
              </div>

              <div
                onClick={() => setActiveTab("attendance")}
                className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                  <Calendar size={24} />
                </div>
                <span className="font-bold text-gray-800">Attendance</span>
              </div>

              <div
                onClick={() => setActiveTab("youtube")}
                className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                  <Youtube size={24} />
                </div>
                <span className="font-bold text-gray-800">YouTube</span>
              </div>

              <div
                onClick={() => setActiveTab("fees")}
                className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-2">
                  <DollarSign size={24} />
                </div>
                <span className="font-bold text-gray-800">Fees</span>
              </div>
            </div>

            {/* Upcoming Subject Classes */}
            {enrolledClasses.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mt-4 border-l-4 border-pink-500">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Video size={20} className="mr-2 text-pink-500" /> Upcoming Subject Classes
                </h3>
                <div className="space-y-3">
                  {zoomLinks
                    .filter(z => enrolledClasses.includes(z.subject))
                    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
                    .slice(0, 3) // Show next 3
                    .map(z => (
                      <div key={z.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                          <p className="font-bold text-gray-800">{z.title} <span className="text-sm font-normal text-gray-500">({z.subject})</span></p>
                          <p className="text-xs text-gray-500">{new Date(z.datetime).toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => handleJoinClass(z.link)}
                          className="bg-pink-100 text-pink-700 px-4 py-2 rounded font-medium hover:bg-pink-200 text-sm"
                        >
                          Join
                        </button>
                      </div>
                    ))}
                  {zoomLinks.filter(z => enrolledClasses.includes(z.subject)).length === 0 && (
                    <p className="text-gray-500 text-sm italic">No upcoming classes scheduled.</p>
                  )}
                </div>
              </div>
            )}

            {/* Main Class Link Section */}
            {classLinks[studentData.grade] && (
              <div className="bg-white rounded-xl shadow-lg p-6 mt-4 border-l-4 border-blue-500">
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                  <Video size={20} className="mr-2 text-blue-500" /> Live Zoom Class Link
                </h3>
                <p className="text-sm text-gray-600 mb-4">Join your regular class sessions for {studentData.grade}</p>
                <button 
                  onClick={() => handleJoinClass(classLinks[studentData.grade])}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md"
                >
                  Join Live Zoom Class & Mark Attendance
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "subjects" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-800 flex items-center">
                <Book className="mr-2 text-pink-500" /> My Subjects
              </h2>
              <p className="text-gray-600 mb-6">Enroll in subjects and view class details.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Find all unique subjects offered for this grade by any staff */}
                {Array.from(new Set(staffs.flatMap(s => s.assignedClasses?.filter((c: any) => c.grade === studentData.grade).map((c: any) => c.subject) || []))).map((subjectName: any) => {
                  const isEnrolled = enrolledClasses.includes(subjectName);
                  const staffForSubject = staffs.filter(s => s.assignedClasses?.some((c: any) => c.grade === studentData.grade && c.subject === subjectName));
                  const subjectTimetable = timetable.filter(t => t.subject === subjectName);
                  const subjectZoomLinks = zoomLinks.filter(z => z.subject === subjectName);
                  
                  return (
                    <div key={subjectName} className={`p-4 rounded-xl shadow-sm border transition-all ${isEnrolled ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{subjectName}</h3>
                          <p className="text-sm text-gray-600 font-medium mt-1">
                            Teacher(s): <span className="text-indigo-600">{staffForSubject.map(s => s.name).join(', ') || 'TBA'}</span>
                          </p>
                        </div>
                        <button
                          onClick={async () => {
                            let newEnrolled = [...enrolledClasses];
                            if (isEnrolled) {
                              newEnrolled = newEnrolled.filter(s => s !== subjectName);
                            } else {
                              newEnrolled.push(subjectName);
                            }
                            setEnrolledClasses(newEnrolled);
                            
                            // Save to db
                            const allStudents = await getStudents();
                            const updatedStudents = allStudents.map((s: any) => 
                              s.id === studentData.id ? { ...s, enrolledClasses: newEnrolled } : s
                            );
                            await saveStudents(updatedStudents);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-bold ${isEnrolled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {isEnrolled ? 'Enrolled' : 'Enroll'}
                        </button>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        {isEnrolled && (
                          <>
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="font-semibold text-gray-800 mb-1">Timetable:</p>
                              {subjectTimetable.length > 0 ? (
                                <ul className="list-disc pl-4 space-y-1">
                                  {subjectTimetable.map(t => (
                                    <li key={t.id}>{t.day} {t.startTime} - {t.endTime}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-500 italic">No timetable set.</p>
                              )}
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="font-semibold text-gray-800 mb-1">Upcoming Zoom Classes:</p>
                              {subjectZoomLinks.length > 0 ? (
                                <div className="space-y-2">
                                  {subjectZoomLinks.map(z => (
                                    <div key={z.id} className="bg-white p-2 rounded border border-blue-100">
                                      <p className="font-medium text-blue-900">{z.title}</p>
                                      <p className="text-xs text-gray-500">{new Date(z.datetime).toLocaleString()}</p>
                                      <a href={z.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Join Link</a>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 italic">No upcoming classes.</p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {staffs.flatMap(s => s.assignedClasses?.filter((c: any) => c.grade === studentData.grade) || []).length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No subjects currently available for {studentData.grade}.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
              <button 
                onClick={() => window.open("https://www.agaramdhines.lk/courses/", "_blank")}
                className="bg-[#1e3a8a] text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800"
              >
                Browse All Courses
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">Access your grade-specific courses below.</p>
            
            <div className="space-y-4">
              {courses.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No courses found for your grade.</div>
              ) : (
                courses.map(course => (
                  <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="bg-[#1e3a8a] text-white p-3">
                      <h3 className="font-bold">{course.grade} - {course.title}</h3>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-between items-center">
                      <span className="text-sm text-gray-600">View course materials on our website</span>
                      <button 
                        onClick={() => window.open(course.link, "_blank")}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded font-medium hover:bg-blue-200"
                      >
                        Open Course
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "youtube" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">YouTube Videos</h2>
            <div className="space-y-4">
              {youtubeLinks.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No videos found.</div>
              ) : (
                youtubeLinks.map(link => (
                  <div key={link.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-red-600">{link.title}</h3>
                    </div>
                    <button 
                      onClick={() => window.open(link.link, "_blank")}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded font-medium hover:bg-red-200"
                    >
                      Watch
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {activeTab === "homework" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Recent Homework
            </h2>
            <div className="space-y-4">
              {homework.filter(h => enrolledClasses.includes(h.subject)).length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No homework assigned yet for your enrolled subjects.
                </div>
              ) : (
                homework.filter(h => enrolledClasses.includes(h.subject)).map((hw: any) => (
                  <div key={hw.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-[#1e3a8a] text-lg">{hw.title} <span className="text-sm font-normal text-gray-500">({hw.subject})</span></h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Assigned: {hw.date}</span>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{hw.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Attendance Record
            </h2>
            <div className="space-y-4">
              {attendance.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No attendance records found.</div>
              ) : (
                attendance.map((record: any) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-800">{new Date(record.date).toLocaleDateString()}</h3>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded text-sm font-medium ${record.status === "Present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "fees" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Fee Status</h2>
            <div className="space-y-4">
              {fees.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No fee records found.</div>
              ) : (
                fees.map((fee: any) => (
                  <div key={fee.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-[#1e3a8a]">{fee.month}</h3>
                      <p className="text-sm text-gray-500">Paid on: {new Date(fee.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded text-sm">Paid: Rs. {fee.amount}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-4 border-blue-100">
                  <User size={48} className="text-gray-400" />
                </div>
              </div>
              
              <div className="text-center mb-6">
                {isEditingName ? (
                  <div className="flex items-center justify-center space-x-2">
                    <input 
                      type="text" 
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-center font-bold text-gray-800"
                      autoFocus
                    />
                    <button onClick={handleSaveName} className="text-green-600 hover:text-green-800">
                      <Check size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {displayName}
                    </h2>
                    <button onClick={() => setIsEditingName(true)} className="text-gray-400 hover:text-blue-600">
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1">Display Name</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Admin Given Name</span>
                  <span className="font-medium">{studentData.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Username</span>
                  <span className="font-medium">{studentData.username}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Grade</span>
                  <span className="font-medium">{studentData.grade}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Roll No</span>
                  <span className="font-medium">{studentData.rollNo}</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => window.open("https://www.agaramdhines.lk/lp-profile/", "_blank")}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2"
                >
                  <User size={20} />
                  Manage External Profile
                </button>
              </div>
            </div>

            {/* Zoom Class Link Section in Profile */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 mt-4">
              <h3 className="text-lg font-bold mb-2 text-[#1e3a8a] flex items-center">
                <Video size={20} className="mr-2" /> Class Links
              </h3>
              <p className="text-sm text-gray-600 mb-4">Your registered live class links for {studentData.grade}</p>
              
              <div className="space-y-3">
                {classLinks[studentData.grade] && (
                  <div className="bg-blue-50 p-3 rounded-md flex justify-between items-center border border-blue-100">
                    <span className="font-medium text-blue-800 truncate mr-2">CLASS</span>
                    <button 
                      onClick={() => handleJoinClass(classLinks[studentData.grade])}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
                    >
                      Join Now
                    </button>
                  </div>
                )}
                
                {zoomLinks.map(link => (
                  <div key={link.id} className="bg-pink-50 p-3 rounded-md flex justify-between items-center border border-pink-100">
                    <span className="font-medium text-pink-800 truncate mr-2">{link.title}</span>
                    <button 
                      onClick={() => handleJoinClass(link.link)}
                      className="bg-pink-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-pink-700 whitespace-nowrap"
                    >
                      Join Now
                    </button>
                  </div>
                ))}

                {!classLinks[studentData.grade] && zoomLinks.length === 0 && (
                  <div className="text-center text-gray-500 py-4">No class links available.</div>
                )}
              </div>
            </div>

            {/* Fee History Section in Profile */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 text-[#1e3a8a] flex items-center">
                <DollarSign size={20} className="mr-2" /> Monthly Fee History
              </h3>
              <div className="space-y-3">
                {fees.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No fee history found.</div>
                ) : (
                  fees.map((fee: any) => (
                    <div key={fee.id} className="flex justify-between items-center border-b pb-2">
                      <span className="text-gray-700 font-medium">{formatMonth(fee.month)}</span>
                      <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-sm">Paid (Rs. {fee.amount})</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 flex justify-around p-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === "website") {
                window.open("https://agaramdhines.lk", "_blank");
              } else {
                setActiveTab(item.id);
              }
            }}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === item.id
                ? "text-pink-600 scale-110"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
