import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'FARMER', // Default role
    newPassword: ''
  });
  
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });
  const navigate = useNavigate();

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    cloudGrey: '#CCDCDB',
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      // Endpoint should match your backend security reset controller
      const response = await axios.post(`${API_BASE_URL}auth/forgot-password`, formData);

      if (response.status === 200) {
        setStatus({ loading: false, success: true, error: '' });
        // Optional: Redirect to login after a few seconds
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Verification failed. Please check your details.'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: colors.cloudGrey }}>
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-white">
        
        {/* Header */}
        <div className="p-8 text-center text-white" style={{ backgroundColor: colors.deepEmerald }}>
          <h2 className="text-3xl font-bold tracking-tight">Security Reset</h2>
          <p className="text-sm opacity-70 mt-2">Verify your identity to update your password</p>
        </div>

        {status.success ? (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Password Changed Successfully!</h3>
            <p className="text-slate-500">You will be redirected to the login page shortly.</p>
            <Link to="/login" className="inline-block font-bold" style={{ color: colors.vibrantGreen }}>
              Click here to login now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            {status.error && (
              <div className="col-span-full bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 text-center font-medium">
                {status.error}
              </div>
            )}

            {/* Name */}
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
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email</label>
              <input 
                type="email" 
                name="email" 
                required 
                value={formData.email} 
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                style={{ focusRingColor: colors.vibrantGreen }}
              />
            </div>

            {/* Phone */}
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
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Account Role</label>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 appearance-none"
                style={{ focusRingColor: colors.vibrantGreen }}
              >
                <option value="FARMER">FARMER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="COMPLAINCEOFFICER">COMPLIANCE OFFICER</option>
                <option value="AUDITOR">AUDITOR</option>
                <option value="RURALOFFICER">RURAL OFFICER</option>
              </select>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">New Password</label>
              <input 
                type="password" 
                name="newPassword" 
                required 
                value={formData.newPassword} 
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 transition-all"
                style={{ focusRingColor: colors.vibrantGreen }}
                placeholder="Min 8 characters"
              />
            </div>

            {/* Submit */}
            <div className="col-span-full pt-4">
              <button 
                type="submit" 
                disabled={status.loading}
                className="w-full py-4 rounded-xl text-white font-bold shadow-lg hover:brightness-110 transition-all transform active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: colors.vibrantGreen }}
              >
                {status.loading ? 'Verifying Identity...' : 'Reset Password'}
              </button>
            </div>

            <div className="col-span-full text-center mt-2">
              <Link to="/login" className="text-sm opacity-60 hover:opacity-100 font-medium">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;