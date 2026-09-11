import React from 'react';

const TermsOfService = (props) => {
  return (
    <div className="min-h-screen bg-[#F5F0F0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      <div className="max-w-3xl mx-auto px-8 py-10 bg-white my-10 rounded-3xl border border-[#e8d0d0] shadow-sm">

        <span onClick={props.onGoToHome} className="text-sm font-semibold cursor-pointer hover:underline" style={{ color: '#800020' }}>← Back to Home</span>

        <h2 className="font-headings text-xl text-[#800020] mb-6 mt-4 font-bold border-b border-[#e8d0d0] pb-2">Terms of Service</h2>

        <div className="space-y-6 text-[#5a3a3a] text-sm md:text-base">
          <div>
            <p>These are the basic rules for using LostLink. Nothing complicated — just what keeps this useful and fair for everyone on campus.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">1. Who can use LostLink</h3>
            <p>LostLink is meant for students of this campus. You'll need a valid student account to report items, browse listings, or submit a claim.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">2. Reporting items honestly</h3>
            <p>When you report a lost or found item, please give real, accurate details. Don't post fake listings, and don't report something as "found" if you don't actually have it. This is what keeps the system trustworthy for everyone using it.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">3. Claiming an item</h3>
            <p>Only submit a claim on an item that actually belongs to you. Claiming something just to see if you can get it, or to mess with the person who found it, isn't allowed and can get your account restricted.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">4. Your account</h3>
            <p>You're responsible for what happens under your account. Keep your login details to yourself, and let us know if you think someone else has access to it.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">5. What's not allowed</h3>
            <p>No fake reports, no harassment of other users through the chat feature, no using LostLink to sell items, and no trying to get someone else's personal contact details outside of what the system already shares for a claim.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">6. Changes to these terms</h3>
            <p>As LostLink grows, these terms might be updated. If anything major changes, we'll make sure it's reflected here.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">7. Questions</h3>
            <p>If anything here is unclear, feel free to reach out to the LostLink team and we'll sort it out.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;