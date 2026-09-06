import React, { useState } from 'react';

const Home = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const reportedItems = [
    { type: 'LOST', name: 'Blue Backpack', location: 'Science Block', status: 'Reported 3h ago', image: '/backpack.jpeg' },
    { type: 'FOUND', name: 'Apple AirPods', location: 'Library', status: 'Reported 12h ago', image: '/airpods.jpeg' },
    { type: 'LOST', name: 'House Keys', location: 'Cafeteria', status: 'Reported yesterday', image: '/keys.jpeg' },
    { type: 'FOUND', name: 'Scientific Calculator', location: 'Admin Block', status: 'Reported yesterday', image: '/calculator.jpeg' },
  ];

  const testimonials = [
    { name: 'Ali Raza', dept: 'Information Technology', text: 'Found my keys within an hour! I was so stressed about getting back into my dorm, but someone had already posted them here.', avatar: 'AR' },
    { name: 'Huma Arshad', dept: 'English', text: 'I left my AirPods at the library and thought they were gone forever. This portal is a lifesaver for forgetful students like me!', avatar: 'HA' },
    { name: 'Zunira kanwal', dept: 'Mathematics', text: 'Reported a calculator I found in the lab, and the owner reached out five minutes later. The verification process was super smooth.', avatar: 'ZK' },
  ];

  return (
    <div className="min-h-screen m-0 p-0" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: '#F5F0F0' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');

        .font-headings { font-family: 'Fraunces', serif; }

        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; border: 1.5px solid #e8d0d0; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(128,0,32,0.08) !important; }

        .grad-text { 
          background: linear-gradient(135deg, #800020, #a0002a); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
          background-clip: text; 
        }

        .btn-primary { 
          background: linear-gradient(135deg, #800020, #4a0010); 
          color: #fde8ec; 
          transition: all 0.3s ease; 
        }
        .btn-primary:hover { 
          background: linear-gradient(135deg, #a0002a, #800020); 
        }
      `}</style>

      {/* ===== NAVBAR ===== */}
      <nav className="flex justify-between items-center px-[5%] h-[68px] sticky top-0 z-[1000]"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e8d0d0', boxShadow: '0 2px 20px rgba(128,0,32,0.04)' }}>

        <div className="flex items-center gap-2.5">
          <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #800020, #4a0010)', boxShadow: '0 4px 12px rgba(128,0,32,0.2)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <span className="font-headings text-[1.35rem] text-[#2e1a1a] tracking-tight">LostLink</span>
        </div>

        <div className="hidden md:flex gap-1">
          {['Home', 'Found Items', 'Lost Items', 'Report Lost & Found Items'].map((link, i) => (
            <span key={link}
             onClick={() => {
              setActiveTab(i);
             if (link === 'Found Items' && props.onGoToFoundItems) {
               props.onGoToFoundItems();
             } else if (link === 'Lost Items' && props.onGoToLostItems) {
               props.onGoToLostItems();
             } else if (link === 'Report Lost & Found Items' && props.onNavigate) {
                props.onNavigate('Report Lost & Found Items');
              } else if (props.onNavigate) {
                props.onNavigate(link.toLowerCase());
              }
            }}
              className="px-4 py-2 rounded-lg cursor-pointer text-[0.9rem] font-bold transition-all hover:bg-[#fff8f8]"
              style={{ 
                color: '#800020', 
                background: activeTab === i ? '#fff8f8' : 'transparent' 
              }}>
              {link}
            </span>
          ))}
        </div>

        <div className="hidden md:flex gap-2.5 items-center">
          <button onClick={props.onGoToLogin}
            className="px-5 py-2 rounded-[10px] font-bold cursor-pointer text-[0.9rem] transition-all hover:bg-[#fff8f8]"
            style={{ border: '1.5px solid #e8d0d0', background: 'transparent', color: '#800020' }}>
            Login
          </button>
          <button onClick={props.onGoToSignup}
            className="btn-primary px-5 py-2 rounded-[10px] border-none font-bold cursor-pointer text-[0.9rem]"
            style={{ boxShadow: '0 4px 15px rgba(128,0,32,0.2)' }}>
            Register
          </button>
        </div>

        <button className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-2 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}>
          {[0,1,2].map(i => <span key={i} className="block w-6 h-[2.5px] rounded-sm bg-[#2e1a1a]"></span>)}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-[5%] py-4" style={{ borderBottom: '1px solid #e8d0d0', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
          {['Home', 'Found Items', 'Lost Items', 'Report Lost & Found Items'].map((link, i) => (
            <div key={link}
              onClick={() => { 
                setActiveTab(i);
                if (link === 'Found Items' && props.onGoToFoundItems) {
                  props.onGoToFoundItems();
                } else if (link === 'Lost Items' && props.onGoToLostItems) {
                  props.onGoToLostItems();
                } else if (link === 'Report Lost & Found Items' && props.onNavigate) {
                  props.onNavigate('Report Lost & Found Items');
                } else if (props.onNavigate) {
                  props.onNavigate(link.toLowerCase());
                }
                setMenuOpen(false); 
              }}
              className="py-3 font-bold cursor-pointer text-[0.95rem]"
              style={{ borderBottom: '1px solid #fff8f8', color: '#800020' }}>
              {link}
            </div>
          ))}
          <div className="flex gap-2.5 pt-4">
            <button onClick={props.onGoToLogin} className="flex-1 py-3 rounded-[10px] font-bold cursor-pointer" style={{ border: '1.5px solid #e8d0d0', background: 'transparent', color: '#800020' }}>Login</button>
            <button onClick={props.onGoToSignup} className="btn-primary flex-1 py-3 rounded-[10px] border-none font-bold cursor-pointer">Register</button>
          </div>
        </div>
      )}

      {/* ===== HERO ===== */}
      <section className="flex flex-col md:flex-row items-center justify-between px-[5%] py-[70px] gap-12"
        style={{ background: 'linear-gradient(135deg, #F5F0F0 0%, #fff8f8 50%, #F5F0F0 100%)' }}>

        <div className="flex-1 max-w-[560px]">
          <div className="inline-flex items-center gap-2 bg-[#fff8f8] rounded-[20px] px-3.5 py-1.5 mb-5" style={{ border: '1px solid #e8d0d0' }}>
            <span className="w-2 h-2 rounded-full bg-[#800020] inline-block"></span>
            <span className="text-[#800020] font-bold text-[0.78rem] uppercase tracking-widest">Lost & Found System</span>
          </div>

          <h1 className="font-headings text-[#2e1a1a] mb-4 leading-[1.08]" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', letterSpacing: '-1px' }}>
            Find What You Lost,{' '}
            <span className="grad-text">Return What You Found</span>
          </h1>

          <p className="text-[#c07080] text-[1.05rem] leading-[1.75] mb-8 font-medium">
            The central hub for recovering lost belongings across the college. Fast, secure, and student-run.
          </p>

          {/* Search */}
          <div className="flex gap-2.5 mb-6 p-2 rounded-2xl bg-white" style={{ border: '2px solid #e8d0d0', boxShadow: '0 4px 20px rgba(128,0,32,0.04)' }}>
            <div className="flex items-center flex-1 gap-2 px-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c07080" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search for lost or found items..."
                className="flex-1 py-3 border-none outline-none text-[0.95rem] text-[#2e1a1a] bg-transparent min-w-0" 
                style={{ color: '#2e1a1a' }} />
            </div>
            <button className="btn-primary px-6 py-0 rounded-[10px] border-none font-bold cursor-pointer text-[0.95rem] min-h-[46px] whitespace-nowrap"
              style={{ boxShadow: '0 4px 15px rgba(128,0,32,0.2)' }}>
              Search
            </button>
          </div>

          {/* Single Combined CTA Button */}
          <div className="flex gap-3 flex-wrap">
            <button onClick={props.onGoToReportItem}
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl border-none font-bold cursor-pointer text-[0.95rem]"
              style={{ boxShadow: '0 4px 15px rgba(128,0,32,0.2)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Report Lost & Found Item
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative flex-1 max-w-[460px] w-full md:w-auto h-[360px] rounded-3xl overflow-hidden flex items-center justify-center"
          style={{ boxShadow: '0 30px 60px rgba(74,0,16,0.1)', border: '3px solid #e8d0d0', background: '#fff8f8' }}>
          <img src="/hero-students.jpeg" alt="Students" className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML = '<div style="text-align:center;padding:40px"><div style="font-size:5rem">🎓</div><p style="color:#800020;font-weight:800;font-size:1.2rem;margin-top:16px">LostLink Portal</p></div>'; }} />

          <div className="absolute top-4 left-4 flex items-center gap-2 bg-white rounded-2xl px-3 py-1.5" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <span className="w-2 h-2 rounded-full bg-green-600 inline-block"></span>
            <span className="text-[0.78rem] font-bold text-[#2e1a1a]">24 items found today</span>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white rounded-2xl px-3 py-2" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#800020' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
              <p className="text-[0.6rem] text-[#c07080] m-0 uppercase font-bold tracking-wide">Verified Portal</p>
              <p className="text-[0.75rem] font-bold text-[#2e1a1a] m-0">Student Governance</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <div className="mx-[5%] mb-[60px] mt-[60px]">
        <div className="rounded-3xl px-[5%] py-[50px]" style={{ background: 'linear-gradient(135deg, #4a0010 0%, #800020 50%, #4a0010 100%)', boxShadow: '0 20px 50px rgba(74,0,16,0.2)' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[['1.2k+', 'Items Returned', '📦'], ['85%', 'Success Rate', '✅'], ['24/7', 'College Access', '🕐'], ['15min', 'Avg. Response', '⚡']].map(([val, label, emoji]) => (
              <div key={label} className="text-center px-2.5 py-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-[1.8rem] mb-1.5">{emoji}</div>
                <h3 className="font-headings text-[#fde8ec] m-0 mb-1.5" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>{val}</h3>
                <p className="text-[#e8d0d0] m-0 text-[0.88rem] font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== RECENTLY REPORTED ===== */}
      <section className="px-[5%] pb-[70px]">
        <div className="flex justify-between items-center mb-9 flex-wrap gap-3">
          <div>
            <h2 className="font-headings text-[#2e1a1a] m-0 mb-1.5" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)' }}>Recently Reported Items</h2>
            <p className="m-0 text-[#c07080] text-[0.95rem]">Browse the latest lost and found reports from across college</p>
          </div>
          <button onClick={props.onGoToAllItems}
            className="px-5 py-2.5 rounded-[10px] font-bold cursor-pointer text-[0.9rem] transition-colors hover:bg-[#fff8f8]"
            style={{ background: '#ffffff', border: '1.5px solid #e8d0d0', color: '#800020' }}>
            View All Items →
          </button>
        </div>

        <div className="grid gap-[22px]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {reportedItems.map((item, i) => (
            <div key={i} className="card-hover bg-white rounded-[18px] p-[22px] flex flex-col"
              style={{ background: '#ffffff' }}>
              <div className="w-full h-[130px] rounded-xl mb-4 overflow-hidden flex items-center justify-center relative"
                style={{ background: item.type === 'LOST' ? '#fff8f8' : '#f0fdf4' }}>
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl"
                  onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML='<span style="font-size:3.5rem">📦</span>'; }} />
              </div>
              <span className="inline-block text-[0.72rem] font-bold uppercase tracking-wide rounded-md px-2 py-0.5 mb-2.5 self-start"
                style={{ color: item.type === 'LOST' ? '#a0002a' : '#16a34a', background: item.type === 'LOST' ? '#fff8f8' : '#f0fdf4', border: `1px solid ${item.type === 'LOST' ? '#e8d0d0' : '#bbf7d0'}` }}>
                {item.type}
              </span>
              <h4 className="m-0 mb-1.5 text-[1.05rem] font-bold text-[#2e1a1a]">{item.name}</h4>
              <p className="text-[0.85rem] text-[#c07080] m-0 mb-3.5 flex-1 leading-[1.5] font-medium">📍 {item.location}</p>
              <div className="flex justify-between items-center text-[0.78rem] text-[#c07080] pt-3" style={{ borderTop: '1px solid #fff8f8' }}>
                <span>{item.status}</span>
                <button className="bg-transparent text-[#800020] border-none font-bold cursor-pointer text-[0.83rem]">Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== INFO CARDS ===== */}
<section className="px-[5%] pb-[70px]">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div className="card-hover bg-white rounded-2xl p-8">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: '#800020', boxShadow: '0 4px 12px rgba(128,0,32,0.2)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <h3 className="font-headings text-[#2e1a1a] text-[1.1rem] m-0 mb-2">Not sure where to start?</h3>
      <p className="text-[#c07080] text-[0.95rem] leading-[1.6] m-0 mb-4 font-medium">Our guide helps you understand the process of claiming an item and verifying ownership safely.</p>
      <span onClick={props.onGoToGuide} className="text-[#800020] font-bold text-[0.9rem] cursor-pointer hover:underline">Read the Guide ↗</span>
    </div>

    <div className="card-hover bg-white rounded-2xl p-8">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: '#4a0010' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <h3 className="font-headings text-[#2e1a1a] text-[1.1rem] m-0 mb-2">Security Office</h3>
      <p className="text-[#c07080] text-[0.95rem] leading-[1.6] m-0 mb-4 font-medium">Valuable items like laptops and phones are often held at the security office for 30 days.</p>
      <span onClick={props.onGoToSecurity} className="text-[#800020] font-bold text-[0.9rem] cursor-pointer hover:underline">Contact Security ↗</span>
    </div>

  </div>
</section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="px-[5%] py-[70px]">
        <div className="text-center mb-12">
          <h2 className="font-headings text-[#2e1a1a] m-0 mb-2.5" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)' }}>Student Success Stories</h2>
          <p className="text-[#c07080] text-[1rem]">See how we are helping students reconnect with their lost belongings every single day.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card-hover bg-white p-7 rounded-[20px]">
              <div className="mb-3.5 text-[1.1rem] tracking-widest" style={{ color: '#c07080' }}>★★★★★</div>
              <p className="italic text-[#2e1a1a] leading-[1.7] mb-5 text-[0.95rem]">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-[#fde8ec] font-bold text-[0.85rem] shrink-0"
                  style={{ background: 'linear-gradient(135deg, #800020, #4a0010)' }}>{t.avatar}</div>
                <div>
                  <p className="font-bold m-0 text-[#2e1a1a] text-[0.95rem]">{t.name}</p>
                  <p className="text-[0.85rem] text-[#c07080] mt-0.5 m-0 font-medium">{t.dept}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="mx-[5%] mb-[60px] rounded-3xl px-[5%] py-[60px] text-center"
        style={{ background: 'linear-gradient(135deg, #4a0010, #800020, #a0002a)', boxShadow: '0 20px 50px rgba(128,0,32,0.25)' }}>
        <h2 className="font-headings text-[#fde8ec] m-0 mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>Lost something? Don't stress!</h2>
        <p className="text-[#e8d0d0] mb-8 text-[1.05rem]">Join thousands of students who have recovered their belongings through LostLink.</p>
        <div className="flex gap-3.5 justify-center flex-wrap">
          <button onClick={props.onGoToReportItem}
            className="px-8 py-3.5 rounded-xl border-none font-bold cursor-pointer text-[0.95rem] transition-all hover:bg-[#fff8f8]"
            style={{ background: '#ffffff', color: '#800020', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
            Report Lost & Found Item
          </button>
          <button onClick={props.onGoToSignup}
            className="px-8 py-3.5 rounded-xl font-bold cursor-pointer text-[0.95rem] text-[#fde8ec] transition-all hover:bg-[rgba(255,255,255,0.1)]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(253,232,236,0.4)' }}>
            Create Account
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-white px-[5%] pt-[60px] pb-[30px]" style={{ borderTop: '1px solid #e8d0d0' }}>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">

          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #800020, #4a0010)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <span className="font-headings text-[1.3rem] text-[#2e1a1a]">LostLink</span>
            </div>
            <p className="text-[#5a3a3a] text-[0.9rem] leading-[1.7] max-w-[280px] mb-5 font-medium">Helping college students recover what they've lost through community cooperation and technology.</p>
            <div className="flex gap-3">
              {[
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>,
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              ].map((icon, i) => (
                <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:bg-[#800020] hover:text-[#fde8ec]"
                  style={{ background: '#f5f0f0', color: '#800020', border: '1px solid #e8d0d0' }}>
                  {icon}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-headings mb-4 text-[#2e1a1a] text-[1.05rem]">Quick Links</h4>
            <ul className="list-none p-0 m-0 text-[#5a3a3a] text-[0.9rem] flex flex-col gap-2.5 font-medium">
              {['About the System', 'Terms of Service', 'Privacy Policy', 'FAQ'].map(l => (
                <li key={l} className="cursor-pointer hover:text-[#800020] transition-colors">{l}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-headings mb-4 text-[#2e1a1a] text-[1.05rem]">Resources</h4>
            <ul className="list-none p-0 m-0 text-[#5a3a3a] text-[0.9rem] flex flex-col gap-2.5 font-medium">
              {['Main Map', 'Security Services', 'Student Union', 'Library Hours'].map(l => (
                <li key={l} className="cursor-pointer hover:text-[#800020] transition-colors">{l}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-headings mb-4 text-[#2e1a1a] text-[1.05rem]">Contact Support</h4>
            <div className="flex flex-col gap-3 font-medium">
              <div className="flex items-center gap-2 text-[#5a3a3a] text-[0.9rem]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#800020" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                gcmbdin@gmail.com
              </div>
              <div className="flex items-center gap-2 text-[#5a3a3a] text-[0.9rem]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#800020" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13A19.79 19.79 0 0 1 1.62 4.33 2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                0546-504504
              </div>
              <div className="flex items-center gap-2 text-[#5a3a3a] text-[0.9rem]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#800020" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Admin Block
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-[#5a3a3a] text-[0.85rem] font-medium" style={{ borderTop: '1px solid #e8d0d0' }}>
          <span>© 2026 LostLink. Developed with care for the student body.</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span className="cursor-pointer hover:text-[#800020] transition-colors">University Guidelines</span>
            <span className="cursor-pointer hover:text-[#800020] transition-colors">Sitemap</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;