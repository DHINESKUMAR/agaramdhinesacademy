import React, { useState, useEffect } from "react";
import { getStudents, getAttendance, saveAttendance, getStaffs, getStaffAttendance } from "../../lib/db";

export default function Attendances() {
  const [activeTab, setActiveTab] = useState<"students" | "staffs">("students");
  
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  
  const [staffs, setStaffs] = useState<any[]>([]);
  const [staffAttendance, setStaffAttendance] = useState<any[]>([]);

  const [selectedGrade, setSelectedGrade] = useState("Grade 10");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const grades = Array.from({ length: 13 }, (_, i) => `Grade ${String(i + 1).padStart(2, '0')}`);

  useEffect(() => {
    const loadData = async () => {
      setStudents(await getStudents());
      setAttendance(await getAttendance());
      setStaffs(await getStaffs());
      setStaffAttendance(await getStaffAttendance());
    };
    loadData();
  }, []);

  const handleMarkAttendance = async (studentId: string, status: "Present" | "Absent") => {
    const newRecord = {
      id: Date.now().toString() + studentId,
      studentId,
      date,
      status
    };

    const existingIndex = attendance.findIndex(a => a.studentId === studentId && a.date === date);
    let updatedAttendance = [...attendance];
    
    if (existingIndex >= 0) {
      updatedAttendance[existingIndex] = newRecord;
    } else {
      updatedAttendance.push(newRecord);
    }

    setAttendance(updatedAttendance);
    await saveAttendance(updatedAttendance);
  };

  const filteredStudents = students.filter(s => s.grade === selectedGrade);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Attendance Management</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-md font-medium ${activeTab === "students" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            Students
          </button>
          <button 
            onClick={() => setActiveTab("staffs")}
            className={`px-4 py-2 rounded-md font-medium ${activeTab === "staffs" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            Staffs
          </button>
        </div>
      </div>
      
      {activeTab === "students" ? (
        <>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Grade</label>
              <select 
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 text-sm">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">No students found for this grade.</td>
                  </tr>
                ) : (
                  filteredStudents.map(student => {
                    const record = attendance.find(a => a.studentId === student.id && a.date === date);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="p-3 border-b">{student.id}</td>
                        <td className="p-3 border-b font-medium">{student.name}</td>
                        <td className="p-3 border-b text-center space-x-2">
                          <button 
                            onClick={() => handleMarkAttendance(student.id, "Present")}
                            className={`px-3 py-1 rounded text-sm font-medium ${record?.status === "Present" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-green-100"}`}
                          >
                            Present
                          </button>
                          <button 
                            onClick={() => handleMarkAttendance(student.id, "Absent")}
                            className={`px-3 py-1 rounded text-sm font-medium ${record?.status === "Absent" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-red-100"}`}
                          >
                            Absent
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Staff Activity & Attendance</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Staff Name</th>
                <th className="p-3 border-b">Activity Type</th>
                <th className="p-3 border-b">Details</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {staffAttendance.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">No staff attendance records found.</td>
                </tr>
              ) : (
                staffAttendance.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{new Date(record.date).toLocaleString()}</td>
                    <td className="p-3 border-b font-medium">{record.staffName}</td>
                    <td className="p-3 border-b">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {record.type}
                      </span>
                    </td>
                    <td className="p-3 border-b text-gray-600">{record.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
