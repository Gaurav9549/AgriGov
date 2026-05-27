import React, { useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../config";

export const AddResourceForm = ({ projectId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    type: "",
    quantity: "",
    status: "",
  });

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const colors = {
    deepEmerald: '#135E4B',
    vibrantGreen: '#4CB572',
    softMint: '#A1D8B5',
    cloudGrey: '#CCDCDB',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const errors = useMemo(() => {
    const e = {};
    if (!formData.type) e.type = "Resource type is required";
    if (!formData.quantity || Number(formData.quantity) < 0)
      e.quantity = "Quantity must be zero or greater";
    if (!formData.status) e.status = "Status is required";
    return e;
  }, [formData]);

  const isFormValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);

    const payload = {
      projectId,
      type: formData.type,
      quantity: parseFloat(formData.quantity),
      status: formData.status,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}api/resources/save`,
        payload,
        { headers: getAuthHeaders() }
      );

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("❌ Failed to save resource:", error);
      alert("Failed to save resource. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => `
    w-full p-4 rounded-2xl bg-slate-50 border transition-all outline-none
    ${touched[name] && errors[name] ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100'}
    focus:ring-4 appearance-none
  `;

  return (
    <div className="p-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black tracking-tight" style={{ color: colors.deepEmerald }}>
          Allocate Resources
        </h2>
        <p className="text-slate-500 mt-2">Project ID: <span className="font-mono font-bold text-emerald-600">#{projectId}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        
        {/* Resource Type */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Resource Type</label>
          <div className="relative">
            <select
              name="type"
              className={inputStyle("type")}
              value={formData.type}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">-- Select Category --</option>
              <option value="Funds">FUNDS</option>
              <option value="Materials">MATERIALS</option>
            </select>
            <div className="absolute right-4 top-5 pointer-events-none opacity-40">▼</div>
          </div>
          {touched.type && errors.type && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold uppercase">{errors.type}</p>}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Quantity / Amount</label>
          <input
            type="number"
            name="quantity"
            className={inputStyle("quantity")}
            min="0"
            step="0.01"
            value={formData.quantity}
            placeholder="0.00"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.quantity && errors.quantity && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold uppercase">{errors.quantity}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Allocation Status</label>
          <div className="relative">
            <select
              name="status"
              className={inputStyle("status")}
              value={formData.status}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">-- Select Status --</option>
              <option value="PLANNED">PLANNED</option>
              <option value="ALLOCATED">ALLOCATED</option>
              <option value="UTILIZED">UTILIZED</option>
              <option value="ON_HOLD">ON_HOLD</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <div className="absolute right-4 top-5 pointer-events-none opacity-40">▼</div>
          </div>
          {touched.status && errors.status && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold uppercase">{errors.status}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: colors.vibrantGreen }}
          >
            {loading ? "Processing..." : "Confirm Allocation"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-4 rounded-2xl font-black uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};