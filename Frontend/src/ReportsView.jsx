import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '../config';
import CreateReportForm from './CreateReportForm';

const ReportsView = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState(null);

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    cloudGrey: '#CCDCDB',
    softMint: '#A1D8B5'
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.FETCH_REPORTS}`, {
        headers: getAuthHeaders(),
      });
      setReports(response.data || []);
    } catch (err) {
      setError('Failed to retrieve analytical reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (isCreating) {
    return (
      <CreateReportForm 
        onCancel={() => setIsCreating(false)} 
        onSuccess={() => {
          setIsCreating(false);
          fetchReports();
        }} 
      />
    );
  }

  if (loading) return <div className="p-10 text-center animate-pulse text-emerald-800 font-medium">Generating Report View...</div>;

  return (
    <div className="p-8 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.deepEmerald }}>Analytical Reports</h2>
          <p className="text-sm text-slate-500">Performance summaries and metric disbursements.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          style={{ backgroundColor: colors.vibrantGreen }}
          className="flex items-center space-x-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:brightness-110 transition-all active:scale-95"
        >
          <span>📊</span>
          <span>Generate New Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.reportId} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-slate-100 text-slate-500">
                ID #{report.reportId}
              </span>
              <span className="text-xs font-medium text-slate-400">{report.date}</span>
            </div>
            
            <h4 className="font-bold text-lg mb-2" style={{ color: colors.deepEmerald }}>
              Scope: {report.scope}
            </h4>
            
            <p className="text-sm text-slate-600 line-clamp-2 mb-6 h-10">
              {report.metrics}
            </p>

            <button 
              onClick={() => setSelectedMetrics(report.metrics)}
              className="w-full py-2 rounded-lg font-bold text-xs uppercase tracking-tighter transition-colors"
              style={{ border: `1px solid ${colors.vibrantGreen}`, color: colors.vibrantGreen }}
            >
              Expand Metrics
            </button>
          </div>
        ))}
      </div>

      {/* --- Metrics Modal --- */}
      {selectedMetrics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedMetrics(null)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center" style={{ backgroundColor: colors.cloudGrey }}>
              <h3 className="text-lg font-bold" style={{ color: colors.deepEmerald }}>Disbursement Metrics</h3>
              <button onClick={() => setSelectedMetrics(null)} className="text-slate-400 hover:text-slate-600 text-3xl">&times;</button>
            </div>
            <div className="p-8">
              <p className="text-slate-700 leading-relaxed font-medium">
                {selectedMetrics}
              </p>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedMetrics(null)} 
                className="px-8 py-2 rounded-xl text-white font-bold" 
                style={{ backgroundColor: colors.deepEmerald }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsView;