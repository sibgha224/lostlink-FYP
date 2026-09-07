import { useState } from "react";

const initialNotifsData = [
  { id: 1, title: "New Claim Submitted", msg: "Ali Hassan submitted a claim for iPhone 14 Pro.", time: "2 min ago", type: "claim", unread: true },
  { id: 2, title: "Item Status Updated", msg: "LL-003 (Student ID Card) has been marked as resolved.", time: "1 hr ago", type: "system", unread: true },
  { id: 3, title: "New Lost Item Reported", msg: "Ayesha Noor reported a lost item: Blue Backpack.", time: "3 hrs ago", type: "lost", unread: false },
  { id: 4, title: "User Profile Updated", msg: "Sara Malik updated her phone number and details.", time: "Yesterday", type: "user", unread: false },
  { id: 5, title: "Found Item Match", msg: "System found a potential match for Black Wallet.", time: "2 days ago", type: "found", unread: false },
];

const badgeColors = {
  claim: { bg: "#fff7ed", color: "#c2410c", border: "#ffedd5" },
  lost:  { bg: "#fef2f2", color: "#dc2626", border: "#fee2e2" },
  found: { bg: "#f0fdf4", color: "#16a34a", border: "#dcfce7" },
  user:  { bg: "#f5f3ff", color: "#7c3aed", border: "#ede9fe" },
  system:{ bg: "#fdf6f7", color: "#800020", border: "#fce7f3" },
};

export default function NotificationsPage({ notifications, setNotifications }) {
  const [localNotifs, setLocalNotifs] = useState(initialNotifsData);
  const [filter, setFilter] = useState("all");

  const notifList = notifications || localNotifs;
  const updateNotifs = setNotifications || setLocalNotifs;

  const markAllRead = () => {
    updateNotifs(notifList.map(n => ({ ...n, unread: false })));
  };

  const deleteNotif = (id) => {
    updateNotifs(notifList.filter(n => n.id !== id));
  };

  const filtered = notifList.filter(n => {
    if (filter === "unread") return n.unread;
    return true;
  });

  return (
    <div style={{ background: "#fff", border: "1px solid #e8d0d0", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(74,0,16,0.05)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: "#2e1a1a", margin: 0 }}>
            Notifications Center
          </h2>
          <p style={{ fontSize: 12, color: "#c07080", marginTop: 2 }}>
            Manage and view all lost & found alerts
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button 
            onClick={markAllRead} 
            style={{ background: "#fdf6f7", border: "1px solid #e8d0d0", borderRadius: 10, padding: "8px 14px", color: "#800020", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid #f0e0e0", paddingBottom: 12, marginBottom: 16 }}>
        {["all", "unread"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "capitalize",
              cursor: "pointer",
              background: filter === tab ? "linear-gradient(135deg,#800020,#4a0010)" : "transparent",
              color: filter === tab ? "#fde8ec" : "#6b4848",
            }}
          >
            {tab} {tab === "unread" && `(${notifList.filter(n => n.unread).length})`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#c07080", fontSize: 14 }}>
            No notifications found.
          </div>
        ) : (
          filtered.map((item) => {
            const badge = badgeColors[item.type] || badgeColors.system;
            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: item.unread ? "#fdf6f7" : "#fff",
                  border: item.unread ? "1px solid #f0d0d0" : "1px solid #f2e8e8",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: item.unread ? "#800020" : "transparent",
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#2e1a1a" }}>{item.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, textTransform: "uppercase" }}>
                        {item.type || "system"}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#6b4848", margin: 0, lineHeight: 1.4 }}>{item.msg}</p>
                    <span style={{ fontSize: 11, color: "#c07080", marginTop: 4, display: "inline-block" }}>{item.time}</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteNotif(item.id)}
                  style={{ background: "none", border: "none", color: "#c5a3a3", fontSize: 16, cursor: "pointer", padding: "0 4px" }}
                  title="Remove notification"
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}