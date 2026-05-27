import React, { useState, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../config";

export const AddProjectForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    status: "PLANNED", // Defaulting to planned
  });

  const [touched, setTouched] = useState({});

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    softMint: '#A1D8B5',
    errorRed: '#EF4444'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  // Validation Logic
  const errors = useMemo(() => {
    const e = {};
    if (!formData.title || formData.title.length < 3) e.title = "Title is too short";
    if (!formData.description) e.description = "Description is required";
    if (!formData.startDate) e.startDate = "Start date required";
    if (formData.endDate < formData.startDate) e.endDate = "Cannot end before start";
    if (!formData.budget || Number(formData.budget) < 0) e.budget = "Invalid budget";
    return e;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}api/rural-projects/save`,
        { ...formData, budget: Number(formData.budget) },
        { headers: getAuthHeaders() }
      );
      onSuccess(response.data);
    } catch (err) {
      alert("Failed to create project");
    }
  };

  const inputStyle = (name) => `
    w-full p-4 rounded-2xl bg-slate-50 border transition-all outline-none
    ${touched[name] && errors[name] ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100'}
    focus:ring-4
  `;

  return (
    <div className="p-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-10">
        <button 
          onClick={onCancel}
          className="text-sm font-bold flex items-center mb-4 transition-opacity hover:opacity-60"
          style={{ color: colors.deepEmerald }}
        >
          ← Back to Project List
        </button>
        <h2 className="text-4xl font-black tracking-tight" style={{ color: colors.deepEmerald }}>
          Initiate New Project
        </h2>
        <p className="text-slate-500 mt-2">Enter project specifications for regional approval.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/50 backdrop-blur-md p-2 border border-white/20 rounded-[2.5rem]">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Project Title</label>
            <input
              type="text"
              name="title"
              className={inputStyle("title")}
              value={formData.title}
              placeholder="e.g. Solar Irrigation Phase 1"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.title && errors.title && <p className="text-red-500 text-xs mt-2 ml-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Scope & Description</label>
            <textarea
              name="description"
              className={inputStyle("description")}
              rows={4}
              value={formData.description}
              placeholder="Describe the regional impact and objectives..."
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          {/* Dates & Budget Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Start Date</label>
              <input type="date" name="startDate" className={inputStyle("startDate")} value={formData.startDate} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">End Date</label>
              <input type="date" name="endDate" className={inputStyle("endDate")} value={formData.endDate} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Budget (₹)</label>
              <input type="number" name="budget" className={inputStyle("budget")} value={formData.budget} placeholder="0.00" onChange={handleChange} />
            </div>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Initial Status</label>
            <select name="status" className={inputStyle("status")} value={formData.status} onChange={handleChange}>
              <option value="PLANNED">PLANNED</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="ON_HOLD">ON HOLD</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 px-2">
          <button
            type="submit"
            className="flex-1 py-5 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl hover:brightness-110 transition-all active:scale-95"
            style={{ backgroundColor: colors.vibrantGreen }}
          >
            Deploy Project
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
};