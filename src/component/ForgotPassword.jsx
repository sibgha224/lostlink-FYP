import React, { useState } from 'react';

const ForgotPassword = ({ onGoToLogin }) => {
  const [step, setStep] = useState('email'); // 'email' ya 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleGetCode = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setStep('otp'); // Email enter karne ke baad OTP screen par le jaye ga
    } else {
      alert('Please enter your email address');
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

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 4) {
      alert('OTP Verified Successfully! You can now reset your password.');
      onGoToLogin(); // Verification complete hone ke baad login par wapas bhej dein
    } else {
      alert('Please enter a valid 4-digit OTP');
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
            {step === 'email' ? 'Reset Password' : 'Enter Verification Code'}
          </h2>

          <p
            className="text-xs mt-1 font-medium"
            style={{ color: '#c5a3a3' }}
          >
            {step === 'email' 
              ? 'Enter your email to get a secure verification code.' 
              : `We've sent a 4-digit code to ${email}`}
          </p>
        </div>

        {/* Card Body */}
        <div className="p-7">

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
                className="w-full py-3 text-base rounded-xl border-none cursor-pointer transition-all shadow-md mt-2 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #800020, #4a0010)',
                  color: '#fde8ec',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                Get Verification Code →
              </button>
            </form>
          ) : (
            /* --- STEP 2: OTP VERIFICATION FORM --- */
            <form onSubmit={handleVerifyOtp}>
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-[#e8d0d0] rounded-xl outline-none focus:border-[#800020] bg-[#fff8f8] text-[#2e1a1a]"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3 text-base rounded-xl border-none cursor-pointer transition-all shadow-md mt-2 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #800020, #4a0010)',
                  color: '#fde8ec',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                Verify Code & Proceed
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