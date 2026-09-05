import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/adminlogin";
import AdminDashboard from "./pages/admin-dashboard";
import LostItems from "./pages/lostItems";
import Claims from "./pages/claims-page"; // Claims page import kiya

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/lost-items" element={<LostItems />} />
        <Route path="/admin/claims" element={<Claims />} /> {/* Claims route add ho gaya */}
      </Routes>
    </Router>
  );
}

export default App;