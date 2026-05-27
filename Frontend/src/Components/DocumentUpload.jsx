import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL, getAuthHeaders } from "../config";

const DocumentUpload = ({ scheme, onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    docType: "",
    file: null,
  });

  const [farmerId, setFarmerId] = useState("");
  const [uploading, setUploading] = useState(false);

  const colors = {
    deepEmerald: "#135E4B",
    vibrantGreen: "#4CB572",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.uid; 
        if (id) {
          setFarmerId(id.toString());
        }
      } catch (e) {
        console.error("❌ Token decoding failed:", e);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!farmerId) {
      alert("Error: Farmer ID not found in session. Please log in again.");
      return;
    }
    if (!formData.file || !formData.docType) {
      alert("Please select a document type and a file to upload.");
      return;
    }

    setUploading(true);

    // 1. Prepare Multipart Data for Document Upload
    const uploadData = new FormData();
    uploadData.append("farmerId", farmerId);
    uploadData.append("docType", formData.docType);
    uploadData.append("file", formData.file); 
    uploadData.append("schemeId", scheme.schemeID);

    try {
      // ✅ Step 1: Call the documents/upload API
      await axios.post(`${API_BASE_URL}documents/upload`, uploadData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Step 2: Call the Application Creation API
      // Constructing the local date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      const applicationData = {
        farmerID: parseInt(farmerId),
        schemeID: scheme.schemeID,
        submittedDate: today,
        status: "ACTIVE"
      };

      // Assuming your applications endpoint follows the structure below
      await axios.post(`${API_BASE_URL}application/save`, applicationData, {
        headers: getAuthHeaders()
      });
      
      alert("Document uploaded and application submitted successfully! ✅");
      onSuccess();
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.response?.data?.message || "Failed to process application.");
    } finally {
      setUploading(false);
    }
  };

  const inputStyle = "w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-100 transition-all appearance-none";

  return (
    <div className="p-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-10 text-center">
        <button onClick={onBack} className="text-xs font-black uppercase tracking-widest text-emerald-700 hover:opacity-50 mb-4 transition-all">
          ← Back to Schemes
        </button>
        <h2 className="text-3xl font-black tracking-tight text-[#135E4B]">Identity Verification</h2>
        <p className="text-sm text-slate-500 mt-2">
          Applying for: <span className="font-bold text-emerald-600">{scheme.title}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
        
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Verified User ID (UID)</label>
          <input 
            type="text" 
            className={`${inputStyle} bg-slate-100 text-slate-400 font-mono`} 
            value={farmerId || "Detecting UID..."} 
            readOnly 
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Document Type</label>
          <div className="relative">
            <select 
              className={inputStyle}
              value={formData.docType}
              onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
              required
            >
              <option value="">-- Choose Category --</option>
              <option value="AADHAR">AADHAAR CARD</option>
              <option value="LAND_RECORD">LAND RECORD</option>
              <option value="PAN_CARD">PAN CARD</option>
              <option value="VOTER_ID">VOTER ID</option>
            </select>
            <div className="absolute right-4 top-5 pointer-events-none opacity-40">▼</div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Attachment</label>
          <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 bg-slate-50 text-center group hover:border-emerald-400 transition-all">
            <input 
              type="file" 
              className="hidden" 
              id="fileInput" 
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <div className="text-4xl mb-3">📁</div>
              <p className="text-sm font-bold text-slate-700">
                {formData.file ? formData.file.name : "Select document from computer"}
              </p>
              <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest">
                PDF, JPG, PNG (Max 5MB)
              </p>
            </label>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <button
            type="submit"
            disabled={uploading || !farmerId}
            className="w-full py-5 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
            style={{ backgroundColor: colors.vibrantGreen }}
          >
            {uploading ? "Processing..." : "Submit Application"}
          </button>
          <button 
            type="button" 
            onClick={onBack} 
            className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload;