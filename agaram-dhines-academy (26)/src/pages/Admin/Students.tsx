import React, { useState, useEffect } from "react";
import { getStudents, saveStudents, getClasses } from "../../lib/db";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { secondaryAuth } from "../../lib/firebase";

export default function Students() {
  const [view, setView] = useState<"menu" | "add" | "view">("menu");
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [filterClass, setFilterClass] = useState<string>("");

  useEffect(() => {
    getStudents().then(setStudents);
    getClasses().then(setClasses);
  }, [view]);

  // Form state
  const [formData, setFormData] = useState({
    grade: "Grade 01",
    name: "",
    username: "",
    password: "",
    rollNo: "",
    subjects: [] as string[]
  });

  const availableSubjects = [
    "தமிழ்", "தமிழ் இலக்கிய நயம்", "கணிதம்", "வரலாறு", "விஞ்ஞானம்", "புவியியல்", "ஆங்கிலம்", "சித்திரம்", "ICT"
  ];

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => {
      const subjects = prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject];
      return { ...prev, subjects };
    });
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password) {
      alert("Name, Username, and Password are required!");
      return;
    }
    
    try {
      // Create user in Firebase Auth
      const email = `${formData.username}@agaram.com`;
      await createUserWithEmailAndPassword(secondaryAuth, email, formData.password);
      
      const newStudent = {
        id: "STU" + Math.floor(Math.random() * 100000),
        ...formData
      };
      
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      await saveStudents(updatedStudents);
      
      alert("Student added successfully!");
      setFormData({ grade: "Grade 01", name: "", username: "", password: "", rollNo: "", subjects: [] });
      setView("menu");
    } catch (error: any) {
      console.error("Error creating student:", error);
      alert("Error creating student: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student? They will not be able to login.")) {
      const updatedStudents = students.filter(s => s.id !== id);
      setStudents(updatedStudents);
      await saveStudents(updatedStudents);
      alert("Student deleted successfully. They can no longer login.");
    }
  };

  if (view === "menu") {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">
        <button
          onClick={() => setView("add")}
          className="bg-[#1e3a8a] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors font-medium text-center"
        >
          Add Student
        </button>
        <button
          onClick={() => setView("view")}
          className="bg-[#1e3a8a] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors font-medium text-center"
        >
          View Students
        </button>
        <button className="bg-[#1e3a8a] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors font-medium text-center">
          View ID & PIN
        </button>
      </div>
    );
  }

  if (view === "add") {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setView("menu")}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h2 className="text-xl font-bold text-gray-800">Add Student</h2>
        </div>

        <form onSubmit={handleAddStudent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Class And Section
            </label>
            <select 
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Select Class</option>
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <option key={cls.id} value={cls.name}>
                    {cls.name}
                  </option>
                ))
              ) : (
                Array.from({ length: 13 }, (_, i) => (
                  <option key={i} value={`Grade ${String(i + 1).padStart(2, '0')}`}>
                    Grade {String(i + 1).padStart(2, '0')}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name
            </label>
            <input
              type="text"
              placeholder="Enter Student Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Of Birth
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guardian Name
            </label>
            <input
              type="text"
              placeholder="Enter Guardian Name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              placeholder="Enter Address"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact No
            </label>
            <input
              type="tel"
              placeholder="Enter Contact No"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roll No
            </label>
            <input
              type="text"
              placeholder="Enter Roll No"
              value={formData.rollNo}
              onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Code (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter Student Code (If any)"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Of Admission
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="text"
              placeholder="Enter Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Image (Optional)
            </label>
            <input
              type="file"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subjects
            </label>
            <div className="grid grid-cols-2 gap-2 border border-gray-300 rounded-md p-3 bg-white">
              {availableSubjects.map(subject => (
                <label key={subject} className="flex items-center space-x-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={formData.subjects.includes(subject)}
                    onChange={() => handleSubjectToggle(subject)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{subject}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="bg-pink-600 text-white px-8 py-2 rounded-md hover:bg-pink-700 transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (view === "view") {
    const filteredStudents = filterClass 
      ? students.filter(s => s.grade === filterClass)
      : students;

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => setView("menu")}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h2 className="text-xl font-bold text-gray-800">View Students</h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Filter by Class:</span>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Classes</option>
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <option key={cls.id} value={cls.name}>
                    {cls.name}
                  </option>
                ))
              ) : (
                Array.from({ length: 13 }, (_, i) => (
                  <option key={i} value={`Grade ${String(i + 1).padStart(2, '0')}`}>
                    Grade {String(i + 1).padStart(2, '0')}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredStudents.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No students found.</div>
          ) : (
            filteredStudents.map(student => (
              <div key={student.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1e3a8a]">{student.name}</h3>
                    <p className="text-sm text-gray-500">ID: {student.id} | Username: {student.username} | {student.grade}</p>
                    {student.subjects && student.subjects.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">Subjects: {student.subjects.join(", ")}</p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(student.id)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return null;
}
