import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '../config';
import CompliancesView from './CompliancesView';
import AuditsView from './AuditsView';
import ReportsView from './ReportsView';
import ProjectCompliance from './ProjectCompliance'; // Assuming these names
import Subsidies from './Subsidies';
import SchemeApplications from './SchemeApplications';
// Placeholder Components (We will populate these with your data next)\\

const ComplianceDashboard = () => {
  const [activeTab, setActiveTab] = useState('Compliances');

  // Palette Mapping
  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    softMint: '#A1D8B5',
    cloudGrey: '#CCDCDB',
  };

  const menuItems = [
    { name: 'Compliances', icon: '🛡️' },
    { name: 'Audits', icon: '📝' },
    { name: 'Reports', icon: '📈' },
    { name: 'Projects', icon: '🏗️' },          // New
    { name: 'Applications', icon: '📄' },      // New
    { name: 'Subsidies', icon: '💰' },         // New
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Compliances': return <CompliancesView />;
      case 'Audits': return <AuditsView />;
      case 'Reports': return <ReportsView />;
      case 'Projects': return <ProjectCompliance />;
      case 'Applications': return <SchemeApplications />;
      case 'Subsidies': return <Subsidies />;
      default: return <CompliancesView />;
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
      
      {/* Sidebar */}
      <aside 
        className="w-64 flex-shrink-0 shadow-xl z-20" 
        style={{ backgroundColor: colors.deepEmerald }}
      >
        <div className="p-6">
          <h2 className="text-white text-xl font-bold tracking-tight flex items-center">
            <span className="mr-2">⚖️</span> AgriGov Compliance
          </h2>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.name 
                  ? 'bg-white/10 text-white shadow-inner' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
              {activeTab === item.name && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.vibrantGreen }}></div>
              )}
            </button>
          ))}
        </nav>

        {/* User Info / Logout area at bottom */}
        <div className="absolute bottom-0 w-64 p-6 border-t border-white/10">
          <button onClick={handleLogout} className="text-white/50 text-sm hover:text-white flex items-center space-x-2">
            <span>🚪</span> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-bold" style={{ color: colors.deepEmerald }}>
            {activeTab} Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: colors.softMint, color: colors.deepEmerald }}>
              Officer Access
            </div>
          </div>
        </header>

        {/* Content Portal */}
        <div className="p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[80vh]">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplianceDashboard;