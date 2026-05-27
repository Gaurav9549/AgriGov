import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../config";

const EditSchemeForm = ({ scheme, onSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    title: scheme.title,
    description: scheme.description,
    startDate: scheme.startDate,
    endDate: scheme.endDate,
    budget: scheme.budget,
    status: scheme.status,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}policy/${scheme.schemeID}`,
        { ...formData, budget: parseFloat(formData.budget) },
        { headers: getAuthHeaders() }
      );
      onSuccess();
    } catch (err) {
      alert("Failed to update scheme.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all";

  return (
    <div className="p-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-10">
        <button onClick={onBack} className="text-sm font-bold flex items-center mb-4 text-[#135E4B] hover:opacity-60 transition-all">
          ← Cancel Editing
        </button>
        <h2 className="text-4xl font-black tracking-tight text-[#135E4B]">Edit Policy Details</h2>
        <p className="text-slate-500 mt-2">Modifying: <span className="font-bold text-emerald-600">{scheme.title}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Title</label>
          <input className={inputStyle} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Description</label>
          <textarea className={inputStyle} rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Start Date</label>
            <input type="date" className={inputStyle} value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">End Date</label>
            <input type="date" className={inputStyle} value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Budget (₹)</label>
            <input type="number" className={inputStyle} value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} required />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Status</label>
            <select className={inputStyle} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full py-5 rounded-2xl text-white font-black uppercase bg-[#4CB572] shadow-xl hover:brightness-110 transition-all disabled:opacity-50">
          {loading ? "Saving Changes..." : "Update Policy"}
        </button>
      </form>
    </div>
  );
};

export default EditSchemeForm;