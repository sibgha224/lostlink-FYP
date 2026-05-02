import React from 'react';

const Login = ({ onGoToSignup, onGoToForget }) => {
  return (
    <div className="w-full max-w-[420px] px-4">

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Logo Header */}
        <div className="flex items-center justify-center gap-3 pt-7 pb-3 px-6">
          <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <span className="text-3xl font-bold text-slate-900 tracking-tight">LostLink</span>
        </div>

        {/* Form */}
        <div className="px-9 pb-9 pt-4">
          <form className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1 ml-1">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full py-3 pl-10 pr-3 rounded-3xl border border-slate-200 bg-slate-50 text-[0.95rem] text-slate-700 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1 ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full py-3 pl-10 pr-3 rounded-3xl border border-slate-200 bg-slate-50 text-[0.95rem] text-slate-700 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <p
                onClick={onGoToForget}
                className="text-right text-sm text-blue-600 cursor-pointer mt-2 font-medium hover:underline"
              >
                Forgot Password?
              </p>
            </div>

            {/* Login Button */}
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-base rounded-3xl border-none cursor-pointer transition-all shadow-md shadow-blue-500/20 mt-2"
            >
              Log In
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

          </form>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center mt-6 text-[0.95rem] text-white drop-shadow">
        Don't have an account?{' '}
        <span
          onClick={onGoToSignup}
          className="text-white font-bold underline cursor-pointer"
        >
          Create new account
        </span>
      </p>

    </div>
  );
};

export default Login;