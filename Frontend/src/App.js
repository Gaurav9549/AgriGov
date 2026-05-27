import { Router , Routes , Route} from "react-router-dom";
import Home from "./Components/Home";
import AboutUs from "./Components/AboutUs";
import Programs from "./Components/Programs";
import Login from "./Components/Login";
import FarmerDashboard from "./Components/FarmerDashboard";
import ComplianceOfficer from "./Components/ComplianceOfficer";
import GovernmentAuditor from "./Components/GovernmentAuditor";
import RuralOfficerDashboard from "./Components/RuralOfficerDashboard";
import AdminDashboard from "./Components/AdminDashboard";
import ForgotPassword from "./Components/ForgotPassword";
import Register from "./Components/Register";
import ProgramManagerDashboard from "./Components/ProgramManagerDashboard";
export default function App() {
  return (
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/farmerdashboard" element={<FarmerDashboard />} />
        <Route path="/complianceofficer" element={<ComplianceOfficer />} />
        <Route path="/governmentauditor" element={<GovernmentAuditor />} />
        <Route path="/programmanager" element={<ProgramManagerDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/ruralofficerdashboard" element={<RuralOfficerDashboard />} />
      </Routes>
  )
}