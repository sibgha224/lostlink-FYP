import { useState } from "react";

const Ico = ({ d, size = 18, sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const IcoDash    = () => <Ico d={["M3 3h7v7H3z","M14 3h7v7h-7z","M14 14h7v7h-7z","M3 14h7v7H3z"]} />;
const IcoItems   = () => <Ico d={["M21 10H3","M21 6H3","M21 14H3","M21 18H3"]} />;
const IcoClaim   = () => <Ico d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />;
const IcoUsers   = () => <Ico d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"]} />;
const IcoBell    = () => <Ico d={["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"]} />;
const IcoSearch  = () => <Ico d="M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.35-4.35" />;
const IcoLogout  = () => <Ico d={["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"]} />;
const IcoMenu    = () => <Ico d={["M3 12h18","M3 6h18","M3 18h18"]} />;
const IcoMsg     = () => <Ico d={["M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"]} />;
const IcoSet     = () => <Ico d={["M12 15a3 3 0 100-6 3 3 0 000 6z","M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"]} />;
const IcoBox     = () => <Ico d={["M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"]} />;
const IcoChev    = () => <Ico d="M9 18l6-6-6-6" size={14} />;
const IcoNotif   = () => <Ico d={["M22 17H2a3 3 0 000-6h.09A6.01 6.01 0 0112 3a6 6 0 015.91 8H18a3 3 0 010 6z","M13.73 21a2 2 0 01-3.46 0"]} />;

const recentItems = [
  { id:"LL-001", title:"Black Leather Wallet", cat:"Accessories", date:"12 May 2026", status:"Lost",     reporter:"Ali Hassan",  emoji:"💼" },
  { id:"LL-002", title:"iPhone 14 Pro Max",   cat:"Electronics", date:"11 May 2026", status:"Found",    reporter:"Sara Malik",  emoji:"📱" },
  { id:"LL-003", title:"Student ID Card",     cat:"Documents",   date:"10 May 2026", status:"Claimed",  reporter:"Umar Sheikh", emoji:"🪪" },
  { id:"LL-004", title:"Blue Water Bottle",   cat:"Accessories", date:"09 May 2026", status:"Lost",     reporter:"Ayesha Noor", emoji:"🧴" },
  { id:"LL-005", title:"Car Bike Keys",       cat:"Keys",        date:"08 May 2026", status:"Found",    reporter:"Bilal Ahmed", emoji:"🔑" },
  { id:"LL-006", title:"Reading Glasses",     cat:"Accessories", date:"07 May 2026", status:"Resolved", reporter:"Fatima Khan", emoji:"👓" },
];

const notifs = [
  { msg:"New claim submitted for iPhone 14 Pro", time:"2 min ago", dot:"#800020" },
  { msg:"Item LL-003 status changed to Resolved", time:"1 hr ago",  dot:"#16a34a" },
  { msg:"New lost item reported: Blue Bottle",   time:"3 hrs ago", dot:"#dc2626" },
];

const statusCfg = {
  Lost:     { bg:"#fef2f2", color:"#991b1b", border:"#fecaca" },
  Found:    { bg:"#f0fdf4", color:"#166534", border:"#bbf7d0" },
  Claimed:  { bg:"#fff7ed", color:"#9a3412", border:"#fed7aa" },
  Resolved: { bg:"#fdf4ff", color:"#6b21a8", border:"#f5d0fe" },
};

const navLinks = [
  { id:"dashboard", label:"Dashboard",     icon: IcoDash,  badge:null },
  { id:"items",     label:"Lost Items",    icon: IcoBox,   badge:"12" },
  { id:"found",     label:"Found Items",   icon: IcoItems, badge:"8"  },
  { id:"claims",    label:"Claims",        icon: IcoClaim, badge:"5"  },
  { id:"users",     label:"Users",         icon: IcoUsers, badge:null },
  { id:"messages",  label:"Messages",      icon: IcoMsg,   badge:"3"  },
  { id:"notif",     label:"Notifications", icon: IcoNotif, badge:"4"  },
  { id:"settings",  label:"Settings",      icon: IcoSet,   badge:null },
];

const barData = [
  { month:"Jan", lost:14, found:9  },
  { month:"Feb", lost:18, found:14 },
  { month:"Mar", lost:10, found:12 },
  { month:"Apr", lost:24, found:19 },
  { month:"May", lost:15, found:11 },
  { month:"Jun", lost:21, found:16 },
];

export default function AdminDashboard() {
  const [active, setActive]       = useState("dashboard");
  const [sideOpen, setSideOpen]   = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch]       = useState("");

  const filtered = recentItems.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f6f2f3", display:"flex", fontFamily:"'DM Sans',sans-serif", color:"#2e1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;height:5px} ::-webkit-scrollbar-thumb{background:#e8d0d0;border-radius:4px}
        .nav-item{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:12px;cursor:pointer;transition:all .18s;font-size:14px;color:#5a3e3e;font-weight:500;}
        .nav-item:hover{background:rgba(128,0,32,0.06);color:#800020;}
        .nav-item.active{background:linear-gradient(135deg,#800020,#4a0010);color:#ffffff!important;box-shadow:0 4px 14px rgba(128,0,32,0.3);}
        .nav-item.active .badge-pill{background:rgba(255,255,255,0.25);color:#fff;}
        .icon-btn{background:#fff;border:1.5px solid #e8d0d0;border-radius:10px;padding:8px;cursor:pointer;color:#6b4848;display:flex;align-items:center;transition:all .18s;}
        .icon-btn:hover{border-color:#800020;color:#800020;}
        .al-search{background:#fff;border:1.5px solid #e8d0d0;border-radius:12px;padding:9px 14px 9px 40px;color:#2e1a1a;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;width:240px;transition:all .2s;}
        .al-search::placeholder{color:#a88585}
        .al-search:focus{border-color:#800020;box-shadow:0 0 0 3px rgba(128,0,32,0.1);width:280px}
        .trow:hover td{background:#fdf5f6!important;}
        .add-btn{padding:10px 20px;background:linear-gradient(135deg,#800020,#4a0010);border:none;border-radius:12px;color:#ffffff;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 4px 14px rgba(128,0,32,0.3);transition:all .2s;}
        .add-btn:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(128,0,32,0.4);}
        @media(max-width:960px){
          .sidebar-desk{display:none!important} .main-wrap{margin-left:0!important}
          .grid-stats{grid-template-columns:1fr!important}
          .search-area{display:none!important}
        }
        @media(min-width:961px){.mob-overlay{display:none!important} .hamburger{display:none!important}}
      `}</style>

      {/* SIDEBAR */}
      <aside className="sidebar-desk" style={{
        width:240, background:"#fff", borderRight:"1px solid #e8d0d0",
        position:"fixed", top:0, left:0, bottom:0, zIndex:50,
        padding:"24px 14px", display:"flex", flexDirection:"column",
        boxShadow:"2px 0 16px rgba(74,0,16,0.04)", overflowY:"auto",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 6px", marginBottom:28 }}>
          <div style={{ width:40, height:40, borderRadius:11, background:"linear-gradient(135deg,#800020,#4a0010)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(128,0,32,0.35)", flexShrink:0 }}>
            <svg width="19" height="19" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M21 21l-4-4"/></svg>
          </div>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:21, fontWeight:800, color:"#2e1a1a" }}>LostLink</span>
        </div>

        <p style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#a88585", padding:"0 8px", marginBottom:10 }}>Main Pages</p>
        
        <nav style={{ display:"flex", flexDirection:"column", gap:3, flex:1 }}>
          {navLinks.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className={`nav-item ${active===item.id?"active":""}`} onClick={() => setActive(item.id)}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}><IconComponent /><span>{item.label}</span></div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  {item.badge && <span className="badge-pill" style={{ background:"rgba(128,0,32,0.1)", color:"#800020", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:100 }}>{item.badge}</span>}
                  <IcoChev />
                </div>
              </div>
            );
          })}
        </nav>

        <div style={{ marginTop:16, padding:"12px", background:"#fdf6f7", border:"1px solid #e8d0d0", borderRadius:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#800020,#4a0010)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:15, flexShrink:0 }}>A</div>
            <div style={{ flex:1, overflow:"hidden" }}>
              <p style={{ fontSize:13, fontWeight:700, color:"#2e1a1a", margin:0 }}>Admin Panel</p>
              <p style={{ fontSize:11, color:"#800020", margin:0, fontWeight:500 }}>GGC Mandi B.</p>
            </div>
            <button style={{ background:"none", border:"none", cursor:"pointer", color:"#800020", display:"flex", padding:2 }} title="Logout"><IcoLogout /></button>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {sideOpen && (
        <div className="mob-overlay" style={{ position:"fixed", inset:0, zIndex:200 }}>
          <div onClick={() => setSideOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(46,26,26,0.45)", backdropFilter:"blur(3px)" }} />
          <aside style={{ position:"absolute", top:0, left:0, bottom:0, width:240, background:"#fff", padding:"24px 14px", display:"flex", flexDirection:"column", zIndex:10, overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, padding:"0 6px" }}>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:800, color:"#2e1a1a" }}>LostLink</span>
              <button className="icon-btn" onClick={() => setSideOpen(false)} style={{ padding:6 }}>✕</button>
            </div>
            {navLinks.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.id} className={`nav-item ${active===item.id?"active":""}`} onClick={() => { setActive(item.id); setSideOpen(false); }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}><IconComponent /><span>{item.label}</span></div>
                  {item.badge && <span style={{ background:"rgba(128,0,32,0.1)", color:"#800020", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:100 }}>{item.badge}</span>}
                </div>
              );
            })}
          </aside>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="main-wrap" style={{ marginLeft:240, flex:1, display:"flex", flexDirection:"column", minHeight:"100vh" }}>

        {/* TOPBAR */}
        <header style={{ height:66, background:"rgba(255,255,255,0.92)", backdropFilter:"blur(10px)", borderBottom:"1px solid #e8d0d0", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", position:"sticky", top:0, zIndex:40 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button className="hamburger icon-btn" onClick={() => setSideOpen(true)}><IcoMenu /></button>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:13, color:"#800020" }}>Home</span>
              <span style={{ color:"#c5a3a3", fontSize:12 }}>→</span>
              <span style={{ fontSize:13, color:"#2e1a1a", fontWeight:700 }}>Dashboard</span>
            </div>
          </div>
          
          <div className="search-area" style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#a88585", pointerEvents:"none", display:"flex" }}><IcoSearch /></span>
            <input className="al-search" placeholder="Quick finding..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ position:"relative" }}>
              <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
                <IcoBell />
                <span style={{ position:"absolute", top:4, right:4, width:8, height:8, borderRadius:"50%", background:"#800020", border:"1.5px solid #fff" }} />
              </button>
              {notifOpen && (
                <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, width:300, background:"#fff", border:"1px solid #e8d0d0", borderRadius:16, boxShadow:"0 16px 40px rgba(0,0,0,0.12)", zIndex:100 }}>
                  <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid #f0e0e0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <p style={{ fontSize:13, fontWeight:700, color:"#2e1a1a" }}>Notifications</p>
                    <span style={{ fontSize:11, color:"#800020", fontWeight:700, cursor:"pointer" }}>Mark read</span>
                  </div>
                  {notifs.map((n, i) => (
                    <div key={i} style={{ padding:"12px 16px", borderBottom: i < notifs.length-1 ? "1px solid #fdf0f0":"none", display:"flex", gap:10, alignItems:"flex-start" }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:n.dot, marginTop:4, flexShrink:0 }} />
                      <div>
                        <p style={{ fontSize:12, color:"#2e1a1a", lineHeight:1.4 }}>{n.msg}</p>
                        <p style={{ fontSize:10, color:"#a88585", marginTop:2 }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 12px 5px 6px", background:"#fdf5f6", border:"1px solid #e8d0d0", borderRadius:12 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:"linear-gradient(135deg,#800020,#4a0010)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:13 }}>A</div>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:"#2e1a1a", margin:0, lineHeight:1.2 }}>Admin</p>
                <p style={{ fontSize:10, color:"#800020", margin:0, fontWeight:500 }}>@lostlink</p>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <main style={{ flex:1, padding:"28px", overflowY:"auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
            <div>
              <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:28, fontWeight:800, color:"#2e1a1a", margin:0 }}>Dashboard</h1>
              <p style={{ color:"#7a5656", fontSize:13, marginTop:2, fontWeight:500 }}>Govt. Graduate College Mandi Bahauddin</p>
            </div>
            <button className="add-btn">+ Add Item</button>
          </div>

          {/* STATS & CHARTS */}
          <div className="grid-stats" style={{ display:"grid", gridTemplateColumns:"2.1fr 1fr", gap:18, marginBottom:24 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {/* Card 1 */}
              <div style={{ borderRadius:20, padding:"22px", background:"linear-gradient(135deg,#800020,#4a0010)", color:"#ffffff", boxShadow:"0 6px 20px rgba(128,0,32,0.25)" }}>
                <p style={{ fontSize:13, fontWeight:600, opacity:0.9, margin:0 }}>Total Lost</p>
                <p style={{ fontSize:38, fontWeight:800, fontFamily:"'Fraunces',serif", margin:"8px 0", lineHeight:1 }}>48</p>
                <span style={{ background:"rgba(255,255,255,0.2)", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>+5 Last Month</span>
              </div>
              {/* Card 2 */}
              <div style={{ borderRadius:20, padding:"22px", background:"linear-gradient(135deg,#a31d3b,#6b001a)", color:"#ffffff", boxShadow:"0 6px 20px rgba(163,29,59,0.25)" }}>
                <p style={{ fontSize:13, fontWeight:600, opacity:0.9, margin:0 }}>Total Found</p>
                <p style={{ fontSize:38, fontWeight:800, fontFamily:"'Fraunces',serif", margin:"8px 0", lineHeight:1 }}>35</p>
                <span style={{ background:"rgba(255,255,255,0.2)", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>+3 Last Month</span>
              </div>
              {/* Card 3 - Improved Contrast */}
              <div style={{ borderRadius:20, padding:"22px", background:"#fce8ec", border:"1px solid #f8c4ce", color:"#4a0010", boxShadow:"0 4px 14px rgba(128,0,32,0.06)" }}>
                <p style={{ fontSize:13, fontWeight:700, opacity:0.8, margin:0 }}>Pending Claims</p>
                <p style={{ fontSize:38, fontWeight:800, fontFamily:"'Fraunces',serif", margin:"8px 0", lineHeight:1, color:"#800020" }}>12</p>
                <span style={{ background:"#800020", color:"#fff", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>2 Urgent</span>
              </div>
              {/* Card 4 - Improved Contrast */}
              <div style={{ borderRadius:20, padding:"22px", background:"#ffffff", border:"1px solid #e8d0d0", color:"#2e1a1a", boxShadow:"0 4px 14px rgba(0,0,0,0.04)" }}>
                <p style={{ fontSize:13, fontWeight:700, opacity:0.7, margin:0 }}>Total Resolved</p>
                <p style={{ fontSize:38, fontWeight:800, fontFamily:"'Fraunces',serif", margin:"8px 0", lineHeight:1, color:"#2e1a1a" }}>89</p>
                <span style={{ background:"#f0e0e0", color:"#5a3e3e", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>All Time</span>
              </div>
            </div>

            {/* Overview Chart Card */}
            <div style={{ background:"linear-gradient(160deg,#800020,#4a0010)", borderRadius:20, padding:"24px", color:"#ffffff", boxShadow:"0 8px 24px rgba(128,0,32,0.3)", display:"flex", flexDirection:"column" }}>
              <p style={{ fontSize:12, opacity:0.8, textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 2px", fontWeight:600 }}>Monthly Overview</p>
              <p style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:800, margin:0 }}>Lost & Found</p>
              <div style={{ flex:1, display:"flex", alignItems:"flex-end", gap:8, marginTop:24 }}>
                {barData.map((b, i) => (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                    <div style={{ width:"100%", display:"flex", gap:3, alignItems:"flex-end", height:90 }}>
                      <div style={{ flex:1, height:`${(b.lost/25)*90}px`, background:"rgba(255,255,255,0.4)", borderRadius:"4px 4px 0 0" }} title={`Lost: ${b.lost}`} />
                      <div style={{ flex:1, height:`${(b.found/25)*90}px`, background:"#ffffff", borderRadius:"4px 4px 0 0" }} title={`Found: ${b.found}`} />
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, opacity:0.8 }}>{b.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RECENT ITEMS TABLE */}
          <div style={{ background:"#fff", border:"1px solid #e8d0d0", borderRadius:20, overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ padding:"18px 24px", borderBottom:"1px solid #f0e0e0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:"#2e1a1a", margin:0 }}>Recent Items</h2>
                <p style={{ fontSize:12, color:"#800020", marginTop:2, fontWeight:500 }}>Showing {filtered.length} active records</p>
              </div>
              <button style={{ background:"none", border:"1px solid #e8d0d0", borderRadius:10, padding:"7px 14px", color:"#800020", fontSize:12, fontWeight:700, cursor:"pointer" }}>View All</button>
            </div>
            
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#fdf5f6", borderBottom:"1px solid #f0e0e0" }}>
                    {["ID","Item Title","Category","Date","Status","Reporter","Action"].map(h => (
                      <th key={h} style={{ padding:"12px 18px", textAlign:"left", fontSize:11, fontWeight:700, color:"#800020", letterSpacing:"0.5px", textTransform:"uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const s = statusCfg[item.status];
                    return (
                      <tr key={item.id} className="trow" style={{ borderBottom:"1px solid #fdf0f0" }}>
                        <td style={{ padding:"14px 18px", fontSize:12, color:"#800020", fontWeight:700 }}>{item.id}</td>
                        <td style={{ padding:"14px 18px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ fontSize:18 }}>{item.emoji}</span>
                            <span style={{ fontSize:13, color:"#2e1a1a", fontWeight:600 }}>{item.title}</span>
                          </div>
                        </td>
                        <td style={{ padding:"14px 18px", fontSize:13, color:"#5a3e3e" }}>{item.cat}</td>
                        <td style={{ padding:"14px 18px", fontSize:12, color:"#7a5656" }}>{item.date}</td>
                        <td style={{ padding:"14px 18px" }}>
                          <span style={{ padding:"4px 12px", borderRadius:100, fontSize:11, fontWeight:700, background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding:"14px 18px", fontSize:13, color:"#5a3e3e" }}>{item.reporter}</td>
                        <td style={{ padding:"14px 18px" }}>
                          <button style={{ background:"#fdf5f6", border:"1px solid #e8d0d0", borderRadius:8, padding:"5px 12px", color:"#800020", fontSize:12, fontWeight:700, cursor:"pointer" }}>View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}