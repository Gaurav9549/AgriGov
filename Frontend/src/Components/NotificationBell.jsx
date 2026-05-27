import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ Ensure you use named import
import Notification from "./Notification";
import { Bell } from 'lucide-react';
import { fetchNotifications } from "../config"; 

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [userId, setUserId] = useState(null);

  // Function to extract UID from token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        return decoded.uid; // ✅ Extracting the uid
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
    return null;
  };

  const checkUnread = (uid) => {
    if (!uid) return;
    fetchNotifications(uid)
      .then((res) => {
        const unreadExists = res.data.some(n => n.status === "SENT");
        setHasUnread(unreadExists);
      })
      .catch(console.error);
  };

  useEffect(() => {
    const uid = getUserIdFromToken();
    setUserId(uid);
    checkUnread(uid);
  }, []);

  return open ? (
    <div className="fixed inset-0 z-[9999] bg-white">
      <Notification 
        farmerId={userId} 
        onBack={() => {
          setOpen(false);
          checkUnread(userId); 
        }} 
      />
    </div>
  ) : (
    <button 
      className="relative w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#135E4B] hover:border-[#4CB572] hover:shadow-lg hover:shadow-emerald-100 transition-all active:scale-90" 
      onClick={() => setOpen(true)}
    >
      <Bell size={24} />
      {hasUnread && (
        <span className="absolute top-3.5 right-3.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
      )}
    </button>
  );
}