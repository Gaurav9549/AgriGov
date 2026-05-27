import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SchemeApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    softMint: '#A1D8B5',
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:9091/application/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store token here
          }
        });
        setApplications(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch applications. Please try again later.');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse text-emerald-800">Loading Applications...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Scheme Applications</h2>
        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
          Total: {applications.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="py-4 px-4 font-semibold text-slate-600">App ID</th>
              <th className="py-4 px-4 font-semibold text-slate-600">Farmer ID</th>
              <th className="py-4 px-4 font-semibold text-slate-600">Scheme ID</th>
              <th className="py-4 px-4 font-semibold text-slate-600">Submitted Date</th>
              <th className="py-4 px-4 font-semibold text-slate-600">Status</th>
              <th className="py-4 px-4 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.applicationID} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                <td className="py-4 px-4 font-medium text-slate-700">#{app.applicationID}</td>
                <td className="py-4 px-4 text-slate-600">Farmer-{app.farmerID}</td>
                <td className="py-4 px-4 text-slate-600">Scheme-{app.schemeID}</td>
                <td className="py-4 px-4 text-slate-600">
                   {new Date(app.submittedDate).toLocaleDateString('en-IN', {
                     day: '2-digit', month: 'short', year: 'numeric'
                   })}
                </td>
                <td className="py-4 px-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{ 
                      backgroundColor: app.status === 'ACTIVE' ? colors.softMint : '#fed7aa',
                      color: app.status === 'ACTIVE' ? colors.deepEmerald : '#9a3412'
                    }}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button 
                    className="text-sm font-semibold hover:underline"
                    style={{ color: colors.vibrantGreen }}
                    onClick={() => console.log('Viewing ID:', app.applicationID)}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchemeApplications;