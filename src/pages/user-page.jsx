import { useState } from "react";

const initialUsers = [
  { id: "USR-001", name: "Ali Hassan", email: "ali.hassan@example.com", rollNo: "CS-2022-01", department: "Computer Science", status: "Active", itemsReported: 3 },
  { id: "USR-002", name: "Sara Malik", email: "sara.malik@example.com", rollNo: "CS-2022-14", department: "Software Engineering", status: "Active", itemsReported: 1 },
  { id: "USR-003", name: "Zainab Bibi", email: "zainab.b@example.com", rollNo: "IT-2023-09", department: "Information Technology", status: "Active", itemsReported: 2 },
  { id: "USR-004", name: "Usman Raza", email: "usman.raza@example.com", rollNo: "EE-2021-45", department: "Electrical Eng", status: "Blocked", itemsReported: 0 },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  const toggleStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" }
          : u
      )
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8d0d0",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 2px 12px rgba(74,0,16,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Fraunces',serif",
              fontSize: 20,
              color: "#2e1a1a",
              margin: 0,
            }}
          >
            User Management
          </h2>
          <p style={{ fontSize: 12, color: "#c07080", marginTop: 2 }}>
            Manage registered students and users
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by name, roll no, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #e8d0d0",
            fontSize: 13,
            outline: "none",
            width: "260px",
          }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fdf6f7", borderBottom: "1px solid #f0e0e0" }}>
              {["User ID", "Name", "Roll No", "Department", "Items", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      fontSize: 11,
                      color: "#c07080",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #fdf0f0" }}>
                <td style={{ padding: "12px 14px", fontWeight: 700, color: "#800020", fontSize: 13 }}>
                  {user.id}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ fontWeight: 600, color: "#2e1a1a", fontSize: 13 }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: "#c07080" }}>{user.email}</div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#2e1a1a" }}>
                  {user.rollNo}
                </td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "#6b4848" }}>
                  {user.department}
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "#2e1a1a" }}>
                  {user.itemsReported}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 100,
                      fontSize: 11,
                      fontWeight: 700,
                      background: user.status === "Active" ? "#f0fdf4" : "#fef2f2",
                      color: user.status === "Active" ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <button
                    onClick={() => toggleStatus(user.id)}
                    style={{
                      background: user.status === "Active" ? "#fef2f2" : "#f0fdf4",
                      border: user.status === "Active" ? "1px solid #fecaca" : "1px solid #bbf7d0",
                      color: user.status === "Active" ? "#dc2626" : "#16a34a",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {user.status === "Active" ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}