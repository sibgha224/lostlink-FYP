import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

const ChatScreen = ({ claimId, partnerName, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatDisabled, setIsChatDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Load message history + connect socket for this claim
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
        setIsChatDisabled(!!data.isChatDisabled);
        fetch(`${API_BASE}/chat/${claimId}/read`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
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
          setMessages((prev) => [...prev, msg]);
        }
      });
      socket.on('typing', (data) => {
        if (data.claimId === claimId) setIsTyping(true);
      });
      socket.on('stop_typing', (data) => {
        if (data.claimId === claimId) setIsTyping(false);
      });
      socket.on('message_deleted', (data) => {
        setMessages((prev) => prev.map(m => m._id === data._id ? { ...m, isDeleted: true, text: '', image: '' } : m));
      });
      socket.on('message_edited', (msg) => {
        setMessages((prev) => prev.map(m => m._id === msg._id ? msg : m));
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
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

  const handleSend = async () => {
    if ((!inputText.trim() && !selectedImage) || !claimId || sending) return;
    const token = localStorage.getItem('token');

    const payload = new FormData();
    if (inputText.trim()) payload.append('text', inputText.trim());
    if (selectedImage) payload.append('image', selectedImage);

    try {
      setSending(true);
      const response = await fetch(`${API_BASE}/chat/${claimId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send message');
      setMessages((prev) => [...prev, data]);
      setInputText('');
      setSelectedImage(null);
      socketRef.current?.emit('stop_typing', { claimId });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (!claimId) {
    return (
      <div className="flex flex-col h-screen bg-[#F5F0F0] items-center justify-center text-center px-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <p className="text-[#c07080] font-medium mb-4">No conversation selected. Open a chat from an approved claim in "My Reports".</p>
        <button onClick={onBack || (() => window.history.back())} className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white cursor-pointer" style={{ background: '#800020' }}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F5F0F0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e8d0d0] px-4 py-3 flex flex-col shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack || (() => window.history.back())}
              className="p-2 rounded-xl hover:bg-[#fff8f8] text-[#800020] font-bold cursor-pointer">
              ← Back
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-sm">
                {(partnerName || '?').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="font-bold text-[#2e1a1a] text-base leading-tight">{partnerName || 'Chat'}</h2>
                <span className="text-xs text-green-600 font-semibold">● Claim Approved — Chat Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="mx-4 mt-3 p-3 bg-red-100 text-red-700 text-sm rounded-xl font-medium">{error}</div>
      )}

      {isChatDisabled && (
        <div className="mx-4 mt-3 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-xl font-medium">
          This item has been marked as returned. This conversation is now read-only.
        </div>
      )}

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full text-center text-[#c07080] font-medium text-sm">
            Loading conversation...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-center text-[#c07080] font-medium text-sm">
            No messages yet — say hello!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = (msg.sender?._id || msg.sender) === currentUser?._id;
            return (
              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] md:max-w-[50%] rounded-2xl p-3 shadow-sm ${
                  isMe ? 'bg-[#800020] text-white rounded-tr-none' : 'bg-white text-[#2e1a1a] border border-[#e8d0d0] rounded-tl-none'
                }`}>
                  {msg.isDeleted ? (
                    <p className="text-sm italic opacity-70">Message deleted</p>
                  ) : (
                    <>
                      {msg.image && (
                        <div className="mb-2 overflow-hidden rounded-xl">
                          <img src={msg.image} alt="attachment" className="w-full h-36 object-cover" />
                        </div>
                      )}
                      {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
                    </>
                  )}
                  <div className={`flex items-center gap-1 mt-1 text-[10px] ${isMe ? 'text-pink-200 justify-end' : 'text-[#c07080] justify-start'}`}>
                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.isEdited && <span>(edited)</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="flex items-center gap-1 text-xs text-[#c07080] italic px-2">
            <span>{partnerName || 'They'} {partnerName ? 'is' : 'are'} typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* TYPING BOX */}
      {!isChatDisabled && (
        <div className="p-3 bg-white border-t border-[#e8d0d0] flex items-center gap-2">
          <label className="cursor-pointer p-2 rounded-xl hover:bg-[#fff8f8] text-[#800020]">
            📎
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </label>

          <input
            type="text"
            placeholder={selectedImage ? `Image attached: ${selectedImage.name}` : 'Type a message...'}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              emitTyping();
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-[#F5F0F0] border border-[#e8d0d0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#800020] text-[#2e1a1a]"
          />

          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-gradient-to-r from-[#800020] to-[#4a0010] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow cursor-pointer disabled:opacity-60">
            {sending ? '...' : 'Send'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
