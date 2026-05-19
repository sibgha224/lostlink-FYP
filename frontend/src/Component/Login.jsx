import React, { useState } from 'react';

const Login = ({ onGoToSignup, onGoToForget }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="w-full min-h-screen flex justify-center items-center p-4 sm:p-6"
      style={{
        backgroundImage: "url('/college_bg.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      }}
    >

      {/* Card */}
      <div className="w-full max-w-[420px] bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-2xl overflow-hidden" style={{ border: '0.5px solid #e8d0d0' }}>

        {/* Logo Header */}
        <div
          className="flex flex-col items-center justify-center gap-1 py-4 sm:py-5 px-4 sm:px-5"
          style={{ background: 'linear-gradient(135deg, #4a0010 0%, #800020 100%)' }}
        >
          <div className="flex items-center gap-2 sm:gap-2.5 mb-0.5">
            <div
              className="w-7 sm:w-9 h-7 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <span
              className="text-xl sm:text-2xl tracking-tight"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, color: '#fde8ec' }}
            >
              LostLink
            </span>
          </div>
          <p
            className="text-[0.65rem] sm:text-xs tracking-widest uppercase text-center px-2"
            style={{ color: '#c07080', letterSpacing: '0.12em' }}
          >
            Govt. Graduate College Mandi Bahauddin
          </p>
        </div>

        {/* Form Area */}
        <div className="px-5 sm:px-8 pt-5 sm:pt-6 pb-6 sm:pb-7">

          {/* Welcome text */}
          <div className="text-center mb-4 sm:mb-5">
            <h2
              className="text-xl sm:text-2xl m-0"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, color: '#2e1a1a' }}
            >
              Welcome Back
            </h2>
            <p className="text-[0.8rem] sm:text-[0.85rem] mt-0.5" style={{ color: '#c07080' }}>
          
            </p>
          </div>

          <form className="flex flex-col gap-3 sm:gap-4">

            {/* Email */}
            <div>
              <label
                className="block text-xs font-bold mb-1.5 tracking-widest uppercase"
                style={{ color: '#800020', letterSpacing: '0.1em' }}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" style={{ color: '#c07080' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-[0.8rem] sm:text-[0.85rem] outline-none transition-all"
                  style={{
                    borderRadius: '10px',
                    border: '1.5px solid #e8d0d0',
                    backgroundColor: '#fff8f8',
                    color: '#2e1a1a',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#800020'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e8d0d0'; e.target.style.backgroundColor = '#fff8f8'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-bold mb-1.5 tracking-widest uppercase"
                style={{ color: '#800020', letterSpacing: '0.1em' }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" style={{ color: '#c07080' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full py-2.5 sm:py-3 pl-9 sm:pl-10 pr-9 sm:pr-10 text-[0.8rem] sm:text-[0.85rem] outline-none transition-all"
                  style={{
                    borderRadius: '10px',
                    border: '1.5px solid #e8d0d0',
                    backgroundColor: '#fff8f8',
                    color: '#2e1a1a',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#800020'; e.target.style.backgroundColor = '#ffffff'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e8d0d0'; e.target.style.backgroundColor = '#fff8f8'; }}
                />
                {/* Eye toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer p-0"
                  style={{ color: '#c07080' }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>

              {/* Forgot Password */}
              <p
                onClick={onGoToForget}
                className="text-right text-[0.75rem] sm:text-[0.8rem] cursor-pointer mt-1.5 font-semibold hover:underline transition-colors"
                style={{ color: '#800020' }}
              >
                Forgot your password?
              </p>
            </div>

            {/* Login Button */}
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 sm:py-3 font-bold text-[0.85rem] sm:text-[0.9rem] border-none cursor-pointer transition-all active:scale-95 mt-1"
              style={{
                background: 'linear-gradient(135deg, #800020, #4a0010)',
                color: '#fde8ec',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(128,0,32,0.25)',
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #a0002a, #800020)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #800020, #4a0010)'; }}
            >
              Log In
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

          </form>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-3 sm:bottom-6 text-center text-[0.75rem] sm:text-[0.85rem] text-white drop-shadow w-full px-4">
        Don't have an account?{' '}
        <span
          onClick={onGoToSignup}
          className="font-bold underline cursor-pointer hover:opacity-80 transition-opacity"
          style={{ color: '#fde8ec' }}
        >
          Create new account
        </span>
      </p>

    </div>
  );
};

export default Login;
