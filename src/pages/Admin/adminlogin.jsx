import { useState } from "react";

const AdminLogin = () => {
  const [screen, setScreen] = useState("login");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Yahan maine flex-row set kar diya hai taakay mobile par upar-neeche na ho */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl flex flex-row overflow-hidden">

        {/* LEFT SIDE - SVG Illustration - mobile pe bhi side pe dikhega */}
        <div className="w-[40%] md:w-1/2 bg-blue-50 flex items-center justify-center p-4 sm:p-6">
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm">
            <circle cx="200" cy="200" r="160" fill="#EEF2FF"/>
            <rect x="130" y="80" width="140" height="240" rx="20" fill="#4F46E5"/>
            <rect x="140" y="95" width="120" height="210" rx="12" fill="white"/>
            <rect x="175" y="140" width="50" height="40" rx="8" fill="#E0E7FF"/>
            <path d="M185 140 Q185 125 200 125 Q215 125 215 140" fill="none" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round"/>
            <circle cx="200" cy="162" r="5" fill="#4F46E5"/>
            <rect x="155" y="200" width="90" height="12" rx="4" fill="#E0E7FF"/>
            <rect x="155" y="222" width="90" height="12" rx="4" fill="#E0E7FF"/>
            <rect x="165" y="248" width="70" height="14" rx="7" fill="#4F46E5"/>
            <circle cx="100" cy="200" r="22" fill="#FDA4AF"/>
            <path d="M65 300 Q65 255 100 255 Q135 255 135 300" fill="#7C3AED"/>
            <rect x="78" y="240" width="44" height="30" rx="8" fill="#7C3AED"/>
            <circle cx="290" cy="120" r="20" fill="none" stroke="#C7D2FE" strokeWidth="6"/>
            <circle cx="290" cy="120" r="8" fill="#C7D2FE"/>
            <circle cx="320" cy="150" r="14" fill="none" stroke="#C7D2FE" strokeWidth="5"/>
            <circle cx="320" cy="150" r="6" fill="#C7D2FE"/>
            <circle cx="90" cy="160" r="28" fill="#FDA4AF"/>
            <rect x="78" y="158" width="24" height="18" rx="4" fill="white"/>
            <path d="M82 158 Q82 148 90 148 Q98 148 98 158" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="310" cy="280" r="6" fill="#C7D2FE"/>
            <circle cx="330" cy="260" r="4" fill="#E0E7FF"/>
            <circle cx="80" cy="320" r="5" fill="#FCA5A5"/>
          </svg>
        </div>

        {/* RIGHT SIDE - Form Area */}
        <div className="w-[60%] md:w-1/2 flex flex-col">

          {/* Header */}
          <div className="bg-blue-100 px-4 py-5 sm:px-6 flex items-center justify-center gap-3">
            <div className="bg-blue-600 text-white p-1.5 sm:p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-black">LostLink</h1>
          </div>

          {/* Form Area */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-sm">

              {/* LOGIN SCREEN */}
              {screen === "login" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-2 sm:px-3 bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input type="email" placeholder="admin@lostlink.com" className="w-full py-2 sm:py-2.5 bg-transparent focus:outline-none text-gray-800 text-xs sm:text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-2 sm:px-3 bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input type="password" placeholder="••••" className="w-full py-2 sm:py-2.5 bg-transparent focus:outline-none text-gray-800 text-xs sm:text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-2 sm:px-3 bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input type="password" placeholder="••••" className="w-full py-2 sm:py-2.5 bg-transparent focus:outline-none text-gray-800 text-xs sm:text-sm" />
                    </div>
                  </div>

                  <div className="text-right">
                    <button onClick={() => setScreen("forgot")} className="text-[10px] sm:text-sm text-blue-500 hover:underline">
                      Forgot Password?
                    </button>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 sm:py-2.5 rounded-full font-semibold hover:bg-blue-700 transition text-xs sm:text-sm">
                    Login →
                  </button>
                </div>
              )}

              {/* FORGOT PASSWORD SCREEN */}
              {screen === "forgot" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-bold">Reset Password</label>
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-3">Enter your email to get a verification code.</p>
                    <div className="flex items-center border border-gray-300 rounded-lg px-2 bg-gray-50">
                      <input type="email" placeholder="admin@lostlink.com" className="w-full py-2 bg-transparent outline-none text-xs sm:text-sm" />
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold text-xs sm:text-sm">
                    Get Verification Code
                  </button>
                  <div className="text-center">
                    <button onClick={() => setScreen("login")} className="text-[10px] sm:text-sm text-blue-500 hover:underline">← Back</button>
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