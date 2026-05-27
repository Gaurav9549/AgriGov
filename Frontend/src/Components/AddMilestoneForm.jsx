import React, { useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../config";

export const AddMilestoneForm = ({ projectId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    status: "PLANNED",
  });

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    softMint: '#A1D8B5',
    cloudGrey: '#CCDCDB',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  // Validation rules
  const errors = useMemo(() => {
    const e = {};
    if (!formData.title || formData.title.length < 3)
      e.title = "Title must be at least 3 characters";
    if (formData.title.length > 100)
      e.title = "Title cannot exceed 100 characters";
    if (!formData.date)
      e.date = "Milestone date is required";
    if (!formData.status)
      e.status = "Status is required";
    return e;
  }, [formData]);

  const isFormValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectId) {
      alert("No project selected.");
      return;
    }
    if (!isFormValid) return;
    setLoading(true);

    const payload = {
      projectId,
      title: formData.title,
      date: formData.date,
      status: formData.status,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}api/milestones/save`,
        payload,
        { headers: getAuthHeaders() }
      );

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("❌ Failed to save milestone:", error);
      alert("Failed to save milestone.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => `
    w-full p-4 rounded-2xl bg-slate-50 border transition-all outline-none
    ${touched[name] && errors[name] ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100'}
    focus:ring-4 appearance-none
  `;

  return (
    <div className="p-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black tracking-tight" style={{ color: colors.deepEmerald }}>
          Define Milestone
        </h2>
        <p className="text-sm text-slate-500 mt-2">Tracking Progress for Project <span className="font-mono font-bold text-emerald-600">#{projectId}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        
        {/* Milestone Title */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Milestone Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Foundation Completion"
            className={inputStyle("title")}
            maxLength={100}
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="flex justify-between mt-2 px-1">
            {touched.title && errors.title ? (
              <p className="text-red-500 text-[10px] font-bold uppercase">{errors.title}</p>
            ) : (
              <span />
            )}
            <small className="text-[10px] text-slate-400 font-bold">{formData.title.length}/100</small>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Target Date</label>
          <input
            type="date"
            name="date"
            className={inputStyle("date")}
            value={formData.date}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.date && errors.date && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold uppercase">{errors.date}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Current Status</label>
          <div className="relative">
            <select
              name="status"
              className={inputStyle("status")}
              value={formData.status}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">-- Select Status --</option>
              <option value="PLANNED">PLANNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="DELAYED">DELAYED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <div className="absolute right-4 top-5 pointer-events-none opacity-40">▼</div>
          </div>
          {touched.status && errors.status && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold uppercase">{errors.status}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: colors.vibrantGreen }}
          >
            {loading ? "Saving Milestone..." : "Set Milestone"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-4 rounded-2xl font-black uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
};