import React, { useState, useEffect } from "react";
import { getSubjects, saveSubjects, getGrades, saveGrades } from "../../lib/db";
import { Plus, Trash2 } from "lucide-react";

export default function SubjectsGrades() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  
  const [newSubject, setNewSubject] = useState("");
  const [newGrade, setNewGrade] = useState("");

  useEffect(() => {
    getSubjects().then(setSubjects);
    getGrades().then(setGrades);
  }, []);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    
    const updated = [...subjects, { id: Date.now().toString(), name: newSubject }];
    setSubjects(updated);
    await saveSubjects(updated);
    setNewSubject("");
  };

  const handleDeleteSubject = async (id: string) => {
    if (window.confirm("Delete this subject?")) {
      const updated = subjects.filter(s => s.id !== id);
      setSubjects(updated);
      await saveSubjects(updated);
    }
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrade.trim()) return;
    
    const updated = [...grades, { id: Date.now().toString(), name: newGrade }];
    setGrades(updated);
    await saveGrades(updated);
    setNewGrade("");
  };

  const handleDeleteGrade = async (id: string) => {
    if (window.confirm("Delete this grade?")) {
      const updated = grades.filter(g => g.id !== id);
      setGrades(updated);
      await saveGrades(updated);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Subjects Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Manage Subjects</h2>
        
        <form onSubmit={handleAddSubject} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="e.g., Mathematics"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Plus size={20} className="mr-1" /> Add
          </button>
        </form>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {subjects.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No subjects added yet.</p>
          ) : (
            subjects.map(subject => (
              <div key={subject.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-md bg-gray-50">
                <span className="font-medium text-gray-700">{subject.name}</span>
                <button onClick={() => handleDeleteSubject(subject.id)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Grades Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Manage Grades</h2>
        
        <form onSubmit={handleAddGrade} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="e.g., Grade 10"
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Plus size={20} className="mr-1" /> Add
          </button>
        </form>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {grades.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No grades added yet.</p>
          ) : (
            grades.map(grade => (
              <div key={grade.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-md bg-gray-50">
                <span className="font-medium text-gray-700">{grade.name}</span>
                <button onClick={() => handleDeleteGrade(grade.id)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
