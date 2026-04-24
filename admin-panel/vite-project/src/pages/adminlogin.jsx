import { useState } from "react";

const AdminLogin = () => {
  const [screen, setScreen] = useState("login");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">

        {/* LEFT SIDE - Dark Purple - Chota */}
        <div className="w-full md:w-1/3 flex flex-col justify-center p-6"
          style={{ background: '#1e1b4b' }}>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl" style={{ background: '#6366f1' }}>
              <svg className="h-6 w-6" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="6"/><path d="M21 21l-4-4"/>
              </svg>
            </div>
            <span className="text-white text-xl font-bold">LostLink</span>
          </div>

          {/* Tagline */}
          <p style={{ color: '#a5b4fc' }} className="text-sm leading-relaxed">
            Intelligent Lost & Found Portal for Govt. Graduate College Mandi Bahauddin
          </p>

          {/* Dots */}
          <div className="flex items-center gap-2 mt-8">
            <div className="h-2 w-5 rounded-full" style={{ background: '#818cf8' }}></div>
            <div className="h-2 w-2 rounded-full" style={{ background: '#4338ca' }}></div>
            <div className="h-2 w-2 rounded-full" style={{ background: '#4338ca' }}></div>
          </div>

        </div>

        {/* RIGHT SIDE - Bara */}
        <div className="w-full md:w-2/3 flex flex-col">

          {/* Header */}
          <div className="px-8 py-4 border-b text-center" style={{ background: '#eef2ff', borderColor: '#e0e7ff' }}>
            <h3 className="font-semibold" style={{ color: '#3730a3' }}>
              {screen === "login" ? "Admin Login" : "Reset Password"}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#6366f1' }}>
              {screen === "login" ? "Sign in to your account" : "Enter email to reset"}
            </p>
          </div>

          {/* Form Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md">

              {/* LOGIN SCREEN */}
              {screen === "login" && (
                <div className="space-y-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center border border-gray-200 rounded-lg px-3 bg-gray-50 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <input type="email" placeholder="admin@lostlink.com" className="w-full py-2.5 bg-transparent focus:outline-none text-gray-800 text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="flex items-center border border-gray-200 rounded-lg px-3 bg-gray-50 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                      <input type="password" placeholder="••••••••" className="w-full py-2.5 bg-transparent focus:outline-none text-gray-800 text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <div className="flex items-center border border-gray-200 rounded-lg px-3 bg-gray-50 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                      <input type="password" placeholder="••••••••" className="w-full py-2.5 bg-transparent focus:outline-none text-gray-800 text-sm" />
                    </div>
                  </div>

                  <div className="text-right">
                    <button onClick={() => setScreen("forgot")} className="text-sm hover:underline" style={{ color: '#6366f1' }}>
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    className="w-full text-white py-2.5 rounded-full font-semibold transition text-sm"
                    style={{ background: '#4338ca' }}
                    onMouseOver={e => e.target.style.background='#3730a3'}
                    onMouseOut={e => e.target.style.background='#4338ca'}>
                    Login →
                  </button>

                </div>
              )}

              {/* FORGOT PASSWORD SCREEN */}
              {screen === "forgot" && (
                <div className="space-y-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="flex items-center border border-gray-200 rounded-lg px-3 bg-gray-50 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <input type="email" placeholder="admin@lostlink.com" className="w-full py-2.5 bg-transparent focus:outline-none text-gray-800 text-sm" />
                    </div>
                  </div>

                  <button
                    className="w-full text-white py-2.5 rounded-full font-semibold transition text-sm"
                    style={{ background: '#4338ca' }}
                    onMouseOver={e => e.target.style.background='#3730a3'}
                    onMouseOut={e => e.target.style.background='#4338ca'}>
                    Send Reset Link
                  </button>

                  <div className="text-center">
                    <button onClick={() => setScreen("login")} className="text-sm hover:underline" style={{ color: '#6366f1' }}>
                      ← Back to Login
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;