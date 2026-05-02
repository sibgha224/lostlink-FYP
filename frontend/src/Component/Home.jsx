import React, { useState } from 'react';

const Home = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const reportedItems = [
    { type: 'LOST', name: 'Blue Backpack', location: 'Science Building - Room 204', status: 'Reported 3h ago', image: '/backpack.jpeg' },
    { type: 'FOUND', name: 'Apple AirPods', location: 'Student Union Cafe', status: 'Reported 12h ago', image: '/airpods.jpeg' },
    { type: 'LOST', name: 'House Keys', location: 'Main Gymnasium Locker', status: 'Reported yesterday', image: '/keys.jpeg' },
    { type: 'FOUND', name: 'Scientific Calculator', location: 'Engineering Lab 4', status: 'Reported yesterday', image: '/calculator.jpeg' },
  ];

  const testimonials = [
    { name: 'Sarah Jenkins', dept: 'Psychology Major', text: 'Found my keys within an hour! I was so stressed about getting back into my dorm, but someone had already posted them here.', avatar: 'SJ' },
    { name: 'Marcus Chen', dept: 'Computer Science', text: 'I left my AirPods at the library and thought they were gone forever. This portal is a lifesaver for forgetful students like me!', avatar: 'MC' },
    { name: 'Elena Rodriguez', dept: 'Biology Senior', text: 'Reported a calculator I found in the lab, and the owner reached out five minutes later. The verification process was super smooth.', avatar: 'ER' },
  ];

  return (
    <div className="min-h-screen m-0 p-0" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", backgroundColor: '#f0f4ff' }}>

      <style>{`
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(37,99,235,0.12) !important; }
        .grad-text { background: linear-gradient(135deg, #2563eb, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      `}</style>

      {/* ===== NAVBAR ===== */}
      <nav className="flex justify-between items-center px-[5%] h-[68px] sticky top-0 z-[1000]"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e0e7ff', boxShadow: '0 2px 20px rgba(37,99,235,0.08)' }}>

        <div className="flex items-center gap-2.5">
          <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <span className="text-[1.35rem] font-extrabold text-[#1e1b4b] tracking-tight">LostLink</span>
        </div>

        <div className="hidden md:flex gap-1">
          {['Home', 'Report Lost', 'Report Found', 'Browse All'].map((link, i) => (
            <span key={link}
              onClick={i === 1 ? props.onGoToReportLost : i === 2 ? props.onGoToReportFound : undefined}
              className="px-4 py-2 rounded-lg cursor-pointer text-[0.9rem] font-semibold transition-all hover:text-blue-600 hover:bg-blue-50"
              style={{ color: i === 0 ? '#2563eb' : '#475569', background: i === 0 ? '#eff6ff' : 'transparent' }}>
              {link}
            </span>
          ))}
        </div>

        <div className="hidden md:flex gap-2.5 items-center">
          <button onClick={props.onGoToLogin}
            className="px-5 py-2 rounded-[10px] font-bold cursor-pointer text-[0.9rem] transition-all hover:bg-[#e8edff]"
            style={{ border: '1.5px solid #c7d2fe', background: 'transparent', color: '#4338ca' }}>
            Login
          </button>
          <button onClick={props.onGoToSignup}
            className="px-5 py-2 rounded-[10px] border-none font-bold cursor-pointer text-[0.9rem] text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}>
            Register
          </button>
        </div>

        <button className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-2 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}>
          {[0,1,2].map(i => <span key={i} className="block w-6 h-[2.5px] rounded-sm bg-[#1e1b4b]"></span>)}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-[5%] py-4" style={{ borderBottom: '1px solid #e0e7ff', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
          {['Home', 'Report Lost', 'Report Found', 'Browse All'].map((link, i) => (
            <div key={link}
              onClick={() => { if(i===1) props.onGoToReportLost?.(); if(i===2) props.onGoToReportFound?.(); setMenuOpen(false); }}
              className="py-3 font-semibold cursor-pointer text-[0.95rem]"
              style={{ borderBottom: '1px solid #f1f5f9', color: i===0 ? '#2563eb' : '#475569' }}>
              {link}
            </div>
          ))}
          <div className="flex gap-2.5 pt-4">
            <button onClick={props.onGoToLogin} className="flex-1 py-3 rounded-[10px] font-bold cursor-pointer" style={{ border: '1.5px solid #c7d2fe', background: 'transparent', color: '#4338ca' }}>Login</button>
            <button onClick={props.onGoToSignup} className="flex-1 py-3 rounded-[10px] border-none font-bold cursor-pointer text-white" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>Register</button>
          </div>
        </div>
      )}

      {/* ===== HERO ===== */}
      <section className="flex flex-col md:flex-row items-center justify-between px-[5%] py-[70px] gap-12"
        style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 50%, #faf5ff 100%)' }}>

        <div className="flex-1 max-w-[560px]">
          <div className="inline-flex items-center gap-2 bg-[#dbeafe] rounded-[20px] px-3.5 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
            <span className="text-[#1d4ed8] font-bold text-[0.78rem] uppercase tracking-widest">Lost & Found Portal</span>
          </div>

          <h1 className="font-black text-[#1e1b4b] mb-4 leading-[1.08]" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', letterSpacing: '-2px' }}>
            Find What You Lost,{' '}
            <span className="grad-text">Return What You Found</span>
          </h1>

          <p className="text-slate-500 text-[1.05rem] leading-[1.75] mb-8">
            The central hub for recovering lost belongings across the college. Fast, secure, and student-run.
          </p>

          {/* Search */}
          <div className="flex gap-2.5 mb-6 p-2 rounded-2xl bg-white" style={{ border: '2px solid #e0e7ff', boxShadow: '0 4px 20px rgba(37,99,235,0.08)' }}>
            <div className="flex items-center flex-1 gap-2 px-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search for lost or found items..."
                className="flex-1 py-3 border-none outline-none text-[0.95rem] text-[#1e1b4b] bg-transparent min-w-0" />
            </div>
            <button className="px-6 py-0 rounded-[10px] border-none font-bold cursor-pointer text-[0.95rem] text-white min-h-[46px] whitespace-nowrap transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}>
              Search
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button onClick={props.onGoToReportLost}
              className="px-6 py-3 rounded-xl border-none font-bold cursor-pointer text-[0.95rem] text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}>
              + Report Lost Item
            </button>
            <button onClick={props.onGoToReportFound}
              className="px-6 py-3 rounded-xl font-bold cursor-pointer text-[0.95rem] transition-all hover:bg-[#e8edff]"
              style={{ background: '#fff', color: '#4338ca', border: '2px solid #c7d2fe' }}>
              ⊞ Report Found Item
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative flex-1 max-w-[460px] w-full md:w-auto h-[360px] rounded-3xl overflow-hidden flex items-center justify-center"
          style={{ boxShadow: '0 30px 60px rgba(37,99,235,0.2)', border: '3px solid #e0e7ff', background: 'linear-gradient(135deg, #dbeafe, #ede9fe)' }}>
          <img src="/hero-students.jpeg" alt="Students" className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML = '<div style="text-align:center;padding:40px"><div style="font-size:5rem">🎓</div><p style="color:#4338ca;font-weight:800;font-size:1.2rem;margin-top:16px">LostLink Portal</p></div>'; }} />
          {/* 24 items badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-white rounded-2xl px-3 py-1.5" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
            <span className="text-[0.78rem] font-bold text-slate-700">24 items found today</span>
          </div>
          {/* Verified badge */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white rounded-2xl px-3 py-2" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
              <p className="text-[0.6rem] text-slate-400 m-0 uppercase font-bold tracking-wide">Verified Portal</p>
              <p className="text-[0.75rem] font-bold text-slate-700 m-0">Student Governance</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <div className="mx-[5%] mb-[60px] mt-[60px]">
        <div className="rounded-3xl px-[5%] py-[50px]" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)', boxShadow: '0 20px 50px rgba(30,27,75,0.3)' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[['1.2k+', 'Items Returned', '📦'], ['85%', 'Success Rate', '✅'], ['24/7', 'College Access', '🕐'], ['15min', 'Avg. Response', '⚡']].map(([val, label, emoji]) => (
              <div key={label} className="text-center px-2.5 py-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-[1.8rem] mb-1.5">{emoji}</div>
                <h3 className="font-black text-white m-0 mb-1.5" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>{val}</h3>
                <p className="text-[#a5b4fc] m-0 text-[0.88rem] font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== RECENTLY REPORTED ===== */}
      <section className="px-[5%] pb-[70px]">
        <div className="flex justify-between items-center mb-9 flex-wrap gap-3">
          <div>
            <h2 className="font-extrabold text-[#1e1b4b] m-0 mb-1.5" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)' }}>Recently Reported Items</h2>
            <p className="m-0 text-slate-500 text-[0.95rem]">Browse the latest lost and found reports from across college</p>
          </div>
          <button className="px-5 py-2.5 rounded-[10px] font-bold cursor-pointer text-[0.9rem] text-blue-600"
            style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe' }}>View All Items →</button>
        </div>

        <div className="grid gap-[22px]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {reportedItems.map((item, i) => (
            <div key={i} className="card-hover bg-white rounded-[18px] p-[22px] flex flex-col"
              style={{ border: '1.5px solid #e0e7ff', boxShadow: '0 4px 15px rgba(37,99,235,0.06)' }}>
              <div className="w-full h-[130px] rounded-xl mb-4 overflow-hidden flex items-center justify-center relative"
                style={{ background: item.type === 'LOST' ? '#fef2f2' : '#f0fdf4' }}>
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl"
                  onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML='<span style="font-size:3.5rem">📦</span>'; }} />
              </div>
              <span className="inline-block text-[0.72rem] font-extrabold uppercase tracking-wide rounded-md px-2 py-0.5 mb-2.5 self-start"
                style={{ color: item.type === 'LOST' ? '#dc2626' : '#16a34a', background: item.type === 'LOST' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${item.type === 'LOST' ? '#fecaca' : '#bbf7d0'}` }}>
                {item.type}
              </span>
              <h4 className="m-0 mb-1.5 text-[1rem] font-extrabold text-[#1e1b4b]">{item.name}</h4>
              <p className="text-[0.83rem] text-slate-500 m-0 mb-3.5 flex-1 leading-[1.5]">📍 {item.location}</p>
              <div className="flex justify-between items-center text-[0.78rem] text-slate-400 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
                <span>{item.status}</span>
                <button className="bg-transparent text-blue-600 border-none font-bold cursor-pointer text-[0.83rem]">Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== INFO CARDS (Not sure + Security Office) ===== */}
      <section className="px-[5%] pb-[70px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Not sure where to start */}
          <div className="card-hover bg-white rounded-2xl p-8" style={{ border: '1.5px solid #e0e7ff', boxShadow: '0 4px 15px rgba(37,99,235,0.06)' }}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-4" style={{ boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3 className="font-extrabold text-[#1e1b4b] text-[1.1rem] m-0 mb-2">Not sure where to start?</h3>
            <p className="text-slate-500 text-[0.9rem] leading-[1.6] m-0 mb-4">Our guide helps you understand the process of claiming an item and verifying ownership safely.</p>
            <span className="text-blue-600 font-bold text-[0.88rem] cursor-pointer hover:underline">Read the Guide ↗</span>
          </div>

          {/* Security Office */}
          <div className="card-hover bg-white rounded-2xl p-8" style={{ border: '1.5px solid #e0e7ff', boxShadow: '0 4px 15px rgba(37,99,235,0.06)' }}>
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 className="font-extrabold text-[#1e1b4b] text-[1.1rem] m-0 mb-2">Security Office</h3>
            <p className="text-slate-500 text-[0.9rem] leading-[1.6] m-0 mb-4">Valuable items like laptops and phones are often held at the security office for 30 days.</p>
            <span className="text-blue-600 font-bold text-[0.88rem] cursor-pointer hover:underline">Contact Security ↗</span>
          </div>

        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="px-[5%] py-[70px]">
        <div className="text-center mb-12">
          <h2 className="font-extrabold text-[#1e1b4b] m-0 mb-2.5" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)' }}>Student Success Stories</h2>
          <p className="text-slate-500 text-[0.95rem]">See how we are helping students reconnect with their lost belongings every single day.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card-hover bg-white p-7 rounded-[20px]"
              style={{ boxShadow: '0 4px 20px rgba(37,99,235,0.07)', border: '1.5px solid #e0e7ff' }}>
              <div className="text-amber-400 mb-3.5 text-[1.1rem] tracking-widest">★★★★★</div>
              <p className="italic text-slate-700 leading-[1.7] mb-5 text-[0.95rem]">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-white font-extrabold text-[0.85rem] shrink-0"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>{t.avatar}</div>
                <div>
                  <p className="font-extrabold m-0 text-[#1e1b4b] text-[0.95rem]">{t.name}</p>
                  <p className="text-[0.82rem] text-slate-400 mt-0.5 m-0">{t.dept}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="mx-[5%] mb-[60px] rounded-3xl px-[5%] py-[60px] text-center"
        style={{ background: 'linear-gradient(135deg, #1e1b4b, #2563eb, #7c3aed)', boxShadow: '0 20px 50px rgba(37,99,235,0.25)' }}>
        <h2 className="text-white font-black m-0 mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>Lost something? Don't stress!</h2>
        <p className="text-[#a5b4fc] mb-8 text-[1rem]">Join thousands of students who have recovered their belongings through LostLink.</p>
        <div className="flex gap-3.5 justify-center flex-wrap">
          <button onClick={props.onGoToReportLost}
            className="px-8 py-3.5 rounded-xl border-none font-extrabold cursor-pointer text-[0.95rem] text-blue-600 bg-white transition-all hover:opacity-90"
            style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            Report Lost Item
          </button>
          <button onClick={props.onGoToSignup}
            className="px-8 py-3.5 rounded-xl font-extrabold cursor-pointer text-[0.95rem] text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)' }}>
            Create Account
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-white px-[5%] pt-[60px] pb-[30px]" style={{ borderTop: '1px solid #e0e7ff' }}>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <span className="text-[1.3rem] font-extrabold text-[#1e1b4b]">LostLink</span>
            </div>
            <p className="text-slate-500 text-[0.9rem] leading-[1.7] max-w-[280px] mb-5">Helping college students recover what they've lost through community cooperation and technology.</p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>,
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              ].map((icon, i) => (
                <div key={i} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-all">
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold mb-4 text-[#1e1b4b] text-[0.95rem]">Quick Links</h4>
            <ul className="list-none p-0 m-0 text-slate-500 text-[0.9rem] flex flex-col gap-2.5">
              {['About the Portal', 'Terms of Service', 'Privacy Policy', 'FAQ'].map(l => (
                <li key={l} className="cursor-pointer hover:text-blue-600 transition-colors">{l}</li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-extrabold mb-4 text-[#1e1b4b] text-[0.95rem]">Resources</h4>
            <ul className="list-none p-0 m-0 text-slate-500 text-[0.9rem] flex flex-col gap-2.5">
              {['Main Map', 'Security Services', 'Student Union', 'Library Hours'].map(l => (
                <li key={l} className="cursor-pointer hover:text-blue-600 transition-colors">{l}</li>
              ))}
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="font-extrabold mb-4 text-[#1e1b4b] text-[0.95rem]">Contact Support</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-500 text-[0.9rem]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                support@lostlink.edu
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[0.9rem]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +1 (500) 123-4567
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[0.9rem]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Student Hub, Room 102
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-slate-400 text-[0.85rem]" style={{ borderTop: '1px solid #f1f5f9' }}>
          <span>© 2024 LostLink. Developed with care for the student body.</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span className="cursor-pointer hover:text-blue-600 transition-colors">University Guidelines</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Sitemap</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;