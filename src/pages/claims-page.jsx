import { useState } from "react";

const initialClaims = [
  { id: "CLM-101", itemId: "LL-002", itemTitle: "iPhone 14 Pro", claimant: "Usman Raza", date: "12 May 2026", status: "Pending", proof: "Purchase receipt & Serial number mismatch check." },
  { id: "CLM-102", itemId: "LL-001", itemTitle: "Black Wallet", claimant: "Zainab Bibi", date: "10 May 2026", status: "Approved", proof: "ID Card matches name inside wallet." },
  { id: "CLM-103", itemId: "LL-005", itemTitle: "House Keys", claimant: "Hamza Ali", date: "09 May 2026", status: "Rejected", proof: "Key shape description did not match." },
];

export default function ClaimsPage() {
  const [claims, setClaims] = useState(initialClaims);

  const updateStatus = (id, newStatus) => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e8d0d0", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(74,0,16,0.05)" }}>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, color: "#2e1a1a", marginBottom: 16 }}>Claims Management</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#fdf6f7", borderBottom: "1px solid #f0e0e0" }}>
            {["Claim ID", "Item Title", "Claimant", "Date", "Status", "Proof Detail", "Actions"].map(h => (
              <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "#c07080", textTransform: "uppercase" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim.id} style={{ borderBottom: "1px solid #fdf0f0" }}>
              <td style={{ padding: "12px 14px", fontWeight: 700, color: "#800020", fontSize: 13 }}>{claim.id}</td>
              <td style={{ padding: "12px 14px", fontSize: 13, color: "#2e1a1a" }}>{claim.itemTitle}</td>
              <td style={{ padding: "12px 14px", fontSize: 13, color: "#6b4848" }}>{claim.claimant}</td>
              <td style={{ padding: "12px 14px", fontSize: 12, color: "#c07080" }}>{claim.date}</td>
              <td style={{ padding: "12px 14px" }}>
                <span style={{
                  padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                  background: claim.status === "Approved" ? "#f0fdf4" : claim.status === "Rejected" ? "#fef2f2" : "#fff7ed",
                  color: claim.status === "Approved" ? "#16a34a" : claim.status === "Rejected" ? "#dc2626" : "#c2410c"
                }}>
                  {claim.status}
                </span>
              </td>
              <td style={{ padding: "12px 14px", fontSize: 12, color: "#6b4848" }}>{claim.proof}</td>
              <td style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => updateStatus(claim.id, "Approved")} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>Approve</button>
                  <button onClick={() => updateStatus(claim.id, "Rejected")} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>Reject</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}