import React from 'react';

const SuccessScreen = ({ title, message, onGoToHome }) => {
  return (
    <div className="min-h-screen bg-[#F5F0F0] flex items-center justify-center px-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>
      <div className="bg-white rounded-3xl border border-[#e8d0d0] shadow-sm p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="font-headings text-2xl text-[#2e1a1a] font-bold mb-2">{title}</h1>
        <p className="text-sm text-[#c07080] font-medium mb-8 leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={onGoToHome}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg hover:opacity-95 transition-all cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#800020,#4a0010)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
          </svg>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;