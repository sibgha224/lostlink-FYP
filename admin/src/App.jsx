import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/adminlogin";
import AdminDashboard from "./pages/admin-dashboard";
import Claims from "./pages/claims-page";
import RequestsPage from "./pages/requests-page";
import SupportPage from "./pages/support-page";
import UsersPage from "./pages/user-page";
import MessagesPage from "./pages/messages-page";
import NotificationsPage from "./pages/Notification-page";
import SettingsPage from "./pages/settings-page";
import { getAdminUser } from "./adminApi";

const RequireAdmin = ({ children }) => {
  const admin = getAdminUser();
  const token = localStorage.getItem("adminToken");
  if (!admin || !token || admin.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/claims" element={<RequireAdmin><Claims /></RequireAdmin>} />
        <Route path="/admin/requests" element={<RequireAdmin><RequestsPage /></RequireAdmin>} />
        <Route path="/admin/support" element={<RequireAdmin><SupportPage /></RequireAdmin>} />
        <Route path="/admin/users" element={<RequireAdmin><UsersPage /></RequireAdmin>} />
        <Route path="/admin/messages" element={<RequireAdmin><MessagesPage /></RequireAdmin>} />
        <Route path="/admin/notifications" element={<RequireAdmin><NotificationsPage /></RequireAdmin>} />
        <Route path="/admin/settings" element={<RequireAdmin><SettingsPage /></RequireAdmin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;