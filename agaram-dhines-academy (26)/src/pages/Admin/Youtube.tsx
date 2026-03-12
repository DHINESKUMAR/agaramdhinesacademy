import React, { useState, useEffect } from 'react';
import { getYoutubeLinks, saveYoutubeLinks } from '../../lib/db';

export default function Youtube() {
  const [view, setView] = useState<'menu' | 'add' | 'view'>('menu');
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    getYoutubeLinks().then(setLinks);
  }, [view]);

  const [formData, setFormData] = useState({
    title: '',
    link: ''
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
    await saveYoutubeLinks(updatedLinks);
    alert('YouTube Link Added');
    setFormData({ title: '', link: '' });
    setView('menu');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this YouTube link?")) {
      const updatedLinks = links.filter(l => l.id !== id);
      setLinks(updatedLinks);
      await saveYoutubeLinks(updatedLinks);
    }
  };

  if (view === 'menu') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">
        <button 
          onClick={() => setView('add')}
          className="bg-[#1e3a8a] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors font-medium text-center"
        >
          Add YouTube Link
        </button>
        <button 
          onClick={() => setView('view')}
          className="bg-[#1e3a8a] text-white py-3 px-6 rounded-md hover:bg-blue-800 transition-colors font-medium text-center"
        >
          Manage YouTube Links
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
          <h2 className="text-xl font-bold text-gray-800">Add YouTube Video</h2>
        </div>
        <form className="space-y-4" onSubmit={handleAddLink}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
            <input 
              type="text" 
              placeholder="e.g., Tamil Chapter 1" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Link</label>
            <input 
              type="url" 
              placeholder="https://www.youtube.com/watch?v=..." 
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2" 
            />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700">Save Video</button>
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
          <h2 className="text-xl font-bold text-gray-800">Manage YouTube Links</h2>
        </div>
        <div className="space-y-4">
          {links.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No YouTube links found.</div>
          ) : (
            links.map(link => (
              <div key={link.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-red-600">{link.title}</h3>
                  <p className="text-sm text-gray-500">Link: {link.link}</p>
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
