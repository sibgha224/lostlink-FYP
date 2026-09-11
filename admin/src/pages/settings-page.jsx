import { useState } from "react";
import { adminFetch, getAdminUser } from "../adminApi";

const initialCategories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Books & Notes" },
  { id: 3, name: "Clothing" },
  { id: 4, name: "Keys" },
  { id: 5, name: "Wallet / Purse" },
  { id: 6, name: "ID Card" },
  { id: 7, name: "Jewelry" },
  { id: 8, name: "Bag / Backpack" },
  { id: 9, name: "Other" },
];

export default function SettingsPage() {
  const admin = getAdminUser();
  const [saved, setSaved] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [exportError, setExportError] = useState("");

  const showSaved = (msg) => {
    setSavedMsg(msg);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const downloadCSV = (filename, headers, rows) => {
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportItemsCSV = async () => {
    setExportError("");
    try {
      const [lost, found] = await Promise.all([
        adminFetch('/lost-items/all'),
        adminFetch('/found-items/all'),
      ]);
      const rows = [
        ...(Array.isArray(lost) ? lost : []).map(i => [i._id, i.itemName, i.category, new Date(i.createdAt).toLocaleDateString(), 'Lost', i.userId?.name || '']),
        ...(Array.isArray(found) ? found : []).map(i => [i._id, i.itemName, i.category, new Date(i.createdAt).toLocaleDateString(), 'Found', i.userId?.name || '']),
      ];
      downloadCSV('lostlink_items_report.csv', ["ID", "Item", "Category", "Date", "Status", "Reporter"], rows);
      showSaved("Items report exported");
    } catch (err) {
      setExportError(err.message);
    }
  };

  const exportClaimsCSV = async () => {
    setExportError("");
    try {
      const claims = await adminFetch('/claims/all');
      const rows = (Array.isArray(claims) ? claims : []).map(c => [
        c._id, c.foundItem?.itemName || '', c.claimedBy?.name || '', new Date(c.createdAt).toLocaleDateString(), c.status
      ]);
      downloadCSV('lostlink_claims_report.csv', ["Claim ID", "Item", "Claimant", "Date", "Status"], rows);
      showSaved("Claims report exported");
    } catch (err) {
      setExportError(err.message);
    }
  };

  /* ---------------- Password (reuses the same forgot/reset-password flow as login) ---------------- */
  const [pwStep, setPwStep] = useState("idle"); // idle | otp
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  const sendResetCode = async () => {
    setPwError("");
    setPwBusy(true);
    try {
      await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: admin?.email }),
      }).then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.message || 'Failed to send code'); });
      setPwStep("otp");
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwBusy(false);
    }
  };

  const submitNewPassword = async () => {
    setPwError("");
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) { setPwError("Enter the full 6-digit code"); return; }
    if (newPass !== confirmPass) { setPwError("Passwords do not match"); return; }
    setPwBusy(true);
    try {
      await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: admin?.email, otp: enteredOtp, newPassword: newPass }),
      }).then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.message || 'Reset failed'); });
      setPwStep("idle");
      setOtp(["", "", "", "", "", ""]);
      setNewPass(""); setConfirmPass("");
      showSaved("Password updated — use it next time you sign in");
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwBusy(false);
    }
  };

  /* ---------------- Institute Info ---------------- */
  const [systemInfo, setSystemInfo] = useState({
    collegeName: "Govt. Graduate College Mandi Bahauddin",
    address: "Mandi Bahauddin, Punjab, Pakistan",
    supportEmail: "support@lostlink.com",
    contactNumber: "0546-123456",
  });
  const handleSystemChange = (e) =>
    setSystemInfo({ ...systemInfo, [e.target.name]: e.target.value });

  /* ---------------- Category Management ---------------- */
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setCategories([...categories, { id: Date.now(), name: newCategory.trim() }]);
    setNewCategory("");
  };

  const removeCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  /* ---------------- Auto-Resolve Rule ---------------- */
  const [autoResolve, setAutoResolve] = useState({
    enabled: true,
    days: 30,
    autoDeleteEnabled: false,
    deleteMonths: 6,
  });

  /* ---------------- Shared styles ---------------- */
  const cardStyle = {
    background: "#fff",
    border: "1px solid #e8d0d0",
    borderRadius: 20,
    padding: 24,
    boxShadow: "0 2px 12px rgba(74,0,16,0.05)",
  };
  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: "#6b4848",
    display: "block",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
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
  const saveBtn = {
    padding: "9px 20px",
    background: "linear-gradient(135deg,#800020,#4a0010)",
    border: "none",
    borderRadius: 10,
    color: "#fde8ec",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  };
  const sectionTitle = {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    fontWeight: 700,
    color: "#2e1a1a",
    margin: "0 0 4px",
  };
  const sectionSub = { fontSize: 12, color: "#c07080", margin: "0 0 18px" };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#2e1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .settings-input:focus{border-color:#800020!important;box-shadow:0 0 0 3px rgba(128,0,32,0.08);}
        .cat-chip{display:flex;align-items:center;gap:8px;background:#fdf6f7;border:1px solid #f0d0d0;border-radius:100px;padding:6px 8px 6px 14px;font-size:12px;font-weight:600;color:#800020;}
        .cat-chip button{background:rgba(128,0,32,0.1);border:none;border-radius:50%;width:18px;height:18px;color:#800020;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;}
        .cat-chip button:hover{background:#800020;color:#fff;}
        .toggle{position:relative;width:42px;height:24px;border-radius:100px;cursor:pointer;transition:background .2s;flex-shrink:0;}
        .toggle-on{background:linear-gradient(135deg,#800020,#4a0010);}
        .toggle-off{background:#e8d0d0;}
        .toggle-knob{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);}
      `}</style>

      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 800, color: "#2e1a1a", margin: 0 }}>
          Settings
        </h1>
        <p style={{ color: "#c07080", fontSize: 13, marginTop: 4 }}>
          Manage your account, categories, and system preferences
        </p>
      </div>

      {saved && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
          ✓ {savedMsg}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* ============ PROFILE ============ */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Admin Profile</h3>
          <p style={sectionSub}>Your signed-in admin account</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={{ ...inputStyle, background: "#fdf6f7", color: "#2e1a1a" }} type="text" value={admin?.name || ''} disabled />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input style={{ ...inputStyle, background: "#fdf6f7", color: "#2e1a1a" }} type="email" value={admin?.email || ''} disabled />
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <input style={{ ...inputStyle, background: "#fdf6f7", color: "#800020", fontWeight: 600 }} type="text" value="Admin" disabled />
            </div>
          </div>
        </div>

        {/* ============ PASSWORD ============ */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Change Password</h3>
          <p style={sectionSub}>We'll email a verification code to {admin?.email} to confirm it's you</p>

          {pwError && (
            <div style={{ background: "#fee2e2", color: "#b91c1c", fontSize: 13, fontWeight: 600, padding: "10px 14px", borderRadius: 12, marginBottom: 14 }}>{pwError}</div>
          )}

          {pwStep === "idle" ? (
            <button style={saveBtn} disabled={pwBusy} onClick={sendResetCode}>
              {pwBusy ? "Sending..." : "Send Verification Code"}
            </button>
          ) : (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {otp.map((val, idx) => (
                  <input key={idx} maxLength={1} value={val}
                    onChange={(e) => { if (!/^\d?$/.test(e.target.value)) return; const n = [...otp]; n[idx] = e.target.value; setOtp(n); }}
                    style={{ width: 40, height: 46, textAlign: "center", fontSize: 18, fontWeight: 700, border: "1.5px solid #e8d0d0", borderRadius: 10, outline: "none" }} />
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <input className="settings-input" style={inputStyle} type="password" placeholder="••••••••" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <input className="settings-input" style={inputStyle} type="password" placeholder="••••••••" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
                </div>
              </div>
              <div style={{ marginTop: 18, textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button style={{ ...saveBtn, background: "#fdf6f7", color: "#800020", border: "1px solid #e8d0d0" }} onClick={() => setPwStep("idle")}>Cancel</button>
                <button style={saveBtn} disabled={pwBusy} onClick={submitNewPassword}>{pwBusy ? "Saving..." : "Update Password"}</button>
              </div>
            </>
          )}
        </div>

        {/* ============ CATEGORY MANAGEMENT ============ */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Category Management</h3>
          <p style={sectionSub}>
            Categories currently used across Lost &amp; Found listings.{" "}
            <span style={{ color: "#c2410c", fontWeight: 600 }}>Preview only — adding/removing here doesn't change the report form yet (categories are fixed in the database schema).</span>
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
            {categories.map((cat) => (
              <div key={cat.id} className="cat-chip">
                {cat.name}
                <button onClick={() => removeCategory(cat.id)} title="Remove category">✕</button>
              </div>
            ))}
            {categories.length === 0 && (
              <p style={{ fontSize: 12, color: "#c5a3a3" }}>No categories yet. Add one below.</p>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              className="settings-input"
              style={{ ...inputStyle, flex: 1 }}
              type="text"
              placeholder="e.g. Sports Equipment"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
            />
            <button style={saveBtn} onClick={addCategory}>+ Add Category</button>
          </div>
        </div>

        {/* ============ AUTO-RESOLVE RULE ============ */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Automation Rules</h3>
          <p style={sectionSub}>
            Let the system manage stale listings automatically.{" "}
            <span style={{ color: "#c2410c", fontWeight: 600 }}>Preview only — no scheduled job runs these rules yet.</span>
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Auto resolve */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#2e1a1a", margin: 0 }}>Auto-mark items as Resolved</p>
                <p style={{ fontSize: 12, color: "#c07080", margin: "2px 0 0" }}>
                  Unclaimed items are auto-resolved after the set number of days
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {autoResolve.enabled && (
                  <input
                    type="number"
                    min="1"
                    value={autoResolve.days}
                    onChange={(e) => setAutoResolve({ ...autoResolve, days: e.target.value })}
                    style={{ ...inputStyle, width: 70, padding: "8px 10px", textAlign: "center" }}
                  />
                )}
                {autoResolve.enabled && <span style={{ fontSize: 12, color: "#6b4848" }}>days</span>}
                <div
                  className={`toggle ${autoResolve.enabled ? "toggle-on" : "toggle-off"}`}
                  onClick={() => setAutoResolve({ ...autoResolve, enabled: !autoResolve.enabled })}
                >
                  <div className="toggle-knob" style={{ left: autoResolve.enabled ? 21 : 3 }} />
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: "#f0e0e0" }} />

            {/* Auto delete */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#2e1a1a", margin: 0 }}>Auto-delete archived items</p>
                <p style={{ fontSize: 12, color: "#c07080", margin: "2px 0 0" }}>
                  Permanently remove resolved items after the set number of months
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {autoResolve.autoDeleteEnabled && (
                  <input
                    type="number"
                    min="1"
                    value={autoResolve.deleteMonths}
                    onChange={(e) => setAutoResolve({ ...autoResolve, deleteMonths: e.target.value })}
                    style={{ ...inputStyle, width: 70, padding: "8px 10px", textAlign: "center" }}
                  />
                )}
                {autoResolve.autoDeleteEnabled && <span style={{ fontSize: 12, color: "#6b4848" }}>months</span>}
                <div
                  className={`toggle ${autoResolve.autoDeleteEnabled ? "toggle-on" : "toggle-off"}`}
                  onClick={() => setAutoResolve({ ...autoResolve, autoDeleteEnabled: !autoResolve.autoDeleteEnabled })}
                >
                  <div className="toggle-knob" style={{ left: autoResolve.autoDeleteEnabled ? 21 : 3 }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, textAlign: "right" }}>
            <button style={saveBtn} onClick={() => showSaved("Automation rules saved")}>Save Rules</button>
          </div>
        </div>

        {/* ============ INSTITUTE INFO ============ */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Institute Information</h3>
          <p style={sectionSub}>
            Shown across the portal, login page, and reports.{" "}
            <span style={{ color: "#c2410c", fontWeight: 600 }}>Preview only — not yet wired to a settings collection in the database.</span>
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Institute Name</label>
              <input className="settings-input" style={inputStyle} type="text" name="collegeName" value={systemInfo.collegeName} onChange={handleSystemChange} />
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <input className="settings-input" style={inputStyle} type="text" name="address" value={systemInfo.address} onChange={handleSystemChange} />
            </div>
            <div>
              <label style={labelStyle}>Support Email</label>
              <input className="settings-input" style={inputStyle} type="email" name="supportEmail" value={systemInfo.supportEmail} onChange={handleSystemChange} />
            </div>
            <div>
              <label style={labelStyle}>Contact Number</label>
              <input className="settings-input" style={inputStyle} type="text" name="contactNumber" value={systemInfo.contactNumber} onChange={handleSystemChange} />
            </div>
          </div>

          <div style={{ marginTop: 18, textAlign: "right" }}>
            <button style={saveBtn} onClick={() => showSaved("Institute information saved")}>Save Settings</button>
          </div>
        </div>

        {/* ============ EXPORT DATA ============ */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Export Data</h3>
          <p style={sectionSub}>Download live records for record-keeping or audit purposes</p>

          {exportError && (
            <div style={{ background: "#fee2e2", color: "#b91c1c", fontSize: 13, fontWeight: 600, padding: "10px 14px", borderRadius: 12, marginBottom: 14 }}>{exportError}</div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button style={saveBtn} onClick={exportItemsCSV}>⬇ Export Items Report (CSV)</button>
            <button style={{ ...saveBtn, background: "#fdf6f7", color: "#800020", border: "1px solid #e8d0d0" }} onClick={exportClaimsCSV}>
              ⬇ Export Claims Report (CSV)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}