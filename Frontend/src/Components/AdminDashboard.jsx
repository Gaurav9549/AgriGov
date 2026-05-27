import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '../config';
import UserManagement from './UserManagement';
import AuditLogs from './AuditLogs';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Users');

  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    softMint: '#A1D8B5',
    cloudGrey: '#CCDCDB',
  };

  const menuItems = [
    { name: 'Users', icon: '👥' },
    { name: 'AuditLogs', icon: '📜' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 shadow-2xl z-20" style={{ backgroundColor: colors.deepEmerald }}>
        <div className="p-8">
          <h2 className="text-white text-2xl font-black tracking-tighter">AGRIGOV <br/><span className="text-xs font-light opacity-50 uppercase tracking-widest">Admin Portal</span></h2>
        </div>

        <nav className="mt-4 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl transition-all ${
                activeTab === item.name 
                  ? 'bg-white/10 text-white shadow-inner' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-bold">{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-left text-white/70 hover:text-white flex items-center space-x-2 text-sm font-medium"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-10 py-6 sticky top-0 z-10 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: colors.deepEmerald }}>{activeTab} Management</h1>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full animate-pulse bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase text-slate-400">System Live</span>
          </div>
        </header>

        <div className="p-10">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {activeTab === 'Users' ? <UserManagement /> : <AuditLogs />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;