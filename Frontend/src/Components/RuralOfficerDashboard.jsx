import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateSubsidyComponent from "./CreateSubsidyComponent";
import {
  LayoutDashboard,
  FileText,
  HandCoins,
  CheckCircle2,
  LogOut,
  UserCircle,
} from "lucide-react";
import { clearTokens } from "../config";
import Subsidies from "./Subsidies";
import DisbursementsComponent from "./DisbursementsComponent";
import ApplicationsComponent from "./ApplicationsComponent";

const RuralOfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState("Applications");
  const [preFillData, setPreFillData] = useState(null);
  const navigate = useNavigate();
  const colors = {
    deepEmerald: "#135E4B",
    vibrantGreen: "#4CB572",
    softBg: "#F8FAFC",
  };

  const menuItems = [
    { id: "Applications", icon: <FileText size={20} />, label: "Applications" },
    { id: "Subsidies", icon: <HandCoins size={20} />, label: "Subsidies" },
    {
      id: "Disbursements",
      icon: <CheckCircle2 size={20} />,
      label: "Disbursements",
    },
  ];

  const handleSignOut = () => {
    // Add your logout logic here (clear tokens, redirect, etc.)
    alert("Signing out...");
    clearTokens();
    navigate("/login");
  };

  const handleApproveRedirect = (tabName, data) => {
    setPreFillData(data); // Store { farmerId, schemeId }
    setActiveTab(tabName); // Switch the view to 'CreateSubsidy'
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-slate-200 bg-white">
        {/* Branding Area */}
        <div className="p-6 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: colors.deepEmerald }}
          >
            <LayoutDashboard size={22} />
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tight leading-tight">
              RURAL CARE
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Officer Portal
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === item.id
                  ? "text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`}
              style={
                activeTab === item.id
                  ? { backgroundColor: colors.vibrantGreen }
                  : {}
              }
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom Section: Profile & Sign Out */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <UserCircle size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black truncate">Officer Name</p>
              <p className="text-[10px] text-slate-400 font-medium">
                District HQ
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800 tracking-tight">
            {activeTab} Management
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-widest">
              Live Data
            </span>
          </div>
        </header>

        {/* Tab Content Rendering */}
        <section className="flex-1 overflow-y-auto p-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "Applications" && (
              <ApplicationsComponent
                onApproveRedirect={handleApproveRedirect}
              />
            )}
            {activeTab === "CreateSubsidy" && (
              <CreateSubsidyComponent
                initialData={preFillData}
                onComplete={(targetTab) => {
                  setActiveTab(targetTab); // Go to 'Subsidies' after saving
                  setPreFillData(null); // Reset the data
                }}
              />
            )}

            {activeTab === "Subsidies" && <Subsidies />}

            {activeTab === "Disbursements" && <DisbursementsComponent />}
          </div>
        </section>
      </main>
    </div>
  );
};

export default RuralOfficerDashboard;
