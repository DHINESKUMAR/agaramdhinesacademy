import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Globe, 
  Video, 
  BookOpen, 
  Calendar, 
  UserCheck, 
  Menu, 
  X,
  DollarSign,
  Download,
  FileText
} from "lucide-react";
import { getAttendance, getZoomLinks, saveZoomLinks, getHomework, saveHomework, getStaffAttendance, saveStaffAttendance, getTimeTable, saveTimeTable, getStudents } from "../../lib/db";

export default function StaffDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("website");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const staff = location.state;

  useEffect(() => {
    if (!staff) {
      navigate("/");
    }
  }, [staff, navigate]);

  if (!staff) return null;

  const handleLogout = () => {
    navigate("/");
  };

  const navItems = [
    { id: "website", name: "Agaram Website", icon: <Globe size={20} /> },
    { id: "timetable", name: "My Timetable", icon: <Calendar size={20} /> },
    { id: "zoom", name: "Add Zoom Links", icon: <Video size={20} /> },
    { id: "homework", name: "Assign Homework", icon: <BookOpen size={20} /> },
    { id: "student-attendance", name: "Student Attendance", icon: <UserCheck size={20} /> },
    { id: "my-attendance", name: "My Classes (Attendance)", icon: <Calendar size={20} /> },
    { id: "salary", name: "Salary Details", icon: <DollarSign size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-blue-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold">Staff Panel</h1>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-blue-900 text-white flex flex-col shadow-xl`}>
        <div className="p-6 flex items-center justify-between bg-blue-950">
          <div>
            <h2 className="text-2xl font-bold text-white">Staff Panel</h2>
            <p className="text-blue-300 text-sm mt-1">Welcome, {staff.name}</p>
            <p className="text-blue-400 text-xs mt-0.5">{staff.role}</p>
          </div>
          <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id ? "bg-blue-600 text-white shadow-md" : "text-blue-100 hover:bg-blue-800 hover:text-white"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-blue-100 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200">
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
        <header className="bg-white shadow-sm px-8 py-4 hidden md:flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {navItems.find(i => i.id === activeTab)?.name}
          </h2>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2">
              <span>{staff.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span className="text-blue-600">{staff.role}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === "website" && <WebsiteView />}
          {activeTab === "timetable" && <TimetableManager staff={staff} />}
          {activeTab === "zoom" && <ZoomManager staff={staff} />}
          {activeTab === "homework" && <HomeworkManager staff={staff} />}
          {activeTab === "student-attendance" && <StudentAttendanceView staff={staff} />}
          {activeTab === "my-attendance" && <StaffAttendanceView staff={staff} />}
          {activeTab === "salary" && <SalaryView staff={staff} />}
        </main>
      </div>
    </div>
  );
}

function WebsiteView() {
  return (
    <div className="h-full w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-700">Agaram Dhines Academy Website</h3>
        <a href="https://www.agaramdhines.lk" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">Open in new tab</a>
      </div>
      <iframe src="https://www.agaramdhines.lk" className="w-full flex-1 border-0" title="Agaram Website" />
    </div>
  );
}

