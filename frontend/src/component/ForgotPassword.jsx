import React, { useState } from 'react';

const API_BASE = 'http://localhost:5000/api/auth';

const ForgotPassword = ({ onGoToLogin }) => {
  const [step, setStep] = useState('email'); // 'email' ya 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleGetCode = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setStep('reset');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Reset failed');
      }

      setMessage(data.message || 'Password reset successful! Please login.');
      setTimeout(() => onGoToLogin(), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage: "url('/college_bg.jpeg')",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Top-Left Logo */}
      <div className="fixed top-4 left-4 flex items-center gap-2.5 z-20">
        <div
          className="w-[48px] h-[48px] rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #800020, #4a0010)',
            boxShadow: '0 4px 12px rgba(128, 0, 32, 0.25)',
          }}
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.8"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7.5" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
        </div>

        <span
          className="text-[1.5rem] font-extrabold tracking-tight"
          style={{
            color: '#2e1a1a',
            fontFamily: "'Fraunces', serif",
            fontWeight: 800,
          }}
        >
          LostLink
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden z-10 mx-4">

        {/* Card Header */}
        <div
          className="px-6 py-5 text-center border-b-2"
          style={{
            background: 'linear-gradient(135deg, #4a0010, #800020)',
            borderColor: '#e8d0d0',
          }}
        >
          <h2
            className="text-xl m-0"
            style={{
              color: '#fde8ec',
              fontFamily: "'Fraunces', serif",
              fontWeight: 800,
            }}
          >
            {step === 'email' ? 'Reset Password' : 'Enter Code & New Password'}
          </h2>

          <p
            className="text-xs mt-1 font-medium"
            style={{ color: '#c5a3a3' }}
          >
            {step === 'email'
              ? 'Enter your email to get a secure verification code.'
              : `We've sent a 6-digit code to ${email}`}
          </p>
        </div>

        {/* Card Body */}
        <div className="p-7">

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 text-xs rounded-xl font-medium">
              {message}
            </div>
          )}

          {step === 'email' ? (
            /* --- STEP 1: EMAIL INPUT FORM --- */
            <form onSubmit={handleGetCode}>
              <div className="mb-4">
                <label
                  className="block text-sm font-bold mb-1"
                  style={{ color: '#c07080' }}
                >
                  Email Address
                </label>

                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#c07080' }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>

                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3 pl-10 pr-3 rounded-xl text-sm outline-none transition-colors"
                    style={{
                      border: '1px solid #e8d0d0',
                      backgroundColor: '#fff8f8',
                      color: '#2e1a1a',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-base rounded-xl border-none cursor-pointer transition-all shadow-md mt-2 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #800020, #4a0010)',
                  color: '#fde8ec',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Sending...' : 'Get Verification Code →'}
              </button>
            </form>
          ) : (
            /* --- STEP 2: OTP + NEW PASSWORD FORM --- */
            <form onSubmit={handleResetPassword}>
              <div className="flex justify-center gap-2 mb-5">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    className="w-10 h-12 text-center text-xl font-bold border-2 border-[#e8d0d0] rounded-xl outline-none focus:border-[#800020] bg-[#fff8f8] text-[#2e1a1a]"
                  />
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-1" style={{ color: '#c07080' }}>
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full py-3 px-3 rounded-xl text-sm outline-none transition-colors"
                  style={{ border: '1px solid #e8d0d0', backgroundColor: '#fff8f8', color: '#2e1a1a' }}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-1" style={{ color: '#c07080' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full py-3 px-3 rounded-xl text-sm outline-none transition-colors"
                  style={{ border: '1px solid #e8d0d0', backgroundColor: '#fff8f8', color: '#2e1a1a' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-base rounded-xl border-none cursor-pointer transition-all shadow-md mt-2 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #800020, #4a0010)',
                  color: '#fde8ec',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Resetting...' : 'Reset Password →'}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="text-center mt-5">
            <span
              onClick={onGoToLogin}
              className="cursor-pointer font-bold text-sm hover:underline"
              style={{
                color: '#800020',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ← Back to Login
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
