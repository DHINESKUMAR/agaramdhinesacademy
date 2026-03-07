import React, { useState, useEffect } from 'react';
import { getZoomLinks, saveZoomLinks } from '../../lib/db';

export default function LiveClasses() {
  const [view, setView] = useState<'menu' | 'add' | 'view'>('menu');
  const [links, setLinks] = useState<any[]>([]);
  const grades = Array.from({ length: 13 }, (_, i) => `Grade ${String(i + 1).padStart(2, '0')}`);

  useEffect(() => {
    getZoomLinks().then(setLinks);
  }, [view]);

  const [formData, setFormData] = useState({
    grade: 'Grade 01',
    title: '',
    link: '',
    datetime: ''
  });

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.link) {
      alert("Title and Link are required!");
      return;
    }
    const newLink = { id: Date.now().toString(), ...formData };
    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    await saveZoomLinks(updatedLinks);
    alert('Zoom Link Added');
    setFormData({ grade: 'Grade 01', title: '', link: '', datetime: '' });
    setView('menu');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this Zoom link?")) {
      const updatedLinks = links.filter(l => l.id !== id);
      setLinks(updatedLinks);
      await saveZoomLinks(updatedLinks);
    }
  };

  if (view === 'menu') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">
        <button 
          onClick={() => setView('add')}
          className="bg-[#1e3a8a] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors font-medium text-center"
        >
          Add Zoom Link
        </button>
        <button 
          onClick={() => setView('view')}
          className="bg-[#1e3a8a] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors font-medium text-center"
        >
          Manage Zoom Links
        </button>
      </div>
    );
  }

  if (view === 'add') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => setView('menu')} className="mr-4 text-gray-600 hover:text-gray-900">
            ← Back
          </button>
          <h2 className="text-xl font-bold text-gray-800">Add Zoom Link</h2>
        </div>
        <form className="space-y-4" onSubmit={handleAddLink}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Grade</label>
            <select 
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <option>Select Grade</option>
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject / Title</label>
            <input 
              type="text" 
              placeholder="e.g., Tamil Live Class" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zoom Meeting Link</label>
            <input 
              type="url" 
              placeholder="https://zoom.us/j/..." 
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
            <input 
              type="datetime-local" 
              value={formData.datetime}
              onChange={(e) => setFormData({...formData, datetime: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2" 
            />
          </div>
          <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700">Save Zoom Link</button>
        </form>
      </div>
    );
  }

  if (view === 'view') {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => setView('menu')} className="mr-4 text-gray-600 hover:text-gray-900">
            ← Back
          </button>
          <h2 className="text-xl font-bold text-gray-800">Manage Zoom Links</h2>
        </div>
        <div className="space-y-4">
          {links.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No Zoom links found.</div>
          ) : (
            links.map(link => (
              <div key={link.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#1e3a8a]">{link.grade} - {link.title}</h3>
                  <p className="text-sm text-gray-500">Time: {link.datetime}</p>
                  <p className="text-xs text-blue-500 truncate max-w-xs">{link.link}</p>
                </div>
                <button 
                  onClick={() => handleDelete(link.id)}
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
