import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, getAuthHeaders } from '../config';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}audit`, { headers: getAuthHeaders() });
        setLogs(res.data);
      } catch (err) { console.error(err); }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-8">
      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-lg">
                {log.event.includes('LOGIN') ? '🔑' : '👤'}
              </div>
              <div>
                <div className="font-bold text-slate-800">{log.event.replace('_', ' ')}</div>
                <div className="text-xs text-slate-500">By {log.actor} {log.target ? `on Target ID: ${log.target}` : ''}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-400 mb-1">{new Date(log.createdAt).toLocaleTimeString()}</div>
              <div className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">{log.metadata}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogs;