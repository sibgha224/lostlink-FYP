import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/adminlogin";
import AdminDashboard from "./pages/admin-dashboard";
import LostItems from "./pages/lostItems";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/lost-items" element={<LostItems />} />
      </Routes>
    </Router>
  );
}

export default App;