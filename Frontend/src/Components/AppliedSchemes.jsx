import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL, getAuthHeaders } from "../config";

const AppliedSchemes = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = {
    deepEmerald: "#135E4B",
    vibrantGreen: "#4CB572",
  };

  useEffect(() => {
    fetchAppliedSchemes();
  }, []);

  const fetchAppliedSchemes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No session found");

      const decoded = jwtDecode(token);
      const farmerId = decoded.uid; // Using 'uid' as per your requirement

      // Adjust endpoint to match your backend (e.g., fetchByFarmer/{id})
      const response = await axios.get(
        `${API_BASE_URL}application/farmer/${farmerId}`,
        { headers: getAuthHeaders() }
      );

      setApplications(response.data || []);
    } catch (err) {
      console.error("Error fetching applied schemes:", err);
      setError("Failed to load your application history.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PENDING": return "bg-blue-100 text-blue-700 border-blue-200";
      case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  if (loading) return (
    <div className="p-20 text-center font-black tracking-widest text-[#135E4B] animate-pulse">
      RETRIEVING APPLICATIONS...
    </div>
  );

  return (
    <div className="p-10 animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-black tracking-tight text-[#135E4B]">My Applied Schemes</h2>
        <p className="text-slate-500 mt-2">Track the status of your submitted grant and aid applications.</p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl text-center">
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Application Info</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Scheme ID</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Submission Date</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.applicationID} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl shadow-sm border border-white">
                          📄
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-base leading-tight">
                            Application #{app.applicationID}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter mt-0.5">
                            Farmer UID: {app.farmerID}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-semibold text-slate-700">Scheme Reference</div>
                      <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                        ID: {app.schemeID}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🗓️</span>
                        <div className="text-sm font-mono font-bold text-slate-800">
                          {new Date(app.submittedDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-slate-400 italic">
                    You haven't applied for any schemes yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppliedSchemes;