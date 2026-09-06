import React from 'react';

const Guide = (props) => {
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
          <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center bg-[#800020] text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <span className="font-headings text-[1.35rem] text-[#2e1a1a]">LostLink</span>
        </div>
        <button onClick={props.onGoToHome} className="px-5 py-2 rounded-xl bg-[#800020] text-white font-bold text-sm cursor-pointer hover:opacity-90">
          Back to Home
        </button>
      </nav>

      {/* CONTENT CARD */}
      <div className="max-w-3xl mx-auto px-8 py-10 bg-white my-10 rounded-3xl border border-[#e8d0d0] shadow-sm">
        
        <h2 className="font-headings text-xl text-[#800020] mb-6 font-bold border-b border-[#e8d0d0] pb-2">Claiming Process</h2>
        
        <div className="space-y-6 text-[#5a3a3a] text-sm md:text-base">
          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">1. Report a Lost Item</h3>
            <p>Provide accurate details about the item you have lost.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">2. Find a Possible Match</h3>
            <p>Browse found items and check for a possible match with your lost item.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">3. Submit a Claim</h3>
            <p>Select the matching item and submit a claim request.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">4. Verify Ownership</h3>
            <p>Provide the required information to verify that the item belongs to you.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">5. Claim Approval</h3>
            <p>After successful ownership verification, your claim will be reviewed and approved.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">6. Message the Finder</h3>
            <p>Once your claim is approved, you can communicate securely with the finder through the system.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">7. Return the Item</h3>
            <p>Coordinate with the finder through messaging and mutually decide where and when the item will be returned.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guide;