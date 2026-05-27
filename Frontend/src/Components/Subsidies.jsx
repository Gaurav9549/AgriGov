import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Edit2, Trash2, AlertCircle, CheckCircle, Lock, Send, Loader2 } from 'lucide-react'; // Added Loader2
import { API_BASE_URL, getAuthHeaders } from '../config';

const Subsidies = () => {
  const [subsidies, setSubsidies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disbursedSubsidyIds, setDisbursedSubsidyIds] = useState([]);
  const [officerId, setOfficerId] = useState(null);
  const [processingId, setProcessingId] = useState(null); // ✅ Tracking specific row processing

  const [toast, setToast] = useState({ show: false, message: '', type: '', actionId: null });
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({
    subsidyId: '',
    schemeId: '',
    farmerId: '',
    amount: '',
    status: 'PENDING'
  });

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setOfficerId(decoded.uid || decoded.sub || decoded.id);
      } catch (error) {
        console.error("❌ Failed to decode token:", error);
      }
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchSubsidies(), fetchDisbursements()]);
    setLoading(false);
  };

  const fetchSubsidies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}subsidies/fetchAll`, {
        headers: getAuthHeaders()
      });
      setSubsidies(response.data);
    } catch (error) {
      console.error("❌ Error fetching subsidies:", error);
    }
  };

  const fetchDisbursements = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}disbursements/fetchAll`, {
        headers: getAuthHeaders()
      });
      const disbursedIds = response.data
        .filter(d => d.status === "DISBURSED")
        .map(d => d.subsidyId);
      setDisbursedSubsidyIds(disbursedIds);
    } catch (error) {
      console.error("❌ Error fetching disbursements:", error);
    }
  };

  const handleDisburse = async (subsidyId) => {
    if (!officerId) {
      setToast({ show: true, message: "Officer session not found. Please log in.", type: "error" });
      return;
    }

    setProcessingId(subsidyId); // ✅ START PROCESSING

    try {
      const payload = {
        subsidyId: subsidyId,
        officerId: officerId,
        status: "DISBURSED"
      };

      await axios.post(`${API_BASE_URL}disbursements/save`, payload, {
        headers: getAuthHeaders()
      });

      setToast({ show: true, message: "Funds disbursed successfully!", type: "success" });
      
      // Sync local state
      await fetchDisbursements();
      
    } catch (error) {
      console.error("❌ Disbursement error:", error);
      setToast({ show: true, message: "Failed to process disbursement.", type: "error" });
    } finally {
      setProcessingId(null); // ✅ END PROCESSING
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const confirmDelete = (id) => {
    setToast({
      show: true,
      message: "Are you sure you want to delete this subsidy?",
      type: "confirm",
      actionId: id
    });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}subsidies/delete/${toast.actionId}`, {
        headers: getAuthHeaders()
      });
      setSubsidies(prev => prev.filter(item => item.subsidyId !== toast.actionId));
      setToast({ show: true, message: "Subsidy deleted successfully", type: "success", actionId: null });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    } catch (error) {
      console.error("❌ Delete error:", error);
    }
  };

  const openEditPopup = (item) => {
    setEditData({ ...item });
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        schemeId: editData.schemeId,
        farmerId: editData.farmerId,
        amount: editData.amount,
        status: editData.status
      };

      const response = await axios.put(
        `${API_BASE_URL}subsidies/update/${editData.subsidyId}`,
        payload,
        { headers: getAuthHeaders() }
      );
      
      setSubsidies(prev => prev.map(item => item.subsidyId === editData.subsidyId ? response.data : item));
      setShowEdit(false);
      setToast({ show: true, message: "Subsidy updated!", type: "success" });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2000);
    } catch (error) {
      console.error("❌ Update error:", error);
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse uppercase tracking-[0.2em]">Loading Records...</div>;

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Summary Card */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
              <AlertCircle size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Subsidy Records</h3>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Manage and track farmer allocations</p>
          </div>
        </div>
        <div className="text-right px-6 border-l border-slate-100">
          <p className="text-3xl font-black text-emerald-600">{subsidies.length}</p>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Entries</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: colors.deepEmerald }} className="text-white">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Subsidy ID</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Scheme</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Farmer</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Amount</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {subsidies.map((item) => {
              const isLocked = disbursedSubsidyIds.includes(item.subsidyId);
              const isApproved = item.status === "APPROVED";
              const isProcessing = processingId === item.subsidyId;

              return (
                <tr key={item.subsidyId} className={`transition-colors ${isLocked ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}>
                  <td className="p-6 font-black text-slate-800">#{item.subsidyId}</td>
                  <td className="p-6 text-sm font-bold text-slate-500">Scheme {item.schemeId}</td>
                  <td className="p-6 text-sm font-bold text-slate-600">Farmer {item.farmerId}</td>
                  <td className="p-6 text-sm font-black text-emerald-600">₹{parseFloat(item.amount).toLocaleString()}</td>
                  <td className="p-6">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.15em] ${
                      item.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-6 flex justify-center gap-2">
                    {isLocked ? (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                        <Lock size={12} /> Disbursed
                      </div>
                    ) : (
                      <>
                        {isApproved && (
                          <button 
                            disabled={isProcessing}
                            onClick={() => handleDisburse(item.subsidyId)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95 ${
                                isProcessing ? 'bg-slate-200 text-slate-500' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            {isProcessing ? "Processing" : "Disburse"}
                          </button>
                        )}
                        
                        <button 
                          disabled={isProcessing}
                          onClick={() => openEditPopup(item)}
                          className="p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-600 transition-all shadow-sm disabled:opacity-50"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          disabled={isProcessing}
                          onClick={() => confirmDelete(item.subsidyId)}
                          className="p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-600 transition-all shadow-sm disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal Overlay */}
      {showEdit && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center text-white" style={{ backgroundColor: colors.deepEmerald }}>
              <h4 className="font-black text-xl tracking-tight">Modify Record</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Updating Subsidy #{editData.subsidyId}</p>
            </div>
            <div className="p-10 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Adjust Amount (₹)</label>
                <input 
                  type="number" 
                  value={editData.amount}
                  onChange={(e) => setEditData({...editData, amount: e.target.value})}
                  className="w-full p-4 mt-2 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Update Approval Status</label>
                <select 
                  value={editData.status}
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                  className="w-full p-4 mt-2 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-100 appearance-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleUpdate}
                  className="flex-2 px-8 py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200 active:scale-95 transition-all"
                  style={{ backgroundColor: colors.vibrantGreen }}
                >
                  Confirm Changes
                </button>
                <button 
                  onClick={() => setShowEdit(false)}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation/Toast Overlay */}
      {toast.show && (
        <div className="fixed bottom-10 right-10 z-[6000] animate-in slide-in-from-right-8 duration-300">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 min-w-[320px]">
            <div className="flex items-center gap-4 mb-5">
              <div className={`p-3 rounded-2xl ${toast.type === 'confirm' ? 'bg-amber-50 text-amber-500' : toast.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                {toast.type === 'confirm' ? <AlertCircle /> : <CheckCircle />}
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 tracking-tight">
                  {toast.type === 'confirm' ? 'Security Check' : toast.type === 'error' ? 'Error' : 'Success'}
                </p>
                <p className="text-xs font-bold text-slate-400">{toast.message}</p>
              </div>
            </div>
            {toast.type === 'confirm' && (
              <div className="flex gap-3">
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-md"
                >
                  Delete
                </button>
                <button 
                  onClick={() => setToast({ ...toast, show: false })}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Go Back
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Subsidies;