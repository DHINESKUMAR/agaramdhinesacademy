import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getClasses, saveClasses, getStudents, getStaffs } from '../../lib/db';
import { Edit2, Trash2, Plus, GraduationCap } from 'lucide-react';

export default function Classes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'all' | 'new'>(searchParams.get('tab') === 'new' ? 'new' : 'all');
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    monthlyTuitionFees: '',
    classTeacherId: ''
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'new') {
      setActiveTab('new');
    } else {
      setActiveTab('all');
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'all' | 'new') => {
    setActiveTab(tab);
    if (tab === 'new') {
      setSearchParams({ tab: 'new' });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    getClasses().then(setClasses);
    getStudents().then(setStudents);
    getStaffs().then(setStaffs);
  }, [activeTab]);

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.monthlyTuitionFees || !formData.classTeacherId) {
      alert("Please fill all required fields.");
      return;
    }
    
    const newClass = {
      id: Date.now().toString(),
      ...formData
    };
    
    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);
    await saveClasses(updatedClasses);
    
    alert("Class added successfully!");
    setFormData({ name: '', monthlyTuitionFees: '', classTeacherId: '' });
    handleTabChange('all');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      const updatedClasses = classes.filter(c => c.id !== id);
      setClasses(updatedClasses);
      await saveClasses(updatedClasses);
    }
  };

  // Calculate student stats for a class
  const getClassStats = (className: string) => {
    // For now, we assume students are linked to classes by 'grade' matching 'className'
    // This might need adjustment based on how students are actually linked to these new classes
    const classStudents = students.filter(s => s.grade === className || s.className === className);
    const total = classStudents.length;
    
    // Since we don't have gender data, all are N/A
    return {
      total,
      boys: 0,
      girls: 0,
      na: total
    };
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Tabs */}
      <div className="flex items-center text-sm text-gray-500 mb-6 bg-white p-3 rounded-md shadow-sm border border-gray-100">
        <span className="font-medium text-gray-700 mr-2">Classes</span>
        <span className="mx-2">|</span>
        <button 
          onClick={() => handleTabChange('all')}
          className={`flex items-center ${activeTab === 'all' ? 'text-gray-800 font-medium' : 'hover:text-gray-700'}`}
        >
          <span className="mr-1">🏠</span> - All Classes
        </button>
        {activeTab === 'new' && (
          <>
            <span className="mx-2">|</span>
            <span className="text-gray-800 font-medium">Add New Class</span>
          </>
        )}
      </div>
      
      {activeTab === 'all' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => {
            const stats = getClassStats(cls.name);
            return (
              <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-800 text-sm pr-12">{cls.name}</h3>
                  <div className="flex space-x-2 absolute top-4 right-4">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(cls.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-3xl font-bold text-gray-800">{stats.total}</span>
                    <span className="text-xs text-gray-500 ml-1 font-medium uppercase tracking-wider">Students</span>
                  </div>
                  <GraduationCap size={32} className="text-blue-600 opacity-80" />
                </div>
                
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                  {/* Boys Circle */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-100"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-blue-500"
                          strokeWidth="3"
                          strokeDasharray={`${stats.total ? (stats.boys/stats.total)*100 : 0}, 100`}
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-xs font-bold text-gray-700">{stats.total ? Math.round((stats.boys/stats.total)*100) : 0}%</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                      <span className="text-[10px] text-gray-500 font-medium uppercase">Boys</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{stats.boys}</span>
                  </div>
                  
                  {/* Girls Circle */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-100"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-pink-500"
                          strokeWidth="3"
                          strokeDasharray={`${stats.total ? (stats.girls/stats.total)*100 : 0}, 100`}
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-xs font-bold text-gray-700">{stats.total ? Math.round((stats.girls/stats.total)*100) : 0}%</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-pink-500 mr-1"></div>
                      <span className="text-[10px] text-gray-500 font-medium uppercase">Girls</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{stats.girls}</span>
                  </div>
                  
                  {/* N/A Circle */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-100"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-blue-700"
                          strokeWidth="3"
                          strokeDasharray={`${stats.total ? (stats.na/stats.total)*100 : 0}, 100`}
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-xs font-bold text-gray-700">{stats.total ? Math.round((stats.na/stats.total)*100) : 0}%</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-700 mr-1"></div>
                      <span className="text-[10px] text-gray-500 font-medium uppercase">N/A</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{stats.na}</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Add New Card */}
          <div 
            onClick={() => handleTabChange('new')}
            className="bg-white rounded-xl shadow-sm border border-dashed border-blue-300 p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <Plus size={24} />
            </div>
            <span className="text-blue-600 font-medium">Add New</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">Add New Class</h2>
            <div className="flex items-center justify-center text-xs mt-2 space-x-4">
              <div className="flex items-center text-blue-600">
                <div className="w-4 h-1.5 bg-blue-600 rounded-full mr-1"></div>
                Required*
              </div>
              <div className="flex items-center text-gray-400">
                <div className="w-4 h-1.5 bg-gray-300 rounded-full mr-1"></div>
                Optional
              </div>
            </div>
          </div>
          
          <form onSubmit={handleAddClass} className="space-y-6">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-blue-600">
                Class Name*
              </label>
              <input
                type="text"
                placeholder="Name Of Class"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-blue-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-blue-600">
                Monthly Tuition Fees*
              </label>
              <input
                type="text"
                placeholder="Monthly Tuition Fees"
                value={formData.monthlyTuitionFees}
                onChange={(e) => setFormData({...formData, monthlyTuitionFees: e.target.value})}
                className="w-full border border-blue-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-blue-600">
                Select Class Teacher*
              </label>
              <select
                value={formData.classTeacherId}
                onChange={(e) => setFormData({...formData, classTeacherId: e.target.value})}
                className="w-full border border-blue-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                required
              >
                <option value="" disabled>Select*</option>
                {staffs.map(staff => (
                  <option key={staff.id} value={staff.id}>{staff.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => handleTabChange('all')}
                className="mr-3 px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm font-medium shadow-sm"
              >
                Save Class
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
