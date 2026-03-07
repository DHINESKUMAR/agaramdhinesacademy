import React, { useState, useEffect } from 'react';
import { getClassLinks, saveClassLinks } from '../../lib/db';
import { Edit2, Check, X, Link as LinkIcon } from 'lucide-react';

export default function Classes() {
  // Generate Grade 01 to Grade 13
  const grades = Array.from({ length: 13 }, (_, i) => `Grade ${String(i + 1).padStart(2, '0')}`);
  
  const [links, setLinks] = useState<Record<string, string>>({});
  const [editingGrade, setEditingGrade] = useState<string | null>(null);
  const [tempLink, setTempLink] = useState("");

  useEffect(() => {
    getClassLinks().then(setLinks);
  }, []);

  const handleEdit = (grade: string) => {
    setEditingGrade(grade);
    setTempLink(links[grade] || "");
  };

  const handleSave = async (grade: string) => {
    const updatedLinks = { ...links, [grade]: tempLink };
    setLinks(updatedLinks);
    await saveClassLinks(updatedLinks);
    setEditingGrade(null);
  };

  const handleCancel = () => {
    setEditingGrade(null);
    setTempLink("");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Classes Management</h2>
      <p className="text-gray-600 mb-6">Manage all classes from Grade 01 to Grade 13.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grades.map((grade) => (
          <div 
            key={grade} 
            className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-[#1e3a8a] text-lg">{grade}</span>
              {editingGrade !== grade && (
                <button 
                  onClick={() => handleEdit(grade)}
                  className="text-gray-500 hover:text-blue-600 p-1"
                  title="Edit Link"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>

            {editingGrade === grade ? (
              <div className="flex flex-col space-y-2 mt-2">
                <input 
                  type="url" 
                  placeholder="Enter class link (e.g., Zoom/Meet)" 
                  value={tempLink}
                  onChange={(e) => setTempLink(e.target.value)}
                  className="w-full border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300"
                  >
                    <X size={16} />
                  </button>
                  <button 
                    onClick={() => handleSave(grade)}
                    className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center">
                {links[grade] ? (
                  <a 
                    href={links[grade]} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center text-sm text-blue-600 hover:underline truncate"
                  >
                    <LinkIcon size={14} className="mr-1 flex-shrink-0" />
                    <span className="truncate">{links[grade]}</span>
                  </a>
                ) : (
                  <span className="text-sm text-gray-400 italic">No link added yet</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
