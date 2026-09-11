import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
};

const ProfileModal = (props) => {
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });
  const [reportCount, setReportCount] = useState(null);
  const [rating, setRating] = useState(null); // { average, count }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API_BASE}/lost-items/my-items`, { headers }).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/found-items/my-items`, { headers }).then(r => r.json()).catch(() => []),
    ]).then(([lost, found]) => {
      const lostCount = Array.isArray(lost) ? lost.length : 0;
      const foundCount = Array.isArray(found) ? found.length : 0;
      setReportCount(lostCount + foundCount);
    });

    if (user?.id) {
      fetch(`${API_BASE}/reviews/user/${user.id}`, { headers })
        .then(r => r.json())
        .then(data => setRating({ average: data.average || 0, count: data.count || 0 }))
        .catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0F0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-[5%] h-[68px] sticky top-0 z-[1000] bg-white/95 backdrop-blur border-b border-[#e8d0d0]">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={props.onGoToHome}>
          <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center bg-[#800020] text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <span className="font-headings text-[1.35rem] text-[#2e1a1a]">LostLink</span>
        </div>
        <button onClick={props.onGoToHome} className="px-5 py-2 rounded-xl bg-[#800020] text-white font-bold text-sm cursor-pointer hover:opacity-90">
          Back to Home
        </button>
      </nav>

      {/* PROFILE CONTENT */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-headings text-2xl md:text-3xl text-[#2e1a1a] mb-2 font-bold">My Profile</h1>
        <p className="text-[#c07080] text-sm md:text-base mb-8 font-medium">
          Manage your personal information and student credentials.
        </p>

        <div className="bg-white rounded-3xl border border-[#e8d0d0] p-8 shadow-sm space-y-6">

          {/* Avatar & Name */}
          <div className="flex items-center gap-4 pb-6 border-b border-[#e8d0d0]">
            <div className="w-20 h-20 rounded-full bg-[#800020] text-white flex items-center justify-center text-2xl font-bold shadow">
              {getInitials(user?.name)}
            </div>
            <div>
              <h2 className="font-bold text-[#2e1a1a] text-xl">{user?.name || 'Student'}</h2>
              <p className="text-sm text-[#c07080]">{user?.email || '—'}</p>
              <div className="flex items-center gap-2 mt-2">
                {user?.isVerified && (
                  <span className="inline-block text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full border border-green-200">
                    Verified Student
                  </span>
                )}
                {rating && rating.count > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 font-bold px-3 py-1 rounded-full border border-amber-200">
                    ⭐ {rating.average} <span className="font-normal">({rating.count})</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F5F0F0] p-4 rounded-2xl">
              <p className="text-xs text-[#c07080] font-bold uppercase">Department</p>
              <p className="text-sm font-bold text-[#2e1a1a] mt-1">{user?.department || '—'}</p>
            </div>
            <div className="bg-[#F5F0F0] p-4 rounded-2xl">
              <p className="text-xs text-[#c07080] font-bold uppercase">Roll Number</p>
              <p className="text-sm font-bold text-[#2e1a1a] mt-1">{user?.rollNo || '—'}</p>
            </div>
            <div className="bg-[#F5F0F0] p-4 rounded-2xl">
              <p className="text-xs text-[#c07080] font-bold uppercase">Session / Shift</p>
              <p className="text-sm font-bold text-[#2e1a1a] mt-1">{user?.session || '—'} · {user?.shift || '—'}</p>
            </div>
            <div className="bg-[#F5F0F0] p-4 rounded-2xl">
              <p className="text-xs text-[#c07080] font-bold uppercase">Total Reports Submitted</p>
              <p className="text-sm font-bold text-[#2e1a1a] mt-1">{reportCount === null ? 'Loading...' : `${reportCount} Item${reportCount === 1 ? '' : 's'}`}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              onClick={props.onGoToMyReports}
              className="flex-1 bg-[#800020] text-white py-3 rounded-xl font-bold text-sm shadow hover:opacity-90 cursor-pointer">
              View My Reports
            </button>
            <button
              onClick={props.onLogout}
              className="px-6 bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl font-bold text-sm hover:bg-red-100 cursor-pointer">
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
