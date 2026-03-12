import React, { useState, useEffect } from 'react';
import { getZoomLinks, saveZoomLinks, getSubjects, getClasses } from '../../lib/db';

export default function LiveClasses() {
  const [view, setView] = useState<'menu' | 'add' | 'view'>('menu');
  const [links, setLinks] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [filterClass, setFilterClass] = useState<string>("");

  useEffect(() => {
    getZoomLinks().then(setLinks);
    getSubjects().then(setSubjects);
    getClasses().then(setClasses);
  }, [view]);

  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    title: '',
    link: '',
    datetime: '',
    hostKey: ''
  });

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.link || !formData.subject || !formData.grade) {
      alert("Class, Subject, Title and Link are required!");
      return;
    }
    const newLink = { id: Date.now().toString(), ...formData };
    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    await saveZoomLinks(updatedLinks);
    alert('Zoom Link Added');
    setFormData({ grade: '', subject: '', title: '', link: '', datetime: '', hostKey: '' });
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
            <select 
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
            <select 
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic / Title</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Host Key</label>
            <input 
              type="text" 
              placeholder="e.g., 123456" 
              value={formData.hostKey}
              onChange={(e) => setFormData({...formData, hostKey: e.target.value})}
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
    const filteredLinks = filterClass 
      ? links.filter(l => l.grade === filterClass)
      : links;

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={() => setView('menu')} className="mr-4 text-gray-600 hover:text-gray-900">
              ← Back
            </button>
            <h2 className="text-xl font-bold text-gray-800">Manage Zoom Links</h2>
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
          {filteredLinks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No Zoom links found.</div>
          ) : (
            filteredLinks.map(link => (
              <div key={link.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#1e3a8a]">{link.grade} - {link.subject} - {link.title}</h3>
                  <p className="text-sm text-gray-500">Time: {link.datetime}</p>
                  <p className="text-sm text-gray-500">Host Key: {link.hostKey || 'N/A'}</p>
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
