import React, { useEffect, useState } from "react";
// ✅ Fix: Import directly from your config file
import { fetchNotifications, markAsRead } from "../config"; 
import { ArrowLeft, Bell, MailOpen, Calendar, ChevronRight } from 'lucide-react';

export default function Notification({ farmerId, onBack }) {
  const [screen, setScreen] = useState("list");
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchNotifications(farmerId)
      .then((res) => setNotifications(res.data))
      .catch(console.error);
  }, [farmerId]);

  // ... inside Notification.jsx ...
const openNotification = (n) => {
  if (n.status === "SENT") {
    markAsRead(n.notificationId);
    setNotifications((prev) =>
      prev.map((x) =>
        x.notificationId === n.notificationId ? { ...x, status: "READ" } : x
      )
    );
  }
  setSelected(n);
  setScreen("detail");
};

  if (screen === "list") {
    return (
      <div className="w-full min-h-screen bg-[#f8fafc] p-8 animate-in fade-in duration-500">
        {/* Back Button */}
        <button 
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[#135E4B] hover:border-[#4CB572] transition-all mb-6 group"
          onClick={onBack}
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Dashboard
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Notifications</h2>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">
              Updates on your applications and profile
            </p>
          </div>
          <div className="text-right px-6 border-l border-slate-100">
            <p className="text-3xl font-black text-[#4CB572]">
              {notifications.filter(n => n.status === "SENT").length}
            </p>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Unread</p>
          </div>
        </div>

        {/* List Container */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100">
          <div className="space-y-4">
            {notifications.map((n) => (
              <article
                key={n.notificationId}
                className={`group flex items-center gap-6 p-6 rounded-3xl cursor-pointer border transition-all duration-300 ${
                  n.status === "SENT" 
                    ? "bg-emerald-50/50 border-emerald-100 border-l-4 border-l-[#4CB572]" 
                    : "bg-white border-transparent hover:bg-slate-50"
                }`}
                onClick={() => openNotification(n)}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                  n.status === "SENT" ? "bg-white text-[#4CB572]" : "bg-slate-100 text-slate-400"
                }`}>
                  {n.status === "SENT" ? <Bell size={22} /> : <MailOpen size={22} />}
                </div>
                
                <div className="flex-grow">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#4CB572]">
                    {n.category}
                  </span>
                  <p className="text-sm font-bold text-slate-700 leading-snug mt-1">
                    {n.message.substring(0, 90)}...
                  </p>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mt-2">
                    {new Date(n.createdDate).toLocaleDateString()} • {new Date(n.createdDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">
                  <ChevronRight size={20} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "detail" && selected) {
    return (
      <div className="w-full min-h-screen bg-[#f8fafc] p-8 animate-in slide-in-from-bottom-4 duration-500">
        <button 
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[#135E4B] transition-all mb-8"
          onClick={() => setScreen("list")}
        >
          <ArrowLeft size={14} /> Back to List
        </button>

        <div className="max-w-3xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-[#135E4B] p-10 text-white">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Message Details</span>
            <h1 className="text-3xl font-black mt-2 tracking-tight">{selected.category}</h1>
          </div>
          
          <div className="p-12">
            <p className="text-lg font-bold text-slate-700 leading-relaxed italic">
              "{selected.message}"
            </p>

            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-400">
                <Calendar size={18} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Received {new Date(selected.createdDate).toLocaleString()}
                </span>
              </div>
              <span className="px-4 py-2 rounded-full bg-emerald-50 text-[#4CB572] text-[10px] font-black uppercase tracking-widest">
                Status: Read
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}