function ZoomManager({ staff }: { staff: any }) {
  const [links, setLinks] = useState<any[]>([]);
  const [formData, setFormData] = useState({ grade: "", subject: "", title: "", link: "", datetime: "", hostKey: "" });

  useEffect(() => {
    getZoomLinks().then(setLinks);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLink = { ...formData, id: Date.now().toString(), staffId: staff.id, staffName: staff.name };
    const updated = [...links, newLink];
    await saveZoomLinks(updated);
    setLinks(updated);
    setFormData({ grade: "", subject: "", title: "", link: "", datetime: "", hostKey: "" });
    
    // Also log this as a class conducted by the staff
    const staffAtt = await getStaffAttendance() || [];
    await saveStaffAttendance([...staffAtt, {
      id: Date.now().toString(),
      staffId: staff.id,
      staffName: staff.name,
      type: "Zoom Class Added",
      date: new Date().toISOString(),
      details: `${formData.title} (${formData.grade} - ${formData.subject})`
    }]);
    
    alert("Zoom link added successfully!");
  };

  const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = staff.assignedClasses?.[parseInt(e.target.value)];
    if (selected) {
      setFormData({ ...formData, grade: selected.grade, subject: selected.subject });
    } else {
      setFormData({ ...formData, grade: "", subject: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Zoom Link</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select 
            required 
            onChange={handleClassSelect} 
            className="border p-2 rounded"
            defaultValue=""
          >
            <option value="" disabled>Select Assigned Class</option>
            {staff.assignedClasses?.map((cls: any, idx: number) => (
              <option key={idx} value={idx}>{cls.grade} - {cls.subject}</option>
            ))}
            {(!staff.assignedClasses || staff.assignedClasses.length === 0) && (
              <option value="" disabled>No classes assigned to you.</option>
            )}
          </select>
          <input required placeholder="Topic / Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="border p-2 rounded" />
          <input required placeholder="Zoom Link" type="url" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="border p-2 rounded" />
          <input required placeholder="Host Key" value={formData.hostKey} onChange={e => setFormData({...formData, hostKey: e.target.value})} className="border p-2 rounded" />
          <input required type="datetime-local" value={formData.datetime} onChange={e => setFormData({...formData, datetime: e.target.value})} className="border p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium" disabled={!formData.grade}>Add Link</button>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Your Recent Zoom Links</h3>
        <div className="space-y-3">
          {links.filter(l => l.staffId === staff.id).map(link => (
            <div key={link.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold">{link.title} <span className="text-sm text-gray-500 font-normal">({link.grade} - {link.subject})</span></p>
                <p className="text-sm text-gray-600">Time: {new Date(link.datetime).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Host Key: <span className="font-mono bg-gray-100 px-1 rounded">{link.hostKey || 'N/A'}</span></p>
              </div>
              <a href={link.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Join</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimetableManager({ staff }: { staff: any }) {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [formData, setFormData] = useState({ grade: "", subject: "", day: "Monday", startTime: "", endTime: "" });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    getTimeTable().then(setTimetable);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = { 
      ...formData, 
      id: Date.now().toString(), 
      staffId: staff.id, 
      staffName: staff.name 
    };
    const updated = [...timetable, newEntry];
    await saveTimeTable(updated);
    setTimetable(updated);
    setFormData({ ...formData, startTime: "", endTime: "" });
    alert("Timetable entry added successfully!");
  };

  const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = staff.assignedClasses?.[parseInt(e.target.value)];
    if (selected) {
      setFormData({ ...formData, grade: selected.grade, subject: selected.subject });
    } else {
      setFormData({ ...formData, grade: "", subject: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Add Timetable Entry</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select 
            required 
            onChange={handleClassSelect} 
            className="border p-2 rounded"
            defaultValue=""
          >
            <option value="" disabled>Select Assigned Class</option>
            {staff.assignedClasses?.map((cls: any, idx: number) => (
              <option key={idx} value={idx}>{cls.grade} - {cls.subject}</option>
            ))}
            {(!staff.assignedClasses || staff.assignedClasses.length === 0) && (
              <option value="" disabled>No classes assigned to you.</option>
            )}
          </select>
          <select 
            required 
            value={formData.day} 
            onChange={e => setFormData({...formData, day: e.target.value})} 
            className="border p-2 rounded"
          >
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input required type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="border p-2 rounded" />
          <input required type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="border p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium md:col-span-2" disabled={!formData.grade}>Add to Timetable</button>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Your Timetable</h3>
        <div className="space-y-3">
          {timetable.filter(t => t.staffId === staff.id).sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day)).map(entry => (
            <div key={entry.id} className="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
              <div>
                <p className="font-bold text-gray-800">{entry.subject} <span className="text-sm text-gray-500 font-normal">({entry.grade})</span></p>
                <p className="text-sm text-blue-600 font-medium">{entry.day}: {entry.startTime} - {entry.endTime}</p>
              </div>
              <button onClick={async () => {
                if(window.confirm("Delete this entry?")) {
                  const updated = timetable.filter(t => t.id !== entry.id);
                  setTimetable(updated);
                  await saveTimeTable(updated);
                }
              }} className="text-red-500 hover:text-red-700 p-2">
                <X size={18} />
              </button>
            </div>
          ))}
          {timetable.filter(t => t.staffId === staff.id).length === 0 && (
            <p className="text-gray-500 italic">No timetable entries found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function HomeworkManager({ staff }: { staff: any }) {
  const [homework, setHomework] = useState<any[]>([]);
  const [formData, setFormData] = useState({ grade: "", subject: "", title: "", description: "", date: "" });

  useEffect(() => {
    getHomework().then(setHomework);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newHw = { ...formData, id: Date.now().toString(), staffId: staff.id, staffName: staff.name };
    const updated = [...homework, newHw];
    await saveHomework(updated);
    setHomework(updated);
    setFormData({ grade: "", subject: "", title: "", description: "", date: "" });
    alert("Homework assigned successfully!");
  };

  const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = staff.assignedClasses?.[parseInt(e.target.value)];
    if (selected) {
      setFormData({ ...formData, grade: selected.grade, subject: selected.subject });
    } else {
      setFormData({ ...formData, grade: "", subject: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Assign Homework</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select 
              required 
              onChange={handleClassSelect} 
              className="border p-2 rounded"
              defaultValue=""
            >
              <option value="" disabled>Select Assigned Class</option>
              {staff.assignedClasses?.map((cls: any, idx: number) => (
                <option key={idx} value={idx}>{cls.grade} - {cls.subject}</option>
              ))}
              {(!staff.assignedClasses || staff.assignedClasses.length === 0) && (
                <option value="" disabled>No classes assigned to you.</option>
              )}
            </select>
            <input required placeholder="Topic / Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="border p-2 rounded" />
            <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="border p-2 rounded md:col-span-2" />
          </div>
          <textarea required placeholder="Homework Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="border p-2 rounded h-24" />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium w-full md:w-auto md:px-8" disabled={!formData.grade}>Assign</button>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Your Recent Homework</h3>
        <div className="space-y-3">
          {homework.filter(h => h.staffId === staff.id).map(hw => (
            <div key={hw.id} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800">{hw.title} <span className="text-sm font-normal text-gray-500">({hw.grade} - {hw.subject})</span></h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Due: {hw.date}</span>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{hw.description}</p>
            </div>
          ))}
          {homework.filter(h => h.staffId === staff.id).length === 0 && (
            <p className="text-gray-500 italic">No homework assigned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentAttendanceView({ staff }: { staff: any }) {
  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const allAttendance = await getAttendance();
      const allStudents = await getStudents();
      
      const assignedGrades = staff.assignedClasses?.map((c: any) => c.grade) || [];
      
      // Map student data to attendance records
      const enrichedAttendance = allAttendance.map((record: any) => {
        const student = allStudents.find((s: any) => s.id === record.studentId);
        return {
          ...record,
          studentName: student?.name || 'Unknown',
          grade: student?.grade || 'Unknown'
        };
      });

      // Filter attendance to only show records for students in the staff's assigned classes
      const filtered = enrichedAttendance.filter((record: any) => assignedGrades.includes(record.grade));
      setAttendance(filtered);
    };
    loadData();
  }, [staff]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Student Attendance Records</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendance.map((record: any) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{record.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{record.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
            {attendance.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No attendance records found for your assigned classes.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StaffAttendanceView({ staff }: { staff: any }) {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    getStaffAttendance().then(data => {
      const myRecords = (data || []).filter((r: any) => r.staffId === staff.id);
      setRecords(myRecords);
    });
  }, [staff.id]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const classesThisMonth = records.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Classes This Month</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{classesThisMonth}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Classes</p>
          <p className="text-4xl font-bold text-green-600 mt-2">{records.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Your Activity Log</h3>
        <div className="space-y-3">
          {records.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
            <div key={record.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800">{record.type}</p>
                <p className="text-sm text-gray-600">{record.details}</p>
              </div>
              <p className="text-sm text-gray-500">{new Date(record.date).toLocaleString()}</p>
            </div>
          ))}
          {records.length === 0 && <p className="text-gray-500 text-center py-4">No activity recorded yet.</p>}
        </div>
      </div>
    </div>
  );
}

import { jsPDF } from "jspdf";

function SalaryView({ staff }: { staff: any }) {
  const handleDownload = (month: string) => {
    const subjects = staff.assignedClasses?.map((c: any) => c.subject).join(', ') || 'N/A';
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138); // #1e3a8a
    doc.text("AGARAM DHINES ACADEMY", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`SALARY SLIP: ${month}`, 105, 30, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Staff Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Staff Name: ${staff.name}`, 20, 50);
    doc.text(`Role: ${staff.role || 'Teacher'}`, 20, 60);
    doc.text(`Subjects: ${subjects}`, 20, 70);
    
    // Salary Details
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Salary Details", 20, 90);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Basic Salary:`, 20, 105);
    doc.text(`Rs. ${staff.salary || "0"}`, 150, 105);
    
    doc.line(20, 115, 190, 115);
    
    doc.setFont("helvetica", "bold");
    doc.text(`Total Payable:`, 20, 125);
    doc.text(`Rs. ${staff.salary || "0"}`, 150, 125);
    
    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 270, { align: "center" });
    doc.text("This is a computer generated document.", 105, 280, { align: "center" });
    
    doc.save(`Payslip_${staff.name.replace(/\s+/g, '_')}_${month.replace(/\s+/g, '_')}.pdf`);
  };

  const months = [
    new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('default', { month: 'long', year: 'numeric' }),
    new Date(new Date().setMonth(new Date().getMonth() - 2)).toLocaleString('default', { month: 'long', year: 'numeric' })
  ];

  const subjects = staff.assignedClasses?.map((c: any) => c.subject).join(', ') || 'N/A';

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Salary Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col justify-center">
            <p className="text-sm text-blue-600 font-medium mb-1 uppercase tracking-wider">Current Basic Salary</p>
            <p className="text-4xl font-bold text-blue-900">Rs. {staff.salary || "0"}</p>
          </div>
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-500 font-medium">Name:</span> <span className="font-bold text-gray-800">{staff.name}</span></p>
            <p className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-500 font-medium">Role:</span> <span className="font-bold text-gray-800">{staff.role || "Teacher"}</span></p>
            <p className="flex justify-between pb-1"><span className="text-gray-500 font-medium">Subjects:</span> <span className="font-bold text-gray-800">{subjects}</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Payslips</h3>
        <div className="space-y-3">
          {months.map((month, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Salary Slip - {month}</p>
                  <p className="text-sm text-gray-500">Amount: Rs. {staff.salary || "0"}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDownload(month)}
                className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 hover:text-blue-600 font-medium text-sm transition-colors shadow-sm"
              >
                <Download size={16} />
                <span>Download Sheet</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
