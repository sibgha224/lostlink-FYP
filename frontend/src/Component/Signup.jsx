import React, { useState } from 'react';

const Signup = ({ onGoToLogin }) => {
  const [level, setLevel] = useState('BS');

  const bsDepartments = ["BS I.T", "BS Botany", "BS Chemistry", "BS Mathematics", "BS Physics", "BS Zoology", "BS English", "BS BBA"];
  const interDepartments = ["F.Sc (Pre-Medical)", "F.Sc (Pre-Engineering)", "ICS (Physics)", "I.Com", "F.A"];
  const currentDepartments = level === 'BS' ? bsDepartments : interDepartments;

  const inputStyle = { width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #ddd', marginTop: '3px', boxSizing: 'border-box', fontSize: '0.8rem' };
  const labelStyle = { fontSize: '0.75rem', fontWeight: 'bold', display: 'block', textAlign: 'left', color: '#334155' };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      
      {/* 🚩 Top-Left Logo & Name Section */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10 }}>
        {/* Blue Search Icon Logo */}
        <div style={{ background: '#2563eb', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        {/* LostLink Name */}
        <span style={{ fontSize: '1.7rem', fontWeight: 'bold', color: '#ffffff', letterSpacing: '-1px', textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>LostLink</span>
      </div>

      {/* Signup Card Content */}
      <div style={{ width: '100%', maxWidth: '440px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', overflow: 'hidden', zIndex: 2 }}>
        <div style={{ background: '#cbd5e1', padding: '15px', textAlign: 'center', borderBottom: '2px solid #94a3b8' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>Create Account</h2>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#475569' }}>Join the lost and found portal.</p>
        </div>

        <div style={{ padding: '15px 20px' }}>
          <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ gridColumn: 'span 1' }}><label style={labelStyle}>Full Name</label><input type="text" placeholder="Name" style={inputStyle} /></div>
            <div style={{ gridColumn: 'span 1' }}><label style={labelStyle}>Email</label><input type="email" placeholder="email@com" style={inputStyle} /></div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Academic Level</label>
              <select style={inputStyle} value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="BS">Bachelor (BS Programs)</option>
                <option value="Inter">Intermediate (FA/FSC/ICS)</option>
              </select>
            </div>
            <div><label style={labelStyle}>Program</label>
              <select style={inputStyle}>
                <option>Select</option>
                {currentDepartments.map((d, i) => <option key={i}>{d}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>{level === 'BS' ? 'Semester' : 'Year'}</label>
              <select style={inputStyle}>
                {level === 'BS' ? [1,2,3,4,5,6,7,8].map(s => <option key={s}>{s}th Sem</option>) : [<option>1st Year</option>,<option>2nd Year</option>]}
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Phone (Optional)</label><input type="text" placeholder="+92..." style={inputStyle} /></div>
            <div><label style={labelStyle}>Password</label><input type="password" placeholder="********" style={inputStyle} /></div>
            <div><label style={labelStyle}>Confirm Password</label><input type="password" placeholder="********" style={inputStyle} /></div>
            <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>{level === 'BS' ? 'Batch / Session' : 'College Roll No'}</label><input type="text" style={inputStyle} /></div>
            
            {level === 'BS' && (
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Shift</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <label style={{ flex: 1, border: '1px solid #ddd', padding: '5px', textAlign: 'center', borderRadius: '6px', fontSize: '0.7rem' }}><input type="radio" name="shift" /> Morning</label>
                  <label style={{ flex: 1, border: '1px solid #ddd', padding: '5px', textAlign: 'center', borderRadius: '6px', fontSize: '0.7rem' }}><input type="radio" name="shift" /> Evening</label>
                </div>
              </div>
            )}
            <button type="button" style={{ gridColumn: 'span 2', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>Create Account →</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.8rem' }}>Already have an account? <span onClick={onGoToLogin} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' }}>Login</span></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;