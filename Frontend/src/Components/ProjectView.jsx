import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../config";

// Component Imports
import { AddProjectForm } from "./AddProjectForm";
import { AddResourceForm } from "./AddResourceForm";
import { AddMilestoneForm } from "./AddMilestoneForm";
import { EditProjectForm } from "./EditProjectForm";
import { EditResourceForm } from "./EditResourceForm";
import { EditMilestoneForm } from "./EditMilestoneForm";
import ResourceListView from "./ResourceListView";
import MilestoneListView from "./MilestoneListView";

const statusStyles = {
  PLANNED: { bg: "#F1F5F9", text: "#475569" },
  IN_PROGRESS: { bg: "#E0F2FE", text: "#0369A1" },
  COMPLETED: { bg: "#DCFCE7", text: "#15803D" },
  ON_HOLD: { bg: "#FEF9C3", text: "#854D0E" },
  CANCELLED: { bg: "#FEE2E2", text: "#991B1B" },
};

const ProjectView = () => {
  // State Management
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("list"); 

  // Selection States
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const colors = { deepEmerald: "#135E4B", vibrantGreen: "#4CB572" };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}api/rural-projects/fetchAll`, {
        headers: getAuthHeaders(),
      });
      setProjects(res.data || []);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanent delete? This cannot be undone.")) {
      try {
        await axios.delete(`${API_BASE_URL}api/rural-projects/delete/${id}`, {
          headers: getAuthHeaders(),
        });
        fetchProjects();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectId?.toString().includes(searchTerm)
  );

  // --- INTERNAL VIEW ROUTING ---
  
  if (view === "add-project")
    return <AddProjectForm onSuccess={() => { fetchProjects(); setView("list"); }} onCancel={() => setView("list")} />;

  if (view === "edit-project") {
    if (!selectedProject) return <div className="p-20 text-center">Loading Project Data...</div>;
    return <EditProjectForm project={selectedProject} onUpdate={() => { fetchProjects(); setView("list"); }} onCancel={() => setView("list")} />;
  }

  if (view === "add-resource")
    return <AddResourceForm projectId={selectedProjectId} onSuccess={() => { fetchProjects(); setView("list"); }} onCancel={() => setView("list")} />;

  if (view === "edit-resource")
    return <EditResourceForm resource={selectedResource} onUpdate={() => { fetchProjects(); setView("list"); }} onCancel={() => setView("list")} />;

  if (view === "add-milestone")
    return <AddMilestoneForm projectId={selectedProjectId} onSuccess={() => { fetchProjects(); setView("list"); }} onCancel={() => setView("list")} />;

  if (view === "edit-milestone")
    return <EditMilestoneForm milestone={selectedMilestone} onUpdate={() => { fetchProjects(); setView("list"); }} onCancel={() => setView("list")} />;

  if (view === "resource-list")
    return <ResourceListView projectId={selectedProjectId} onBack={() => setView("list")} />;

  if (view === "milestone-list")
    return <MilestoneListView projectId={selectedProjectId} onBack={() => setView("list")} />;

  if (loading)
    return <div className="p-20 text-center font-black tracking-widest text-[#135E4B] animate-pulse">SYNCING PROJECT DATABASE...</div>;

  return (
    <div className="p-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search Project ID or Title..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-3.5 opacity-40">🔍</span>
        </div>
        <button
          onClick={() => setView("add-project")}
          className="w-full md:w-auto px-8 py-3 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all"
          style={{ backgroundColor: colors.vibrantGreen }}
        >
          + Create Project
        </button>
      </div>

      {/* Table Grid */}
      <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-sm">
        <table className="w-full text-left border-collapse bg-white">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Project Overview</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Budget (₹)</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProjects.map((project) => (
              <tr key={project.projectId} className="hover:bg-slate-50/30 transition-colors group">
                <td className="p-6">
                  <div className="text-xs font-black text-emerald-600 mb-1">#{project.projectId}</div>
                  <div className="font-bold text-slate-800 text-lg leading-tight">{project.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{project.startDate} — {project.endDate}</div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProjectId(project.projectId);
                        setView("resource-list");
                      }}
                      className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded text-[10px] font-bold text-emerald-700 transition-colors"
                    >
                      📦 {project.resources?.length || 0} Resources
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProjectId(project.projectId);
                        setView("milestone-list");
                      }}
                      className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded text-[10px] font-bold text-amber-700 transition-colors"
                    >
                      📍 {project.milestones?.length || 0} Milestones
                    </button>
                  </div>
                </td>
                <td className="p-6 text-lg font-mono font-bold text-slate-700">
                  {Number(project.budget).toLocaleString("en-IN")}
                </td>
                <td className="p-6 text-center">
                  <span
                    className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                    style={{
                      backgroundColor: statusStyles[project.status]?.bg || "#f1f5f9",
                      color: statusStyles[project.status]?.text || "#475569",
                    }}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={() => { setSelectedProject(project); setView("edit-project"); }}
                      className="p-2.5 bg-slate-100 rounded-xl hover:bg-emerald-500 hover:text-white transition-colors"
                      title="Edit Project"
                    >✏️</button>
                    <button
                      onClick={() => { setSelectedProjectId(project.projectId); setView("add-resource"); }}
                      className="p-2.5 bg-slate-100 rounded-xl hover:bg-blue-500 hover:text-white transition-colors"
                      title="Add Resource"
                    >📦</button>
                    <button
                      onClick={() => { setSelectedProjectId(project.projectId); setView("add-milestone"); }}
                      className="p-2.5 bg-slate-100 rounded-xl hover:bg-amber-500 hover:text-white transition-colors"
                      title="Add Milestone"
                    >📍</button>
                    <button
                      onClick={() => handleDelete(project.projectId)}
                      className="p-2.5 bg-slate-100 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete"
                    >🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectView;