import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '../config';

const CreateComplianceForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    entityID: '',
    type: 'SCHEME', // Default value
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    cloudGrey: '#CCDCDB',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "entityID" ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Endpoint results in: http://localhost:9091/api/compliance-records
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_COMPLIANCES}`,
        formData,
        { headers: getAuthHeaders() }
      );
      
      // Callback to refresh list and go back
      onSuccess(); 
    } catch (err) {
      console.error("Submission Error:", err.response?.data);
      setError(err.response?.data?.message || 'Failed to create record. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={onCancel}
          className="text-sm font-bold mb-4 flex items-center hover:opacity-70 transition-opacity"
          style={{ color: colors.deepEmerald }}
        >
          ← Back to List
        </button>
        <h2 className="text-3xl font-bold" style={{ color: colors.deepEmerald }}>New Compliance Entry</h2>
        <p className="text-slate-500">Record a new verification result for an entity or scheme.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Entity ID Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Entity ID</label>
          <input
            type="number"
            name="entityID"
            value={formData.entityID}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 transition-all"
            style={{ focusRingColor: colors.vibrantGreen }}
            placeholder="e.g. 101"
          />
        </div>

        {/* Compliance Type Dropdown */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Compliance Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 appearance-none transition-all"
            style={{ focusRingColor: colors.vibrantGreen }}
          >
            <option value="SCHEME">SCHEME</option>
            <option value="PROJECT">PROJECT</option>
            <option value="SUBSIDY">SUBSIDY</option>
          </select>
        </div>

        {/* Notes Textarea */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Verification Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 transition-all"
            style={{ focusRingColor: colors.vibrantGreen }}
            placeholder="Describe the compliance status or any issues found..."
          ></textarea>
        </div>

        {/* Submit Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 rounded-2xl text-white font-bold shadow-lg hover:brightness-110 transition-all disabled:opacity-50 active:scale-95"
            style={{ backgroundColor: colors.vibrantGreen }}
          >
            {loading ? 'Submitting...' : 'Register Compliance'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateComplianceForm;