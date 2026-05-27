import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '../config';
import CreateAuditForm from './CreateAuditForm';

const AuditsView = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFindings, setSelectedFindings] = useState(null);

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    cloudGrey: '#CCDCDB',
  };

  const fetchAudits = async () => {
    setLoading(true);
    try {
      // Ensure you add FETCH_AUDITS to your config.js API_ENDPOINTS
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.FETCH_AUDITS}`, {
        headers: getAuthHeaders(),
      });
      setAudits(response.data || []);
    } catch (err) {
      setError('Unable to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const getStatusBadge = (status) => {
    const isPass = status === "PASS";
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
        isPass ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
      }`}>
        {status}
      </span>
    );
  };

  if (isCreating) {
    return (
      <CreateAuditForm 
        onCancel={() => setIsCreating(false)} 
        onSuccess={() => {
          setIsCreating(false);
          fetchAudits();
        }} 
      />
    );
  }

  if (loading) return <div className="p-10 text-center animate-pulse text-emerald-800">Loading audit logs...</div>;

  return (
    <div className="p-8 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.deepEmerald }}>Audit Logs</h2>
          <p className="text-sm text-slate-500">History of internal system and scheme verifications.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          style={{ backgroundColor: colors.vibrantGreen }}
          className="flex items-center space-x-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:brightness-110 transition-all active:scale-95"
        >
          <span>+</span>
          <span>New Audit Entry</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="py-4 px-4 text-xs font-bold uppercase text-slate-400">Audit ID</th>
              <th className="py-4 px-4 text-xs font-bold uppercase text-slate-400">User ID</th>
              <th className="py-4 px-4 text-xs font-bold uppercase text-slate-400">Scope</th>
              <th className="py-4 px-4 text-xs font-bold uppercase text-slate-400">Status</th>
              <th className="py-4 px-4 text-xs font-bold uppercase text-slate-400">Date</th>
              <th className="py-4 px-4 text-xs font-bold uppercase text-slate-400 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {audits.map((audit) => (
              <tr key={audit.auditId} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-4 font-mono text-sm text-slate-500">#{audit.auditId}</td>
                <td className="py-4 px-4 text-sm font-semibold">User {audit.userId}</td>
                <td className="py-4 px-4 text-sm text-slate-600">{audit.scope}</td>
                <td className="py-4 px-4">{getStatusBadge(audit.status)}</td>
                <td className="py-4 px-4 text-sm text-slate-500">{audit.date}</td>
                <td className="py-4 px-4 text-right">
                  <button 
                    onClick={() => setSelectedFindings(audit.findings)}
                    className="text-emerald-700 hover:underline text-xs font-bold uppercase"
                  >
                    View Findings
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Findings Modal --- */}
      {selectedFindings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedFindings(null)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold" style={{ color: colors.deepEmerald }}>Audit Findings</h3>
              <button onClick={() => setSelectedFindings(null)} className="text-slate-400 hover:text-slate-600 text-3xl">&times;</button>
            </div>
            <div className="p-8">
              <div className="p-6 rounded-2xl border-l-4 leading-relaxed text-slate-700 italic" style={{ backgroundColor: colors.cloudGrey, borderColor: colors.vibrantGreen }}>
                "{selectedFindings}"
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end">
              <button onClick={() => setSelectedFindings(null)} className="px-8 py-2 rounded-xl text-white font-bold" style={{ backgroundColor: colors.deepEmerald }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditsView;