import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

const NOTIF_META = {
  claim_submitted: { label: 'Claim Submitted',      bg: '#fff7ed', color: '#c2410c' },
  claim_approved:  { label: 'Claim Approved',       bg: '#f0fdf4', color: '#16a34a' },
  claim_rejected:  { label: 'Claim Rejected',       bg: '#fef2f2', color: '#dc2626' },
  item_matched:    { label: 'Possible Match Found', bg: '#f5f3ff', color: '#7c3aed' },
  new_lost_item:   { label: 'New Lost Item',        bg: '#fdf6f7', color: '#800020' },
  new_found_item:  { label: 'New Found Item',       bg: '#eff6ff', color: '#2563eb' },
  report_reply:    { label: 'Support Replied',      bg: '#fdf6f7', color: '#800020' },
  message:         { label: 'New Message',          bg: '#fdf6f7', color: '#800020' },
  default:         { label: 'Notification',         bg: '#fdf6f7', color: '#800020' },
};

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const NotifIcon = ({ type }) => {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'claim_approved') return <svg {...common}><path d="M20 6L9 17l-5-5" /></svg>;
  if (type === 'claim_rejected') return <svg {...common}><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>;
  if (type === 'claim_submitted') return <svg {...common}><path d="M9 12h6" /><path d="M9 16h6" /><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M13 2v6h6" /></svg>;
  if (type === 'item_matched') return <svg {...common}><path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7z" /></svg>;
  if (type === 'new_lost_item') return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>;
  if (type === 'new_found_item') return <svg {...common}><path d="M20 12V8a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h8" /><path d="M18 21v-6" /><path d="M15 18h6" /></svg>;
  return <svg {...common}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
};

