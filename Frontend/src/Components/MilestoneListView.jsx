import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../config";
import { EditMilestoneForm } from "./EditMilestoneForm";

const MilestoneListView = ({ projectId, onBack }) => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(null);

  const colors = {
    deepEmerald: "#135E4B",
    vibrantGreen: "#4CB572",
    cloudGrey: "#CCDCDB",
  };

  useEffect(() => {
    const fetchMilestones = async () => {
      setLoading(true);
      try {
        // Endpoint: http://localhost:9091/api/milestones/fetchByProject/{projectId}
        const response = await axios.get(
          `${API_BASE_URL}api/milestones/fetchByProject/${projectId}`,
          { headers: getAuthHeaders() }
        );
        setMilestones(response.data || []);
      } catch (err) {
        console.error("Milestone fetch error:", err);
        setError("Unable to retrieve project milestones. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchMilestones();
  }, [projectId]);

  const handleEditClick = (milestone) => {
    setEditingMilestone(milestone);
  };

  const handleEditSuccess = (updatedMilestone) => {
    setMilestones((prev) =>
      prev.map((m) => (m.milestoneId === updatedMilestone.milestoneId ? updatedMilestone : m))
    );
    setEditingMilestone(null);
  };

  const handleEditCancel = () => {
    setEditingMilestone(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "COMPLETED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-700 border-blue-200";
      case "DELAYED": return "bg-red-100 text-red-700 border-red-200";
      case "PLANNED": return "bg-slate-100 text-slate-600 border-slate-200";
      default: return "bg-slate-50 text-slate-400 border-slate-100";
    }
  };

  if (loading) return (
    <div className="p-20 text-center font-black tracking-widest text-[#135E4B] animate-pulse">
      SYNCING TIMELINE DATA...
    </div>
  );

  if (editingMilestone) {
    return (
      <EditMilestoneForm
        milestone={editingMilestone}
        onUpdate={handleEditSuccess}
        onCancel={handleEditCancel}
      />
    );
  }

  return (
    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Navigation & Header */}
      <div className="mb-10">
        <button 
          onClick={onBack}
          className="text-xs font-black uppercase tracking-widest text-emerald-700 hover:opacity-50 mb-4 transition-all"
        >
          ← Return to Project Overview
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight" style={{ color: colors.deepEmerald }}>
              Project Milestones
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Tracking phase completion for <span className="font-mono font-bold text-emerald-600">#{projectId}</span>
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Phases</span>
            <p className="text-2xl font-black text-emerald-600">{milestones.length}</p>
          </div>
        </div>
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
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Milestone Title</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Project Context</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Target Date</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {milestones.length > 0 ? (
                milestones.map((ms) => (
                  <tr key={ms.milestoneId} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl shadow-sm border border-white">
                          📍
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-base leading-tight">{ms.title}</div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter mt-0.5">
                            ID: M-{ms.milestoneId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-semibold text-slate-700">{ms.projectTitle || "N/A"}</div>
                      <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                        Project ID: {ms.projectId}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🗓️</span>
                        <div className="text-sm font-mono font-bold text-slate-800">
                          {new Date(ms.date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(ms.status)}`}>
                        {ms.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <button
                        onClick={() => handleEditClick(ms)}
                        className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs uppercase hover:bg-emerald-200 transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-slate-400 italic">
                    No milestones defined for this project schedule.
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

export default MilestoneListView;