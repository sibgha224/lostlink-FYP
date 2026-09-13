import { useState, useEffect, useCallback } from "react";
import { adminFetch } from "../adminApi";

const typeLabel = {
  lost_followup: "Lost Item Follow-up",
  found_handover: "Found Item Hand-over",
  unblock: "Unblock Account"
};

const statusStyle = (status) => ({
  pending:  { bg: "#fff7ed", color: "#c2410c" },
  approved: { bg: "#f0fdf4", color: "#16a34a" },
  rejected: { bg: "#fef2f2", color: "#dc2626" },
}[status] || { bg: "#f5f0f0", color: "#6b4848" });

const shortId = (id) => `#${(id || '').slice(-6).toUpperCase()}`;

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [noteDraft, setNoteDraft] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch('/requests/all');
      setRequests((Array.isArray(data) ? data : []).filter(r => r.type !== 'general_issue'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const resolve = async (request, action) => {
    setBusyId(request._id);
    try {
      await adminFetch(`/requests/${request._id}/resolve`, {
        method: 'PUT',
        body: JSON.stringify({ action, adminNote: noteDraft[request._id] || '' })
      });
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div style={{ background: "#fff", border: "1px solid #e8d0d0", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(74,0,16,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, color: "#2e1a1a", margin: 0 }}>Student Requests</h2>
          <p style={{ fontSize: 12, color: "#c07080", marginTop: 4 }}>
            Lost item follow-ups, found item hand-overs, and account unblock requests — {pendingCount} pending. Reported issues with live chat are under the Support tab.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", fontSize: 13, fontWeight: 600, padding: "10px 14px", borderRadius: 12, marginBottom: 14 }}>{error}</div>
      )}

      {loading ? (
        <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>No requests yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fdf6f7", borderBottom: "1px solid #f0e0e0" }}>
                {["Request ID", "Type", "Student", "Message", "Date", "Status", "Action"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "#c07080", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => {
                const s = statusStyle(r.status);
                return (
                  <tr key={r._id} style={{ borderBottom: "1px solid #fdf0f0" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "#800020", fontSize: 13 }}>{shortId(r._id)}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#2e1a1a" }}>{typeLabel[r.type] || r.type}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#6b4848" }}>
                      {r.requester?.name || r.requesterName || '—'}
                      <div style={{ fontSize: 11, color: "#c07080" }}>{r.requester?.email || r.requesterEmail}</div>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#6b4848", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.message}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#c07080" }}>{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, textTransform: "capitalize" }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {r.status === 'pending' ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 160 }}>
                          <input
                            placeholder="Note (optional)"
                            value={noteDraft[r._id] || ''}
                            onChange={(e) => setNoteDraft(prev => ({ ...prev, [r._id]: e.target.value }))}
                            style={{ padding: "5px 8px", fontSize: 11, borderRadius: 6, border: "1px solid #e8d0d0", outline: "none" }}
                          />
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              disabled={busyId === r._id}
                              onClick={() => resolve(r, 'approved')}
                              style={{ flex: 1, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                            >
                              Approve
                            </button>
                            <button
                              disabled={busyId === r._id}
                              onClick={() => resolve(r, 'rejected')}
                              style={{ flex: 1, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: 11, color: "#c07080" }}>{r.adminNote || '—'}</span>
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
  );
}