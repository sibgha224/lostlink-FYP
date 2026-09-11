import React from 'react';

const PrivacyPolicy = (props) => {
  return (
    <div className="min-h-screen bg-[#F5F0F0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      <div className="max-w-3xl mx-auto px-8 py-10 bg-white my-10 rounded-3xl border border-[#e8d0d0] shadow-sm">

        <span onClick={props.onGoToHome} className="text-sm font-semibold cursor-pointer hover:underline" style={{ color: '#800020' }}>← Back to Home</span>

        <h2 className="font-headings text-xl text-[#800020] mb-6 mt-4 font-bold border-b border-[#e8d0d0] pb-2">Privacy Policy</h2>

        <div className="space-y-6 text-[#5a3a3a] text-sm md:text-base">
          <div>
            <p>You're sharing personal details just to sign up, so it's fair you know exactly what happens with that information.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">What we collect</h3>
            <p>When you create an account, we collect your name, email, roll number, department, academic session and shift, and an optional phone number. When you report or claim an item, we also store the details you provide about that item.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">How it's used</h3>
            <p>Your information is used to verify that you're a genuine student, to show your profile details like your department and roll number on your own account, and to connect you with the right person when a claim is made on an item.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">Who can see it</h3>
            <p>Other students don't see your phone number, and only your name and email are shared as part of a claim conversation, so the other person knows who they're talking to. Your roll number, department, and other account details stay private to your own profile.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">How it's stored</h3>
            <p>Your information is kept in LostLink's database and is not sold or handed over to any outside company. It's used only to run the lost and found system for this campus.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">Your choices</h3>
            <p>The phone number field is optional — you can leave it blank if you'd rather not share it. You can also reach out if you'd like your account or data removed.</p>
          </div>

          <div>
            <h3 className="font-bold text-[#2e1a1a] text-base mb-1">Questions</h3>
            <p>If you're ever unsure how your data is being used, feel free to reach out to the LostLink team and ask directly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;