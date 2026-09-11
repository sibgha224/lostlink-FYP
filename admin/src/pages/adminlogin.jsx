import bgImage from "../assets/clg.png"; // Rename ki hui image ka import
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/auth";

const AdminLogin = () => {
  const [screen, setScreen] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Forgot-password step state
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetStep, setResetStep] = useState("email"); // 'email' | 'otp'
  const [resetMsg, setResetMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  useEffect(() => {
    // If already logged in as admin, skip straight to dashboard
    const token = localStorage.getItem("adminToken");
    const user = JSON.parse(localStorage.getItem("adminUser") || "null");
    if (token && user?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const n = [...otp]; n[idx] = val; setOtp(n);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      document.getElementById(`otp-${idx - 1}`)?.focus();
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      if (data.user?.role !== "admin") {
        throw new Error("This account does not have admin access.");
      }
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      navigate("/admin/dashboard");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setResetMsg("");
    setErrorMsg("");
    try {
      setLoading(true);
      if (resetStep === "email") {
        const response = await fetch(`${API_BASE}/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not send code");
        setResetStep("otp");
      } else {
        const enteredOtp = otp.join("");
        if (enteredOtp.length !== 6) throw new Error("Please enter the full 6-digit code");
        if (newPassword !== confirmPassword) throw new Error("Passwords do not match");
        const response = await fetch(`${API_BASE}/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail, otp: enteredOtp, newPassword }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Reset failed");
        setResetMsg(data.message || "Password reset! Please sign in.");
        setTimeout(() => { setScreen("login"); setResetStep("email"); }, 1500);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: `url(${bgImage})`, // 1. Background Image yahan apply ho gayi
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", position: "relative", overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      
      {/* 2. Dark Overlay - Taake text easily parha jaye */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(40, 10, 20, 0.65)",
        backdropFilter: "blur(3px)",
        zIndex: 1,
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes rise {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes slide {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0px);   }
          50%     { transform: translateY(-12px);  }
        }
        @keyframes spin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }

        .al-enter { animation: rise  0.75s cubic-bezier(0.16,1,0.3,1) both; }
        .al-slide { animation: slide 0.3s  cubic-bezier(0.16,1,0.3,1) both; }

        .al-inp {
          width: 100%;
          padding: 13px 16px 13px 46px;
          background: #fff;
          border: 1.5px solid #e8d0d0;
          border-radius: 14px;
          color: #2e1a1a;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.22s;
        }
        .al-inp::placeholder { color: #c5a3a3; }
        .al-inp:focus {
          border-color: #800020;
          box-shadow: 0 0 0 4px rgba(128,0,32,0.1);
          background: #fff8f8;
        }

        .al-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #800020 0%, #4a0010 100%);
          border: none;
          border-radius: 14px;
          color: #fde8ec;
          font-size: 13px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 6px 20px rgba(128,0,32,0.3);
        }
        .al-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(128,0,32,0.4);
          background: linear-gradient(135deg, #a0002a 0%, #800020 100%);
        }
        .al-btn:active { transform: translateY(0); }

        .al-ghost {
          background: none; border: none;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .al-icon {
          position: absolute; left: 15px; top: 50%;
          transform: translateY(-50%);
          color: #c07080; pointer-events: none; display: flex;
        }

        .otp-inp {
          width: 44px; height: 54px;
          border-radius: 12px;
          border: 1.5px solid #e8d0d0;
          background: #fff;
          color: #2e1a1a;
          font-size: 22px; font-weight: 700;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: all 0.2s;
        }
        .otp-inp:focus {
          border-color: #800020;
          box-shadow: 0 0 0 3px rgba(128,0,32,0.12);
          background: #fff8f8;
        }

        .al-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: #c07080; display: block; margin-bottom: 7px;
        }
      `}</style>

      {/* ── CARD ── */}
      <div
        className={mounted ? "al-enter" : ""}
        style={{
          width: "100%", maxWidth: 430,
          opacity: mounted ? 1 : 0,
          position: "relative", zIndex: 10,
        }}
      >

        {/* ── HEADER ── */}
        <div style={{
          background: "linear-gradient(135deg, #4a0010 0%, #800020 100%)",
          borderRadius: "24px 24px 0 0",
          padding: "26px 30px 22px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:"linear-gradient(90deg, transparent, rgba(253,232,236,0.4), transparent)" }} />
          <div style={{ position:"absolute", top:"50%", left:"50%", width:160, height:160, marginLeft:-80, marginTop:-80, border:"1px solid rgba(255,255,255,0.05)", borderRadius:"50%", animation:"spin 30s linear infinite", pointerEvents:"none" }} />

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:8, position:"relative" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="18" height="18" fill="none" stroke="#fde8ec" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="6"/><path d="M21 21l-4-4"/>
              </svg>
            </div>
            <span style={{ fontFamily:"'Fraunces', serif", fontSize:24, fontWeight:800, color:"#fde8ec", letterSpacing:"-0.5px" }}>LostLink</span>
          </div>
          <p style={{ color:"rgba(253,232,236,0.55)", fontSize:10, fontWeight:600, letterSpacing:"1.5px", textTransform:"uppercase", position:"relative" }}>
            Govt. Graduate College Mandi Bahauddin
          </p>
        </div>

        {/* ── FORM BODY ── */}
        <div style={{
          background: "#ffffff",
          border: "1.5px solid #e8d0d0",
          borderTop: "none",
          borderRadius: "0 0 24px 24px",
          padding: "30px 34px 36px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
        }}>

          <div style={{ display:"flex", justifyContent:"center", marginBottom:26 }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:7,
              padding:"6px 14px",
              background:"rgba(128,0,32,0.06)",
              border:"1px solid rgba(128,0,32,0.15)",
              borderRadius:100,
            }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#800020" }} />
              <span style={{ color:"#800020", fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase" }}>
                {screen === "login" ? "Admin Access Only" : "Account Recovery"}
              </span>
            </div>
          </div>

          {/* ── LOGIN FORM ── */}
          {screen === "login" && (
            <form onSubmit={handleLoginSubmit} className="al-slide" style={{ display:"flex", flexDirection:"column", gap:18 }}>

              <div style={{ textAlign:"center", marginBottom:4 }}>
                <h1 style={{ fontFamily:"'Fraunces', serif", fontSize:28, fontWeight:800, color:"#2e1a1a", lineHeight:1.2 }}>Welcome Back</h1>
                <p style={{ color:"#c07080", fontSize:13, marginTop:6 }}>Sign in to manage the portal</p>
              </div>

              {errorMsg && (
                <div style={{ background:"#fee2e2", color:"#b91c1c", fontSize:12, fontWeight:600, padding:"10px 14px", borderRadius:12 }}>
                  {errorMsg}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="al-label">Email Address</label>
                <div style={{ position:"relative" }}>
                  <span className="al-icon">
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </span>
                  <input 
                    className="al-inp" 
                    type="email" 
                    placeholder="admin@college.edu.pk" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="al-label">Password</label>
                <div style={{ position:"relative" }}>
                  <span className="al-icon">
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </span>
                  <input 
                    className="al-inp" 
                    type={showPass ? "text" : "password"} 
                    placeholder="••••••••" 
                    style={{ paddingRight:48 }} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" className="al-ghost" onClick={() => setShowPass(!showPass)}
                    style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:"#c07080", display:"flex" }}>
                    {showPass
                      ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                      : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div style={{ textAlign:"right", marginTop:-6 }}>
                <button type="button" className="al-ghost" onClick={() => setScreen("forgot")}
                  style={{ color:"#800020", fontSize:12, fontWeight:500, textDecoration:"underline", textDecorationColor:"rgba(128,0,32,0.3)", textUnderlineOffset:3 }}>
                  Forgot your password?
                </button>
              </div>

              <button type="submit" className="al-btn" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ flex:1, height:1, background:"#f0e0e0" }} />
                <span style={{ color:"#c5a3a3", fontSize:10, letterSpacing:"1px", whiteSpace:"nowrap" }}>RESTRICTED ACCESS</span>
                <div style={{ flex:1, height:1, background:"#f0e0e0" }} />
              </div>
            </form>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {screen === "forgot" && (
            <form onSubmit={handleForgotSubmit} className="al-slide" style={{ textAlign:"center", display:"flex", flexDirection:"column", gap:22, alignItems:"center" }}>
              <div>
                <h2 style={{ fontFamily:"'Fraunces', serif", fontSize:26, fontWeight:800, color:"#2e1a1a", marginBottom:8 }}>
                  {resetStep === "email" ? "Reset Password" : "Verification"}
                </h2>
                <p style={{ color:"#c07080", fontSize:13, lineHeight:1.6 }}>
                  {resetStep === "email"
                    ? "Enter your admin email to get a code"
                    : <>Enter the 6-digit code sent to<br/>{resetEmail}</>}
                </p>
              </div>

              {errorMsg && (
                <div style={{ width:"100%", background:"#fee2e2", color:"#b91c1c", fontSize:12, fontWeight:600, padding:"10px 14px", borderRadius:12 }}>
                  {errorMsg}
                </div>
              )}
              {resetMsg && (
                <div style={{ width:"100%", background:"#dcfce7", color:"#15803d", fontSize:12, fontWeight:600, padding:"10px 14px", borderRadius:12 }}>
                  {resetMsg}
                </div>
              )}

              {resetStep === "email" ? (
                <input
                  className="al-inp"
                  type="email"
                  required
                  placeholder="admin@college.edu.pk"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  style={{ paddingLeft: 16, textAlign: "center" }}
                />
              ) : (
                <>
                  <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                    {otp.map((val, idx) => (
                      <input
                        key={idx} id={`otp-${idx}`}
                        className="otp-inp"
                        maxLength={1} value={val}
                        onChange={e => handleOtpChange(e.target.value, idx)}
                        onKeyDown={e => handleOtpKey(e, idx)}
                      />
                    ))}
                  </div>
                  <input
                    className="al-inp"
                    type="password"
                    required
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ paddingLeft: 16 }}
                  />
                  <input
                    className="al-inp"
                    type="password"
                    required
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ paddingLeft: 16 }}
                  />
                </>
              )}

              <button type="submit" className="al-btn" style={{ width:"100%", opacity: loading ? 0.7 : 1 }} disabled={loading}>
                {loading ? "Please wait..." : resetStep === "email" ? "Send Code" : "Reset Password"}
              </button>

              <button type="button" className="al-ghost" onClick={() => { setScreen("login"); setResetStep("email"); setErrorMsg(""); setResetMsg(""); }}
                style={{ color:"#c5a3a3", fontSize:13, display:"flex", alignItems:"center", gap:4 }}>
                ← Back to Login
              </button>
            </form>
          )}

        </div>

        {/* Footer */}
        <p style={{ textAlign:"center", marginTop:16, color:"#ffffff", fontSize:11, letterSpacing:"0.5px" }}>
          LostLink Portal © 2026
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;