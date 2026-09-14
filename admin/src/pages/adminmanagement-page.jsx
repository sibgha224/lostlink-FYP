import { useState, useEffect } from "react";
import { adminFetch, getAdminUser } from "../adminApi";

const initials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function AdminManagementPage() {
  const currentAdmin = getAdminUser();

  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState({ total: 0, adminCount: 0, coAdminCount: 0, activeCount: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "co-admin" });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const showSaved = (msg) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(""), 2200);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3500);
  };

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const data = await adminFetch('/admin/admins');
      setAdmins(data.admins || []);
      setStats({
        total: data.total || 0,
        adminCount: data.adminCount || 0,
        coAdminCount: data.coAdminCount || 0,
        activeCount: data.activeCount || 0
      });
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const filteredAdmins = admins.filter((a) => {
    const matchesRole = roleFilter === "all" || a.role === roleFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const openModal = () => {
    setForm({ name: "", email: "", password: "", role: "co-admin" });
    setFormError("");
    setModalOpen(true);
  };

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitNewAdmin = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setFormError("Please fill all fields");
      return;
    }
    setCreating(true);
    setFormError("");
    try {
      await adminFetch('/admin/admins', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setModalOpen(false);
      showSaved("Admin added successfully");
      loadAdmins();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await adminFetch(`/admin/admins/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role })
      });
      showSaved("Role updated");
      loadAdmins();
    } catch (err) {
      showError(err.message);
    }
  };

  const toggleLogin = async (id) => {
    try {
      await adminFetch(`/admin/admins/${id}/login`, { method: 'PUT' });
      loadAdmins();
    } catch (err) {
      showError(err.message);
    }
  };

  const removeAdmin = async (id, name) => {
    if (!window.confirm(`Remove ${name} from admins?`)) return;
    try {
      await adminFetch(`/admin/admins/${id}`, { method: 'DELETE' });
      showSaved("Admin removed");
      loadAdmins();
    } catch (err) {
      showError(err.message);
    }
  };

  /* ---------------- Shared styles ---------------- */
  const cardStyle = {
    background: "#fff",
    border: "1px solid #e8d0d0",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 2px 12px rgba(74,0,16,0.05)",
  };
  const statCard = { ...cardStyle, padding: 18, display: "flex", alignItems: "center", gap: 12 };
  const statIcon = {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    flexShrink: 0,
  };
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #e8d0d0",
    borderRadius: 10,
    outline: "none",
    fontSize: 13,
    color: "#2e1a1a",
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box",
  };
  const primaryBtn = {
    padding: "10px 20px",
    background: "linear-gradient(135deg,#800020,#4a0010)",
    border: "none",
    borderRadius: 10,
    color: "#fde8ec",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };
  const sectionTitle = {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    fontWeight: 700,
    color: "#2e1a1a",
    margin: "0 0 4px",
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#2e1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .am-input:focus{border-color:#800020!important;box-shadow:0 0 0 3px rgba(128,0,32,0.08);}
        .am-toggle{position:relative;width:42px;height:24px;border-radius:100px;cursor:pointer;transition:background .2s;flex-shrink:0;}
        .am-toggle-on{background:linear-gradient(135deg,#800020,#4a0010);}
        .am-toggle-off{background:#e8d0d0;}
        .am-toggle-knob{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);}
        .am-role-select{border:1.5px solid #e8d0d0;border-radius:100px;padding:6px 12px;font-size:12px;font-weight:700;color:#800020;background:#fdf6f7;outline:none;cursor:pointer;font-family:'DM Sans',sans-serif;}
        .am-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#800020,#4a0010);color:#fde8ec;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;}
        .am-row:hover{background:#fdf6f7;}
        .am-modal-overlay{position:fixed;inset:0;background:rgba(46,26,26,0.45);display:flex;align-items:center;justify-content:center;z-index:1000;}
        .am-icon-btn{background:none;border:none;cursor:pointer;color:#c07080;font-size:15px;padding:4px;}
        .am-icon-btn:hover{color:#800020;}
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 800, color: "#2e1a1a", margin: 0 }}>
            Admin Management
          </h1>
          <p style={{ color: "#c07080", fontSize: 13, marginTop: 4 }}>
            Add, disable, or change roles for admins and co-admins
          </p>
        </div>
        <button style={primaryBtn} onClick={openModal}>+ Add New Admin</button>
      </div>

      {savedMsg && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
          ✓ {savedMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#b91c1c", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
          {errorMsg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 18 }}>
        <div style={statCard}>
          <div style={{ ...statIcon, background: "#fdf6f7", color: "#800020" }}>👥</div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#c07080", fontWeight: 700, textTransform: "uppercase" }}>Total Admins</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#2e1a1a" }}>{stats.total}</p>
          </div>
        </div>
        <div style={statCard}>
          <div style={{ ...statIcon, background: "#fdf6f7", color: "#800020" }}>🛡</div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#c07080", fontWeight: 700, textTransform: "uppercase" }}>Admins</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#2e1a1a" }}>{stats.adminCount}</p>
          </div>
        </div>
        <div style={statCard}>
          <div style={{ ...statIcon, background: "#fdf6f7", color: "#800020" }}>🎫</div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#c07080", fontWeight: 700, textTransform: "uppercase" }}>Co-Admins</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#2e1a1a" }}>{stats.coAdminCount}</p>
          </div>
        </div>
        <div style={statCard}>
          <div style={{ ...statIcon, background: "#f0fdf4", color: "#16a34a" }}>✓</div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#c07080", fontWeight: 700, textTransform: "uppercase" }}>Active</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#2e1a1a" }}>{stats.activeCount}/{stats.total}</p>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <input
            className="am-input"
            style={{ ...inputStyle, flex: 1, minWidth: 200 }}
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="am-input"
            style={{ ...inputStyle, width: 160 }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="co-admin">Co-Admin</option>
          </select>
        </div>

        {loading ? (
          <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>Loading admins...</p>
        ) : filteredAdmins.length === 0 ? (
          <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>No admins found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0e0e0" }}>
                  <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, color: "#c07080", textTransform: "uppercase", fontWeight: 700 }}>Admin</th>
                  <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, color: "#c07080", textTransform: "uppercase", fontWeight: 700 }}>Role</th>
                  <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, color: "#c07080", textTransform: "uppercase", fontWeight: 700 }}>Status</th>
                  <th style={{ textAlign: "left", padding: "10px 8px", fontSize: 11, color: "#c07080", textTransform: "uppercase", fontWeight: 700 }}>Login</th>
                  <th style={{ textAlign: "right", padding: "10px 8px", fontSize: 11, color: "#c07080", textTransform: "uppercase", fontWeight: 700 }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((a) => {
                  const isSelf = currentAdmin && currentAdmin.id === a._id;
                  return (
                    <tr key={a._id} className="am-row" style={{ borderBottom: "1px solid #f5e8e8" }}>
                      <td style={{ padding: "12px 8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="am-avatar">{initials(a.name)}</div>
                          <div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#2e1a1a" }}>
                              {a.name}{isSelf ? " (You)" : ""}
                            </p>
                            <p style={{ margin: 0, fontSize: 12, color: "#c07080" }}>{a.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <select
                          className="am-role-select"
                          value={a.role}
                          disabled={isSelf}
                          onChange={(e) => changeRole(a._id, e.target.value)}
                        >
                          <option value="admin">Admin</option>
                          <option value="co-admin">Co-Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700,
                          color: a.isBlocked ? "#b91c1c" : "#16a34a",
                          background: a.isBlocked ? "#fee2e2" : "#f0fdf4",
                          padding: "4px 10px", borderRadius: 100,
                        }}>
                          {a.isBlocked ? "Disabled" : "Active"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <div
                          className={`am-toggle ${!a.isBlocked ? "am-toggle-on" : "am-toggle-off"}`}
                          style={{ opacity: isSelf ? 0.4 : 1, pointerEvents: isSelf ? "none" : "auto" }}
                          onClick={() => toggleLogin(a._id)}
                        >
                          <div className="am-toggle-knob" style={{ left: !a.isBlocked ? 21 : 3 }} />
                        </div>
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "right" }}>
                        {!isSelf && (
                          <button className="am-icon-btn" title="Remove admin" onClick={() => removeAdmin(a._id, a.name)}>✕</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="am-modal-overlay" onClick={() => setModalOpen(false)}>
          <div style={{ ...cardStyle, width: 380, maxWidth: "90vw" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={sectionTitle}>Add New Admin</h3>
            <p style={{ fontSize: 12, color: "#c07080", margin: "0 0 16px" }}>Create a login for a new admin or co-admin</p>

            {formError && (
              <div style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#b91c1c", padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, marginBottom: 14 }}>
                {formError}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#6b4848", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Name</label>
                <input className="am-input" style={inputStyle} type="text" name="name" value={form.name} onChange={handleFormChange} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#6b4848", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Email</label>
                <input className="am-input" style={inputStyle} type="email" name="email" value={form.email} onChange={handleFormChange} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#6b4848", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Password</label>
                <input className="am-input" style={inputStyle} type="password" name="password" value={form.password} onChange={handleFormChange} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#6b4848", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Role</label>
                <select className="am-input" style={inputStyle} name="role" value={form.role} onChange={handleFormChange}>
                  <option value="co-admin">Co-Admin</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button
                style={{ ...primaryBtn, background: "#fdf6f7", color: "#800020", border: "1px solid #e8d0d0" }}
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button style={{ ...primaryBtn, opacity: creating ? 0.7 : 1 }} disabled={creating} onClick={submitNewAdmin}>
                {creating ? "Adding..." : "Add Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
