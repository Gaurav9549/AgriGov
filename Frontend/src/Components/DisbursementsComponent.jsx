import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, History, Database } from 'lucide-react';
import { API_BASE_URL, getAuthHeaders } from '../config';

const DisbursementsComponent = () => {
  const [disbursements, setDisbursements] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = { deepEmerald: '#135E4B', vibrantGreen: '#4CB572' };

  useEffect(() => {
    fetchDisbursements();
  }, []);

  const fetchDisbursements = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}disbursements/fetchAll`, {
        headers: getAuthHeaders()
      });
      setDisbursements(response.data);
    } catch (error) {
      console.error("❌ Error fetching disbursements:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400">
        <div className="animate-spin mb-4 text-emerald-500"><Database size={40} /></div>
        <p className="font-bold italic">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600"><History size={32} /></div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Disbursement Records</h3>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Audit trail</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-emerald-600">{disbursements.length}</p>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Transactions</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        {disbursements.length === 0 ? (
          <div className="p-20 text-center text-slate-400 font-bold italic">No records found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: colors.deepEmerald }} className="text-white">
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">Txn ID</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Subsidy Link</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {disbursements.map((item) => (
                <tr key={item.disbursementId} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5 text-center"><span className="text-sm font-black bg-slate-100 px-3 py-1 rounded-lg">#{item.disbursementId}</span></td>
                  <td className="p-5 text-sm font-bold text-slate-600">Linking Subsidy <span className="text-emerald-600">#{item.subsidyId}</span></td>
                  <td className="p-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest bg-emerald-100 text-emerald-600">{item.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DisbursementsComponent;