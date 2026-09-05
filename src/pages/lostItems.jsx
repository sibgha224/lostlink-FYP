import { useState } from "react";

const initialStats = {
  totalItems: 48,
  lostCount: 22,
  foundCount: 16,
  resolvedCount: 10,
};

const initialRecentItems = [
  { id: "LL-101", title: "Black Leather Wallet", category: "Accessories", location: "Library - Hall A", date: "12 May 2026", reporter: "Ali Hassan", phone: "0300-1234567", status: "Lost" },
  { id: "LL-102", title: "Blue Water Bottle", category: "Accessories", location: "Cafeteria", date: "09 May 2026", reporter: "Ayesha Noor", phone: "0301-7654321", status: "Lost" },
  { id: "LL-103", title: "Dell Laptop Charger", category: "Electronics", location: "CS Lab 2", date: "05 May 2026", reporter: "Zain Ahmed", phone: "0322-9876543", status: "Claimed" },
  { id: "LL-104", title: "Calculus Textbook", category: "Books", location: "Room 14", date: "02 May 2026", reporter: "Usman Ghani", phone: "0345-1122334", status: "Resolved" }
];

const statusStyles = {
  Lost: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  Claimed: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  Resolved: { bg: "#fdf4ff", color: "#7c3aed", border: "#f5d0fe" }
};

export default function AdminDashboard() {
  const [items, setItems] = useState(initialRecentItems);

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div style={{ padding: "28px", fontFamily: "'DM Sans', sans-serif", color: "#2e1a1a", background: "#f5f0f0", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .stat-card { background: #fff; border: 1px solid #e8d0d0; border-radius: 16px; padding: 20px; boxShadow: 0 2px 10px rgba(74,0,16,0.03); }
        .delete-btn { background: #fff; border: 1px solid #e8d0d0; border-radius: 8px; padding: 6px 10px; cursor: pointer; color: #dc2626; transition: all 0.2s; }
        .delete-btn:hover { background: #fef2f2; border-color: #dc2626; }
        .trow:hover td { background: #fdf6f7 !important; }
      `}</style>

      {/* HEADER SECTION */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ border: "1.5px solid #e8d0d0", borderRadius: "12px", padding: "10px 18px", background: "#fff", display: "inline-block", boxShadow: "0 2px 8px rgba(74,0,16,0.04)" }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 800, color: "#2e1a1a", margin: 0 }}>
            Admin Dashboard
          </h1>
        </div>
      </div>

      {/* OVERVIEW STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        <div className="stat-card">
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#6b4848" }}>TOTAL REPORTED</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#800020", marginTop: "4px" }}>{initialStats.totalItems}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#dc2626" }}>LOST ITEMS</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#dc2626", marginTop: "4px" }}>{initialStats.lostCount}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#c2410c" }}>CLAIMED ITEMS</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#c2410c", marginTop: "4px" }}>{initialStats.foundCount}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#7c3aed" }}>RESOLVED ITEMS</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#7c3aed", marginTop: "4px" }}>{initialStats.resolvedCount}</div>
        </div>
      </div>

      {/* RECENT REPORTS TABLE */}
      <div style={{ background: "#fff", border: "1px solid #e8d0d0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(74,0,16,0.04)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e8d0d0", background: "#fdf6f7" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#800020" }}>Recent Activity</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fff", borderBottom: "1px solid #e8d0d0" }}>
              {["ITEM ID", "ITEM TITLE", "CATEGORY", "LOCATION", "DATE", "REPORTER", "STATUS", "ACTIONS"].map((head) => (
                <th key={head} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#800020", letterSpacing: "0.5px" }}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const st = statusStyles[item.status];
              return (
                <tr key={item.id} className="trow" style={{ borderBottom: "1px solid #fdf0f0" }}>
                  <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 700, color: "#800020" }}>{item.id}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 700, color: "#2e1a1a" }}>{item.title}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b4848" }}>{item.category}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b4848" }}>{item.location}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b4848" }}>{item.date}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#2e1a1a" }}>{item.reporter}</div>
                    <div style={{ fontSize: "11px", color: "#c07080" }}>{item.phone}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 700, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button className="delete-btn" onClick={() => handleDelete(item.id)} title="Delete Item">
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}