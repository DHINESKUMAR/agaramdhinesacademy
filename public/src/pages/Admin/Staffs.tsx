import React, { useState, useEffect } from "react";
import { getStaffs, saveStaffs, getGrades, getSubjects } from "../../lib/db";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function Staffs() {
  const [staffs, setStaffs] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    assignedClasses: [] as { grade: string, subject: string }[],
    salary: "",
    phone: "",
    role: "Teacher"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [staffData, gradesData, subjectsData] = await Promise.all([
      getStaffs(),
      getGrades(),
      getSubjects()
    ]);
    setStaffs(staffData || []);
    setGrades(gradesData || []);
    setSubjects(subjectsData || []);
  };

  const handleAddClass = () => {
    setFormData({
      ...formData,
      assignedClasses: [...formData.assignedClasses, { grade: "", subject: "" }]
    });
  };

  const handleRemoveClass = (index: number) => {
    const newClasses = [...formData.assignedClasses];
    newClasses.splice(index, 1);
    setFormData({ ...formData, assignedClasses: newClasses });
  };

  const handleClassChange = (index: number, field: 'grade' | 'subject', value: string) => {
    const newClasses = [...formData.assignedClasses];
    newClasses[index][field] = value;
    setFormData({ ...formData, assignedClasses: newClasses });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate assigned classes
    const isValidClasses = formData.assignedClasses.every(c => c.grade && c.subject);
    if (!isValidClasses && formData.assignedClasses.length > 0) {
      alert("Please select both Grade and Subject for all assigned classes.");
      return;
    }

    let updatedStaffs;
    
    if (editingId) {
      updatedStaffs = staffs.map(s => s.id === editingId ? { ...formData, id: editingId } : s);
    } else {
      const newStaff = { ...formData, id: Date.now().toString() };
      updatedStaffs = [...staffs, newStaff];
    }

    await saveStaffs(updatedStaffs);
    setStaffs(updatedStaffs);
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", username: "", password: "", assignedClasses: [], salary: "", phone: "", role: "Teacher" });
  };

  const handleEdit = (staff: any) => {
    setFormData({
      ...staff,
      assignedClasses: staff.assignedClasses || (staff.subject ? [{ grade: "All", subject: staff.subject }] : [])
    });
    setEditingId(staff.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      const updatedStaffs = staffs.filter(s => s.id !== id);
      await saveStaffs(updatedStaffs);
      setStaffs(updatedStaffs);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: "", username: "", password: "", assignedClasses: [], salary: "", phone: "", role: "Teacher" });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} /> Add Staff
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Staff" : "Add New Staff"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role / Department</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border rounded-md px-3 py-2">
                <option value="Teacher">Teacher</option>
                <option value="Coordinator">Coordinator</option>
                <option value="Admin Assistant">Admin Assistant</option>
                <option value="Management">Management</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border rounded-md px-3 py-2" />
            </div>
            
            <div className="md:col-span-2 border border-gray-200 rounded-md p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Assigned Classes</label>
                <button type="button" onClick={handleAddClass} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 flex items-center gap-1">
                  <Plus size={16} /> Add Class
                </button>
              </div>
              
              {formData.assignedClasses.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No classes assigned yet.</p>
              ) : (
                <div className="space-y-3">
                  {formData.assignedClasses.map((cls, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white p-3 rounded border border-gray-200">
                      <div className="flex-1">
                        <select 
                          value={cls.grade} 
                          onChange={e => handleClassChange(index, 'grade', e.target.value)} 
                          className="w-full border rounded-md px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Select Grade</option>
                          {grades.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                        </select>
                      </div>
                      <div className="flex-1">
                        <select 
                          value={cls.subject} 
                          onChange={e => handleClassChange(index, 'subject', e.target.value)} 
                          className="w-full border rounded-md px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Select Subject</option>
                          {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                      <button type="button" onClick={() => handleRemoveClass(index)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded">
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
              <input required type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-md hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Classes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffs.map((staff) => (
              <tr key={staff.id}>
                <td className="px-6 py-4 whitespace-nowrap">{staff.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {staff.role || "Teacher"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{staff.username}</td>
                <td className="px-6 py-4">
                  {staff.assignedClasses && staff.assignedClasses.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {staff.assignedClasses.map((cls: any, i: number) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded inline-block w-max">
                          {cls.grade} - {cls.subject}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">{staff.subject || "None"}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{staff.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">Rs. {staff.salary}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(staff)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(staff.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {staffs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No staff members found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
