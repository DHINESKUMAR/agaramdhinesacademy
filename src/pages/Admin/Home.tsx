import React, { useState, useEffect } from "react";
import { DollarSign, Calendar as CalendarIcon, Edit2, Check, Trash2 } from "lucide-react";
import { getSchedule, saveSchedule, getFees, getStudents } from "../../lib/db";

export default function AdminHome() {
  const [currentDate] = useState(new Date());
  const [schedule, setSchedule] = useState<any[]>([]);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [totalFees, setTotalFees] = useState(0);
  const [studentStats, setStudentStats] = useState({ total: 0, boys: 0, girls: 0 });

  const [newSchedule, setNewSchedule] = useState({
    grade: "Grade 10",
    day: "Monday",
    time: "",
    subject: "",
    link: ""
  });

  const grades = Array.from({ length: 13 }, (_, i) => `Grade ${String(i + 1).padStart(2, '0')}`);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const loadData = async () => {
      setSchedule(await getSchedule());
      
      // Calculate total fees for current month
      const fees = await getFees();
      const currentMonthStr = currentDate.toISOString().slice(0, 7); // YYYY-MM
      const monthFees = fees.filter((f: any) => f.month === currentMonthStr);
      const total = monthFees.reduce((sum: number, f: any) => sum + Number(f.amount), 0);
      setTotalFees(total);

      // Get student stats
      const students = await getStudents();
      setStudentStats({
        total: students.length,
        boys: students.length, // Assuming all boys for now as gender isn't saved in db.ts initially
        girls: 0
      });
    };
    loadData();
  }, [currentDate]);

  const handleAddSchedule = async () => {
    if (!newSchedule.time || !newSchedule.subject) {
      alert("Time and Subject are required!");
      return;
    }
    const updated = [...schedule, { id: Date.now().toString(), ...newSchedule }];
    setSchedule(updated);
    await saveSchedule(updated);
    setNewSchedule({ ...newSchedule, time: "", subject: "", link: "" });
  };

  const handleDeleteSchedule = async (id: string) => {
    const updated = schedule.filter(s => s.id !== id);
    setSchedule(updated);
    await saveSchedule(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Student Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-medium">Total Students</span>
              <span className="font-bold">{studentStats.total}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-medium">Boys</span>
              <span className="font-bold">{studentStats.boys}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-medium">Girls</span>
              <span className="font-bold">{studentStats.girls}</span>
            </div>
          </div>
        </div>

        {/* Fees Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg shadow-md p-6 border border-green-200 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <DollarSign size={32} />
          </div>
          <h2 className="text-lg font-bold text-green-800 mb-1">Total Fees Collected</h2>
          <p className="text-sm text-green-600 mb-2">This Month ({currentDate.toLocaleString('default', { month: 'long' })})</p>
          <p className="text-4xl font-extrabold text-green-700">Rs. {totalFees.toLocaleString()}</p>
        </div>
      </div>

      {/* Class Calendar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <CalendarIcon className="mr-2 text-blue-600" /> Class Calendar & Schedule
          </h2>
          <button 
            onClick={() => setIsEditingSchedule(!isEditingSchedule)}
            className={`${isEditingSchedule ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded text-sm font-medium flex items-center`}
          >
            {isEditingSchedule ? <><Check size={16} className="mr-1" /> Done Editing</> : <><Edit2 size={16} className="mr-1" /> Edit Schedule</>}
          </button>
        </div>
        
        {isEditingSchedule && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-bold mb-3 text-gray-700">Add New Schedule Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <select 
                value={newSchedule.grade}
                onChange={e => setNewSchedule({...newSchedule, grade: e.target.value})}
                className="border rounded p-2 text-sm"
              >
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select 
                value={newSchedule.day}
                onChange={e => setNewSchedule({...newSchedule, day: e.target.value})}
                className="border rounded p-2 text-sm"
              >
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input 
                type="time" 
                value={newSchedule.time}
                onChange={e => setNewSchedule({...newSchedule, time: e.target.value})}
                className="border rounded p-2 text-sm"
              />
              <input 
                type="text" 
                placeholder="Subject (e.g., Tamil)" 
                value={newSchedule.subject}
                onChange={e => setNewSchedule({...newSchedule, subject: e.target.value})}
                className="border rounded p-2 text-sm"
              />
              <input 
                type="url" 
                placeholder="Link (Optional)" 
                value={newSchedule.link}
                onChange={e => setNewSchedule({...newSchedule, link: e.target.value})}
                className="border rounded p-2 text-sm"
              />
            </div>
            <button 
              onClick={handleAddSchedule}
              className="mt-3 bg-[#1e3a8a] text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800"
            >
              Add Item
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-3 border-b">Day</th>
                <th className="p-3 border-b">Grade</th>
                <th className="p-3 border-b">Time</th>
                <th className="p-3 border-b">Subject</th>
                <th className="p-3 border-b">Link</th>
                {isEditingSchedule && <th className="p-3 border-b">Action</th>}
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {schedule.length === 0 ? (
                <tr>
                  <td colSpan={isEditingSchedule ? 6 : 5} className="p-4 text-center text-gray-500">No schedule items found.</td>
                </tr>
              ) : (
                schedule.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b font-bold text-blue-800">{item.day}</td>
                    <td className="p-3 border-b">{item.grade}</td>
                    <td className="p-3 border-b">{item.time}</td>
                    <td className="p-3 border-b">{item.subject}</td>
                    <td className="p-3 border-b">
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Link</a>
                      ) : "-"}
                    </td>
                    {isEditingSchedule && (
                      <td className="p-3 border-b">
                        <button onClick={() => handleDeleteSchedule(item.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
