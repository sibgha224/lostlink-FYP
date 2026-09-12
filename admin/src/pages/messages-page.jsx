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

  // Define selectClaim before useEffect or use regular function hoisting
  const selectClaim = async (claim) => {
    setSelectedClaim(claim);
    setThreadLoading(true);
    try {
      const data = await adminFetch(`/admin/chat/claims/${claim._id}/messages`);
      setThread(data.messages || []);
    } catch {
      setThread([]);
    } finally {
      setThreadLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await adminFetch("/claims/all");
        const withChats = (Array.isArray(data) ? data : []).filter(
          (c) => c.status === "approved" || c.foundItem?.status === "returned"
        );
        setClaims(withChats);
        if (withChats.length > 0) {
          setSelectedClaim(withChats[0]);
          setThreadLoading(true);
          try {
            const chatData = await adminFetch(`/admin/chat/claims/${withChats[0]._id}/messages`);
            setThread(chatData.messages || []);
          } catch {
            setThread([]);
          } finally {
            setThreadLoading(false);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const markReturned = async () => {
    if (!selectedClaim) return;
    setBusy(true);
    try {
      await adminFetch(`/admin/chat/claims/${selectedClaim._id}/mark-returned`, { method: "PUT" });
      setClaims((prev) =>
        prev.map((c) =>
          c._id === selectedClaim._id ? { ...c, foundItem: { ...c.foundItem, status: "returned" } } : c
        )
      );
      setSelectedClaim((prev) => ({ ...prev, foundItem: { ...prev.foundItem, status: "returned" } }));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const toggleBlock = async (userId, currentlyBlocked, who) => {
    if (!userId) return;
    if (!window.confirm(`${currentlyBlocked ? "Unban" : "Ban"} the ${who}?`)) return;
    setBusy(true);
    try {
      await adminFetch(`/admin/users/${userId}/block`, { method: "PUT" });
      const applyPatch = (claim) => {
        if (!claim) return claim;
        const next = { ...claim };
        if (next.claimedBy?._id === userId) {
          next.claimedBy = { ...next.claimedBy, isBlocked: !currentlyBlocked };
        }
        if (next.foundItem?.userId?._id === userId) {
          next.foundItem = {
            ...next.foundItem,
            userId: { ...next.foundItem.userId, isBlocked: !currentlyBlocked },
          };
        }
        return next;
      };
      setClaims((prev) => prev.map((c) => applyPatch(c)));
      setSelectedClaim((prev) => applyPatch(prev));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const filteredClaims = claims.filter(
    (c) =>
      (c.claimedBy?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.foundItem?.itemName || "").toLowerCase().includes(search.toLowerCase())
  );

  const finder = selectedClaim?.foundItem?.userId;
  const claimant = selectedClaim?.claimedBy;
  const isLocked = selectedClaim?.foundItem?.status === "returned";

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
              fontFamily: "'Fraunces', serif",
              fontSize: 20,
              color: "#2e1a1a",
              margin: 0,
            }}
          >
            Claim Conversations
          </h2>
          <p style={{ fontSize: 12, color: "#c07080", marginTop: 2 }}>
            View chats between finders and claimants, lock a chat once an item is returned, or ban a user causing trouble
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
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            fontSize: 13,
            fontWeight: 600,
            padding: "10px 14px",
            borderRadius: 12,
            marginBottom: 14,
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>Loading conversations...</p>
      ) : claims.length === 0 ? (
        <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>
          No active conversations yet — chats open once a finder approves a claim.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: 20,
            minHeight: "420px",
          }}
        >
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
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#2e1a1a" }}>
                    {claim.claimedBy?.name || "Claimant"}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 100,
                      background: claim.foundItem?.status === "returned" ? "#f0fdf4" : "#fff7ed",
                      color: claim.foundItem?.status === "returned" ? "#16a34a" : "#c2410c",
                    }}
                  >
                    {claim.foundItem?.status === "returned" ? "Returned" : "Active"}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#6b4848" }}>
                  {claim.foundItem?.itemName} · with {claim.foundItem?.userId?.name || "finder"}
                </div>
              </div>
            ))}
          </div>

          {selectedClaim ? (
            <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div
                  style={{
                    borderBottom: "1px solid #f0e0e0",
                    paddingBottom: 14,
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: 16, color: "#2e1a1a", margin: 0, fontWeight: 700 }}>
                      {selectedClaim.foundItem?.itemName}
                    </h3>
                    <div style={{ fontSize: 12, color: "#c07080", marginTop: 6, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                      <span>
                        <strong>{finder?.name || "Finder"}</strong> (finder)
                        {finder?.isBlocked && (
                          <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: "#b91c1c" }}>BANNED</span>
                        )}
                      </span>
                      <span>↔️</span>
                      <span>
                        <strong>{claimant?.name || "Claimant"}</strong> (claimant)
                        {claimant?.isBlocked && (
                          <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: "#b91c1c" }}>BANNED</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                    <button
                      disabled={busy || !finder?._id}
                      onClick={() => toggleBlock(finder?._id, finder?.isBlocked, "finder")}
                      style={{
                        background: finder?.isBlocked ? "#f0fdf4" : "#fee2e2",
                        border: `1px solid ${finder?.isBlocked ? "#bbf7d0" : "#fecaca"}`,
                        color: finder?.isBlocked ? "#16a34a" : "#b91c1c",
                        borderRadius: 8,
                        padding: "6px 12px",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {finder?.isBlocked ? "Unban Finder" : "Ban Finder"}
                    </button>
                    <button
                      disabled={busy || !claimant?._id}
                      onClick={() => toggleBlock(claimant?._id, claimant?.isBlocked, "claimant")}
                      style={{
                        background: claimant?.isBlocked ? "#f0fdf4" : "#fee2e2",
                        border: `1px solid ${claimant?.isBlocked ? "#bbf7d0" : "#fecaca"}`,
                        color: claimant?.isBlocked ? "#16a34a" : "#b91c1c",
                        borderRadius: 8,
                        padding: "6px 12px",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {claimant?.isBlocked ? "Unban Claimant" : "Ban Claimant"}
                    </button>
                    {isLocked ? (
                      <span
                        style={{
                          background: "#f3f4f6",
                          border: "1px solid #e5e7eb",
                          color: "#6b7280",
                          borderRadius: 8,
                          padding: "6px 12px",
                          fontSize: 11,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        🔒 Chat Locked
                      </span>
                    ) : (
                      <button
                        disabled={busy}
                        onClick={markReturned}
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          color: "#16a34a",
                          borderRadius: 8,
                          padding: "6px 12px",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        🔒 Lock & Resolve Chat
                      </button>
                    )}
                  </div>
                </div>

                {threadLoading ? (
                  <p style={{ color: "#c07080", fontSize: 13 }}>Loading messages...</p>
                ) : thread.length === 0 ? (
                  <p style={{ color: "#c07080", fontSize: 13 }}>No messages exchanged yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 380, overflowY: "auto", padding: "4px 2px" }}>
                    {thread.map((m) => {
                      const senderId = m.sender?._id || m.sender;
                      const isFinder = senderId === finder?._id;
                      return (
                        <div key={m._id} style={{ display: "flex", justifyContent: isFinder ? "flex-start" : "flex-end" }}>
                          <div
                            style={{
                              maxWidth: "78%",
                              background: isFinder ? "#fdf6f7" : "#800020",
                              color: isFinder ? "#2e1a1a" : "#fff",
                              borderRadius: 12,
                              padding: "8px 12px",
                            }}
                          >
                            <div style={{ fontSize: 11, fontWeight: 700, color: isFinder ? "#800020" : "#f3c9d3", marginBottom: 3 }}>
                              {m.sender?.name || "User"} {isFinder ? "· Finder" : "· Claimant"}
                            </div>
                            {m.isDeleted ? (
                              <div style={{ fontSize: 13, fontStyle: "italic", opacity: 0.7 }}>Message deleted</div>
                            ) : (
                              <>
                                {m.image && (
                                  <img
                                    src={m.image}
                                    alt="attachment"
                                    style={{ width: "100%", maxWidth: 220, borderRadius: 8, marginBottom: 6, display: "block" }}
                                  />
                                )}
                                {m.audio && (
                                  <audio controls src={m.audio} style={{ marginBottom: 6, maxWidth: "100%", height: 34 }} />
                                )}
                                {m.file && (
                                  <a
                                    href={m.file}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 6,
                                      fontSize: 12,
                                      fontWeight: 700,
                                      color: isFinder ? "#2e1a1a" : "#fff",
                                      background: isFinder ? "#fff" : "rgba(255,255,255,0.15)",
                                      borderRadius: 8,
                                      padding: "6px 10px",
                                      marginBottom: 6,
                                      textDecoration: "none",
                                    }}
                                  >
                                    📄 {m.fileName || "Download file"}
                                  </a>
                                )}
                                {m.text && <div style={{ fontSize: 13 }}>{m.text}</div>}
                              </>
                            )}
                            <div style={{ fontSize: 10, color: isFinder ? "#c5a3a3" : "#f3c9d3", marginTop: 4 }}>
                              {new Date(m.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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