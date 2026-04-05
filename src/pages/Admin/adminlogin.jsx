import { useState } from "react";

const AdminLogin = () => {
  const [screen, setScreen] = useState("login");

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920')" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Top Header Section with Gray Background */}
        <div className="bg-gray-100 p-8 pb-6 text-center border-b border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">LostLink</h1>
          </div>
          {screen === "forgot" && <p className="text-gray-500 mt-2 text-sm">Reset Password</p>}
        </div>

        <div className="p-8">
          {screen === "login" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input type="email" placeholder="admin@lostlink.com" className="w-full py-2.5 focus:outline-none text-gray-800 bg-transparent" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input type="password" placeholder="••••••••" className="w-full py-2.5 focus:outline-none text-gray-800 bg-transparent" />
                </div>
              </div>

              <div className="text-right">
                <button onClick={() => setScreen("forgot")} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Forgot Password?
                </button>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                Login Now
              </button>
            </div>
          )}

          {screen === "forgot" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter your Email</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input type="email" placeholder="admin@lostlink.com" className="w-full py-2.5 focus:outline-none text-gray-800" />
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                Send Reset Link
              </button>

              <div className="text-center">
                <button onClick={() => setScreen("login")} className="text-sm font-medium text-gray-500 hover:text-blue-600 transition">
                  ← Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;