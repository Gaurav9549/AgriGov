import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  CheckCircle,
  XCircle,
  ClipboardList,
  X,
} from "lucide-react";
import { API_BASE_URL, getAuthHeaders } from "../config";

const ApplicationsComponent = ({ onApproveRedirect }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDocModal, setShowDocModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(null);

  const colors = {
    deepEmerald: "#135E4B",
    vibrantGreen: "#4CB572",
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}application/all`, {
        headers: getAuthHeaders(),
      });
      setApplications(response.data);
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = async (farmerID) => {
    if (!farmerID) {
      alert("Farmer ID is missing.");
      return;
    }
    try {
      const fileInfoResponse = await axios.get(
        `http://localhost:9091/documents/farmer/${farmerID}`,
        { headers: getAuthHeaders() }
      );

      const fileName = fileInfoResponse.data[0]?.fileUri;
      if (!fileName) {
        alert("No document record found.");
        return;
      }

      const fileResponse = await axios.get(
        `http://localhost:9091/documents/files/${fileName}`,
        {
          headers: getAuthHeaders(),
          responseType: "blob",
        }
      );

      const file = new Blob([fileResponse.data], {
        type: fileResponse.headers["content-type"],
      });
      const fileURL = URL.createObjectURL(file);
      setDocumentUrl(fileURL);
      setShowDocModal(true);
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Failed to retrieve document.");
    }
  };

  const handleReject = async (appId) => {
    if (window.confirm("Are you sure you want to reject and delete this application?")) {
      try {
        await axios.delete(`${API_BASE_URL}application/${appId}`, {
          headers: getAuthHeaders(),
        });
        setApplications((prev) => prev.filter((app) => app.applicationID !== appId));
      } catch (error) {
        console.error("❌ Error deleting application:", error);
      }
    }
  };

  const handleApprove = (app) => {
    onApproveRedirect("CreateSubsidy", {
      farmerId: app.farmerID,
      schemeId: app.schemeID,
      applicationId: app.applicationID,
    });
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-400">Loading...</div>;

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600"><ClipboardList size={32} /></div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Pending Approvals</h3>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Review farmer requests</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: colors.deepEmerald }} className="text-white">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">App ID</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Farmer ID</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Scheme ID</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {applications.map((app) => (
              <tr key={app.applicationID} className="hover:bg-slate-50 transition-colors">
                <td className="p-6 font-black text-slate-800">#{app.applicationID}</td>
                <td className="p-6 text-sm font-bold text-slate-500">{app.farmerID}</td>
                <td className="p-6 text-sm font-bold text-slate-500">{app.schemeID}</td>
                <td className="p-6 flex justify-center gap-3">
                  <button onClick={() => handleViewDocument(app.farmerID)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-black text-[10px] uppercase tracking-widest"><FileText size={14} /> View Doc</button>
                  <button onClick={() => handleApprove(app)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all"><CheckCircle size={14} /> Approve</button>
                  <button onClick={() => handleReject(app.applicationID)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all"><XCircle size={14} /> Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDocModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl h-[80vh] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Document Preview</h4>
              <button onClick={() => setShowDocModal(false)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex-1 bg-slate-200">
              <iframe src={documentUrl} className="w-full h-full border-none" title="Doc Preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsComponent;