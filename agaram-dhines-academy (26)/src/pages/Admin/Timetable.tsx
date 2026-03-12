import React, { useState, useEffect } from "react";
import { getTimeTable, saveTimeTable, getGrades, getSubjects, getStaffs } from "../../lib/db";
import { Plus, Trash2 } from "lucide-react";

export default function Timetable() {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    grade: "",
    day: "Monday",
    subject: "",
    staffId: "",
    startTime: "",
    endTime: ""
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    getTimeTable().then(setTimetable);
    getGrades().then(setGrades);
    getSubjects().then(setSubjects);
    getStaffs().then(setStaffs);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.grade || !formData.subject || !formData.staffId || !formData.startTime || !formData.endTime) {
      alert("Please fill all fields");
      return;
    }

    const staff = staffs.find(s => s.id === formData.staffId);
    
    const newEntry = {
      id: Date.now().toString(),
      ...formData,
      staffName: staff ? staff.name : "Unknown"
    };

    const updated = [...timetable, newEntry];
    setTimetable(updated);
    await saveTimeTable(updated);
    
    setFormData({
      ...formData,
      subject: "",
      staffId: "",
      startTime: "",
      endTime: ""
    });
    alert("Timetable entry added successfully!");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this timetable entry?")) {
      const updated = timetable.filter(t => t.id !== id);
      setTimetable(updated);
      await saveTimeTable(updated);
    }
  };

  const filteredTimetable = timetable.filter(t => t.grade === formData.grade && t.day === formData.day);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Class Time Table</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Entry Form */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Entry</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select 
                value={formData.grade}
                onChange={e => setFormData({...formData, grade: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select Grade</option>
                {grades.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                {grades.length === 0 && <option value="Grade 10">Grade 10 (Default)</option>}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <select 
                value={formData.day}
                onChange={e => setFormData({...formData, day: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select 
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff</label>
              <select 
                value={formData.staffId}
                onChange={e => setFormData({...formData, staffId: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select Staff</option>
                {staffs.map(s => <option key={s.id} value={s.id}>{s.name} ({s.assignedClasses?.map((c: any) => c.subject).join(', ') || 'No subjects'})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input 
                  type="time" 
                  value={formData.startTime}
                  onChange={e => setFormData({...formData, startTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input 
                  type="time" 
                  value={formData.endTime}
                  onChange={e => setFormData({...formData, endTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium">
              Add to Timetable
            </button>
          </form>
        </div>

        {/* View Timetable */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">View Timetable</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <p className="text-sm text-gray-600 mb-2">Showing timetable for:</p>
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {formData.grade || "Select Grade"}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {formData.day}
              </span>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {!formData.grade ? (
              <p className="text-gray-500 text-center py-4">Please select a grade to view timetable.</p>
            ) : filteredTimetable.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No classes scheduled for this day.</p>
            ) : (
              filteredTimetable.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(entry => (
                <div key={entry.id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center bg-white shadow-sm">
                  <div>
                    <h4 className="font-bold text-gray-800">{entry.subject}</h4>
                    <p className="text-sm text-gray-600">Staff: {entry.staffName}</p>
                    <p className="text-sm text-blue-600 font-medium">{entry.startTime} - {entry.endTime}</p>
                  </div>
                  <button onClick={() => handleDelete(entry.id)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-md">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
