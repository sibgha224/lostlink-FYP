import { useState } from "react";

const initialMessages = [
  {
    id: 1,
    sender: "Ali Hassan",
    email: "ali.hassan@example.com",
    subject: "Inquiry about Lost Student ID Card",
    message: "Hello Admin, I lost my student ID card near the library cafeteria yesterday. Has anyone handed it in?",
    date: "10:30 AM",
    status: "Unread",
  },
  {
    id: 2,
    sender: "Sara Malik",
    email: "sara.malik@example.com",
    subject: "Claim Status Update",
    message: "Respected Admin, I submitted a claim for the black wallet on Sep 5. Could you please update me on its status?",
    date: "Yesterday",
    status: "Read",
  },
  {
    id: 3,
    sender: "Zainab Bibi",
    email: "zainab.b@example.com",
    subject: "Found Keys near CS Department",
    message: "I found a set of 3 keys with a blue keychain near Lab 2. I have handed them over to the department office.",
    date: "05 Sep",
    status: "Read",
  },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState(initialMessages[0]);
  const [search, setSearch] = useState("");

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    setMessages(
      messages.map((m) => (m.id === msg.id ? { ...m, status: "Read" } : m))
    );
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.sender.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
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
      {/* Header */}
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
              fontFamily: "'Fraunces', serif",
              fontSize: 20,
              color: "#2e1a1a",
              margin: 0,
            }}
          >
            Messages & Inquiries
          </h2>
          <p style={{ fontSize: 12, color: "#c07080", marginTop: 2 }}>
            Manage user communications and support requests
          </p>
        </div>
        <input
          type="text"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #e8d0d0",
            fontSize: 13,
            outline: "none",
            width: "240px",
          }}
        />
      </div>

      {/* Messages Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: 20,
          minHeight: "420px",
        }}
      >
        {/* Messages List */}
        <div
          style={{
            borderRight: "1px solid #f0e0e0",
            paddingRight: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleSelectMessage(msg)}
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                cursor: "pointer",
                background:
                  selectedMessage?.id === msg.id
                    ? "#fdf6f7"
                    : msg.status === "Unread"
                    ? "#fff8f8"
                    : "#fcfcfc",
                border:
                  selectedMessage?.id === msg.id
                    ? "1px solid #800020"
                    : "1px solid #f0e0e0",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontWeight: msg.status === "Unread" ? 700 : 600,
                    fontSize: 13,
                    color: "#2e1a1a",
                  }}
                >
                  {msg.sender}
                </span>
                <span style={{ fontSize: 11, color: "#c07080" }}>{msg.date}</span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: msg.status === "Unread" ? 600 : 400,
                  color: "#6b4848",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {msg.subject}
              </div>
            </div>
          ))}
        </div>

        {/* Message Content View */}
        {selectedMessage ? (
          <div
            style={{
              padding: "10px 16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  borderBottom: "1px solid #f0e0e0",
                  paddingBottom: 14,
                  marginBottom: 16,
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    color: "#2e1a1a",
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  {selectedMessage.subject}
                </h3>
                <div
                  style={{
                    fontSize: 12,
                    color: "#c07080",
                    marginTop: 6,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    From: <strong>{selectedMessage.sender}</strong> ({selectedMessage.email})
                  </span>
                  <span>{selectedMessage.date}</span>
                </div>
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: "#4a3030",
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                }}
              >
                {selectedMessage.message}
              </p>
            </div>

            {/* Quick Reply Box */}
            <div style={{ marginTop: 20 }}>
              <textarea
                placeholder="Type your response here..."
                rows={3}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #e8d0d0",
                  fontSize: 13,
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                }}
              ></textarea>
              <button
                style={{
                  marginTop: 10,
                  background: "#800020",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 20px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => alert("Response sent successfully!")}
              >
                Send Reply
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: 20, color: "#c07080" }}>
            Select a message to view details
          </div>
        )}
      </div>
    </div>
  );
}