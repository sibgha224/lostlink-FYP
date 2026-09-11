import { useState, useEffect } from "react";
import { adminFetch } from "../adminApi";

export default function MessagesPage() {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [thread, setThread] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await adminFetch('/claims/all');
        // Only approved (or previously approved) claims ever have an active chat thread
        const withChats = (Array.isArray(data) ? data : []).filter(c => c.status === 'approved' || c.foundItem?.status === 'returned');
        setClaims(withChats);
        if (withChats.length > 0) selectClaim(withChats[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectClaim = async (claim) => {
    setSelectedClaim(claim);
    setThreadLoading(true);
    try {
      const data = await adminFetch(`/admin/chat/claims/${claim._id}/messages`);
      setThread(data.messages || []);
    } catch (err) {
      setThread([]);
    } finally {
      setThreadLoading(false);
    }
  };

  const markReturned = async () => {
    if (!selectedClaim) return;
    setBusy(true);
    try {
      await adminFetch(`/admin/chat/claims/${selectedClaim._id}/mark-returned`, { method: 'PUT' });
      setClaims(prev => prev.map(c => c._id === selectedClaim._id ? { ...c, foundItem: { ...c.foundItem, status: 'returned' } } : c));
      setSelectedClaim(prev => ({ ...prev, foundItem: { ...prev.foundItem, status: 'returned' } }));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const filteredClaims = claims.filter(
    (c) =>
      (c.claimedBy?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.foundItem?.itemName || '').toLowerCase().includes(search.toLowerCase())
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
      {/* Header */}
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
              fontFamily: "'Fraunces', serif",
              fontSize: 20,
              color: "#2e1a1a",
              margin: 0,
            }}
          >
            Claim Conversations
          </h2>
          <p style={{ fontSize: 12, color: "#c07080", marginTop: 2 }}>
            Read-only view of secure chats between finders and claimants, for moderation and dispute review
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by student or item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #e8d0d0",
            fontSize: 13,
            outline: "none",
            width: "240px",
          }}
        />
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", fontSize: 13, fontWeight: 600, padding: "10px 14px", borderRadius: 12, marginBottom: 14 }}>{error}</div>
      )}

      {loading ? (
        <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>Loading conversations...</p>
      ) : claims.length === 0 ? (
        <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>No active conversations yet — chats open once a finder approves a claim.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: 20,
            minHeight: "420px",
          }}
        >
          {/* Conversation List */}
          <div
            style={{
              borderRight: "1px solid #f0e0e0",
              paddingRight: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              maxHeight: 480,
              overflowY: "auto",
            }}
          >
            {filteredClaims.map((claim) => (
              <div
                key={claim._id}
                onClick={() => selectClaim(claim)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  cursor: "pointer",
                  background: selectedClaim?._id === claim._id ? "#fdf6f7" : "#fcfcfc",
                  border: selectedClaim?._id === claim._id ? "1px solid #800020" : "1px solid #f0e0e0",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#2e1a1a" }}>{claim.claimedBy?.name || 'Claimant'}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: claim.foundItem?.status === 'returned' ? '#f0fdf4' : '#fff7ed', color: claim.foundItem?.status === 'returned' ? '#16a34a' : '#c2410c' }}>
                    {claim.foundItem?.status === 'returned' ? 'Returned' : 'Active'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#6b4848" }}>
                  {claim.foundItem?.itemName} · with {claim.foundItem?.userId?.name || 'finder'}
                </div>
              </div>
            ))}
          </div>

          {/* Message Content View */}
          {selectedClaim ? (
            <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ borderBottom: "1px solid #f0e0e0", paddingBottom: 14, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: 16, color: "#2e1a1a", margin: 0, fontWeight: 700 }}>{selectedClaim.foundItem?.itemName}</h3>
                    <div style={{ fontSize: 12, color: "#c07080", marginTop: 6 }}>
                      <strong>{selectedClaim.claimedBy?.name}</strong> (claimant) ↔ <strong>{selectedClaim.foundItem?.userId?.name}</strong> (finder)
                    </div>
                  </div>
                  {selectedClaim.foundItem?.status !== 'returned' && (
                    <button
                      disabled={busy}
                      onClick={markReturned}
                      style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      Mark Returned
                    </button>
                  )}
                </div>

                {threadLoading ? (
                  <p style={{ color: "#c07080", fontSize: 13 }}>Loading messages...</p>
                ) : thread.length === 0 ? (
                  <p style={{ color: "#c07080", fontSize: 13 }}>No messages exchanged yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 320, overflowY: "auto" }}>
                    {thread.map((m) => (
                      <div key={m._id} style={{ background: "#fdf6f7", borderRadius: 10, padding: "8px 12px" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#800020" }}>{m.sender?.name || 'User'}</div>
                        <div style={{ fontSize: 13, color: "#2e1a1a", marginTop: 2 }}>{m.isDeleted ? <em>Message deleted</em> : m.text}</div>
                        <div style={{ fontSize: 10, color: "#c5a3a3", marginTop: 3 }}>{new Date(m.createdAt).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p style={{ fontSize: 11, color: "#c5a3a3", marginTop: 16 }}>
                Admins can view conversations for moderation but do not send messages — chat is strictly between the finder and claimant.
              </p>
            </div>
          ) : (
            <div style={{ padding: 20, color: "#c07080" }}>Select a conversation to view details</div>
          )}
        </div>
      )}
    </div>
  );
}
