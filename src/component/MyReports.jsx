import React, { useState } from 'react';

const MyReports = (props) => {
  // Dummy reports data jo user ne submit kiya hoga
  const [reports, setReports] = useState([
    {
      id: 1,
      title: 'Blue Laptop Bag',
      category: 'Lost',
      date: 'Sep 04, 2026',
      status: 'Claim Approved', // Jab claim approve ho jaye tabhi chat open hogi
      finderName: 'Ali Raza'
    },
    {
      id: 2,
      title: 'Student ID Card',
      category: 'Lost',
      date: 'Sep 02, 2026',
      status: 'Pending Verification',
      finderName: null
    }
  ]);

  return (
    <div className="min-h-screen bg-[#F5F0F0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      {/* CONTENT AREA */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-headings text-2xl md:text-3xl text-[#2e1a1a] mb-2 font-bold">My Reports & Claims</h1>
        <p className="text-[#c07080] text-sm md:text-base mb-8 font-medium">
          Track the status of your reported items and access secure chats for approved claims.
        </p>

        {reports.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center border border-[#e8d0d0] text-[#c07080]">
            You haven't submitted any reports yet.
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-[#e8d0d0] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                {/* Item Details */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      item.category === 'Lost' ? 'bg-red-50 text-[#800020]' : 'bg-green-50 text-green-700'
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  <h3 className="font-bold text-[#2e1a1a] text-lg">{item.title}</h3>
                  <p className="text-xs text-[#c07080] font-medium mt-1">
                    Status: <span className="font-bold text-[#800020]">{item.status}</span>
                  </p>
                </div>

                {/* Action Button (Chat if approved) */}
                <div>
                  {item.status === 'Claim Approved' ? (
                    <button 
                      onClick={() => props.onOpenChat && props.onOpenChat(item.id)}
                      className="bg-[#800020] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow hover:opacity-90 cursor-pointer flex items-center gap-2">
                      💬 Open Chat ({item.finderName})
                    </button>
                  ) : (
                    <button disabled className="bg-gray-100 text-gray-400 px-5 py-2.5 rounded-xl text-sm font-medium cursor-not-allowed">
                      Waiting for Approval
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;