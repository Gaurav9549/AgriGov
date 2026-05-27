import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectCompliance = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Palette Mapping from your Dashboard
  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    softMint: '#A1D8B5',
    cloudGrey: '#CCDCDB',
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Calling the Project Service directly on 8092
        const response = await axios.get('http://localhost:9091/api/rural-projects/fetchAll', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Project Fetch Error:", err);
        setError('Unable to load rural projects. Please check connection to Project Service.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-emerald-800">Loading Rural Projects...</div>;
  if (error) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl m-6 border border-red-100">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rural Development Projects</h2>
          <p className="text-slate-500 text-sm">Monitoring compliance and budget allocation</p>
        </div>
        <div className="flex space-x-2">
          <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold uppercase">
            Total Projects: {projects.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => (
          <div 
            key={project.projectId} 
            className="group border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300 bg-white"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Project Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">
                    PRJ-{project.projectId}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                    {project.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                  {project.description || "No description provided for this project."}
                </p>
                
                {/* Timeline & Budget Stats */}
                <div className="flex flex-wrap gap-4 text-xs font-medium">
                  <div className="flex items-center text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                    <span className="mr-2 text-base">📅</span>
                    {new Date(project.startDate).toLocaleDateString('en-IN')} — {new Date(project.endDate).toLocaleDateString('en-IN')}
                  </div>
                  <div className="flex items-center text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                    <span className="mr-2 text-base">💰</span>
                    {formatCurrency(project.budget)}
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 min-w-[150px]">
                <div 
                  className="px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-sm"
                  style={{ 
                    backgroundColor: project.status === 'PLANNED' ? colors.softMint : colors.cloudGrey,
                    color: colors.deepEmerald
                  }}
                >
                  {project.status}
                </div>
                
                <button 
                  className="px-6 py-2 rounded-xl text-sm font-bold text-white transition-transform active:scale-95 shadow-lg shadow-emerald-900/10"
                  style={{ backgroundColor: colors.deepEmerald }}
                  onClick={() => console.log("Audit project:", project.projectId)}
                >
                  View Audit
                </button>
              </div>

            </div>

            {/* Compliance Progress Bar (Visual Polish) */}
            <div className="mt-6 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000" 
                style={{ 
                  width: project.complianceStatus ? '100%' : '5%', 
                  backgroundColor: project.complianceStatus ? colors.vibrantGreen : '#cbd5e1' 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectCompliance;