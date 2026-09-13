import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClaimsPage from "./claims-page";
import RequestsPage from "./requests-page";
import SupportPage from "./support-page";
import UsersPage from "./user-page";
import MessagesPage from "./messages-page";
import NotificationsPage from "./Notification-page";
import SettingsPage from "./settings-page";
import { adminFetch, getAdminUser, adminLogout } from "../adminApi";

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
const IcoReqst   = () => <Ico d={["M9 12h6","M9 16h6","M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M13 2v6h6"]} />;
const IcoSupport = () => <Ico d={["M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"]} />;

const statusCfg = {
  Lost:     { bg:"#fef2f2", color:"#dc2626" },
  Found:    { bg:"#f0fdf4", color:"#16a34a" },
  Claimed:  { bg:"#fff7ed", color:"#c2410c" },
  Resolved: { bg:"#fdf4ff", color:"#7c3aed" },
  Pending:  { bg:"#fffbeb", color:"#b45309" },
};

const shortId = (mongoId) => `#${(mongoId || '').slice(-6).toUpperCase()}`;

const NOTIF_TITLES = {
  claim_submitted: 'New Claim Submitted',
  claim_approved: 'Claim Approved',
  claim_rejected: 'Claim Rejected',
  message: 'New Message',
  item_matched: 'Possible Item Match',
  new_lost_item: 'New Lost Item Reported',
  new_found_item: 'New Found Item Reported',
};

