import { useState, useEffect } from "react";

const AdminLogin = () => {
  const [screen, setScreen] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      document.getElementById(`otp-${idx - 1}`)?.focus();
  };

  const resetForgot = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      position: "relative",
      overflow: "hidden",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        .al-root { font-family: 'DM Sans', sans-serif; }
        .al-title { font-family: 'Playfair Display', serif; }

        @keyframes rise {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes formSlide {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes orb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(30px,-20px) scale(1.1); }
          66%     { transform: translate(-20px,15px) scale(0.95); }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(-25px,20px) scale(1.08); }
          66%     { transform: translate(20px,-15px) scale(0.92); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .al-card-enter {
          animation: rise 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .al-form-enter {
          animation: formSlide 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        .al-inp {
          width: 100%;
          padding: 14px 16px 14px 44px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          color: #f0ece8;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.25s;
        }
        .al-inp::placeholder { color: rgba(240,236,232,0.3); }
        .al-inp:focus {
          border-color: #c8a96e;
          background: rgba(200,169,110,0.06);
          box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
        }

        .al-btn-main {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #c8a96e 0%, #a07840 100%);
          border: none;
          border-radius: 14px;
          color: #0a0a0f;
          font-size: 14px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }
        .al-btn-main::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .al-btn-main:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(200,169,110,0.35);
        }
        .al-btn-main:hover::before {
          opacity: 1;
          animation: shimmer 1s linear;
        }
        .al-btn-main:active { transform: translateY(0); }

        .al-link-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #c8a96e;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
          transition: opacity 0.2s;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(200,169,110,0.4);
        }
        .al-link-btn:hover { opacity: 0.7; }

        .al-field { position: relative; }
        .al-field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(200,169,110,0.6);
          pointer-events: none;
        }
        .al-eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(200,169,110,0.5);
          padding: 4px;
          transition: color 0.2s;
          display: flex;
        }
        .al-eye-btn:hover { color: #c8a96e; }

        .otp-box {
          width: 46px;
          height: 56px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: #f0ece8;
          font-size: 22px;
          font-weight: 700;
          text-align: center;
          outline: none;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .otp-box:focus {
          border-color: #c8a96e;
          background: rgba(200,169,110,0.06);
          box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
        }

        .al-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
        }
        .al-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        /* RESPONSIVE */
        @media (max-width: 640px) {
          .al-card-inner { flex-direction: column !important; }
          .al-left-panel { width: 100% !important; min-height: auto !important; padding: 28px 24px !important; flex-direction: row !important; align-items: center !important; gap: 16px; border-radius: 0 !important; }
          .al-left-bottom { display: none !important; }
          .al-right-panel { padding: 28px 20px !important; }
          .otp-box { width: 38px !important; height: 46px !important; font-size: 18px !important; }
        }
        @media (min-width: 641px) {
          .al-left-panel { width: 340px !important; flex-shrink: 0; }
        }
      `}</style>

      {/* Background orbs */}
      <div style={{
        position: "fixed", top: "15%", left: "10%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 65%)",
        animation: "orb1 12s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "10%", right: "8%",
        width: 420, height: 420, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)",
        animation: "orb2 15s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Subtle grid */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.025,
        backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      {/* CARD */}
      <div
        className={`al-root ${mounted ? "al-card-enter" : ""}`}
        style={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,169,110,0.08)",
          display: "flex",
          opacity: mounted ? undefined : 0,
        }}
      >
        <div className="al-card-inner" style={{ display: "flex", width: "100%" }}>

          {/* ── LEFT PANEL ── */}
          <div className="al-left-panel" style={{
            background: "linear-gradient(160deg, #111118 0%, #0e0e15 100%)",
            padding: "52px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            borderRight: "1px solid rgba(255,255,255,0.05)",
          }}>

            {/* Decorative corner accent */}
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: 120, height: 120,
              background: "radial-gradient(circle at top right, rgba(200,169,110,0.12), transparent 70%)",
            }} />
            <div style={{
              position: "absolute", bottom: 0, left: 0,
              width: 100, height: 100,
              background: "radial-gradient(circle at bottom left, rgba(139,92,246,0.1), transparent 70%)",
            }} />

            {/* Top content */}
            <div style={{ position: "relative" }}>
              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 44 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "linear-gradient(135deg, #c8a96e, #8a6030)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(200,169,110,0.3)",
                  flexShrink: 0,
                }}>
                  <svg width="20" height="20" fill="none" stroke="#0a0a0f" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="6"/><path d="M21 21l-4-4"/>
                  </svg>
                </div>
                <span className="al-title" style={{ color: "#f0ece8", fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>LostLink</span>
              </div>

              {/* Decorative number */}
              <div style={{
                fontSize: 100, fontFamily: "'Playfair Display', serif",
                fontWeight: 800, lineHeight: 1,
                color: "rgba(200,169,110,0.06)",
                marginBottom: -16,
                userSelect: "none",
              }}>L²</div>

              <h2 className="al-title" style={{
                color: "#f0ece8",
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1.3,
                margin: "0 0 14px",
              }}>
                Admin<br/>Portal
              </h2>

              <p style={{
                color: "rgba(240,236,232,0.45)",
                fontSize: 13,
                lineHeight: 1.8,
                margin: 0,
              }}>
                Govt. Graduate College<br />
                Mandi Bahauddin<br />
                Lost &amp; Found Management
              </p>
            </div>

            {/* Bottom tag */}
            <div className="al-left-bottom" style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              background: "rgba(200,169,110,0.07)",
              border: "1px solid rgba(200,169,110,0.15)",
              borderRadius: 12,
              marginTop: 40,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "rgba(200,169,110,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="14" height="14" fill="none" stroke="#c8a96e" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <p style={{ color: "#c8a96e", fontSize: 11, fontWeight: 600, margin: 0, letterSpacing: "0.5px" }}>SECURE ACCESS</p>
                <p style={{ color: "rgba(240,236,232,0.4)", fontSize: 11, margin: 0 }}>Admin only portal</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="al-right-panel" style={{
            flex: 1,
            background: "#0f0f17",
            padding: "52px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}>

            {/* Top label strip */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "rgba(200,169,110,0.08)",
              border: "1px solid rgba(200,169,110,0.15)",
              borderRadius: 100,
              marginBottom: 28,
              alignSelf: "flex-start",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8a96e" }} />
              <span style={{ color: "#c8a96e", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                {screen === "login" ? "Admin Login" : "Account Recovery"}
              </span>
            </div>

            {/* ── LOGIN FORM ── */}
            {screen === "login" && (
              <div className="al-form-enter" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                <div style={{ marginBottom: 8 }}>
                  <h1 className="al-title" style={{ color: "#f0ece8", fontSize: 32, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.2 }}>
                    Sign In
                  </h1>
                  <p style={{ color: "rgba(240,236,232,0.4)", fontSize: 14, margin: 0 }}>
                    Enter your credentials to continue
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label style={{ color: "rgba(240,236,232,0.6)", fontSize: 12, fontWeight: 500, display: "block", marginBottom: 8, letterSpacing: "0.3px" }}>
                    Email Address
                  </label>
                  <div className="al-field">
                    <span className="al-field-icon">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </span>
                    <input className="al-inp" type="email" placeholder="admin@lostlink.com" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ color: "rgba(240,236,232,0.6)", fontSize: 12, fontWeight: 500, display: "block", marginBottom: 8, letterSpacing: "0.3px" }}>
                    Password
                  </label>
                  <div className="al-field">
                    <span className="al-field-icon">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </span>
                    <input className="al-inp" type={showPass ? "text" : "password"} placeholder="••••••••" style={{ paddingRight: 44 }} />
                    <button className="al-eye-btn" onClick={() => setShowPass(!showPass)}>
                      {showPass
                        ? <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                        : <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                {/* Forgot */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -8 }}>
                  <button className="al-link-btn" onClick={() => { setScreen("forgot"); resetForgot(); }}>
                    Forgot Password?
                  </button>
                </div>

                <button className="al-btn-main">Login →</button>

                {/* Bottom text */}
                <div className="al-divider">
                  <div className="al-divider-line" />
                  <span style={{ color: "rgba(240,236,232,0.2)", fontSize: 11, whiteSpace: "nowrap" }}>RESTRICTED ACCESS</span>
                  <div className="al-divider-line" />
                </div>
              </div>
            )}

            {/* ── FORGOT / OTP FORM ── */}
            {screen === "forgot" && (
              <div className="al-form-enter" style={{ display: "flex", flexDirection: "column", gap: 22 }}>

                {/* Step 1 — Email */}
                {!otpSent && !otpVerified && (
                  <>
                    <div style={{ marginBottom: 4 }}>
                      <p style={{ color: "rgba(200,169,110,0.7)", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 8px" }}>Step 1 of 2</p>
                      <h1 className="al-title" style={{ color: "#f0ece8", fontSize: 30, fontWeight: 700, margin: "0 0 8px" }}>Reset Password</h1>
                      <p style={{ color: "rgba(240,236,232,0.4)", fontSize: 14, margin: 0 }}>Enter your email to receive a 6-digit OTP.</p>
                    </div>
                    <div>
                      <label style={{ color: "rgba(240,236,232,0.6)", fontSize: 12, fontWeight: 500, display: "block", marginBottom: 8 }}>Email Address</label>
                      <div className="al-field">
                        <span className="al-field-icon">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                        </span>
                        <input className="al-inp" type="email" placeholder="admin@lostlink.com" />
                      </div>
                    </div>
                    <button className="al-btn-main" onClick={() => setOtpSent(true)}>Send OTP →</button>
                  </>
                )}

                {/* Step 2 — OTP */}
                {otpSent && !otpVerified && (
                  <>
                    <div style={{ marginBottom: 4 }}>
                      <p style={{ color: "rgba(200,169,110,0.7)", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 8px" }}>Step 2 of 2</p>
                      <h1 className="al-title" style={{ color: "#f0ece8", fontSize: 30, fontWeight: 700, margin: "0 0 8px" }}>Enter OTP</h1>
                      <p style={{ color: "rgba(240,236,232,0.4)", fontSize: 14, margin: 0 }}>6-digit code sent to your email.</p>
                    </div>

                    <div style={{ display: "flex", gap: 10, justifyContent: "center", padding: "8px 0" }}>
                      {otp.map((val, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          className="otp-box"
                          maxLength={1}
                          value={val}
                          onChange={e => handleOtpChange(e.target.value, idx)}
                          onKeyDown={e => handleOtpKey(e, idx)}
                        />
                      ))}
                    </div>

                    <button className="al-btn-main" onClick={() => setOtpVerified(true)}>Verify OTP →</button>
                    <div style={{ textAlign: "center" }}>
                      <button className="al-link-btn" onClick={() => setOtpSent(false)}>← Resend OTP</button>
                    </div>
                  </>
                )}

                {/* Step 3 — Success */}
                {otpVerified && (
                  <div style={{
                    padding: "36px 24px",
                    background: "rgba(200,169,110,0.05)",
                    border: "1px solid rgba(200,169,110,0.15)",
                    borderRadius: 18,
                    textAlign: "center",
                  }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: "50%",
                      background: "rgba(200,169,110,0.1)",
                      border: "1px solid rgba(200,169,110,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 18px",
                    }}>
                      <svg width="24" height="24" fill="none" stroke="#c8a96e" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </div>
                    <p className="al-title" style={{ color: "#c8a96e", fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>Verified!</p>
                    <p style={{ color: "rgba(240,236,232,0.45)", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
                      Identity confirmed.<br/>You can now reset your password.
                    </p>
                  </div>
                )}

                {/* Back button */}
                {!otpVerified ? (
                  <button className="al-link-btn" onClick={() => { setScreen("login"); resetForgot(); }}
                    style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    ← Back to Login
                  </button>
                ) : (
                  <button className="al-btn-main" onClick={() => { setScreen("login"); resetForgot(); }}>
                    Back to Login
                  </button>
                )}

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;