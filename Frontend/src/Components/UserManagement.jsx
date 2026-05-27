import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, getAuthHeaders } from '../config';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);

  const colors = { 
    deepEmerald: '#135E4B', 
    vibrantGreen: '#4CB572',
    dangerRed: '#EF4444' 
  };

  const fetchUsers = async (id = '') => {
    setLoading(true);
    try {
      const endpoint = id ? `${API_BASE_URL}auth/users/${id}` : `${API_BASE_URL}auth/users`;
      const res = await axios.get(endpoint, { headers: getAuthHeaders() });
      setUsers(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}auth/users/${userId}/status`, 
        { status: newStatus }, 
        { headers: getAuthHeaders() }
      );
      fetchUsers(searchId);
    } catch (err) { alert("Failed to update status"); }
  };

  // --- NEW DELETE LOGIC ---
  const handleDeleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete user: ${userName}? This action cannot be undone.`);
    
    if (confirmDelete) {
      try {
        await axios.delete(`${API_BASE_URL}auth/users/${userId}`, {
          headers: getAuthHeaders()
        });
        // Refresh the list after successful deletion
        fetchUsers(searchId);
      } catch (err) {
        console.error("Delete failed", err);
        alert(err.response?.data?.message || "Failed to delete user. Please check permissions.");
      }
    }
  };

  return (
    <div className="p-8">
      {/* Search Bar */}
      <div className="flex mb-8">
        <input 
          type="text"
          placeholder="Search by User ID..."
          className="flex-1 p-4 rounded-l-2xl bg-slate-50 border border-slate-200 focus:outline-none"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button 
          onClick={() => fetchUsers(searchId)}
          className="px-8 rounded-r-2xl text-white font-bold transition-all hover:brightness-110"
          style={{ backgroundColor: colors.deepEmerald }}
        >
          Search
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase text-slate-400 font-bold border-b border-slate-100">
              <th className="p-4">User Details</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-400 font-mono">ID: {user.id} | {user.email}</div>
                </td>
                <td className="p-4 text-sm font-medium">{user.role}</td>
                <td className="p-4">
                  <select 
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                    className={`text-xs font-bold p-2 rounded-lg border-none focus:ring-0 cursor-pointer ${
                      user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  {/* DELETE BUTTON */}
                  <button 
                    onClick={() => handleDeleteUser(user.id, user.name)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete User"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-20 text-slate-400 italic">No users found match the search criteria.</div>
      )}
    </div>
  );
};

export default UserManagement;