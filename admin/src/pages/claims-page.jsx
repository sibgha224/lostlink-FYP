import { useState, useEffect, useCallback } from "react";
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
  const [selectedClaim, setSelectedClaim] = useState(null);

  const load = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const data = await adminFetch('/claims/all');
        if (isMounted) {
          setClaims(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const markReturned = async (claim) => {
    setBusyId(claim._id);
    try {
      await adminFetch(`/admin/chat/claims/${claim._id}/mark-returned`, { method: 'PUT' });
      await load();
      if (selectedClaim && selectedClaim._id === claim._id) {
        setSelectedClaim(null);
      }
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
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#6b4848", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{claim.proofDescription || '—'}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <button
                          onClick={() => setSelectedClaim(claim)}
                          style={{ background: "rgba(128,0,32,0.07)", border: "1px solid rgba(128,0,32,0.15)", color: "#800020", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                        >
                          View
                        </button>

                        {claim.status === 'approved' && !itemReturned && (
                          <button
                            disabled={busyId === claim._id}
                            onClick={() => markReturned(claim)}
                            style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                          >
                            Mark Returned
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedClaim && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(46,26,26,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 20 }}>
          <div style={{ background: "#fff", border: "1px solid #e8d0d0", borderRadius: 20, width: "100%", maxWidth: 480, overflow: "hidden", boxShadow: "0 20px 50px rgba(74,0,16,0.2)" }}>
            <div style={{ padding: "18px 24px", background: "linear-gradient(135deg,#800020,#4a0010)", color: "#fde8ec", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, margin: 0 }}>Claim Details</h3>
                <span style={{ fontSize: 11, opacity: 0.8 }}>ID: {shortId(selectedClaim._id)}</span>
              </div>
              <button onClick={() => setSelectedClaim(null)} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ margin: 0, fontSize: 14, color: "#2e1a1a" }}><strong>Item Name:</strong> {selectedClaim.foundItem?.itemName || '—'}</p>
              <p style={{ margin: 0, fontSize: 14, color: "#2e1a1a" }}><strong>Claimant:</strong> {selectedClaim.claimedBy?.name || '—'}</p>
              <p style={{ margin: 0, fontSize: 14, color: "#2e1a1a" }}><strong>Founder:</strong> {selectedClaim.foundItem?.userId?.name || '—'}</p>
              <p style={{ margin: 0, fontSize: 14, color: "#2e1a1a" }}><strong>Date:</strong> {new Date(selectedClaim.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              <p style={{ margin: 0, fontSize: 14, color: "#2e1a1a" }}>
                <strong>Status:</strong>{" "}
                <span style={{ textTransform: "capitalize", fontWeight: 700, color: statusStyle(selectedClaim.status).color }}>
                  {selectedClaim.foundItem?.status === 'returned' ? 'Returned' : selectedClaim.status}
                </span>
              </p>
              <div style={{ background: "#fdf6f7", padding: 12, borderRadius: 10, border: "1px solid #f0e0e0" }}>
                <strong style={{ fontSize: 13, color: "#800020", display: "block", marginBottom: 4 }}>Proof Description:</strong>
                <p style={{ margin: 0, fontSize: 13, color: "#6b4848", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                  {selectedClaim.proofDescription || "No proof description provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}