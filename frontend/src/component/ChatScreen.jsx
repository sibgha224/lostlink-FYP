import React, { useState, useRef, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import { API_BASE, SOCKET_URL } from '../config';

const Icon = ({ d, size = 20, stroke = 2, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const ICONS = {
  back: 'M15 18l-6-6 6-6',
  clip: 'M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48',
  mic: ['M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v4', 'M8 23h8'],
  send: ['M22 2L11 13', 'M22 2l-7 20-4-9-9-4 20-7z'],
  image: ['M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z', 'M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'M21 15l-5-5L5 21'],
  file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6'],
  close: ['M18 6L6 18', 'M6 6l12 12'],
  edit: ['M12 20h9', 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z'],
  trash: ['M3 6h18', 'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6', 'M10 11v6', 'M14 11v6', 'M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'],
  more: ['M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z', 'M12 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z', 'M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'],
  lock: ['M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z', 'M7 11V7a5 5 0 0 1 10 0v4'],
  chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  stop: 'M6 6h12v12H6z',
};

const Ticks = ({ read }) => (
  <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke={read ? '#7dd3fc' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 6l3 3 6-7" />
    <path d="M6 9l1 1 7-8" />
  </svg>
);

const dayLabel = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
};

const timeLabel = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ChatScreen = ({ claimId, partnerName, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isChatDisabled, setIsChatDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [menuFor, setMenuFor] = useState(null);
  const [editing, setEditing] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordTimerRef = useRef(null);
  const textareaRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const partnerIdRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const currentUserId = currentUser?._id || currentUser?.id;
  const initials = (partnerName || '?').trim().split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  const imagePreviewUrl = useMemo(() => (selectedImage ? URL.createObjectURL(selectedImage) : null), [selectedImage]);
  const audioPreviewUrl = useMemo(() => (recordedAudio ? URL.createObjectURL(recordedAudio) : null), [recordedAudio]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [inputText]);

  useEffect(() => {
    const close = () => { setMenuFor(null); setAttachOpen(false); };
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const markRead = () => {
    const token = localStorage.getItem('token');
    if (!token || !claimId) return;
    fetch(`${API_BASE}/chat/${claimId}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  };

  useEffect(() => {
    if (!claimId) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');

    const loadMessages = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE}/chat/${claimId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load messages');
        setMessages(data.messages || []);
        const partnerMsg = (data.messages || []).find((m) => (m.sender?._id || m.sender) !== currentUserId);
        if (partnerMsg) partnerIdRef.current = partnerMsg.sender?._id || partnerMsg.sender;
        setIsChatDisabled(!!data.isChatDisabled);
        markRead();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();

    if (token) {
      const socket = io(SOCKET_URL, { auth: { token } });
      socketRef.current = socket;

      socket.on('receive_message', (msg) => {
        if (msg.claim === claimId || msg.claim?._id === claimId) {
          partnerIdRef.current = msg.sender?._id || msg.sender;
          setMessages((prev) => [...prev, msg]);
          setIsTyping(false);
          setIsOnline(true);
          markRead();
        }
      });
      socket.on('typing', (data) => {
        if (data.claimId === claimId) {
          if (data.userId) partnerIdRef.current = data.userId;
          setIsTyping(true);
          setIsOnline(true);
        }
      });
      socket.on('stop_typing', (data) => {
        if (data.claimId === claimId) setIsTyping(false);
      });
      const isPartner = (data) => !partnerIdRef.current || !data?.userId || data.userId === partnerIdRef.current;
      socket.on('user_online', (data) => { if (isPartner(data)) setIsOnline(true); });
      socket.on('user_offline', (data) => { if (isPartner(data)) { setIsOnline(false); setIsTyping(false); } });
      socket.on('chat_locked', (data) => {
        if (data?.claimId === claimId) {
          setIsChatDisabled(true);
          setEditing(null);
          setMenuFor(null);
        }
      });
      socket.on('messages_read', (data) => {
        if (data.claimId === claimId) {
          setMessages((prev) => prev.map((m) => ((m.sender?._id || m.sender) === currentUserId ? { ...m, isRead: true } : m)));
          setIsOnline(true);
        }
      });
      socket.on('message_deleted', (data) => {
        setMessages((prev) => prev.map((m) => (m._id === data._id ? { ...m, isDeleted: true, text: '', image: '', audio: '', file: '' } : m)));
      });
      socket.on('message_edited', (msg) => {
        setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current?.stream?.getTracks().forEach((t) => t.stop());
    };
  }, [claimId]);

  const emitTyping = () => {
    if (!socketRef.current || !claimId) return;
    socketRef.current.emit('typing', { claimId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('stop_typing', { claimId });
    }, 1500);
  };

  const clearAttachments = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setRecordedAudio(null);
  };

  const saveEdit = async () => {
    const text = inputText.trim();
    if (!text || !editing) return;
    const token = localStorage.getItem('token');
    try {
      setSending(true);
      const response = await fetch(`${API_BASE}/chat/message/${editing._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to edit message');
      setMessages((prev) => prev.map((m) => (m._id === data._id ? data : m)));
      setEditing(null);
      setInputText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleSend = async () => {
    if (editing) return saveEdit();
    if ((!inputText.trim() && !selectedImage && !recordedAudio && !selectedFile) || !claimId || sending) return;
    const token = localStorage.getItem('token');

    const payload = new FormData();
    if (inputText.trim()) payload.append('text', inputText.trim());
    if (selectedImage) payload.append('image', selectedImage);
    if (recordedAudio) payload.append('audio', recordedAudio, 'voice-note.webm');
    if (selectedFile) payload.append('file', selectedFile);

    try {
      setSending(true);
      setError('');
      const response = await fetch(`${API_BASE}/chat/${claimId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send message');
      setMessages((prev) => [...prev, data]);
      setInputText('');
      clearAttachments();
      socketRef.current?.emit('stop_typing', { claimId });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (msg) => {
    setMenuFor(null);
    if (!window.confirm('Delete this message for everyone?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE}/chat/message/${msg._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete message');
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, isDeleted: true, text: '', image: '', audio: '', file: '' } : m)));
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (msg) => {
    setMenuFor(null);
    clearAttachments();
    setEditing(msg);
    setInputText(msg.text || '');
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const cancelEdit = () => {
    setEditing(null);
    setInputText('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAudio(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } catch {
      setError('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
  };

  const formatSeconds = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const hasContent = inputText.trim() || selectedImage || selectedFile || recordedAudio;
  const goBack = onBack || (() => window.history.back());

  const statusText = isChatDisabled
    ? 'Item returned · chat closed'
    : isTyping
      ? 'typing…'
      : isOnline
        ? 'Online'
        : 'Claim approved · chat active';

  if (!claimId) {
    return (
      <div className="flex flex-col h-screen bg-[#F5F0F0] items-center justify-center text-center px-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="w-16 h-16 rounded-full bg-white border border-[#e8d0d0] flex items-center justify-center text-[#800020] mb-4">
          <Icon d={ICONS.chat} size={28} />
        </div>
        <p className="text-[#6b4848] font-medium mb-5 max-w-sm">No conversation selected. Open a chat from an approved claim in "My Reports".</p>
        <button onClick={goBack} className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white cursor-pointer" style={{ background: '#800020' }}>
          Go back
        </button>
      </div>
    );
  }

  let lastDay = null;

  return (
    <div className="flex flex-col h-screen" style={{ fontFamily: "'DM Sans', sans-serif", background: '#f6efef' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .ll-chat-bg { background-color:#f6efef; background-image: radial-gradient(rgba(128,0,32,0.06) 1px, transparent 1px); background-size: 18px 18px; }
        .ll-scroll::-webkit-scrollbar { width: 6px; }
        .ll-scroll::-webkit-scrollbar-thumb { background: #e2c6c9; border-radius: 10px; }
        .ll-dot { width:6px; height:6px; border-radius:50%; background:#c07080; display:inline-block; animation: ll-bounce 1.2s infinite ease-in-out; }
        .ll-dot:nth-child(2) { animation-delay: .15s; }
        .ll-dot:nth-child(3) { animation-delay: .3s; }
        @keyframes ll-bounce { 0%, 80%, 100% { transform: translateY(0); opacity:.5 } 40% { transform: translateY(-4px); opacity:1 } }
        .ll-pulse { animation: ll-pulse 1s infinite; }
        @keyframes ll-pulse { 0%,100% { opacity:1 } 50% { opacity:.3 } }
        .ll-bubble:hover .ll-more { opacity: 1; }
        .ll-fade { animation: ll-fade .18s ease-out; }
        @keyframes ll-fade { from { opacity:0; transform: translateY(4px) } to { opacity:1; transform:none } }
      `}</style>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#ecdcdc] px-3 md:px-5 py-2.5 flex items-center gap-3 shadow-[0_1px_8px_rgba(74,0,16,0.05)]">
        <button onClick={goBack} className="w-9 h-9 rounded-full flex items-center justify-center text-[#800020] hover:bg-[#fbf3f4] cursor-pointer" title="Back">
          <Icon d={ICONS.back} size={22} />
        </button>
        <div className="relative flex-shrink-0">
          <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ background: 'linear-gradient(135deg,#800020,#4a0010)' }}>
            {initials}
          </div>
          {isOnline && !isChatDisabled && (
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-[#2e1a1a] text-[15px] leading-tight truncate">{partnerName || 'Chat'}</h2>
          <p className={`text-xs truncate ${isTyping ? 'text-[#800020] font-semibold' : isOnline ? 'text-green-600 font-medium' : 'text-[#a08080]'}`}>
            {statusText}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-[#800020] bg-[#fbf3f4] border border-[#f0dade] rounded-full px-3 py-1">
          <Icon d={ICONS.lock} size={12} />
          Private claim chat
        </div>
      </header>

      {error && (
        <div className="mx-4 mt-3 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-medium flex items-center justify-between gap-3">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-500 cursor-pointer"><Icon d={ICONS.close} size={16} /></button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto ll-scroll ll-chat-bg px-3 md:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#c07080] text-sm gap-3">
              <span className="flex gap-1"><span className="ll-dot" /><span className="ll-dot" /><span className="ll-dot" /></span>
              Loading conversation…
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-white border border-[#ecdcdc] flex items-center justify-center text-[#800020] mb-4 shadow-sm">
                <Icon d={ICONS.chat} size={28} />
              </div>
              <p className="font-bold text-[#2e1a1a]">Start the conversation</p>
              <p className="text-sm text-[#a08080] mt-1 max-w-xs">Say hello to {partnerName || 'the other person'} and agree on where to hand over the item.</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const senderId = msg.sender?._id || msg.sender;
              const isMe = senderId === currentUserId;
              const prev = messages[index - 1];
              const prevSender = prev ? (prev.sender?._id || prev.sender) : null;
              const day = dayLabel(msg.createdAt);
              const showDay = day !== lastDay;
              lastDay = day;
              const grouped = !showDay && prevSender === senderId;
              const canManage = isMe && !msg.isDeleted && !isChatDisabled;

              return (
                <React.Fragment key={msg._id}>
                  {showDay && (
                    <div className="flex justify-center my-4">
                      <span className="text-[11px] font-semibold text-[#8a6a6a] bg-white/90 border border-[#ecdcdc] rounded-full px-3 py-1 shadow-sm">{day}</span>
                    </div>
                  )}
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${grouped ? 'mt-1' : 'mt-3'} ll-fade`}>
                    <div className={`ll-bubble relative max-w-[80%] md:max-w-[62%] px-3 pt-2 pb-1.5 shadow-sm ${
                      isMe
                        ? `text-white ${grouped ? 'rounded-2xl' : 'rounded-2xl rounded-tr-md'}`
                        : `bg-white text-[#2e1a1a] border border-[#ecdcdc] ${grouped ? 'rounded-2xl' : 'rounded-2xl rounded-tl-md'}`
                    }`} style={isMe ? { background: 'linear-gradient(135deg,#8a0a2a,#5a0014)' } : undefined}>
                      {canManage && (
                        <div className="absolute -left-8 top-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setMenuFor(menuFor === msg._id ? null : msg._id); }}
                            className="ll-more opacity-0 w-7 h-7 rounded-full flex items-center justify-center text-[#a08080] hover:bg-white hover:text-[#800020] cursor-pointer transition-opacity"
                            title="Options">
                            <Icon d={ICONS.more} size={16} />
                          </button>
                          {menuFor === msg._id && (
                            <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-8 z-30 bg-white border border-[#ecdcdc] rounded-xl shadow-lg py-1 w-32 text-sm">
                              {msg.text && !msg.image && !msg.audio && !msg.file && (
                                <button onClick={() => startEdit(msg)} className="w-full flex items-center gap-2 px-3 py-2 text-[#2e1a1a] hover:bg-[#fbf3f4] cursor-pointer">
                                  <Icon d={ICONS.edit} size={14} /> Edit
                                </button>
                              )}
                              <button onClick={() => deleteMessage(msg)} className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 cursor-pointer">
                                <Icon d={ICONS.trash} size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {msg.isDeleted ? (
                        <p className={`text-sm italic flex items-center gap-1.5 ${isMe ? 'text-pink-100/80' : 'text-[#a08080]'}`}>
                          <Icon d={ICONS.trash} size={13} /> This message was deleted
                        </p>
                      ) : (
                        <>
                          {msg.image && (
                            <button onClick={() => setPreviewImage(msg.image)} className="block mb-1.5 -mx-1 overflow-hidden rounded-xl cursor-zoom-in">
                              <img src={msg.image} alt="attachment" className="w-64 max-w-full max-h-72 object-cover" />
                            </button>
                          )}
                          {msg.audio && (
                            <audio controls src={msg.audio} className="mb-1.5 max-w-full" style={{ height: '38px' }} />
                          )}
                          {msg.file && (
                            <a
                              href={msg.file}
                              target="_blank"
                              rel="noreferrer"
                              className={`mb-1.5 flex items-center gap-3 rounded-xl px-3 py-2.5 ${isMe ? 'bg-white/15 text-white' : 'bg-[#f8f1f1] text-[#2e1a1a]'}`}>
                              <span className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isMe ? 'bg-white/20' : 'bg-white text-[#800020]'}`}>
                                <Icon d={ICONS.file} size={18} />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-sm font-semibold truncate max-w-[200px]">{msg.fileName || 'Document'}</span>
                                <span className={`block text-[11px] ${isMe ? 'text-pink-100/80' : 'text-[#a08080]'}`}>Tap to open</span>
                              </span>
                            </a>
                          )}
                          {msg.text && <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}
                        </>
                      )}

                      <div className={`flex items-center gap-1 mt-0.5 text-[10.5px] justify-end ${isMe ? 'text-pink-100/80' : 'text-[#a08080]'}`}>
                        {msg.isEdited && !msg.isDeleted && <span>edited ·</span>}
                        <span>{timeLabel(msg.createdAt)}</span>
                        {isMe && !msg.isDeleted && <Ticks read={msg.isRead} />}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}

          {isTyping && (
            <div className="flex justify-start mt-3">
              <div className="bg-white border border-[#ecdcdc] rounded-2xl rounded-tl-md px-4 py-3 shadow-sm flex gap-1">
                <span className="ll-dot" /><span className="ll-dot" /><span className="ll-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {isChatDisabled ? (
        <div className="bg-white border-t border-[#ecdcdc] px-4 py-4 text-center">
          <p className="text-sm text-[#6b4848] flex items-center justify-center gap-2">
            <Icon d={ICONS.lock} size={15} />
            This item has been marked as returned. The conversation is now read-only.
          </p>
        </div>
      ) : (
        <div className="bg-white border-t border-[#ecdcdc]">
          <div className="max-w-3xl mx-auto">
            {editing && (
              <div className="flex items-center justify-between gap-3 mx-3 mt-3 px-3 py-2 rounded-xl bg-[#fbf3f4] border-l-4 border-[#800020]">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#800020]">Editing message</p>
                  <p className="text-xs text-[#6b4848] truncate">{editing.text}</p>
                </div>
                <button onClick={cancelEdit} className="text-[#800020] cursor-pointer"><Icon d={ICONS.close} size={18} /></button>
              </div>
            )}

            {(selectedImage || selectedFile || recordedAudio) && (
              <div className="flex flex-wrap gap-2 mx-3 mt-3">
                {selectedImage && (
                  <div className="relative">
                    <img src={imagePreviewUrl} alt="preview" className="w-20 h-20 object-cover rounded-xl border border-[#ecdcdc]" />
                    <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#2e1a1a] text-white flex items-center justify-center cursor-pointer">
                      <Icon d={ICONS.close} size={12} />
                    </button>
                  </div>
                )}
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-[#fbf3f4] border border-[#ecdcdc] rounded-xl pl-3 pr-2 py-2">
                    <span className="text-[#800020]"><Icon d={ICONS.file} size={16} /></span>
                    <span className="text-xs font-semibold text-[#2e1a1a] max-w-[180px] truncate">{selectedFile.name}</span>
                    <button onClick={() => setSelectedFile(null)} className="text-[#800020] cursor-pointer"><Icon d={ICONS.close} size={14} /></button>
                  </div>
                )}
                {recordedAudio && (
                  <div className="flex items-center gap-2 bg-[#fbf3f4] border border-[#ecdcdc] rounded-xl pl-2 pr-2 py-1.5">
                    <audio controls src={audioPreviewUrl} style={{ height: '32px' }} />
                    <button onClick={() => setRecordedAudio(null)} className="text-[#800020] cursor-pointer"><Icon d={ICONS.close} size={14} /></button>
                  </div>
                )}
              </div>
            )}

            {isRecording ? (
              <div className="flex items-center gap-3 px-3 py-3">
                <div className="flex-1 flex items-center gap-3 bg-[#fbf3f4] border border-[#ecdcdc] rounded-full px-4 py-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 ll-pulse" />
                  <span className="text-sm font-semibold text-[#2e1a1a]">Recording {formatSeconds(recordSeconds)}</span>
                </div>
                <button onClick={stopRecording} className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer shadow" title="Stop recording">
                  <Icon d={ICONS.stop} size={16} fill="currentColor" stroke={0} />
                </button>
              </div>
            ) : (
              <div className="flex items-end gap-2 px-3 py-3">
                {!editing && (
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setAttachOpen(!attachOpen); }}
                      className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-colors ${attachOpen ? 'bg-[#fbf3f4] text-[#800020]' : 'text-[#8a6a6a] hover:bg-[#fbf3f4] hover:text-[#800020]'}`}
                      title="Attach">
                      <Icon d={ICONS.clip} size={20} />
                    </button>
                    {attachOpen && (
                      <div onClick={(e) => e.stopPropagation()} className="absolute bottom-14 left-0 z-30 bg-white border border-[#ecdcdc] rounded-2xl shadow-lg p-1.5 w-44">
                        <button onClick={() => { setAttachOpen(false); imageInputRef.current?.click(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#2e1a1a] hover:bg-[#fbf3f4] cursor-pointer">
                          <span className="w-8 h-8 rounded-full bg-[#800020] text-white flex items-center justify-center"><Icon d={ICONS.image} size={15} /></span>
                          Photo
                        </button>
                        <button onClick={() => { setAttachOpen(false); fileInputRef.current?.click(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#2e1a1a] hover:bg-[#fbf3f4] cursor-pointer">
                          <span className="w-8 h-8 rounded-full bg-[#4a0010] text-white flex items-center justify-center"><Icon d={ICONS.file} size={15} /></span>
                          Document
                        </button>
                      </div>
                    )}
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { setSelectedImage(e.target.files[0] || null); e.target.value = ''; }} />
                    <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => { setSelectedFile(e.target.files[0] || null); e.target.value = ''; }} />
                  </div>
                )}

                {!editing && (
                  <button
                    onClick={startRecording}
                    className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-colors text-[#8a6a6a] hover:bg-[#fbf3f4] hover:text-[#800020] flex-shrink-0"
                    title="Record voice note">
                    <Icon d={ICONS.mic} size={20} />
                  </button>
                )}

                <textarea
                  ref={textareaRef}
                  rows={1}
                  placeholder={editing ? 'Edit your message' : 'Type a message'}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (!editing) emitTyping();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                    if (e.key === 'Escape' && editing) cancelEdit();
                  }}
                  className="flex-1 resize-none bg-[#f8f2f2] border border-[#ecdcdc] rounded-3xl px-4 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#800020] focus:bg-white text-[#2e1a1a] placeholder:text-[#b39595] transition-colors"
                  style={{ maxHeight: 120 }}
                />

                <button
                  onClick={handleSend}
                  disabled={sending || (!hasContent && !editing)}
                  className="w-11 h-11 rounded-full text-white flex items-center justify-center cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-default flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#800020,#4a0010)' }}
                  title={editing ? 'Save' : 'Send'}>
                  {sending
                    ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : <Icon d={ICONS.send} size={18} />}
                </button>
              </div>
            )}
            <p className="hidden md:block text-[10.5px] text-[#b39595] text-center -mt-1 pb-2">Press Enter to send · Shift + Enter for a new line</p>
          </div>
        </div>
      )}

      {previewImage && (
        <div onClick={() => setPreviewImage(null)} className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 cursor-zoom-out">
          <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center cursor-pointer">
            <Icon d={ICONS.close} size={20} />
          </button>
          <img src={previewImage} alt="preview" className="max-w-full max-h-full rounded-xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
