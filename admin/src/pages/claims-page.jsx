import { useState, useEffect } from "react";
import { adminFetch } from "../adminApi";

const statusStyle = (status) => ({
  pending:  { bg: "#fff7ed", color: "#c2410c" },
  approved: { bg: "#f0fdf4", color: "#16a34a" },
  rejected: { bg: "#fef2f2", color: "#dc2626" },
}[status] || { bg: "#f5f0f0", color: "#6b4848" });

const shortId = (id) => `#${(id || '').slice(-6).toUpperCase()}`;

export default function ClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch('/claims/all');
      setClaims(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markReturned = async (claim) => {
    setBusyId(claim._id);
    try {
      await adminFetch(`/admin/chat/claims/${claim._id}/mark-returned`, { method: 'PUT' });
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e8d0d0", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(74,0,16,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, color: "#2e1a1a", margin: 0 }}>Claims Oversight</h2>
          <p style={{ fontSize: 12, color: "#c07080", marginTop: 4 }}>
            Approval/rejection is handled peer-to-peer by the finder — admin can monitor here and mark an item as returned once collected.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", fontSize: 13, fontWeight: 600, padding: "10px 14px", borderRadius: 12, marginBottom: 14 }}>{error}</div>
      )}

      {loading ? (
        <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>Loading claims...</p>
      ) : claims.length === 0 ? (
        <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>No claims have been submitted yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fdf6f7", borderBottom: "1px solid #f0e0e0" }}>
                {["Claim ID", "Item", "Claimant", "Founder", "Date", "Status", "Proof Detail", "Action"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "#c07080", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => {
                const s = statusStyle(claim.status);
                const itemReturned = claim.foundItem?.status === 'returned';
                return (
                  <tr key={claim._id} style={{ borderBottom: "1px solid #fdf0f0" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "#800020", fontSize: 13 }}>{shortId(claim._id)}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#2e1a1a" }}>{claim.foundItem?.itemName || '—'}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#6b4848" }}>{claim.claimedBy?.name || '—'}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#6b4848" }}>{claim.foundItem?.userId?.name || '—'}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#c07080" }}>{new Date(claim.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, textTransform: "capitalize" }}>
                        {itemReturned ? 'Returned' : claim.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#6b4848", maxWidth: 220 }}>{claim.proofDescription}</td>
                    <td style={{ padding: "12px 14px" }}>
                      {claim.status === 'approved' && !itemReturned ? (
                        <button disabled={busyId === claim._id} onClick={() => markReturned(claim)}
                          style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                          Mark Returned
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: "#c5a3a3" }}>—</span>
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
