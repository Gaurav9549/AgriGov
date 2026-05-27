import React, { useState } from 'react';
import { LogOut } from 'lucide-react'; 
import Profile from './Profile';
import NotificationBell from './NotificationBell'; // ✅ Imported your new component
import Schemes from './Schemes'; 
import AppliedSchemes from './AppliedSchemes';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('Schemes');
  const [showProfile, setShowProfile] = useState(false);
  
  // Retrieve user data to get the farmerId for the notification component
  const user = JSON.parse(localStorage.getItem("user"));
  const farmerId = user?.id || user?.uid || ""; 

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    softMint: '#A1D8B5',
    cloudGrey: '#CCDCDB',
  };

  const navItems = [
    { name: 'Schemes', icon: '🌱' },
    { name: 'Applied Schemes', icon: '📝' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 shadow-2xl z-20 flex flex-col justify-between" style={{ backgroundColor: colors.deepEmerald }}>
        <div>
          <div className="p-8">
            <h2 className="text-white text-2xl font-black tracking-tighter">AGRIGOV</h2>
            <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">Farmer Portal</p>
          </div>

          <nav className="mt-4 px-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl transition-all duration-300 ${
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
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-red-300 hover:text-white hover:bg-red-500/20 transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 py-4 sticky top-0 z-10 flex justify-between items-center">
          <h1 className="text-xl font-black uppercase tracking-tight" style={{ color: colors.deepEmerald }}>
            {activeTab}
          </h1>
          
          <div className="flex items-center space-x-4">
            {/* ✅ Integrated NotificationBell Component */}
            <NotificationBell farmerId={farmerId} />

            <button 
              onClick={() => { setShowProfile(!showProfile); }}
              className="flex items-center space-x-3 p-1.5 pr-4 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all border border-transparent hover:border-emerald-200"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-sm font-bold text-slate-700">Profile</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 relative">
          {showProfile && (
            <div className="absolute right-8 top-0 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
              <Profile onClose={() => setShowProfile(false)} />
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[80vh] overflow-hidden">
            {activeTab === 'Schemes' ? (
              <Schemes />
            ) : (
              <AppliedSchemes />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;