import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
};

const Navbar = ({ isLoggedIn, activeTab, onNavigate, onGoToLogin, onGoToSignup, onLogout, onGoToProfile, onGoToMyReports }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (!isLoggedIn) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE}/notifications`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok) setNotifications(Array.isArray(data) ? data : []);
      } catch { /* silent */ }
    };
    fetchNotifications();

    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;
    socket.on('new_notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
    });

    return () => socket.disconnect();
  }, [isLoggedIn]);

  const toggleNotifs = async () => {
    const opening = !showNotifs;
    setShowNotifs(opening);
    setShowDropdown(false);
    if (opening && unreadCount > 0) {
      const token = localStorage.getItem('token');
      try {
        await fetch(`${API_BASE}/notifications/read-all`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch { /* silent */ }
    }
  };

  return (
    <nav className="flex justify-between items-center px-[5%] h-[68px] sticky top-0 z-[1000] bg-white/95 backdrop-blur border-b border-[#e8d0d0]" style={{ boxShadow: '0 2px 20px rgba(128, 0, 32, 0.04)' }}>

      {/* Logo */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
        <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center bg-[#800020] text-white shadow-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <span className="text-[1.35rem] font-bold text-[#2e1a1a]" style={{ fontFamily: "'Fraunces', serif" }}>LostLink</span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#4b5563]">
        <span onClick={() => onNavigate('home')} className="cursor-pointer hover:text-[#800020] transition-colors">Home</span>
        <span onClick={() => onNavigate('found-items')} className="cursor-pointer hover:text-[#800020] transition-colors">Found Items</span>
        <span onClick={() => onNavigate('lost-items')} className="cursor-pointer hover:text-[#800020] transition-colors">Lost Items</span>
        <span onClick={() => onNavigate('report-lost-found')} className="cursor-pointer hover:text-[#800020] transition-colors">Report Lost & Found Items</span>
        {isLoggedIn && (
          <span onClick={() => onNavigate('my-reports')} className="cursor-pointer hover:text-[#800020] transition-colors">My Reports</span>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 relative">
        {isLoggedIn ? (
          <>
            {/* Notification Bell */}
            <div className="relative">
              <button onClick={toggleNotifs} className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#800020] hover:bg-[#fff8f8] cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#800020] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white border border-[#e8d0d0] rounded-2xl shadow-xl py-2 z-50">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-[#c07080]">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n._id} className={`px-4 py-2.5 text-sm border-b border-[#f5f0f0] last:border-0 ${n.isRead ? 'text-[#5a3a3a]' : 'text-[#2e1a1a] font-semibold bg-[#fff8f8]'}`}>
                        {n.message}
                        <div className="text-[10px] text-[#c5a3a3] mt-0.5">{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <div
                onClick={() => { setShowDropdown(!showDropdown); setShowNotifs(false); }}
                className="w-10 h-10 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-sm cursor-pointer shadow hover:opacity-90">
                {getInitials(user?.name)}
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e8d0d0] rounded-2xl shadow-xl py-2 z-50">
                  <button onClick={() => { setShowDropdown(false); onGoToProfile(); }} className="w-full text-left px-4 py-2 text-sm text-[#2e1a1a] hover:bg-[#fff8f8] font-medium">Profile</button>
                  <button onClick={() => { setShowDropdown(false); onGoToMyReports(); }} className="w-full text-left px-4 py-2 text-sm text-[#2e1a1a] hover:bg-[#fff8f8] font-medium">My Reports</button>
                  <div className="border-t border-[#e8d0d0] my-1"></div>
                  <button onClick={() => { setShowDropdown(false); onLogout(); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Logout</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onGoToLogin}
              className="px-5 py-2 rounded-xl border border-[#e8d0d0] text-[#800020] font-bold text-sm bg-white hover:bg-[#fff8f8] cursor-pointer transition-all">
              Login
            </button>
            <button
              onClick={onGoToSignup}
              className="px-5 py-2 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-[#800020] to-[#4a0010] shadow hover:opacity-90 cursor-pointer transition-all">
              Register
            </button>
          </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
