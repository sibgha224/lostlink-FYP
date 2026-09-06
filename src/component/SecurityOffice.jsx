import React from 'react';

const SecurityOffice = (props) => {
  return (
    <div className="min-h-screen bg-[#F5F0F0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-[5%] h-[68px] sticky top-0 z-[1000]"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e8d0d0' }}>
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={props.onGoToHome}>
          <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center bg-[#800020]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <span className="font-headings text-[1.35rem] text-[#2e1a1a]">LostLink</span>
        </div>
        <button onClick={props.onGoToHome} className="px-5 py-2 rounded-xl bg-[#800020] text-white font-bold text-sm cursor-pointer">
          Back to Home
        </button>
      </nav>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-[5%] py-12 bg-white my-10 rounded-3xl border border-[#e8d0d0] shadow-sm">
        <h1 className="font-headings text-3xl md:text-4xl text-[#2e1a1a] mb-6">College Security Office Guidelines</h1>
        <div className="space-y-4 text-[#5a3a3a] text-base leading-relaxed">
          <p><strong>High-Value Items:</strong> Valuable electronics like laptops, smartphones, and smartwatches are securely stored at the main security office.</p>
          <p><strong>30-Day Holding Policy:</strong> Items are kept for up to 30 days. Unclaimed items after this period are handled per college administrative rules.</p>
          <p><strong>Office Timings:</strong> Monday to Saturday, 8:00 AM – 4:00 PM.</p>
          <p><strong>Location:</strong> Main Security Gate / Admin Block, Ground Floor.</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityOffice;