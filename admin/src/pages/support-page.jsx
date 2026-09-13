import { useState, useEffect, useRef, useCallback } from "react";
import { adminFetch, getAdminUser } from "../adminApi";

export default function SupportPage() {
  const admin = getAdminUser();
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [thread, setThread] = useState([]);
  const [threadStatus, setThreadStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [error, setError] = useState("");
  const [replyText, setReplyText] = useState("");
  const [busy, setBusy] = useState(false);
  const pollRef = useRef(null);
  const bottomRef = useRef(null);

  const loadReports = useCallback(async () => {
    try {
      const data = await adminFetch('/requests/all');
      const issues = (Array.isArray(data) ? data : [])
        .filter(r => r.type === 'general_issue')
        .sort((a, b) => {
          if (a.status === 'closed' && b.status !== 'closed') return 1;
          if (a.status !== 'closed' && b.status === 'closed') return -1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      setReports(issues);
      return issues;
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, []);

  const loadThread = useCallback(async (reportId, silent) => {
    if (!silent) setThreadLoading(true);
    try {
      const data = await adminFetch(`/requests/${reportId}/messages`);
      setThread(data.messages || []);
      setThreadStatus(data.status || 'pending');
    } catch (err) {
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setThreadLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError("");
      const issues = await loadReports();
      if (issues.length > 0) {
        setSelected(issues[0]);
        await loadThread(issues[0]._id);
      }
      setLoading(false);
    };
    init();
  }, [loadReports, loadThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  useEffect(() => {
    if (!selected) return;
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      loadThread(selected._id, true);
    }, 4000);
    return () => clearInterval(pollRef.current);
  }, [selected, loadThread]);

  const selectReport = async (report) => {
    setSelected(report);
    await loadThread(report._id);
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selected || busy) return;
    setBusy(true);
    try {
      const msg = await adminFetch(`/requests/${selected._id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text: replyText.trim() })
      });
      setThread(prev => [...prev, msg]);
      setReplyText('');
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const closeChat = async () => {
    if (!selected || busy) return;
    if (!window.confirm('Close this chat? The student will no longer be able to send messages.')) return;
    setBusy(true);
    try {
      await adminFetch(`/requests/${selected._id}/close`, { method: 'PUT' });
      setThreadStatus('closed');
      const issues = await loadReports();
      const updated = issues.find(r => r._id === selected._id);
      if (updated) setSelected(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const openCount = reports.filter(r => r.status !== 'closed').length;

  return (
    <div style={{ background: "#fff", border: "1px solid #e8d0d0", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(74,0,16,0.05)" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: "#2e1a1a", margin: 0 }}>
          Student Support
        </h2>
        <p style={{ fontSize: 12, color: "#c07080", marginTop: 4 }}>
          Chat with students who reported an issue — {openCount} open.
        </p>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", fontSize: 13, fontWeight: 600, padding: "10px 14px", borderRadius: 12, marginBottom: 14 }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p style={{ color: "#c07080", textAlign: "center", padding: 24 }}>No issues reported yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, minHeight: 420 }}>
          <div style={{ borderRight: "1px solid #f0e0e0", paddingRight: 16, display: "flex", flexDirection: "column", gap: 10, maxHeight: 480, overflowY: "auto" }}>
            {reports.map((r) => (
              <div
                key={r._id}
                onClick={() => selectReport(r)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  cursor: "pointer",
                  background: selected?._id === r._id ? "#fdf6f7" : "#fcfcfc",
                  border: selected?._id === r._id ? "1px solid #800020" : "1px solid #f0e0e0"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#2e1a1a" }}>
                    {r.requester?.name || r.requesterName || 'Student'}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100,
                    background: r.status === 'closed' ? '#f3f4f6' : '#fff7ed',
                    color: r.status === 'closed' ? '#6b7280' : '#c2410c'
                  }}>
                    {r.status === 'closed' ? 'Closed' : 'Open'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#6b4848", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.message}
                </div>
              </div>
            ))}
          </div>

          {selected ? (
            <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column" }}>
              <div style={{ borderBottom: "1px solid #f0e0e0", paddingBottom: 14, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: 16, color: "#2e1a1a", margin: 0, fontWeight: 700 }}>
                    {selected.requester?.name || selected.requesterName || 'Student'}
                  </h3>
                  <div style={{ fontSize: 12, color: "#c07080", marginTop: 4 }}>
                    {selected.requester?.email || selected.requesterEmail}
                  </div>
                </div>
                {threadStatus === 'closed' ? (
                  <span style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", color: "#6b7280", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                    🔒 Chat Closed
                  </span>
                ) : (
                  <button
                    disabled={busy}
                    onClick={closeChat}
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    🔒 Close Chat
                  </button>
                )}
              </div>

              {threadLoading ? (
                <p style={{ color: "#c07080", fontSize: 13 }}>Loading messages...</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 340, overflowY: "auto", padding: "4px 2px" }}>
                  {thread.map((m) => {
                    const isAdminMsg = m.senderRole === 'admin';
                    return (
                      <div key={m._id} style={{ display: "flex", justifyContent: isAdminMsg ? "flex-end" : "flex-start" }}>
                        <div style={{
                          maxWidth: "78%",
                          background: isAdminMsg ? "#800020" : "#fdf6f7",
                          color: isAdminMsg ? "#fff" : "#2e1a1a",
                          borderRadius: 12,
                          padding: "8px 12px"
                        }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: isAdminMsg ? "#f3c9d3" : "#800020", marginBottom: 3 }}>
                            {isAdminMsg ? (m.sender?.name || 'Admin') : (m.sender?.name || 'Student')}
                          </div>
                          <div style={{ fontSize: 13 }}>{m.text}</div>
                          <div style={{ fontSize: 10, color: isAdminMsg ? "#f3c9d3" : "#c5a3a3", marginTop: 4 }}>
                            {new Date(m.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              )}

              {threadStatus !== 'closed' && (
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <input
                    type="text"
                    placeholder="Type a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #e8d0d0", fontSize: 13, outline: "none" }}
                  />
                  <button
                    disabled={busy}
                    onClick={sendReply}
                    style={{ background: "#800020", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: 20, color: "#c07080" }}>Select a report to view the conversation</div>
          )}
        </div>
      )}
    </div>
  );
}
