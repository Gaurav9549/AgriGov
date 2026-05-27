import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Added for decoding uid
import { API_BASE_URL, getAuthHeaders } from '../config';
import DocumentUpload from './DocumentUpload';
import EditSchemeForm from './EditSchemeForm';

const Schemes = ({ onAddScheme }) => {
  const [schemes, setSchemes] = useState([]);
  const [appliedSchemeIds, setAppliedSchemeIds] = useState([]); // Store IDs of applied schemes
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [selectedScheme, setSelectedScheme] = useState(null);

  const location = useLocation();
  const isProgramManager = location.pathname.includes('/programmanager');

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchSchemes();
      // Only fetch application history if the user is a farmer (not a manager)
      if (!isProgramManager) {
        await fetchAppliedHistory();
      }
      setLoading(false);
    };
    initializeData();
  }, [isProgramManager]);

  const fetchSchemes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}policy/fetchall`, {
        headers: getAuthHeaders(),
      });
      setSchemes(response.data || []);
    } catch (error) {
      console.error("Error fetching schemes:", error);
    }
  };

  const fetchAppliedHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode(token);
      const farmerId = decoded.uid;

      const response = await axios.get(
        `${API_BASE_URL}application/farmer/${farmerId}`,
        { headers: getAuthHeaders() }
      );

      // Extract only the schemeIDs into an array for easy comparison
      const ids = response.data.map(app => app.schemeID);
      setAppliedSchemeIds(ids);
    } catch (error) {
      console.error("Error fetching application history:", error);
    }
  };

  const handleDelete = async (schemeID) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_BASE_URL}policy/${schemeID}`, {
          headers: getAuthHeaders(),
        });
        fetchSchemes();
      } catch (error) {
        alert("Delete failed");
      }
    }
  };

  // --- FILTER LOGIC ---
  // If Program Manager: Show ALL schemes
  // If Farmer: Hide schemes that are present in appliedSchemeIds
  const visibleSchemes = isProgramManager 
    ? schemes 
    : schemes.filter(scheme => !appliedSchemeIds.includes(scheme.schemeID));

  if (view === 'apply') {
    return <DocumentUpload scheme={selectedScheme} onBack={() => setView('list')} onSuccess={() => {
      setView('list');
      fetchAppliedHistory(); // Refresh history after applying
      fetchSchemes();
    }} />;
  }

  if (view === 'edit') {
    return <EditSchemeForm scheme={selectedScheme} onBack={() => setView('list')} onSuccess={() => { fetchSchemes(); setView('list'); }} />;
  }

  if (loading) return <div className="p-20 text-center font-black tracking-widest text-[#135E4B] animate-pulse">SYNCING SCHEMES...</div>;

  return (
    <div className="p-10 animate-in fade-in duration-500">
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#135E4B]">
            {isProgramManager ? "Policy Management" : "Available Schemes"}
          </h2>
          <p className="text-slate-500 mt-2">
            {isProgramManager ? "Manage regional agricultural policies." : "Apply for schemes you haven't applied for yet."}
          </p>
        </div>
        {isProgramManager && (
          <button onClick={onAddScheme} className="px-8 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg bg-[#4CB572] hover:brightness-110">
            + New Scheme
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {visibleSchemes.map((scheme) => (
          <div key={scheme.schemeID} className="group bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            {/* ... rest of your card rendering logic stays exactly the same ... */}
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-emerald-50 rounded-2xl text-2xl">🌾</div>
               <div className="flex items-center space-x-2">
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${scheme.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                   {scheme.status}
                 </span>
                 {isProgramManager && (
                   <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => { setSelectedScheme(scheme); setView('edit'); }} className="p-2 bg-slate-100 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors">✏️</button>
                     <button onClick={() => handleDelete(scheme.schemeID)} className="p-2 bg-slate-100 hover:bg-red-500 hover:text-white rounded-lg transition-colors">🗑️</button>
                   </div>
                 )}
               </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-3">{scheme.title}</h3>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2">{scheme.description}</p>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-tighter">Budget Allocation</span>
                <span className="text-emerald-600 font-black">₹{Number(scheme.budget).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-tighter">Timeline</span>
                <span className="text-slate-700 font-bold">{scheme.startDate} to {scheme.endDate}</span>
              </div>
            </div>

            {!isProgramManager && (
              <button onClick={() => { setSelectedScheme(scheme); setView('apply'); }} className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg bg-[#4CB572] hover:brightness-110 active:scale-95 transition-all">
                Apply Now
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Show empty state if all schemes are hidden */}
      {!loading && visibleSchemes.length === 0 && (
        <div className="text-center py-20 text-slate-400 italic">
          No new schemes available. You have applied for all active programs.
        </div>
      )}
    </div>
  );
};

export default Schemes;