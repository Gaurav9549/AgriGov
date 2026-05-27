import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '../config';

const CreateAuditForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    scope: 'Scheme',
    findings: '',
    status: 'PASS'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Replace API_ENDPOINTS.CREATE_AUDIT with your actual backend endpoint key
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.CREATE_AUDITS}`, 
        formData, 
        { headers: getAuthHeaders() }
      );
      onSuccess();
    } catch (err) {
      setError('Failed to log audit. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button onClick={onCancel} className="text-sm font-bold mb-4" style={{ color: colors.deepEmerald }}>← Back to Logs</button>
      <h2 className="text-3xl font-bold mb-2" style={{ color: colors.deepEmerald }}>New Audit Entry</h2>
      <p className="text-slate-500 mb-8">Submit findings for internal system or scheme review.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Audit Scope</label>
          <input
            type="text"
            value={formData.scope}
            onChange={(e) => setFormData({...formData, scope: e.target.value})}
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2"
            style={{ focusRingColor: colors.vibrantGreen }}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Audit Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 appearance-none"
          >
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Detailed Findings</label>
          <textarea
            required
            rows="4"
            value={formData.findings}
            onChange={(e) => setFormData({...formData, findings: e.target.value})}
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2"
            style={{ focusRingColor: colors.vibrantGreen }}
            placeholder="Document all observations and results..."
          ></textarea>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 rounded-2xl text-white font-bold shadow-lg hover:brightness-110 disabled:opacity-50 transition-all"
            style={{ backgroundColor: colors.vibrantGreen }}
          >
            {loading ? 'Processing...' : 'Submit Audit'}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateAuditForm;