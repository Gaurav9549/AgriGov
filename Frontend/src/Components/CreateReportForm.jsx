import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '../config';

const CreateReportForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    scope: 'Subsidy',
    metrics: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    cloudGrey: '#CCDCDB'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Ensure CREATE_REPORT is in your config.js
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.CREATE_REPORT}`, 
        formData, 
        { headers: getAuthHeaders() }
      );
      onSuccess();
    } catch (err) {
      setError('Failed to generate report. Please verify data integrity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button onClick={onCancel} className="text-sm font-bold mb-4 flex items-center" style={{ color: colors.deepEmerald }}>
        <span className="mr-2">←</span> Back to Reports
      </button>
      <h2 className="text-3xl font-bold mb-2" style={{ color: colors.deepEmerald }}>Report Generation</h2>
      <p className="text-slate-500 mb-8">Compile and publish official agricultural metrics.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Report Scope</label>
          <select
            value={formData.scope}
            onChange={(e) => setFormData({...formData, scope: e.target.value})}
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 appearance-none"
            style={{ focusRingColor: colors.vibrantGreen }}
          >
            <option value="Subsidy">Subsidy</option>
            <option value="Project">Project</option>
            <option value="Scheme">Scheme</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Detailed Metrics</label>
          <textarea
            required
            rows="6"
            value={formData.metrics}
            onChange={(e) => setFormData({...formData, metrics: e.target.value})}
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2"
            style={{ focusRingColor: colors.vibrantGreen }}
            placeholder="Document success rates, disbursement details, and performance data..."
          ></textarea>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 rounded-2xl text-white font-bold shadow-lg hover:brightness-110 disabled:opacity-50 transition-all active:scale-95"
            style={{ backgroundColor: colors.vibrantGreen }}
          >
            {loading ? 'Generating...' : 'Publish Report'}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="flex-1 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReportForm;