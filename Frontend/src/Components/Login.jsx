import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, API_ENDPOINTS, saveTokens } from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Palette colors
  const colors = {
    deepEmerald: "#135E4B",
    vibrantGreen: "#4CB572",
    cloudGrey: "#CCDCDB",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const loginPayload = {
      usernameOrEmail: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`,
        loginPayload,
        { headers: { "Content-Type": "application/json" } },
      );

      // 1. Debug: See exactly what the backend sent
      console.log("Full Response Data:", response.data);

      // 2. Extract token safely (check if it's in .token or .accessToken or the root)
      const token =
        response.data.token ||
        response.data.accessToken ||
        (typeof response.data === "string" ? response.data : null);

      if (!token) {
        throw new Error("Token not found in server response");
      }

      // 3. Store and Decode
      const refreshToken =
        response.data.refreshToken ||
        response.data.refresh_token ||
        response.data.refresh;
      saveTokens({ token, refreshToken });

      try {
        const base64Url = token.split(".")[1]; // This is where the error was happening
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(window.atob(base64));

        console.log("Decoded Role:", decoded.role);

        if (decoded.role === "FARMER") {
          navigate("/farmerdashboard");
        } else if (decoded.role === "COMPLAINCEOFFICER") {
          navigate("/complianceofficer");
        } else if (decoded.role === "AUDITOR") {
          navigate("/governmentauditor");
        } else if (decoded.role === "ADMIN") {
          navigate("/admindashboard");
        } else if (decoded.role === "RURALOFFICER") {
          navigate("/ruralofficerdashboard");
        } 
        else if(decoded.role === "MANAGER") {
          navigate("/programmanager");
        }
        else {
          navigate("/dashboard");
        }
      } catch (decodeError) {
        console.error("JWT Decode failed:", decodeError);
        setError("Technical error: Invalid token format received.");
      }
    } catch (err) {
      console.error("Login Failed:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Invalid Credentials or Server Error",
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: colors.cloudGrey }}
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white">
        {/* Branding Header */}
        <div
          className="p-8 text-center text-white"
          style={{ backgroundColor: colors.deepEmerald }}
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <span className="text-2xl font-bold">AG</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">AgriGov Portal</h2>
          <p className="text-sm opacity-70">Secure Farmer & Officer Login</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 transition-all"
              style={{ focusRingColor: colors.vibrantGreen }}
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 transition-all"
              style={{ focusRingColor: colors.vibrantGreen }}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl text-white font-bold shadow-lg hover:brightness-110 transition-all transform active:scale-95"
            style={{ backgroundColor: colors.vibrantGreen }}
          >
            Sign In to Dashboard
          </button>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
            >
              Forgot your password?
            </Link>
          </div>
        </form>

        {/* ... existing form code above ... */}

        <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold cursor-pointer hover:underline transition-all"
              style={{ color: colors.deepEmerald }}
            >
              Register here
            </Link>
          </p>
        </div>

        {/* ... rest of the component ... */}
      </div>
    </div>
  );
};

export default Login;
