import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../config';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'FARMER' // Fixed role as per requirement
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    cloudGrey: '#CCDCDB',
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Ensure API_ENDPOINTS.REGISTER is defined in your config.js
      // e.g., REGISTER: 'auth/register'
      await axios.post(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, formData);
      
      // On success, redirect to login
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: colors.cloudGrey }}>
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-white">
        
        {/* Branding Header */}
        <div className="p-8 text-center text-white" style={{ backgroundColor: colors.deepEmerald }}>
          <h2 className="text-3xl font-bold tracking-tight">Join AgriGov</h2>
          <p className="text-sm opacity-70 mt-2">Create your farmer account to access grants and resources</p>
        </div>

        <form onSubmit={handleRegister} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {error && (
            <div className="col-span-full bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 text-center font-medium">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="col-span-full">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 transition-all"
              style={{ focusRingColor: colors.vibrantGreen }}
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 transition-all"
              style={{ focusRingColor: colors.vibrantGreen }}
              placeholder="farmer@example.com"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Phone Number</label>
            <input 
              type="tel" 
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 transition-all"
              style={{ focusRingColor: colors.vibrantGreen }}
              placeholder="9876543210"
            />
          </div>

          {/* Password */}
          <div className="col-span-full">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 transition-all"
              style={{ focusRingColor: colors.vibrantGreen }}
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-full pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-bold shadow-lg hover:brightness-110 transition-all transform active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: colors.vibrantGreen }}
            >
              {loading ? 'Creating Account...' : 'Register as Farmer'}
            </button>
          </div>
        </form>

        <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Already have an account? <span onClick={() => navigate('/login')} className="font-bold cursor-pointer hover:underline" style={{ color: colors.deepEmerald }}>Login here</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;