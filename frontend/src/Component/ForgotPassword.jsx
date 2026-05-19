import React from 'react';

const ForgotPassword = ({ onGoToLogin }) => {
  return (
    <div 
      className="relative flex items-center justify-center min-h-screen w-full overflow-hidden p-4 sm:p-6" 
      style={{ 
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        backgroundImage: `url("/college_bg.jpeg")`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Overlay Shapes */}
      <div 
        className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #800020, #4a0010)' }}
      ></div>
      
      <div 
        className="absolute bottom-[-150px] left-[-150px] w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #4a0010, #800020)' }}
      ></div>

      {/* Top-Left Logo */}
      <div className="absolute top-4 sm:top-5 left-4 sm:left-5 flex items-center gap-2 sm:gap-2.5 z-20">
        <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #800020, #4a0010)', boxShadow: '0 4px 12px rgba(128,0,32,0.4)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="sm:w-5 sm:h-5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <span className="text-xl sm:text-2xl font-bold text-white tracking-tighter drop-shadow-lg" style={{ fontFamily: "'Fraunces', serif" }}>
          LostLink
        </span>
      </div>

      {/* Card */}
      <div 
        className="w-full max-w-[420px] bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-2xl overflow-hidden z-20" 
        style={{ 
          boxShadow: '0 30px 80px rgba(0,0,0,0.3)'
        }}
      >
        {/* Card Header - Darker Background */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 text-center" style={{ background: 'linear-gradient(135deg, #4a0010 0%, #800020 100%)' }}>
          <h2 className="text-lg sm:text-xl font-bold text-white m-0" style={{ fontFamily: "'Fraunces', serif" }}>Reset Password</h2>
          <p className="text-[#fde8ec] text-xs sm:text-xs mt-1 font-medium">
            Enter your email to get a secure verification code.
          </p>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-7">
          {/* Email Field */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-bold text-[#2e1a1a] mb-1.5 sm:mb-2 uppercase tracking-widest" style={{ color: '#800020', letterSpacing: '0.1em' }}>
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#c5a3a3]">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full py-2.5 sm:py-3 pl-10 sm:pl-11 pr-3 sm:pr-4 rounded-xl border text-xs sm:text-sm text-[#2e1a1a] outline-none transition-all"
                style={{ borderColor: '#e8d0d0', backgroundColor: '#fff8f8', borderWidth: '1.5px' }}
                onFocus={(e) => { e.target.style.borderColor = '#800020'; e.target.style.backgroundColor = '#ffffff'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e8d0d0'; e.target.style.backgroundColor = '#fff8f8'; }}
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="button"
            className="w-full py-2.5 sm:py-3 text-white font-bold text-sm sm:text-base rounded-xl border-none cursor-pointer transition-all active:scale-95 mt-2"
            style={{ 
              background: 'linear-gradient(135deg, #800020, #4a0010)',
              boxShadow: '0 4px 15px rgba(128,0,32,0.25)'
            }}
            onMouseEnter={(e) => { e.target.style.background = 'linear-gradient(135deg, #a0002a, #800020)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'linear-gradient(135deg, #800020, #4a0010)'; }}
          >
            Get Verification Code →
          </button>

          {/* Back to Login */}
          <div className="text-center mt-4 sm:mt-5">
            <span
              onClick={onGoToLogin}
              className="hover:underline cursor-pointer font-bold text-xs sm:text-sm transition-colors"
              style={{ color: '#800020' }}
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