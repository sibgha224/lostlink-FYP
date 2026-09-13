import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

const Support = ({ onGoToHome }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [thread, setThread] = useState([]);
  const [threadStatus, setThreadStatus] = useState('pending');
  const [threadLoading, setThreadLoading] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [composeText, setComposeText] = useState('');
  const [composeSubmitting, setComposeSubmitting] = useState(false);
  const [composeError, setComposeError] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/requests/my-requests`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load your reports');
      const issues = (Array.isArray(data) ? data : []).filter(r => r.type === 'general_issue');
      setReports(issues);
      return issues;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadThread = async (reportId) => {
    setThreadLoading(true);
    try {
      const res = await fetch(`${API_BASE}/requests/${reportId}/messages`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load conversation');
      setThread(data.messages || []);
      setThreadStatus(data.status || 'pending');
    } catch (err) {
      setError(err.message);
    } finally {
      setThreadLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const issues = await loadReports();
      if (issues.length > 0) {
        setSelected(issues[0]);
        await loadThread(issues[0]._id);
      }
    })();

    const token = localStorage.getItem('token');
    if (token) {
      const socket = io(SOCKET_URL, { auth: { token } });
      socketRef.current = socket;

      socket.on('report_message', ({ requestId, message }) => {
        setSelected((cur) => {
          if (cur && cur._id === requestId) {
            setThread((prev) => prev.some(m => m._id === message._id) ? prev : [...prev, message]);
          }
          return cur;
        });
        setReports((prev) => prev.map(r => r._id === requestId ? { ...r } : r));
      });

      socket.on('report_closed', ({ requestId }) => {
        setSelected((cur) => {
          if (cur && cur._id === requestId) {
            setThreadStatus('closed');
          }
          return cur;
        });
        setReports((prev) => prev.map(r => r._id === requestId ? { ...r, status: 'closed' } : r));
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const selectReport = async (report) => {
    setSelected(report);
    await loadThread(report._id);
  };

  const submitIssue = async () => {
    if (!composeText.trim()) {
      setComposeError('Please describe your issue.');
      return;
    }
    setComposeSubmitting(true);
    setComposeError('');
    try {
      const res = await fetch(`${API_BASE}/requests/general-issue`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ message: composeText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send your report');
      setShowCompose(false);
      setComposeText('');
      const issues = await loadReports();
      const created = issues.find(r => r._id === data.request._id) || issues[0];
      if (created) {
        setSelected(created);
        await loadThread(created._id);
      }
    } catch (err) {
      setComposeError(err.message);
    } finally {
      setComposeSubmitting(false);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selected || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/requests/${selected._id}/messages`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ text: replyText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send message');
      setThread((prev) => prev.some(m => m._id === data._id) ? prev : [...prev, data]);
      setReplyText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0F0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <span onClick={onGoToHome} className="text-sm font-semibold cursor-pointer hover:underline" style={{ color: '#800020' }}>← Back to Home</span>

        <div className="flex items-center justify-between mt-6 mb-2">
          <h1 className="font-headings text-2xl md:text-3xl text-[#2e1a1a] font-bold">Help &amp; Support</h1>
          <button
            onClick={() => { setShowCompose(true); setComposeError(''); setComposeText(''); }}
            className="text-sm font-bold text-white bg-[#800020] hover:bg-[#a0002a] rounded-xl px-4 py-2 cursor-pointer"
          >
            + Report an Issue
          </button>
        </div>
        <p className="text-sm text-[#c07080] mb-8">Report a problem to the admin and chat with them until it's resolved.</p>

        {showCompose && (
          <div className="bg-white rounded-2xl border border-[#e8d0d0] p-5 mb-6">
            <p className="text-sm font-semibold text-[#2e1a1a] mb-2">Describe your issue:</p>
            <textarea
              value={composeText}
              onChange={(e) => setComposeText(e.target.value)}
              rows={3}
              placeholder="What's going wrong?"
              className="w-full p-2.5 rounded-lg border border-[#e8d0d0] bg-[#F5F0F0] text-sm text-[#2e1a1a] outline-none focus:border-[#800020] mb-2"
            />
            {composeError && <p className="text-xs text-red-600 mb-2">{composeError}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => setShowCompose(false)}
                className="flex-1 py-2 rounded-lg border border-[#e8d0d0] text-[#5a3a3a] text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={composeSubmitting}
                onClick={submitIssue}
                className="flex-1 py-2 rounded-lg bg-[#800020] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {composeSubmitting ? 'Sending...' : 'Send to Admin'}
              </button>
            </div>
          </div>
        )}

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-medium mb-6">{error}</div>}

        {loading ? (
          <div className="bg-white p-8 rounded-3xl text-center border border-[#e8d0d0] text-[#c07080]">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center border border-[#e8d0d0] text-[#c07080]">You haven't reported any issues yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
              {reports.map((r) => (
                <div
                  key={r._id}
                  onClick={() => selectReport(r)}
                  className={`min-w-[200px] md:min-w-0 bg-white rounded-2xl border p-4 cursor-pointer ${selected?._id === r._id ? 'border-[#800020]' : 'border-[#e8d0d0]'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.status === 'closed' ? 'bg-gray-100 text-gray-500' : 'bg-orange-50 text-orange-700'}`}>
                      {r.status === 'closed' ? 'Closed' : 'Open'}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b4848] truncate">{r.message}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#e8d0d0] flex flex-col" style={{ height: '480px' }}>
              {selected ? (
                <>
                  <div className="px-4 py-3 border-b border-[#e8d0d0] flex items-center justify-between">
                    <span className="text-sm font-bold text-[#2e1a1a]">Admin Support</span>
                    <span className={`text-xs font-bold ${threadStatus === 'closed' ? 'text-gray-500' : 'text-green-600'}`}>
                      {threadStatus === 'closed' ? '● Closed' : '● Open'}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {threadLoading ? (
                      <p className="text-center text-sm text-[#c07080]">Loading...</p>
                    ) : thread.length === 0 ? (
                      <p className="text-center text-sm text-[#c07080]">No messages yet.</p>
                    ) : (
                      thread.map((m) => {
                        const isMe = m.senderRole === 'student';
                        return (
                          <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl p-3 ${isMe ? 'bg-[#800020] text-white rounded-tr-none' : 'bg-[#F5F0F0] text-[#2e1a1a] rounded-tl-none'}`}>
                              <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                              <div className={`text-[10px] mt-1 ${isMe ? 'text-pink-200' : 'text-[#c07080]'}`}>
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {threadStatus === 'closed' ? (
                    <div className="px-4 py-3 border-t border-[#e8d0d0] text-xs text-center text-[#c07080]">
                      This chat has been closed by admin.
                    </div>
                  ) : (
                    <div className="px-3 py-3 border-t border-[#e8d0d0] flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                        className="flex-1 bg-[#F5F0F0] border border-[#e8d0d0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#800020] text-[#2e1a1a]"
                      />
                      <button
                        onClick={sendReply}
                        disabled={sending}
                        className="bg-[#800020] text-white px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer disabled:opacity-60"
                      >
                        {sending ? '...' : 'Send'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-[#c07080]">Select a report</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
