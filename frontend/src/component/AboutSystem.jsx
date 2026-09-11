import React from 'react';

const AboutSystem = (props) => {
  return (
    <div className="min-h-screen bg-[#F5F0F0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      <div className="max-w-3xl mx-auto px-8 py-10 bg-white my-10 rounded-3xl border border-[#e8d0d0] shadow-sm">

        <span onClick={props.onGoToHome} className="text-sm font-semibold cursor-pointer hover:underline" style={{ color: '#800020' }}>← Back to Home</span>

        <h2 className="font-headings text-xl text-[#800020] mb-6 mt-4 font-bold border-b border-[#e8d0d0] pb-2">About LostLink</h2>

        <div className="space-y-6 text-[#5a3a3a] text-sm md:text-base">
          <div>
            <p>Every semester, something goes missing on campus. A water bottle left in the cafeteria, an ID card slipped out of a bag near the library, a charger forgotten in a lab. LostLink exists so that finding it again doesn't have to depend on luck or a random WhatsApp group.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">Why we built this</h3>
            <p>Before LostLink, lost items on campus were mostly tracked through word of mouth or scattered posts on social media. Things got missed, claims were hard to verify, and there was no real way to know if the person messaging you about your lost bag actually found it. LostLink brings all of that into one place, built specifically for students.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">How it works</h3>
            <p>If you've lost something, you report it with a few details — what it looks like, roughly where you lost it, and when. If someone finds an item, they report that too. LostLink then makes it easy to browse both lists, so a match can be spotted by either side.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">Claiming and getting it back</h3>
            <p>When you think you've found a match, you submit a claim instead of messaging a stranger directly. Once the claim is reviewed, you can chat inside LostLink to arrange the handover — without ever sharing your phone number with someone you don't know.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">Who's behind it</h3>
            <p>LostLink is a student-built project, made and maintained by students who wanted a better way to handle lost and found on their own campus. It's still growing, and it keeps improving based on what actually happens when real students use it.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSystem;