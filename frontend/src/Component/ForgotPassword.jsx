import React from 'react';

const ForgotPassword = ({ onGoToLogin }) => {
  const inputStyle = { width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#f9fafb', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' };
  const labelStyle = { fontSize: '0.8rem', fontWeight: 'bold', color: '#334155', marginBottom: '5px', display: 'block', textAlign: 'left' };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      
      {/* 🚩 Top-Left Logo & Name Section */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10 }}>
        <div style={{ background: '#2563eb', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <span style={{ fontSize: '1.7rem', fontWeight: 'bold', color: '#ffffff', letterSpacing: '-1px', textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>LostLink</span>
      </div>

      {/* Forgot Password Card */}
      <div style={{ width: '100%', maxWidth: '400px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', overflow: 'hidden', zIndex: 2 }}>
        <div style={{ background: '#cbd5e1', padding: '20px', borderBottom: '2px solid #94a3b8', textAlign: 'center' }}>
          <h2 style={{ color: '#1e293b', margin: '0', fontSize: '1.4rem', fontWeight: 'bold' }}>Reset Password</h2>
          <p style={{ color: '#475569', fontSize: '0.75rem', margin: '5px 0 0 0', fontWeight: '500' }}>
            Enter your email to get a secure verification code.
          </p>
        </div>

        <div style={{ padding: '25px' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <input type="email" placeholder="your@email.com" style={inputStyle} />
              </div>
            </div>
            <button type="button" style={{ padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer' }}>
              Get Verification Code →
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span onClick={onGoToLogin} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>← Back to Login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;