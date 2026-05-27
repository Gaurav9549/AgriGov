import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '../config';

const Programs = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Palette Mapping
  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    softMint: '#A1D8B5',
    cloudGrey: '#CCDCDB',
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.FETCH_PROGRAMS}`,
          { headers: getAuthHeaders() }
        );
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load agricultural programs. Please try again later.");
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'IN_PROGRESS':
        return { bg: '#E0F2F1', text: '#135E4B', label: 'In Progress' };
      case 'COMPLETED':
        return { bg: '#C8E6C9', text: '#2E7D32', label: 'Completed' };
      default:
        return { bg: '#F5F5F5', text: '#616161', label: status };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-emerald-900 font-semibold">
        <div className="animate-pulse">Loading Programs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-red-700 bg-red-50 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12" style={{ backgroundColor: '#CCDCDB' }}>
      <div className="container mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: colors.deepEmerald }}>
              Active Agricultural Programs
            </h1>
            <p className="text-slate-700 opacity-80">
              Monitoring government-backed initiatives and rural development projects.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 font-bold rounded-lg transition-all duration-300"
            style={{ 
              backgroundColor: colors.deepEmerald, 
              color: 'white',
              hover: { opacity: 0.9 }
            }}
          >
            ← Back to Home
          </button>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const status = getStatusStyle(project.status);
            return (
              <div 
                key={project.projectId} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-white/50 overflow-hidden group"
              >
                {/* Visual Accent */}
                <div className="h-2 w-full" style={{ backgroundColor: colors.vibrantGreen }}></div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                      style={{ backgroundColor: status.bg, color: status.text }}
                    >
                      {status.label}
                    </span>
                    <span className="text-xs font-medium text-slate-400">ID: #{project.projectId}</span>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 group-hover:text-emerald-700 transition-colors" style={{ color: colors.deepEmerald }}>
                    {project.title}
                  </h3>

                  <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  <hr className="mb-6 opacity-10 border-slate-900" />

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <p className="text-slate-400 uppercase font-semibold mb-1">Launch Date</p>
                      <p className="font-bold text-slate-700">{new Date(project.startDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 uppercase font-semibold mb-1">Expected Completion</p>
                      <p className="font-bold text-slate-700">{new Date(project.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div 
                  className="bg-slate-50 p-4 text-center cursor-pointer hover:bg-slate-100 transition-colors"
                  style={{ borderTop: `1px solid ${colors.softMint}` }}
                >
                  <span className="text-sm font-bold" style={{ color: colors.deepEmerald }}>
                    View Full Details
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Programs;