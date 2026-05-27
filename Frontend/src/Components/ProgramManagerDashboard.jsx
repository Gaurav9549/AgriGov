import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, getAuthHeaders, clearTokens } from '../config';
import ProjectView from './ProjectView';
import { AddProjectForm } from "./AddProjectForm";
import Schemes from "./Schemes"; // Reusing the list view we designed
import CreateSchemeForm from "./CreateSchemeForm";

const ProgramManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}api/rural-projects/fetchAll`, {
        headers: getAuthHeaders(),
      });
      setProjects(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch projects:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "projects":
        return (
          <ProjectView
            projects={projects}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setActiveTab={setActiveTab}
          />
        );
      case "create-project":
        return <AddProjectForm onSuccess={() => { fetchProjects(); setActiveTab("projects"); }} onCancel={() => setActiveTab("projects")} />;
      
      case "schemes":
        return <Schemes onAddScheme={() => setActiveTab("create-scheme")} />;
        
      case "create-scheme":
        return (
          <CreateSchemeForm 
            onSuccess={() => setActiveTab("schemes")} 
            onCancel={() => setActiveTab("schemes")} 
          />
        );

      default:
        return <ProjectView projects={projects} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
      <aside className="w-64 flex-shrink-0 shadow-xl z-20" style={{ backgroundColor: colors.deepEmerald }}>
        <div className="p-8 text-white">
          <h2 className="text-xl font-bold tracking-tight">AGRIGOV</h2>
          <p className="text-[10px] opacity-50 uppercase tracking-widest">Program Manager</p>
        </div>
        
        <nav className="mt-4 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('projects')} 
            className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-white transition-all ${activeTab.includes('project') ? 'bg-white/10' : 'opacity-50 hover:opacity-100'}`}
          >
            <span>🚜</span> <span className="font-bold">Projects</span>
          </button>

          <button 
            onClick={() => setActiveTab('schemes')} 
            className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-white transition-all ${activeTab.includes('scheme') ? 'bg-white/10' : 'opacity-50 hover:opacity-100'}`}
          >
            <span>🌱</span> <span className="font-bold">Schemes</span>
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-white/10">
          <button onClick={handleLogout} className="w-full text-left text-white/70 hover:text-white flex items-center space-x-2 text-sm font-medium">
            <span>🚪</span> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-10 py-5 sticky top-0 z-10 flex justify-between items-center">
          <h1 className="text-2xl font-bold uppercase tracking-tight" style={{ color: colors.deepEmerald }}>
            {activeTab.replace('-', ' ')}
          </h1>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border shadow-sm">👔</div>
        </header>

        <div className="p-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[80vh] overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgramManagerDashboard;