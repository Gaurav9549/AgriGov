import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../config";

export const EditMilestoneForm = ({ milestone, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilestone = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}api/milestones/fetchById/${milestone.milestoneId}`, { headers: getAuthHeaders() });
        setFormData({ ...res.data });
      } catch (err) { alert("Load failed"); }
      finally { setLoading(false); }
    };
    fetchMilestone();
  }, [milestone.milestoneId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { projectTitle, resourceId, milestoneId, ...dataToSend } = formData;
      console.log("Submitting Milestone Update:", dataToSend);
      const res = await axios.put(`${API_BASE_URL}api/milestones/update/${milestone.milestoneId}`, dataToSend, { headers: getAuthHeaders() });
      onUpdate(res.data);
    } catch (err) { alert("Update failed"); }
  };

  const inputStyle = `w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none transition-all focus:ring-4 focus:ring-emerald-100`;

  if (loading) return <div className="p-10 text-center font-bold text-[#135E4B]">Fetching Milestone...</div>;

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black tracking-tight text-[#135E4B]">Modify Milestone</h2>
        <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mt-2">Target Tracking</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Milestone Title</label>
          <input type="text" className={inputStyle} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Target Date</label>
          <input type="date" className={inputStyle} value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Progress Status</label>
          <select className={inputStyle} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option value="PLANNED">PLANNED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="DELAYED">DELAYED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 py-4 rounded-2xl bg-[#4CB572] text-white font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Confirm</button>
          <button type="button" onClick={onCancel} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 font-black uppercase tracking-widest">Abort</button>
        </div>
      </form>
    </div>
  );
};