import React from 'react';

const Login = ({ onGoToSignup, onGoToForget }) => {
  
  const inputContainerStyle = {
    position: 'relative',
    marginTop: '5px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '25px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    fontSize: '0.95rem',
    color: '#334155',
    boxSizing: 'border-box',
    outline: 'none'
  };

  const labelStyle = {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: '5px',
    display: 'block',
    textAlign: 'left'
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px', padding: '20px' }}>
      
      {/* 🚩 Header section ko white card ke andar lane ke liye content ko wraps kiya hai */}
      <div style={{ background: '#ffffff', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        
        {/* 🚩 1. Naya Header Area (Form Card ke top par, White Background par) */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '12px',
          padding: '25px 25px 10px 25px', // Header ke liye compact padding
          textAlign: 'center'
        }}>
          {/* Blue Icon */}
          <div style={{ background: '#007bff', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,123,255,0.2)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          {/* Text */}
          <span style={{ fontSize: '2.0rem', fontWeight: 'bold', color: '#0f172a', letterSpacing: '-1px' }}>LostLink</span>
        </div>

        {/* Form area padding */}
        <div style={{ padding: '20px 35px 35px 35px' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Email Field */}
            <div>
              <label style={labelStyle}>Email</label>
              <div style={inputContainerStyle}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <input type="email" placeholder="your@email.com" style={inputStyle} />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={inputContainerStyle}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <input type="password" placeholder="********" style={inputStyle} />
              </div>
              {/* Forgot Password */}
              <p onClick={onGoToForget} style={{ textAlign: 'right', fontSize: '0.85rem', color: '#007bff', cursor: 'pointer', marginTop: '8px', fontWeight: '500' }}>
                Forgot Password?
              </p>
            </div>

            {/* Login Button */}
            <button type="button" style={{ padding: '14px', background: '#007bff', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px', boxShadow: '0 4px 12px rgba(0, 123, 255, 0.2)' }}>
              Log In <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </form>
        </div>
      </div>

      {/* 🚩 Footer Link ko white box ke bahar rakha hai taake design clean lage, text COLOR isko WHITE de diya hai taake background par dikhe */}
      <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.95rem', color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
        Don't have an account? <span onClick={onGoToSignup} style={{ color: '#ffffff', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>Create new account</span>
      </p>
    </div>
  );
};

export default Login;