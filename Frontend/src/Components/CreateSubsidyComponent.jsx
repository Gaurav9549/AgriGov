import React, { useState } from 'react';
import axios from 'axios';
import { Landmark, Calendar, Banknote, XCircle, CheckCircle } from 'lucide-react';
import { API_BASE_URL, getAuthHeaders } from '../config';

const CreateSubsidyComponent = ({ initialData, onComplete }) => {
  const [subsidyData, setSubsidyData] = useState({
    amount: "",
    status: "PENDING",
    date: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const colors = { deepEmerald: '#135E4B', vibrantGreen: '#4CB572' };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubsidyData({ ...subsidyData, [name]: value });
  };
  
  const handleCreateSubsidy = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      schemeId: initialData?.schemeId,
      farmerId: initialData?.farmerId,
      amount: subsidyData.amount,
      status: subsidyData.status
    };

    try {
      // 1. Create the Subsidy Record
      await axios.post(`${API_BASE_URL}subsidies/save`, payload, { headers: getAuthHeaders() });

      // 2. Delete the Application (The "Clean-up" step)
      if (initialData?.applicationId) {
        console.log(`Cleaning up application ID: ${initialData.applicationId}`);
        await axios.delete(`${API_BASE_URL}application/${initialData.applicationId}`, {
          headers: getAuthHeaders(),
        });
      }

      setToast({ show: true, message: "Subsidy created & application processed!", type: "success" });
      
      setTimeout(() => {
        onComplete('Subsidies'); 
      }, 1500);

    } catch (error) {
      console.error("❌ Process Error:", error);
      const errorMessage = error.response?.status === 409 
        ? "Record already exists." 
        : "Process failed. Please try again.";
      setToast({ show: true, message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden">
        <div className="p-10 text-center text-white" style={{ backgroundColor: colors.deepEmerald }}>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Landmark size={32} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Grant Approval</h2>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Finalize Disbursement</p>
        </div>

        <div className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Target Scheme</p>
              <p className="text-lg font-black text-slate-800">#{initialData?.schemeId || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Farmer ID</p>
              <p className="text-lg font-black text-slate-800">#{initialData?.farmerId || 'N/A'}</p>
            </div>
          </div>

          <form onSubmit={handleCreateSubsidy} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Amount (₹)</label>
              <div className="relative">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input type="number" name="amount" value={subsidyData.amount} onChange={handleChange} required placeholder="Enter Amount" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:ring-4 focus:ring-emerald-50" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input type="date" name="date" value={subsidyData.date} onChange={handleChange} required className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none" />
              </div>
            </div>

            <button type="submit" disabled={loading || !initialData} className="w-full py-5 rounded-[1.5rem] text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2" style={{ backgroundColor: colors.vibrantGreen }}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Finalize Subsidy'}
            </button>
          </form>
        </div>
      </div>

      {toast.show && (
        <div className="fixed bottom-10 inset-x-0 flex justify-center z-[5000]">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSubsidyComponent;