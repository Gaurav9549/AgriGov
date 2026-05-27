import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../config";

const CreateSchemeForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}policy`,
        { ...formData, budget: parseFloat(formData.budget) },
        { headers: getAuthHeaders() }
      );
      onSuccess();
    } catch (err) {
      console.error("Error creating scheme:", err);
      alert("Failed to create scheme. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all";

  return (
    <div className="p-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <button onClick={onCancel} className="text-sm font-bold flex items-center mb-4 text-[#135E4B] hover:opacity-60 transition-all">
          ← Back to Schemes
        </button>
        <h2 className="text-4xl font-black tracking-tight" style={{ color: colors.deepEmerald }}>Launch New Scheme</h2>
        <p className="text-slate-500 mt-2">Publish a new financial aid or medical aid program for the agricultural sector.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Scheme Title</label>
          <input
            required
            name="title"
            className={inputStyle}
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Drought Relief Fund 2026"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Objective / Description</label>
          <textarea
            required
            name="description"
            className={inputStyle}
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed eligibility and benefits..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Start Date</label>
            <input type="date" name="startDate" className={inputStyle} value={formData.startDate} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">End Date</label>
            <input type="date" name="endDate" className={inputStyle} value={formData.endDate} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Allocation Budget (₹)</label>
            <input
              type="number"
              name="budget"
              className={inputStyle}
              value={formData.budget}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Publish Status</label>
            <select name="status" className={inputStyle} value={formData.status} onChange={handleChange}>
              <option value="ACTIVE">ACTIVE (Published)</option>
              <option value="INACTIVE">INACTIVE (Draft)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-5 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            style={{ backgroundColor: colors.vibrantGreen }}
          >
            {loading ? "Publishing..." : "Launch Scheme"}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">
            Discard
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSchemeForm;