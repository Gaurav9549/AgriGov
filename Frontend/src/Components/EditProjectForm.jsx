import React, { useState, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../config";

export const EditProjectForm = ({ project, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    title: project.title || "",
    description: project.description || "",
    startDate: project.startDate || "",
    endDate: project.endDate || "",
    budget: project.budget || "",
    status: project.status || "",
  });

  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const errors = useMemo(() => {
    const e = {};
    if (!formData.title || formData.title.length < 3) e.title = "Title too short";
    if (!formData.description) e.description = "Description required";
    if (formData.endDate < formData.startDate) e.endDate = "End date error";
    if (!formData.budget || Number(formData.budget) < 0) e.budget = "Invalid budget";
    return e;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    const updatedProject = {
      ...project,
      ...formData,
      budget: parseFloat(formData.budget),
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}api/rural-projects/updateProject/${project.projectId}`,
        updatedProject,
        { headers: getAuthHeaders() }
      );
      onUpdate(response.data || updatedProject);
    } catch (err) {
      console.error("Project update failed", err);
      alert("Failed to update project. Please try again.");
    }
  };

  const inputStyle = (name) => `
    w-full p-4 rounded-2xl bg-slate-50 border outline-none transition-all
    ${touched[name] && errors[name] ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100'}
    focus:ring-4
  `;

  return (
    <div className="p-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <button onClick={onCancel} className="text-sm font-bold flex items-center mb-4 text-[#135E4B] hover:opacity-60 transition-opacity">
          ← Cancel Changes
        </button>
        <h2 className="text-4xl font-black tracking-tight text-[#135E4B]">Update Project Details</h2>
        <p className="text-slate-500 mt-2">Editing: <span className="font-bold text-emerald-600">{project.title}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Title</label>
          <input type="text" name="title" className={inputStyle("title")} value={formData.title} onChange={handleChange} onBlur={() => setTouched({...touched, title: true})} />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Description</label>
          <textarea name="description" className={inputStyle("description")} rows={4} value={formData.description} onChange={handleChange} onBlur={() => setTouched({...touched, description: true})} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Start</label>
            <input type="date" name="startDate" className={inputStyle("startDate")} value={formData.startDate} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">End</label>
            <input type="date" name="endDate" className={inputStyle("endDate")} value={formData.endDate} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Budget (₹)</label>
            <input type="number" name="budget" className={inputStyle("budget")} value={formData.budget} onChange={handleChange} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Status</label>
          <select name="status" className={inputStyle("status")} value={formData.status} onChange={handleChange}>
            <option value="PLANNED">PLANNED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ON_HOLD">ON_HOLD</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <button type="submit" className="w-full py-5 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all bg-[#4CB572]">
          Confirm Updates
        </button>
      </form>
    </div>
  );
};