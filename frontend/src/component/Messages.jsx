import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const Messages = (props) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const headers = authHeaders();
        const [myClaimsRes, myFoundRes] = await Promise.all([
          fetch(`${API_BASE}/claims/my-claims`, { headers }),
          fetch(`${API_BASE}/found-items/my-items`, { headers }),
        ]);
        const myClaimsData = await myClaimsRes.json();
        const myFoundData = await myFoundRes.json();

        const asClaimant = (Array.isArray(myClaimsData) ? myClaimsData : [])
          .filter((c) => c.status === 'approved')
          .map((c) => ({
            claimId: c._id,
            itemName: c.foundItem?.itemName || 'Item',
            itemStatus: c.foundItem?.status || 'active',
            partnerName: c.foundItem?.userId?.name || 'Finder',
            role: 'Claimant',
          }));

        const foundList = Array.isArray(myFoundData) ? myFoundData : [];
        const asFounderEntries = await Promise.all(
          foundList.map(async (item) => {
            try {
              const res = await fetch(`${API_BASE}/claims/item/${item._id}`, { headers });
              if (!res.ok) return [];
              const data = await res.json();
              return (Array.isArray(data) ? data : [])
                .filter((c) => c.status === 'approved')
                .map((c) => ({
                  claimId: c._id,
                  itemName: item.itemName,
                  itemStatus: item.status,
                  partnerName: c.claimedBy?.name || 'Claimant',
                  role: 'Finder',
                }));
            } catch {
              return [];
            }
          })
        );

        const asFounder = asFounderEntries.flat();
        setConversations([...asClaimant, ...asFounder]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0F0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <span onClick={props.onGoToHome} className="text-sm font-semibold cursor-pointer hover:underline" style={{ color: '#800020' }}>← Back to Home</span>

        <h1 className="font-headings text-2xl md:text-3xl text-[#2e1a1a] mt-6 mb-2 font-bold">Messages</h1>
        <p className="text-sm text-[#c07080] mb-8">Chats open once a claim on your item is approved, or your own claim is approved by the finder.</p>

        {loading ? (
          <div className="bg-white p-8 rounded-3xl text-center border border-[#e8d0d0] text-[#c07080]">Loading conversations...</div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-medium">{error}</div>
        ) : conversations.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center border border-[#e8d0d0] text-[#c07080]">No conversations yet.</div>
        ) : (
          <div className="space-y-3">
            {conversations.map((c) => (
              <div key={c.claimId} className="bg-white rounded-2xl border border-[#e8d0d0] p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {c.partnerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#2e1a1a] truncate">{c.partnerName}</p>
                    <p className="text-xs text-[#c07080] truncate">{c.itemName} · you are the {c.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {c.itemStatus === 'returned' && (
                    <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">Returned</span>
                  )}
                  <button
                    onClick={() => props.onOpenChat && props.onOpenChat(c.claimId, c.partnerName)}
                    className="text-sm font-bold text-white bg-[#800020] hover:bg-[#a0002a] rounded-xl px-4 py-2 cursor-pointer">
                    Open Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
