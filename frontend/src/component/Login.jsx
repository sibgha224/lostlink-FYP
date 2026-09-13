import React, { useState } from 'react';

const API_BASE = 'http://localhost:5000/api/auth';
const REQUEST_API_BASE = 'http://localhost:5000/api/requests';

const Login = ({ onLoginSuccess, onGoToSignup, onGoToForget }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showUnblockForm, setShowUnblockForm] = useState(false);
  const [unblockMessage, setUnblockMessage] = useState('');
  const [unblockSubmitting, setUnblockSubmitting] = useState(false);
  const [unblockError, setUnblockError] = useState('');
  const [unblockSuccess, setUnblockSuccess] = useState('');

  const isBlockedError = error.toLowerCase().includes('blocked');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setShowUnblockForm(false);
    setUnblockSuccess('');

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitUnblockRequest = async () => {
    if (!unblockMessage.trim()) {
      setUnblockError('Please write a short message for the admin.');
      return;
    }
    setUnblockSubmitting(true);
    setUnblockError('');
    try {
      const response = await fetch(`${REQUEST_API_BASE}/unblock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message: unblockMessage }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send request');
      }
      setUnblockSuccess('Your unblock request has been sent to the admin.');
      setShowUnblockForm(false);
      setUnblockMessage('');
    } catch (err) {
      setUnblockError(err.message);
    } finally {
      setUnblockSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[420px] px-4 flex flex-col items-center">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full border border-[#e8d0d0]">

          {/* Logo Header */}
          <div className="flex items-center justify-center gap-3 pt-7 pb-3 px-6">
            <div className="bg-[#800020] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[#800020]/30">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fde8ec"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            <span className="text-3xl font-bold text-[#2e1a1a] tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
              LostLink
            </span>
          </div>

          {/* Form */}
          <div className="px-9 pb-9 pt-4">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {isBlockedError && !unblockSuccess && (
              <div className="mb-4">
                {!showUnblockForm ? (
                  <button
                    type="button"
                    onClick={() => setShowUnblockForm(true)}
                    className="text-xs font-bold text-[#800020] underline cursor-pointer"
                  >
                    Request Unblock
                  </button>
                ) : (
                  <div className="p-3 bg-[#fff8f8] border border-[#e8d0d0] rounded-xl">
                    <p className="text-xs font-semibold text-[#2e1a1a] mb-2">
                      Tell the admin why your account should be unblocked:
                    </p>
                    <textarea
                      value={unblockMessage}
                      onChange={(e) => setUnblockMessage(e.target.value)}
                      rows={3}
                      placeholder="Write your message..."
                      className="w-full p-2.5 rounded-lg border border-[#e8d0d0] bg-white text-xs text-[#2e1a1a] outline-none focus:border-[#800020] mb-2"
                    />
                    {unblockError && (
                      <p className="text-xs text-red-600 mb-2">{unblockError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowUnblockForm(false)}
                        className="flex-1 py-2 rounded-lg border border-[#e8d0d0] text-[#5a3a3a] text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={unblockSubmitting}
                        onClick={submitUnblockRequest}
                        className="flex-1 py-2 rounded-lg bg-[#800020] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        {unblockSubmitting ? 'Sending...' : 'Send Request'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {unblockSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 text-xs rounded-xl font-medium">
                {unblockSuccess}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#2e1a1a] mb-1 ml-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c07080]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full py-3 pl-10 pr-3 rounded-3xl border border-[#e8d0d0] bg-[#F5F0F0] text-[0.95rem] text-[#2e1a1a] placeholder:text-[#c5a3a3] outline-none focus:border-[#800020] focus:bg-[#fff8f8] transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[#2e1a1a] mb-1 ml-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c07080]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="********"
                    className="w-full py-3 pl-10 pr-3 rounded-3xl border border-[#e8d0d0] bg-[#F5F0F0] text-[0.95rem] text-[#2e1a1a] placeholder:text-[#c5a3a3] outline-none focus:border-[#800020] focus:bg-[#fff8f8] transition-colors"
                  />
                </div>

                <p
                  onClick={onGoToForget}
                  className="text-right text-sm text-[#800020] cursor-pointer mt-2 font-medium hover:text-[#a0002a] hover:underline"
                >
                  Forgot Password?
                </p>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#800020] to-[#4a0010] hover:from-[#a0002a] hover:to-[#800020] active:scale-95 text-[#fde8ec] font-bold text-base rounded-3xl border-none cursor-pointer transition-all shadow-md shadow-[#800020]/20 mt-2"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Logging in...' : 'Log In'}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-5 text-[0.95rem] text-white font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Don't have an account?{' '}
          <span
            onClick={onGoToSignup}
            className="text-[#800020] font-bold underline cursor-pointer hover:text-[#a0002a]"
          >
            Create new account
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;