const buildMonthlyChart = (items) => {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: d.toLocaleString('en-US', { month: 'short' }), lost: 0, found: 0 });
  }
  items.forEach((item) => {
    const d = new Date(item.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = months.find(m => m.key === key);
    if (bucket) bucket[item.kind === 'Lost' ? 'lost' : 'found'] += 1;
  });
  return months;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const admin = getAdminUser();

  const [active, setActive]       = useState("dashboard");
  const [sideOpen, setSideOpen]   = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch]       = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [itemStats, setItemStats] = useState({ totalLost: 0, totalFound: 0, pendingClaims: 0, totalResolved: 0 });
  const [pendingRequests, setPendingRequests] = useState(0);
  const [openSupportChats, setOpenSupportChats] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const loadDashboard = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [stats, lost, found, pending, notifs, requests] = await Promise.all([
        adminFetch('/admin/item-stats'),
        adminFetch('/lost-items/all'),
        adminFetch('/found-items/all'),
        adminFetch('/found-items/pending'),
        adminFetch('/notifications').catch(() => []),
        adminFetch('/requests/all').catch(() => []),
      ]);
      setItemStats(stats);
      const requestsList = Array.isArray(requests) ? requests : [];
      setPendingRequests(requestsList.filter(r => r.status === 'pending' && r.type !== 'general_issue').length);
      setOpenSupportChats(requestsList.filter(r => r.type === 'general_issue' && r.status !== 'closed').length);
      const combined = [
        ...(Array.isArray(lost) ? lost : []).map(i => ({ ...i, kind: 'Lost' })),
        ...(Array.isArray(found) ? found : []).map(i => ({ ...i, kind: 'Found' })),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setItemsList(combined);
      setPendingApprovals(Array.isArray(pending) ? pending : []);
      setNotifications((Array.isArray(notifs) ? notifs : []).map(n => ({ id: n._id, msg: n.message, title: NOTIF_TITLES[n.type] || 'Notification', type: n.type, time: new Date(n.createdAt).toLocaleString(), dot: '#800020', unread: !n.isRead })));
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!admin) {
      navigate("/");
      return;
    }
    loadDashboard();
  }, []);

  const markAllRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    try {
      await adminFetch('/notifications/read-all', { method: 'PUT' });
    } catch (err) {
      console.error('Failed to mark notifications as read:', err.message);
    }
  };

  const markSingleRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const navLinks = [
    { id:"dashboard", label:"Dashboard",     icon: IcoDash,  badge:null },
    { id:"items",     label:"Lost Items",    icon: IcoBox,   badge: itemStats.totalLost || null },
    { id:"found",     label:"Found Items",   icon: IcoItems, badge: itemStats.totalFound || null },
    { id:"claims",    label:"Claims",        icon: IcoClaim, badge: itemStats.pendingClaims || null },
    { id:"requests",  label:"Requests",      icon: IcoReqst, badge: pendingRequests || null },
    { id:"support",   label:"Support",       icon: IcoSupport, badge: openSupportChats || null },
    { id:"users",     label:"Users",         icon: IcoUsers, badge:null },
    { id:"messages",  label:"Messages",      icon: IcoMsg,   badge:null },
    { id:"notif",     label:"Notifications", icon: IcoNotif, badge: unreadCount > 0 ? `${unreadCount}` : null },
    { id:"settings",  label:"Settings",      icon: IcoSet,   badge:null },
  ];

  const handleDelete = async (item) => {
    if (!window.confirm(`Remove "${item.itemName}"? This cannot be undone.`)) return;
    setBusyId(item._id);
    try {
      const path = item.kind === 'Lost' ? `/lost-items/${item._id}` : `/found-items/${item._id}`;
      await adminFetch(path, { method: 'DELETE' });
      setItemsList(prev => prev.filter(i => i._id !== item._id));
      setSelectedItem(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleApprove = async (item) => {
    setBusyId(item._id);
    try {
      await adminFetch(`/found-items/${item._id}/approve`, { method: 'PUT' });
      setPendingApprovals(prev => prev.filter(i => i._id !== item._id));
      setItemsList(prev => prev.map(i => i._id === item._id ? { ...i, isApproved: true } : i));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const barData = buildMonthlyChart(itemsList);
  const maxBar = Math.max(1, ...barData.flatMap(b => [b.lost, b.found]));

  const filtered = itemsList.filter(i => {
    const matchesSearch = i.itemName.toLowerCase().includes(search.toLowerCase()) ||
                          shortId(i._id).toLowerCase().includes(search.toLowerCase());
    if (active === "items") return matchesSearch && i.kind === "Lost";
    if (active === "found") return matchesSearch && i.kind === "Found";
    return matchesSearch;
  });

  return (
    <div style={{ minHeight:"100vh", background:"#f5f0f0", display:"flex", fontFamily:"'DM Sans',sans-serif", color:"#2e1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-thumb{background:#e8d0d0;border-radius:4px}
        .nav-item{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:12px;cursor:pointer;transition:all .18s;font-size:14px;color:rgba(46,26,26,0.55);border:1px solid transparent;}
        .nav-item:hover{background:rgba(128,0,32,0.06);color:#800020;}
        .nav-item.active{background:linear-gradient(135deg,#800020,#4a0010);color:#fde8ec!important;box-shadow:0 4px 14px rgba(128,0,32,0.3);}
        .nav-item.active .badge-pill{background:rgba(255,255,255,0.25);color:#fff;}
        .icon-btn{background:#fff;border:1.5px solid #e8d0d0;border-radius:10px;padding:8px;cursor:pointer;color:#6b4848;display:flex;align-items:center;transition:all .18s;}
        .icon-btn:hover{border-color:#800020;color:#800020;}
        .al-search{background:#fff;border:1.5px solid #e8d0d0;border-radius:12px;padding:9px 14px 9px 40px;color:#2e1a1a;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;width:220px;transition:all .2s;}
        .al-search::placeholder{color:#c5a3a3}
        .al-search:focus{border-color:#800020;box-shadow:0 0 0 3px rgba(128,0,32,0.08);width:260px}
        .trow:hover td{background:#fdf6f7!important;}
        .notif-panel{position:absolute;top:calc(100% + 8px);right:0;width:290px;background:#fff;border:1px solid #e8d0d0;border-radius:16px;box-shadow:0 20px 50px rgba(74,0,16,0.12);z-index:100;overflow:hidden;}
        .add-btn{padding:8px 18px;background:linear-gradient(135deg,#800020,#4a0010);border:none;border-radius:10px;color:#fde8ec;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 3px 10px rgba(128,0,32,0.3);transition:all .2s;}
        .add-btn:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(128,0,32,0.4);}
        @media(max-width:900px){
          .sidebar-desk{display:none!important} .main-wrap{margin-left:0!important}
          .search-area{display:none!important}
        }
        @media(min-width:901px){.mob-overlay{display:none!important} .hamburger{display:none!important}}
      `}</style>

      <aside className="sidebar-desk" style={{
        width:236, background:"#fff", borderRight:"1px solid #e8d0d0",
        position:"fixed", top:0, left:0, bottom:0, zIndex:50,
        padding:"24px 14px", display:"flex", flexDirection:"column",
        boxShadow:"2px 0 16px rgba(74,0,16,0.05)", overflowY:"auto",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 6px", marginBottom:28 }}>
          <div style={{ width:40, height:40, borderRadius:11, background:"linear-gradient(135deg,#800020,#4a0010)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(128,0,32,0.35)", flexShrink:0 }}>
            <svg width="19" height="19" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M21 21l-4-4"/></svg>
          </div>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:800, color:"#2e1a1a" }}>LostLink</span>
        </div>
        <p style={{ fontSize:9, fontWeight:700, letterSpacing:"1.8px", textTransform:"uppercase", color:"#c5a3a3", padding:"0 8px", marginBottom:8 }}>Main Pages</p>
        <nav style={{ display:"flex", flexDirection:"column", gap:2, flex:1 }}>
          {navLinks.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className={`nav-item ${active===item.id?"active":""}`} onClick={() => setActive(item.id)}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}><IconComponent /><span>{item.label}</span></div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  {item.badge && <span className="badge-pill" style={{ background:"rgba(128,0,32,0.1)", color:"#800020", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:100 }}>{item.badge}</span>}
                  <IcoChev />
                </div>
              </div>
            );
          })}
        </nav>
        <div style={{ marginTop:16, padding:"12px", background:"linear-gradient(135deg,rgba(128,0,32,0.06),rgba(74,0,16,0.04))", border:"1px solid #e8d0d0", borderRadius:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#800020,#4a0010)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fde8ec", fontWeight:800, fontSize:15, flexShrink:0 }}>{(admin?.name || 'A').slice(0,1).toUpperCase()}</div>
            <div style={{ flex:1, overflow:"hidden" }}>
              <p style={{ fontSize:13, fontWeight:700, color:"#2e1a1a", margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{admin?.name || 'Admin'}</p>
            </div>
            <button onClick={adminLogout} style={{ background:"none", border:"none", cursor:"pointer", color:"#c07080", display:"flex", padding:2 }}><IcoLogout /></button>
          </div>
        </div>
      </aside>

      {sideOpen && (
        <div className="mob-overlay" style={{ position:"fixed", inset:0, zIndex:200 }}>
          <div onClick={() => setSideOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(46,26,26,0.45)", backdropFilter:"blur(3px)" }} />
          <aside style={{ position:"absolute", top:0, left:0, bottom:0, width:236, background:"#fff", padding:"24px 14px", display:"flex", flexDirection:"column", zIndex:10, overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, padding:"0 6px" }}>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:19, fontWeight:800, color:"#2e1a1a" }}>LostLink</span>
              <button className="icon-btn" onClick={() => setSideOpen(false)} style={{ padding:6 }}>✕</button>
            </div>
            {navLinks.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.id} className={`nav-item ${active===item.id?"active":""}`} onClick={() => { setActive(item.id); setSideOpen(false); }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}><IconComponent /><span>{item.label}</span></div>
                  {item.badge && <span style={{ background:"rgba(128,0,32,0.1)", color:"#800020", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:100 }}>{item.badge}</span>}
                </div>
              );
            })}
          </aside>
        </div>
      )}

      <div className="main-wrap" style={{ marginLeft:236, flex:1, display:"flex", flexDirection:"column", minHeight:"100vh" }}>

        <header style={{ height:66, background:"rgba(255,255,255,0.95)", backdropFilter:"blur(10px)", borderBottom:"1px solid #e8d0d0", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", position:"sticky", top:0, zIndex:40, boxShadow:"0 2px 10px rgba(74,0,16,0.05)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button className="hamburger icon-btn" onClick={() => setSideOpen(true)}><IcoMenu /></button>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:13, color:"#c07080" }}>Home</span>
              <span style={{ color:"#e8d0d0" }}>→</span>
              <span style={{ fontSize:13, color:"#800020", fontWeight:600, textTransform:"capitalize" }}>{active}</span>
            </div>
          </div>
          <div className="search-area" style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#c5a3a3", pointerEvents:"none", display:"flex" }}><IcoSearch /></span>
            <input className="al-search" placeholder="Quick search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ position:"relative" }}>
              <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
                <IcoBell />
                {unreadCount > 0 && (
                  <span style={{ position:"absolute", top:4, right:4, width:8, height:8, borderRadius:"50%", background:"#800020", border:"1.5px solid #fff" }} />
                )}
              </button>
              {notifOpen && (
                <div className="notif-panel">
                  <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid #f0e0e0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <p style={{ fontSize:13, fontWeight:700, color:"#2e1a1a" }}>Notifications ({unreadCount})</p>
                    <span onClick={markAllRead} style={{ fontSize:11, color:"#800020", fontWeight:600, cursor:"pointer" }}>Mark all read</span>
                  </div>
                  <div style={{ maxHeight:280, overflowY:"auto" }}>
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markSingleRead(n.id)}
                          style={{
                            padding:"11px 16px",
                            borderBottom:"1px solid #fdf0f0",
                            display:"flex",
                            gap:10,
                            alignItems:"flex-start",
                            cursor:"pointer",
                            background: n.unread ? "#fff" : "#faf6f6",
                            opacity: n.unread ? 1 : 0.7
                          }}
                        >
                          <div style={{ width:7, height:7, borderRadius:"50%", background:n.dot, marginTop:5, flexShrink:0 }} />
                          <div style={{ flex:1 }}>
                            <p style={{ fontSize:12, color:"#2e1a1a", lineHeight:1.5, fontWeight: n.unread ? 600 : 400 }}>{n.msg}</p>
                            <p style={{ fontSize:11, color:"#c5a3a3", marginTop:2 }}>{n.time}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ padding: 16, fontSize: 12, color: "#c5a3a3", textAlign: "center" }}>No notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={{ flex:1, padding:"28px", overflowY:"auto" }}>
          {active === "dashboard" && (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
                <div>
                  <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:26, fontWeight:800, color:"#2e1a1a", margin:0 }}>Dashboard</h1>
                  <p style={{ color:"#c07080", fontSize:13, marginTop:4 }}>Govt. Graduate College Mandi Bahauddin</p>
                </div>
              </div>

              {loadError && (
                <div style={{ background:"#fee2e2", color:"#b91c1c", fontSize:13, fontWeight:600, padding:"12px 16px", borderRadius:14, marginBottom:20 }}>{loadError}</div>
              )}

              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:18, marginBottom:24 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                  <div style={{ borderRadius:20, padding:"22px", background:"linear-gradient(135deg,#800020,#4a0010)", color:"#fde8ec", boxShadow:"0 6px 20px rgba(128,0,32,0.35)" }}>
                    <p style={{ fontSize:13, fontWeight:600, opacity:0.85, margin:0 }}>Total Lost</p>
                    <p style={{ fontSize:40, fontWeight:800, fontFamily:"'Fraunces',serif", margin:"10px 0", lineHeight:1 }}>{loading ? '—' : itemStats.totalLost}</p>
                  </div>
                  <div style={{ borderRadius:20, padding:"22px", background:"linear-gradient(135deg,#c07080,#800020)", color:"#fff", boxShadow:"0 6px 20px rgba(192,112,128,0.35)" }}>
                    <p style={{ fontSize:13, fontWeight:600, opacity:0.9, margin:0 }}>Total Found</p>
                    <p style={{ fontSize:40, fontWeight:800, fontFamily:"'Fraunces',serif", margin:"10px 0", lineHeight:1 }}>{loading ? '—' : itemStats.totalFound}</p>
                  </div>
                  <div style={{ borderRadius:20, padding:"22px", background:"linear-gradient(135deg,#fde8ec,#fbd0d8)", color:"#4a0010", boxShadow:"0 6px 20px rgba(128,0,32,0.1)" }}>
                    <p style={{ fontSize:13, fontWeight:600, opacity:0.8, margin:0 }}>Pending Claims</p>
                    <p style={{ fontSize:40, fontWeight:800, fontFamily:"'Fraunces',serif", margin:"10px 0", lineHeight:1 }}>{loading ? '—' : itemStats.pendingClaims}</p>
                  </div>
                  <div style={{ borderRadius:20, padding:"22px", background:"linear-gradient(135deg,#f5f0f0,#ecdede)", color:"#2e1a1a", boxShadow:"0 6px 20px rgba(74,0,16,0.08)" }}>
                    <p style={{ fontSize:13, fontWeight:600, opacity:0.7, margin:0 }}>Total Resolved</p>
                    <p style={{ fontSize:40, fontWeight:800, fontFamily:"'Fraunces',serif", margin:"10px 0", lineHeight:1 }}>{loading ? '—' : itemStats.totalResolved}</p>
                  </div>
                </div>

                <div style={{ background:"linear-gradient(160deg,#800020,#4a0010)", borderRadius:20, padding:"24px", color:"#fde8ec", boxShadow:"0 8px 28px rgba(128,0,32,0.35)", display:"flex", flexDirection:"column" }}>
                  <p style={{ fontSize:13, opacity:0.75, margin:"0 0 4px" }}>Monthly Overview</p>
                  <p style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:800, margin:0 }}>Lost & Found</p>
                  <div style={{ flex:1, display:"flex", alignItems:"flex-end", gap:6, marginTop:20 }}>
                    {barData.map((b, i) => (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                        <div style={{ width:"100%", display:"flex", gap:2, alignItems:"flex-end", height:80 }}>
                          <div style={{ flex:1, height:`${(b.lost/maxBar)*80}px`, background:"rgba(255,255,255,0.35)", borderRadius:"3px 3px 0 0" }} />
                          <div style={{ flex:1, height:`${(b.found/maxBar)*80}px`, background:"rgba(255,255,255,0.6)", borderRadius:"3px 3px 0 0" }} />
                        </div>
                        <span style={{ fontSize:9, opacity:0.6 }}>{b.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {pendingApprovals.length > 0 && (
                <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:20, padding:"18px 24px", marginBottom:24 }}>
                  <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:700, color:"#92400e", margin:"0 0 10px" }}>
                    ⏳ {pendingApprovals.length} Found Item{pendingApprovals.length > 1 ? 's' : ''} Awaiting Verification
                  </h2>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {pendingApprovals.map((item) => (
                      <div key={item._id} style={{ background:"#fff", border:"1px solid #fde68a", borderRadius:12, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                        <div>
                          <span style={{ fontSize:13, fontWeight:700, color:"#2e1a1a" }}>{item.itemName}</span>
                          <span style={{ fontSize:12, color:"#c07080", marginLeft:8 }}>by {item.userId?.name || 'Unknown'} · {item.location?.buildingName || '—'}</span>
                        </div>
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={() => setSelectedItem(item)} style={{ background:"rgba(128,0,32,0.07)", border:"1px solid rgba(128,0,32,0.15)", borderRadius:8, padding:"5px 12px", color:"#800020", fontSize:11, fontWeight:600, cursor:"pointer" }}>View</button>
                          <button disabled={busyId === item._id} onClick={() => handleApprove(item)} style={{ background:"#dcfce7", border:"1px solid #86efac", borderRadius:8, padding:"5px 12px", color:"#15803d", fontSize:11, fontWeight:700, cursor:"pointer" }}>✓ Approve</button>
                          <button disabled={busyId === item._id} onClick={() => handleDelete({ ...item, kind: 'Found' })} style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"5px 12px", color:"#dc2626", fontSize:11, fontWeight:600, cursor:"pointer" }}>✕ Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {(active === "dashboard" || active === "items" || active === "found") && (
            <div style={{ background:"#fff", border:"1px solid #e8d0d0", borderRadius:20, overflow:"hidden", boxShadow:"0 2px 12px rgba(74,0,16,0.05)" }}>
              <div style={{ padding:"18px 24px", borderBottom:"1px solid #f0e0e0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:700, color:"#2e1a1a", margin:0 }}>
                    {active === "items" ? "Lost Items List" : active === "found" ? "Found Items List (Verified)" : "Recent Items"}
                  </h2>
                  <p style={{ fontSize:12, color:"#c07080", marginTop:2 }}>{loading ? 'Loading...' : `${filtered.length} records found`}</p>
                </div>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:"#fdf6f7", borderBottom:"1px solid #f0e0e0" }}>
                      {["ID","Item","Category","Date","Status","Reporter","Action"].map(h => (
                        <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:10, fontWeight:700, color:"#c07080", letterSpacing:"1px", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => {
                      const s = statusCfg[item.kind === 'Lost' ? 'Lost' : 'Found'];
                      return (
                        <tr key={item._id} className="trow" style={{ borderBottom:"1px solid #fdf0f0" }}>
                          <td style={{ padding:"13px 16px", fontSize:12, color:"#800020", fontWeight:700 }}>{shortId(item._id)}</td>
                          <td style={{ padding:"13px 16px" }}>
                            <span style={{ fontSize:13, color:"#2e1a1a", fontWeight:500 }}>{item.itemName}</span>
                          </td>
                          <td style={{ padding:"13px 16px", fontSize:12, color:"#6b4848" }}>{item.category}</td>
                          <td style={{ padding:"13px 16px", fontSize:12, color:"#c07080" }}>{new Date(item.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</td>
                          <td style={{ padding:"13px 16px" }}>
                            <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:600, background:s.bg, color:s.color }}>
                              {item.kind}
                            </span>
                          </td>
                          <td style={{ padding:"13px 16px", fontSize:12, color:"#6b4848" }}>{item.userId?.name || item.contactName || '—'}</td>
                          <td style={{ padding:"13px 16px" }}>
                            <div style={{ display:"flex", gap:6 }}>
                              <button onClick={() => setSelectedItem(item)} style={{ background:"rgba(128,0,32,0.07)", border:"1px solid rgba(128,0,32,0.15)", borderRadius:8, padding:"5px 12px", color:"#800020", fontSize:11, fontWeight:600, cursor:"pointer" }}>View</button>
                              <button disabled={busyId === item._id} onClick={() => handleDelete(item)} style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"5px 12px", color:"#dc2626", fontSize:11, fontWeight:600, cursor:"pointer" }}>Remove</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === "claims" && <ClaimsPage />}

          {active === "requests" && <RequestsPage />}

          {active === "support" && <SupportPage />}

          {active === "users" && <UsersPage />}

          {active === "messages" && <MessagesPage />}

          {active === "notif" && (
            <NotificationsPage notifications={notifications} setNotifications={setNotifications} />
          )}

          {active === "settings" && <SettingsPage />}

          {!["dashboard", "items", "found", "claims", "requests", "support", "users", "messages", "notif", "settings"].includes(active) && (
            <div style={{ background:"#fff", border:"1px solid #e8d0d0", borderRadius:20, padding:40, textAlign:"center" }}>
              <h2 style={{ fontFamily:"'Fraunces',serif", color:"#800020", textTransform:"capitalize" }}>{active} Page</h2>
              <p style={{ color:"#c07080", marginTop:8 }}>This section is active now.</p>
            </div>
          )}
        </main>
      </div>

      {selectedItem && (
        <div style={{ position:"fixed", inset:0, background:"rgba(46,26,26,0.5)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, padding:20 }}>
          <div style={{ background:"#fff", border:"1px solid #e8d0d0", borderRadius:24, width:"100%", maxWidth:480, overflow:"hidden", boxShadow:"0 20px 60px rgba(74,0,16,0.2)" }}>
            <div style={{ padding:"20px 24px", borderBottom:"1px solid #f0e0e0", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#fdf6f7" }}>
              <div>
                <span style={{ fontSize:10, fontWeight:700, color:"#800020", letterSpacing:"1px", textTransform:"uppercase" }}>{selectedItem.kind} Item Details</span>
                <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:800, color:"#2e1a1a", margin:0 }}>{selectedItem.itemName}</h3>
              </div>
              <button onClick={() => setSelectedItem(null)} style={{ background:"none", border:"none", fontSize:18, color:"#c07080", cursor:"pointer", padding:4 }}>✕</button>
            </div>
            
            <div style={{ padding:24, display:"flex", flexDirection:"column", gap:14, maxHeight:"70vh", overflowY:"auto" }}>
              {selectedItem.image && (
                <img src={selectedItem.image} alt={selectedItem.itemName} style={{ width:"100%", height:180, objectFit:"cover", borderRadius:14, border:"1px solid #e8d0d0" }} />
              )}
              
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <p style={{ fontSize:11, color:"#c07080", margin:0 }}>Category</p>
                  <p style={{ fontSize:13, fontWeight:600, color:"#2e1a1a", margin:"2px 0 0" }}>{selectedItem.category || '—'}</p>
                </div>
                <div>
                  <p style={{ fontSize:11, color:"#c07080", margin:0 }}>Reported Date</p>
                  <p style={{ fontSize:13, fontWeight:600, color:"#2e1a1a", margin:"2px 0 0" }}>{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ fontSize:11, color:"#c07080", margin:0 }}>Reporter</p>
                  <p style={{ fontSize:13, fontWeight:600, color:"#2e1a1a", margin:"2px 0 0" }}>{selectedItem.userId?.name || selectedItem.contactName || '—'}</p>
                </div>
                <div>
                  <p style={{ fontSize:11, color:"#c07080", margin:0 }}>Location</p>
                  <p style={{ fontSize:13, fontWeight:600, color:"#2e1a1a", margin:"2px 0 0" }}>{selectedItem.location?.buildingName || selectedItem.location || '—'}</p>
                </div>
              </div>

              <div>
                <p style={{ fontSize:11, color:"#c07080", margin:0 }}>Description</p>
                <p style={{ fontSize:13, color:"#2e1a1a", margin:"4px 0 0", lineHeight:1.5, background:"#f9f4f4", padding:12, borderRadius:10 }}>
                  {selectedItem.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <div style={{ padding:"16px 24px", background:"#fdf6f7", borderTop:"1px solid #f0e0e0", display:"flex", justifyContent:"flex-end", gap:10 }}>
              <button onClick={() => setSelectedItem(null)} style={{ padding:"8px 16px", borderRadius:10, border:"1px solid #e8d0d0", background:"#fff", color:"#6b4848", fontSize:12, fontWeight:600, cursor:"pointer" }}>Close</button>
              <button disabled={busyId === selectedItem._id} onClick={() => handleDelete(selectedItem)} style={{ padding:"8px 16px", borderRadius:10, border:"none", background:"#dc2626", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>Delete Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


