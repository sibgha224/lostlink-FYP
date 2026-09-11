import { useState, useEffect } from "react";
import { adminFetch } from "../adminApi";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch('/admin/users');
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleStatus = async (user) => {
    setBusyId(user._id);
    try {
      await adminFetch(`/admin/users/${user._id}/block`, { method: 'PUT' });
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const removeUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}'s account permanently?`)) return;
    setBusyId(user._id);
    try {
      await adminFetch(`/admin/users/${user._id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u._id !== user._id));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8d0d0",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 2px 12px rgba(74,0,16,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Fraunces',serif",
              fontSize: 20,
              color: "#2e1a1a",
              margin: 0,
            }}
          >
            User Management
          </h2>
          <p style={{ fontSize: 12, color: "#c07080", marginTop: 2 }}>
            {loading ? 'Loading...' : `${users.length} registered students`}
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by name, roll no, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #e8d0d0",
            fontSize: 13,
            outline: "none",
            width: "260px",
          }}
        />
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", fontSize: 13, fontWeight: 600, padding: "10px 14px", borderRadius: 12, marginBottom: 14 }}>{error}</div>
      )}

      {loading ? (
        <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>No users found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fdf6f7", borderBottom: "1px solid #f0e0e0" }}>
                {["Name", "Roll No", "Department", "Session / Shift", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 14px",
                        textAlign: "left",
                        fontSize: 11,
                        color: "#c07080",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} style={{ borderBottom: "1px solid #fdf0f0" }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontWeight: 600, color: "#2e1a1a", fontSize: 13 }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: "#c07080" }}>{user.email}</div>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: "#2e1a1a" }}>
                    {user.rollNo}
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: "#6b4848" }}>
                    {user.department}
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: "#6b4848" }}>
                    {user.session} · {user.shift}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 100,
                        fontSize: 11,
                        fontWeight: 700,
                        background: user.isBlocked ? "#fef2f2" : "#f0fdf4",
                        color: user.isBlocked ? "#dc2626" : "#16a34a",
                      }}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        disabled={busyId === user._id}
                        onClick={() => toggleStatus(user)}
                        style={{
                          background: user.isBlocked ? "#f0fdf4" : "#fef2f2",
                          border: user.isBlocked ? "1px solid #bbf7d0" : "1px solid #fecaca",
                          color: user.isBlocked ? "#16a34a" : "#dc2626",
                          borderRadius: 6,
                          padding: "4px 10px",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        disabled={busyId === user._id}
                        onClick={() => removeUser(user)}
                        style={{
                          background: "#fff",
                          border: "1px solid #e8d0d0",
                          color: "#6b4848",
                          borderRadius: 6,
                          padding: "4px 10px",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
