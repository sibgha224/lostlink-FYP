import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/adminlogin";
import AdminDashboard from "./pages/admin-dashboard";
import LostItems from "./pages/lostItems";
import Claims from "./pages/claims-page";
import UsersPage from "./pages/user-page"; 
import MessagesPage from "./pages/messages-page";
import NotificationsPage from "./pages/Notification-page";
import SettingsPage from "./pages/settings-page";

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
        <Route path="/admin/notifications" element={<NotificationsPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />

      </Routes>
    </Router>
  );
}

export default App;