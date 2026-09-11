export default function AdminProfilePage({ onEditProfile, onLogout }) {
  const cardStyle = {
    background: "#fff",
    border: "1px solid #e8d0d0",
    borderRadius: 20,
    padding: 24,
    boxShadow: "0 2px 12px rgba(74,0,16,0.05)",
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#2e1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .profile-header {
          background: linear-gradient(135deg,#800020,#4a0010);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 18px;
          color: #fde8ec;
          box-shadow: 0 8px 28px rgba(128,0,32,0.3);
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }
        .profile-avatar {
          width: 68px;
          height: 68px;
          border-radius: 18px;
          background: rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .profile-info {
          flex: 1;
          min-width: 180px;
        }
        .profile-name {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 700;
          margin: 0;
        }
        .profile-meta {
          font-size: 13px;
          opacity: 0.85;
          margin: 4px 0 0;
          word-break: break-word;
        }
        .edit-btn {
          padding: 9px 18px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 10px;
          color: #fde8ec;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }

        .account-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
        }
        .logout-btn {
          padding: 9px 18px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          color: #dc2626;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }

        /* Responsive tweaks */
        @media (max-width: 560px) {
          .profile-header {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }
          .edit-btn {
            width: 100%;
            text-align: center;
          }
          .account-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .logout-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">A</div>
        <div className="profile-info">
          <p className="profile-name">Admin User</p>
          <p className="profile-meta">admin@lostlink.com &nbsp;·&nbsp; Super Admin</p>
        </div>
        <button className="edit-btn" onClick={onEditProfile}>
          Edit Profile
        </button>
      </div>

      {/* Account Info + Logout */}
      <div style={{ ...cardStyle }} className="account-card">
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#2e1a1a", margin: 0 }}>Last login</p>
          <p style={{ fontSize: 12, color: "#c07080", margin: "2px 0 0" }}>
            Today at 9:14 AM from Lahore, Pakistan
          </p>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}
