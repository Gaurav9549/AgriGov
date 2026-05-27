import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../config";

export const EditResourceForm = ({ resource, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}api/resources/fetchById/${resource.resourceId}`, { headers: getAuthHeaders() });
        setFormData({ ...res.data });
      } catch (err) { alert("Failed to load resource"); }
      finally { setLoading(false); }
    };
    fetchResource();
  }, [resource.resourceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_BASE_URL}api/resources/update/${resource.resourceId}`, { ...formData, quantity: Number(formData.quantity) }, { headers: getAuthHeaders() });
      onUpdate(res.data);
    } catch (err) { alert("Update failed"); }
  };

  const inputStyle = `w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none transition-all focus:ring-4 focus:ring-emerald-100`;

  if (loading) return <div className="p-10 text-center font-bold text-[#135E4B]">Syncing Resource Data...</div>;

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black tracking-tight text-[#135E4B]">Edit Resource Allocation</h2>
        <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mt-2">ID: {resource.resourceId}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Resource Type</label>
          <select className={inputStyle} value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
            <option value="Funds">FUNDS</option>
            <option value="Materials">MATERIALS</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Quantity</label>
          <input type="number" className={inputStyle} value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Current Status</label>
          <select className={inputStyle} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option value="PLANNED">PLANNED</option>
            <option value="ALLOCATED">ALLOCATED</option>
            <option value="UTILIZED">UTILIZED</option>
            <option value="ON_HOLD">ON_HOLD</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 py-4 rounded-2xl bg-[#4CB572] text-white font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Update</button>
          <button type="button" onClick={onCancel} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 font-black uppercase tracking-widest active:scale-95 transition-all">Cancel</button>
        </div>
      </form>
    </div>
  );
};