const Navbar = ({ isLoggedIn, activeTab, onNavigate, onGoToLogin, onGoToSignup, onLogout, onGoToProfile, onGoToMyReports, onGoToSupport, onOpenMatchedItem, onOpenLostItem }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);
  const notifRef = useRef(null);
  const dropdownRef = useRef(null);

  const [prevTab, setPrevTab] = useState(activeTab);

  if (prevTab !== activeTab) {
    setPrevTab(activeTab);
    setShowNotifs(false);
    setShowDropdown(false);
  }

  const user = (() => {
    try { 
      return JSON.parse(localStorage.getItem('user') || 'null'); 
    } catch { 
      return null; 
    }
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
      } catch {
        // Silently handle error
      }
    };
    fetchNotifications();

    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;
    
    socket.on('new_notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
    });
    
    socket.on('account_blocked', () => {
      alert('Your account has been blocked by the admin. You are being logged out.');
      if (onLogout) onLogout();
    });

    return () => socket.disconnect();
  }, [isLoggedIn, onLogout]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotifs = async () => {
    const opening = !showNotifs;
    setShowNotifs(opening);
    setShowDropdown(false);
    if (opening && unreadCount > 0) {
      const token = localStorage.getItem('token');
      try {
        await fetch(`${API_BASE}/notifications/read-all`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch {
        // Silently handle error
      }
    }
  };

  const handleNotifClick = (n) => {
    setShowNotifs(false);
    if (n.type === 'item_matched' && n.relatedItem && onOpenMatchedItem) {
      onOpenMatchedItem(n.relatedItem);
    } else if (n.type === 'new_found_item' && n.relatedItem && onOpenMatchedItem) {
      onOpenMatchedItem(n.relatedItem);
    } else if (n.type === 'new_lost_item' && n.relatedItem && onOpenLostItem) {
      onOpenLostItem(n.relatedItem);
    } else if (n.type === 'new_lost_item' && onNavigate) {
      onNavigate('lost-items');
    } else if (n.type === 'new_found_item' && onNavigate) {
      onNavigate('found-items');
    } else if (n.type === 'report_reply' && onGoToSupport) {
      onGoToSupport();
    } else if (['claim_submitted', 'claim_approved', 'claim_rejected', 'message'].includes(n.type) && onGoToMyReports) {
      onGoToMyReports();
    }
  };

  return (
    <nav className="flex justify-between items-center px-[5%] h-17 sticky top-0 z-1000 bg-white/95 backdrop-blur border-b border-[#e8d0d0]" style={{ boxShadow: '0 2px 20px rgba(128, 0, 32, 0.04)' }}>

      {/* 1. Brand Logo */}
      <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => onNavigate('home')}>
        <div className="w-9.5 h-9.5 rounded-xl flex items-center justify-center bg-[#800020] text-white shadow-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <span className="text-[1.35rem] font-bold text-[#2e1a1a]" style={{ fontFamily: "'Fraunces', serif" }}>LostLink</span>
      </div>

      {/* 2. Navigation Links with Pill/Button Shapes & No Text Selection */}
      <div className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#4b5563]">
        <span 
          onClick={() => onNavigate('home')} 
          className={`cursor-pointer select-none px-4 py-2 rounded-full transition-all duration-200 ${
            activeTab === 'home' 
              ? 'bg-[#800020] text-white shadow-sm font-bold' 
              : 'hover:bg-[#fff8f8] hover:text-[#800020]'
          }`}
        >
          Home
        </span>

        <span 
          onClick={() => onNavigate('found-items')} 
          className={`cursor-pointer select-none px-4 py-2 rounded-full transition-all duration-200 ${
            activeTab === 'found-items' 
              ? 'bg-[#800020] text-white shadow-sm font-bold' 
              : 'hover:bg-[#fff8f8] hover:text-[#800020]'
          }`}
        >
          Found Items
        </span>

        <span 
          onClick={() => onNavigate('lost-items')} 
          className={`cursor-pointer select-none px-4 py-2 rounded-full transition-all duration-200 ${
            activeTab === 'lost-items' 
              ? 'bg-[#800020] text-white shadow-sm font-bold' 
              : 'hover:bg-[#fff8f8] hover:text-[#800020]'
          }`}
        >
          Lost Items
        </span>

        <span 
          onClick={() => onNavigate('report-lost-found')} 
          className={`cursor-pointer select-none px-4 py-2 rounded-full transition-all duration-200 ${
            activeTab === 'report-lost-found' 
              ? 'bg-[#800020] text-white shadow-sm font-bold' 
              : 'hover:bg-[#fff8f8] hover:text-[#800020]'
          }`}
        >
          Report Lost &amp; Found Items
        </span>

        {isLoggedIn && (
          <span 
            onClick={() => onNavigate('my-reports')} 
            className={`cursor-pointer select-none px-4 py-2 rounded-full transition-all duration-200 ${
              activeTab === 'my-reports' 
                ? 'bg-[#800020] text-white shadow-sm font-bold' 
                : 'hover:bg-[#fff8f8] hover:text-[#800020]'
            }`}
          >
            My Reports
          </span>
        )}

        {isLoggedIn && (
          <span 
            onClick={() => onGoToSupport && onGoToSupport()} 
            className={`cursor-pointer select-none px-4 py-2 rounded-full transition-all duration-200 ${
              activeTab === 'support' 
                ? 'bg-[#800020] text-white shadow-sm font-bold' 
                : 'hover:bg-[#fff8f8] hover:text-[#800020]'
            }`}
          >
            Help &amp; Support
          </span>
        )}
      </div>

      {/* 3. Right Side Notification & User Profile Button */}
      <div className="flex items-center gap-3 relative">
        {isLoggedIn ? (
          <>
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
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
                <div className="absolute right-0 mt-2 w-80 max-h-[26rem] bg-white border border-[#e8d0d0] rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#f5f0f0] bg-[#fff8f8] flex items-center justify-between flex-shrink-0">
                    <span className="text-sm font-bold text-[#2e1a1a]">Notifications</span>
                    {notifications.length > 0 && (
                      <span className="text-[11px] font-semibold text-[#c07080]">{notifications.length} total</span>
                    )}
                  </div>
                  <div className="overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 px-6 text-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-[#fdf6f7] flex items-center justify-center text-[#e0a8b4]">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 01-3.46 0" />
                          </svg>
                        </div>
                        <p className="text-sm text-[#c07080] font-semibold">No notifications yet</p>
                        <p className="text-xs text-[#d9b3b3]">We'll let you know when something happens</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const meta = NOTIF_META[n.type] || NOTIF_META.default;
                        return (
                          <div
                            key={n._id}
                            onClick={() => handleNotifClick(n)}
                            className={`flex gap-3 px-4 py-3 border-b border-[#f5f0f0] last:border-0 cursor-pointer transition-colors hover:bg-[#fff8f8] ${!n.isRead ? 'bg-[#fffbfb]' : ''}`}
                          >
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: meta.bg, color: meta.color }}
                            >
                              <NotifIcon type={n.type} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[13px] ${!n.isRead ? 'font-bold text-[#2e1a1a]' : 'font-semibold text-[#5a3a3a]'}`}>
                                  {meta.label}
                                </span>
                                {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-[#800020] flex-shrink-0" />}
                              </div>
                              <p
                                className="text-[12.5px] text-[#6b4848] leading-snug mt-0.5"
                                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                              >
                                {n.message}
                              </p>
                              <span className="text-[10.5px] text-[#c5a3a3] mt-1 inline-block">{timeAgo(n.createdAt)}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Icon */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => { setShowDropdown(!showDropdown); setShowNotifs(false); }}
                className="w-10 h-10 rounded-full bg-white border-2 border-[#e8d0d0] text-[#800020] hover:border-[#800020] flex items-center justify-center cursor-pointer shadow-sm transition-all p-0 overflow-hidden"
                title={user?.name || "User Profile"}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e8d0d0] rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-1.5 border-b border-[#f5f0f0] mb-1">
                    <p className="text-xs text-[#999] font-medium">Logged in as</p>
                    <p className="text-sm font-bold text-[#800020] truncate">{user?.name || 'User'}</p>
                  </div>
                  <button onClick={() => { setShowDropdown(false); onGoToProfile(); }} className="w-full text-left px-4 py-2 text-sm text-[#2e1a1a] hover:bg-[#fff8f8] font-medium">Profile</button>
                  <button onClick={() => { setShowDropdown(false); onGoToMyReports(); }} className="w-full text-left px-4 py-2 text-sm text-[#2e1a1a] hover:bg-[#fff8f8] font-medium">My Reports</button>
                  <button onClick={() => { setShowDropdown(false); onGoToSupport && onGoToSupport(); }} className="w-full text-left px-4 py-2 text-sm text-[#2e1a1a] hover:bg-[#fff8f8] font-medium">Help &amp; Support</button>
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
              className="px-5 py-2 rounded-xl text-white font-bold text-sm bg-linear-to-r from-[#800020] to-[#4a0010] shadow hover:opacity-90 cursor-pointer transition-all">
              Register
            </button>
          </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;