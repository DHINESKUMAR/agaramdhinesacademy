import React, { useState, useEffect } from "react";
import { getHomework, saveHomework, getSubjects } from "../../lib/db";

export default function Homework() {
  const [view, setView] = useState<"menu" | "add" | "view">("menu");
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getHomework().then(setHomeworkList);
    getSubjects().then(setSubjects);
  }, [view]);

  const handleAddHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrade || !selectedSubject || !title) return;

    const newHomework = {
      id: Date.now().toString(),
      grade: selectedGrade,
      subject: selectedSubject,
      title,
      description,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedList = [...homeworkList, newHomework];
    setHomeworkList(updatedList);
    await saveHomework(updatedList);
    
    alert("Homework added successfully!");
    setSelectedGrade("");
    setSelectedSubject("");
    setTitle("");
    setDescription("");
    setView("menu");
  };

  const handleDelete = async (id: string) => {
    const updatedList = homeworkList.filter(h => h.id !== id);
    setHomeworkList(updatedList);
    await saveHomework(updatedList);
  };

  if (view === "menu") {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">
        <button
          onClick={() => setView("add")}
          className="bg-[#1e3a8a] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors font-medium text-center"
        >
          Add Home Work
        </button>
        <button
          onClick={() => setView("view")}
          className="bg-[#1e3a8a] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors font-medium text-center"
        >
          View Home Work
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
          <h2 className="text-xl font-bold text-gray-800">Add Home Work</h2>
        </div>

        <form onSubmit={handleAddHomework} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Class And Section
            </label>
            <select 
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              <option value="">Select Class</option>
              {Array.from({ length: 13 }, (_, i) => (
                <option key={i} value={`Grade ${String(i + 1).padStart(2, '0')}`}>
                  Grade {String(i + 1).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose Image or PDF
            </label>
            <input
              type="file"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setView("menu")}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h2 className="text-xl font-bold text-gray-800">View HomeWork</h2>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Class
          </label>
          <select 
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">All Classes</option>
            {Array.from({ length: 13 }, (_, i) => (
              <option key={i} value={`Grade ${String(i + 1).padStart(2, '0')}`}>
                Grade {String(i + 1).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {homeworkList
            .filter(h => !selectedGrade || h.grade === selectedGrade)
            .map(hw => (
              <div key={hw.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#1e3a8a]">{hw.title} <span className="text-sm font-normal text-gray-500">({hw.subject})</span></h3>
                  <p className="text-sm text-gray-500">{hw.grade} | Assigned: {hw.date}</p>
                  <p className="text-sm text-gray-700 mt-1">{hw.description}</p>
                </div>
                <button 
                  onClick={() => handleDelete(hw.id)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          {homeworkList.filter(h => !selectedGrade || h.grade === selectedGrade).length === 0 && (
            <div className="text-center text-gray-500 py-4">No homework found.</div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
