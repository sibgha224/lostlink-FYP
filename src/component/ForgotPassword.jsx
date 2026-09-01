import React from 'react';

const ForgotPassword = ({ onGoToLogin }) => {
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

        {/* Logo Icon */}
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

        {/* Logo Text */}
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
            Reset Password
          </h2>

          <p
            className="text-xs mt-1 font-medium"
            style={{ color: '#c5a3a3' }}
          >
            Enter your email to get a secure verification code.
          </p>
        </div>

        {/* Card Body */}
        <div className="p-7">

          {/* Email Field */}
          <div className="mb-4">

            <label
              className="block text-sm font-bold mb-1"
              style={{ color: '#c07080' }}
            >
              Email Address
            </label>

            <div className="relative">

              {/* Email Icon */}
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
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2-2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>

              <input
                type="email"
                placeholder="your@email.com"
                className="w-full py-3 pl-10 pr-3 rounded-xl text-sm outline-none transition-colors"
                style={{
                  border: '1px solid #e8d0d0',
                  backgroundColor: '#fff8f8',
                  color: '#2e1a1a',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#800020';
                  e.target.style.backgroundColor = '#fff8f8';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e8d0d0';
                  e.target.style.backgroundColor = '#fff8f8';
                }}
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="button"
            className="w-full py-3 text-base rounded-xl border-none cursor-pointer transition-all shadow-md mt-2 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #800020, #4a0010)',
              color: '#fde8ec',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #a0002a, #800020)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #800020, #4a0010)';
            }}
          >
            Get Verification Code →
          </button>

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