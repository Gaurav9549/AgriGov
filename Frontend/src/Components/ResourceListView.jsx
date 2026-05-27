import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../config";
import { EditResourceForm } from "./EditResourceForm";

const ResourceListView = ({ projectId, onBack }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

  const colors = {
    deepEmerald: "#135E4B",
    vibrantGreen: "#4CB572",
    cloudGrey: "#CCDCDB",
  };

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        // Endpoint: http://localhost:9091/api/resources/fetchByProject/{projectId}
        const response = await axios.get(
          `${API_BASE_URL}api/resources/fetchByProject/${projectId}`,
          { headers: getAuthHeaders() }
        );
        setResources(response.data || []);
      } catch (err) {
        console.error("Resource fetch error:", err);
        setError("Failed to load regional resources for this project.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchResources();
  }, [projectId]);

  const handleEditClick = (resource) => {
    setEditingResource(resource);
  };

  const handleEditSuccess = (updatedResource) => {
    setResources((prev) =>
      prev.map((r) => (r.resourceId === updatedResource.resourceId ? updatedResource : r))
    );
    setEditingResource(null);
  };

  const handleEditCancel = () => {
    setEditingResource(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ALLOCATED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "UTILIZED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "ON_HOLD": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  if (loading) return (
    <div className="p-20 text-center font-black tracking-widest text-[#135E4B] animate-pulse">
      RETRIEVING RESOURCE DATA...
    </div>
  );

  if (editingResource) {
    return (
      <EditResourceForm
        resource={editingResource}
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
          ← Back to Project List
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight" style={{ color: colors.deepEmerald }}>
              Resource Inventory
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Regional Assets for Project <span className="font-mono font-bold text-emerald-600">#{projectId}</span>
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Allocated Items</span>
            <p className="text-2xl font-black text-emerald-600">{resources.length}</p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl text-center font-medium">
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Resource Info</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Project Mapping</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Quantity</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {resources.length > 0 ? (
                resources.map((res) => (
                  <tr key={res.resourceId} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl shadow-sm border border-white">
                          {res.type === 'Funds' ? '💰' : '📦'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-base leading-tight">{res.type}</div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter mt-0.5">
                            UID: RES-{res.resourceId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-semibold text-slate-700">{res.projectTitle || "N/A"}</div>
                      <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                        Ref: PID-{res.projectId}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="text-lg font-mono font-black text-slate-800">
                        {res.type === 'Funds' ? '₹' : ''}
                        {Number(res.quantity).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(res.status)}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <button
                        onClick={() => handleEditClick(res)}
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
                    No resources currently recorded for this project scope.
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

export default ResourceListView;