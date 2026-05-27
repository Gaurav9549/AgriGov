import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '../config';
import CreateComplianceForm from './CreateComplianceForm'; // Ensure this path is correct

const CompliancesView = ({ showCreateButton = true }) => {
  const [compliances, setCompliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Internal view management
  const [isCreating, setIsCreating] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState(null);

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    softMint: '#A1D8B5',
    cloudGrey: '#CCDCDB',
  };

  // Function to fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.FETCH_COMPLIANCES}`, {
        headers: getAuthHeaders(),
      });
      setCompliances(response.data || []);
    } catch (err) {
      setError('Unable to load compliance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle successful creation
  const handleSuccess = () => {
    setIsCreating(false);
    fetchData(); // Refresh the list automatically
  };

  const getResultBadge = (result) => {
    const isCompliant = result === "COMPLIANT";
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
        isCompliant ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
      }`}>
        {result}
      </span>
    );
  };

  // If the user clicked "Create New", show the Form instead of the List
  if (isCreating) {
    return (
      <CreateComplianceForm 
        onCancel={() => setIsCreating(false)} 
        onSuccess={handleSuccess} 
      />
    );
  }

  if (loading) return <div className="p-10 text-center animate-pulse text-emerald-800">Loading compliance records...</div>;
  if (error) return <div className="p-10 text-center text-red-700 font-medium">{error}</div>;

  return (
    <div className="p-8 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.deepEmerald }}>Compliance Records</h2>
          <p className="text-sm text-slate-500">Overview of all entity audits and verification results.</p>
        </div>
        {showCreateButton && (
          <button
            onClick={() => setIsCreating(true)} // Switches to the internal Form view
            style={{ backgroundColor: colors.vibrantGreen }}
            className="flex items-center space-x-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:brightness-110 transition-all active:scale-95"
          >
            <span>+</span>
            <span>Create New Compliance</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">ID</th>
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Entity</th>
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Type</th>
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Result</th>
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {compliances.map((item) => (
              <tr key={item.complianceId} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-4 px-4 font-mono text-sm text-slate-500">#{item.complianceId}</td>
                <td className="py-4 px-4 font-bold text-slate-700">Entity {item.entityID}</td>
                <td className="py-4 px-4">
                  <span className="text-sm font-medium bg-slate-100 px-2 py-1 rounded text-slate-600">{item.type}</span>
                </td>
                <td className="py-4 px-4">{getResultBadge(item.result)}</td>
                <td className="py-4 px-4 text-sm text-slate-500">{item.date}</td>
                <td className="py-4 px-4 text-right">
                  <button 
                    onClick={() => setSelectedNotes(item.notes)}
                    className="text-emerald-700 hover:underline text-xs font-bold uppercase tracking-tight"
                  >
                    View Notes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {compliances.length === 0 && (
        <div className="text-center py-20 italic text-slate-400">No compliance records found.</div>
      )}

      {/* --- Notes Modal --- */}
      {selectedNotes !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedNotes(null)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold" style={{ color: colors.deepEmerald }}>Verification Notes</h3>
              <button onClick={() => setSelectedNotes(null)} className="text-slate-400 hover:text-slate-600 text-3xl">&times;</button>
            </div>
            <div className="p-8">
              <div className="p-6 rounded-2xl border-l-4 leading-relaxed text-slate-700 italic" style={{ backgroundColor: colors.cloudGrey, borderColor: colors.vibrantGreen }}>
                {selectedNotes || "No additional notes provided."}
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end">
              <button onClick={() => setSelectedNotes(null)} className="px-8 py-2 rounded-xl text-white font-bold" style={{ backgroundColor: colors.deepEmerald }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompliancesView;