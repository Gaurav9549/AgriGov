import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL, getAuthHeaders } from '../config';

const Profile = ({ onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(true); 
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    address: "",
    landDetails: ""
  });

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode(token);
      const userId = decoded.uid;
      const farmerId = Number(decoded.uid);

      const userRes = await axios.get(`${API_BASE_URL}auth/users/${userId}`, {
        headers: getAuthHeaders()
      });

      try {
        const farmerRes = await axios.get(`${API_BASE_URL}farmers/fetch/${farmerId}`, {
          headers: getAuthHeaders()
        });
        
        if (farmerRes.data) {
          setIsNewUser(false); 
          setProfileData({
            ...userRes.data,
            ...farmerRes.data 
          });
        }
      } catch (err) {
        setIsNewUser(true);
        setProfileData(prev => ({
          ...prev,
          name: userRes.data.name,
          email: userRes.data.email,
          phoneNumber: userRes.data.phoneNumber
        }));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // This function ONLY triggers when "Save Changes" is clicked
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const farmerId = Number(decoded.uid);

      const payload = {
        ...profileData,
        id: farmerId,
        userId: decoded.uid
      };

      if (isNewUser) {
        await axios.post(`${API_BASE_URL}farmers/register`, payload, {
          headers: getAuthHeaders()
        });
        setIsNewUser(false); 
      } else {
        // PATCH/PUT only happens here
        await axios.patch(`${API_BASE_URL}farmers/update/${farmerId}`, payload, {
          headers: getAuthHeaders()
        });
      }
      
      setIsEditing(false);
      alert("Profile updated successfully! ✅");
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to enter edit mode without triggering any form logic
  const enterEditMode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  return (
    <div className="w-80 md:w-96 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="p-6 text-center relative" style={{ backgroundColor: colors.deepEmerald }}>
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          ✕
        </button>
        <div className="w-16 h-16 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-2xl mb-3 border border-white/20 shadow-inner">
          👨‍🌾
        </div>
        <h3 className="text-white font-black text-lg tracking-tight">
          {profileData.name || "Farmer Profile"}
        </h3>
        <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">
          Verified Farmer Profile
        </p>
      </div>

      <div className="p-8 max-h-[60vh] overflow-y-auto">
        <form onSubmit={handleSave}>
          
          <div className="space-y-4 mb-6 opacity-70">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email</label>
              <p className="p-3 rounded-xl bg-slate-100 text-sm font-bold text-slate-500 border border-slate-200">
                {profileData.email || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Phone</label>
              <p className="p-3 rounded-xl bg-slate-100 text-sm font-bold text-slate-500 border border-slate-200">
                {profileData.phoneNumber || "N/A"}
              </p>
            </div>
          </div>

          <hr className="mb-6 border-slate-100" />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">DOB</label>
                {isEditing ? (
                  <input 
                    type="date" name="dob" value={profileData.dob} onChange={handleInputChange}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                ) : (
                  <p className="p-3 rounded-xl bg-white border border-transparent text-sm font-bold text-slate-800 shadow-sm italic">
                    {profileData.dob || "Not set"}
                  </p>
                )}
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Gender</label>
                {isEditing ? (
                  <select 
                    name="gender" value={profileData.gender} onChange={handleInputChange}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="p-3 rounded-xl bg-white border border-transparent text-sm font-bold text-slate-800 shadow-sm italic">
                    {profileData.gender || "Not set"}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Residential Address</label>
              {isEditing ? (
                <input 
                  type="text" name="address" value={profileData.address} onChange={handleInputChange}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              ) : (
                <p className="p-3 rounded-xl bg-white border border-transparent text-sm font-bold text-slate-800 shadow-sm italic">
                  {profileData.address || "Not set"}
                </p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Land & Crop Details</label>
              {isEditing ? (
                <textarea 
                  name="landDetails" value={profileData.landDetails} onChange={handleInputChange}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-100 min-h-[80px] transition-all"
                />
              ) : (
                <p className="p-3 rounded-xl bg-white border border-transparent text-sm font-bold text-slate-800 shadow-sm italic">
                  {profileData.landDetails || "Not set"}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            {isEditing ? (
              <>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 py-3 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all" 
                  style={{ backgroundColor: colors.vibrantGreen }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-400 font-black text-[10px] uppercase hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                type="button" // This is the crucial fix
                onClick={enterEditMode} 
                className="w-full py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-50 active:scale-95" 
                style={{ borderColor: colors.vibrantGreen, color: colors.vibrantGreen }}
              >
                Edit Farmer Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;