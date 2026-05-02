import React from 'react';

const ForgotPassword = ({ onGoToLogin }) => {
  return (
    <div className="relative flex items-center justify-center min-h-screen w-full">

      {/* Top-Left Logo */}
      <div className="absolute top-5 left-5 flex items-center gap-2.5 z-10">
        <div className="bg-blue-600 w-9 h-9 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <span className="text-2xl font-bold text-white tracking-tighter drop-shadow-lg">
          LostLink
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden z-10 mx-4">

        {/* Card Header */}
        <div className="bg-slate-100 px-6 py-5 border-b-2 border-slate-200 text-center">
          <h2 className="text-xl font-bold text-slate-800 m-0">Reset Password</h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Enter your email to get a secure verification code.
          </p>
        </div>

        {/* Card Body */}
        <div className="p-7">

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full py-3 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="button"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-base rounded-xl border-none cursor-pointer transition-all shadow-md mt-2"
          >
            Get Verification Code →
          </button>

          {/* Back to Login */}
          <div className="text-center mt-5">
            <span
              onClick={onGoToLogin}
              className="text-blue-600 hover:underline cursor-pointer font-bold text-sm"
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
