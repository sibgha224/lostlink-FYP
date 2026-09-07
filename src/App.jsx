import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/adminlogin";
import AdminDashboard from "./pages/admin-dashboard";
import LostItems from "./pages/lostItems";
import Claims from "./pages/claims-page";
import UsersPage from "./pages/user-page"; 
import MessagesPage from "./pages/messages-page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/lost-items" element={<LostItems />} />
        <Route path="/admin/claims" element={<Claims />} />
        <Route path="/admin/users" element={<UsersPage />} /> 
        <Route path="/admin/messages" element={<MessagesPage />} />
      </Routes>
    </Router>
  );
}

export default App;