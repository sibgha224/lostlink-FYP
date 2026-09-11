import React from 'react';

const Faq = (props) => {
  const faqs = [
    {
      q: 'Is LostLink free to use?',
      a: 'Yes, completely. There\'s no cost to report an item, browse listings, or make a claim.'
    },
    {
      q: 'Who can use LostLink?',
      a: 'It\'s built for students of this campus. You\'ll need a valid student account to use it.'
    },
    {
      q: 'Will other users see my phone number?',
      a: 'No. Your phone number stays private and is never shown to other users. Only your name and email are shared as part of a claim conversation, so the other person knows who they\'re talking to.'
    },
    {
      q: 'I found something — what do I do?',
      a: 'Report it under "Found Items" with a few details about what it is and where you found it. If the owner spots it and submits a claim, you\'ll be able to chat with them to arrange the handover.'
    },
    {
      q: 'How do I claim something as mine?',
      a: 'Browse the found items list, and when you spot something that matches what you lost, submit a claim on it. Once it\'s reviewed, you can message the finder directly through LostLink.'
    },
    {
      q: 'How long do items stay listed?',
      a: 'Items stay listed until they\'re claimed and returned. If nothing matches for a while, it\'s still worth checking back — new items get added regularly.'
    },
    {
      q: 'Who reviews claims and manages the system?',
      a: 'LostLink is looked after by an admin team who oversee claims and keep the platform running smoothly.'
    },
    {
      q: 'I\'m having an issue — who do I contact?',
      a: 'Reach out to the LostLink team directly and describe the issue — we\'ll help sort it out.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0F0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      <div className="max-w-3xl mx-auto px-8 py-10 bg-white my-10 rounded-3xl border border-[#e8d0d0] shadow-sm">

        <span onClick={props.onGoToHome} className="text-sm font-semibold cursor-pointer hover:underline" style={{ color: '#800020' }}>← Back to Home</span>

        <h2 className="font-headings text-xl text-[#800020] mb-6 mt-4 font-bold border-b border-[#e8d0d0] pb-2">Frequently Asked Questions</h2>

        <div className="space-y-6 text-[#5a3a3a] text-sm md:text-base">
          {faqs.map((item, i) => (
            <div key={i}>
              <h3 className="font-bold text-[#2e1a1a] text-base mb-1">{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;