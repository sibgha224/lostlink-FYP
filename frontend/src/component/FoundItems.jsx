import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

const CATEGORIES = [
  'All', 'Electronics', 'Books & Notes', 'Clothing', 'Keys',
  'Wallet / Purse', 'ID Card', 'Jewelry', 'Bag / Backpack', 'Other'
];

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `Reported ${mins <= 1 ? 'just now' : mins + 'm ago'}`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Reported ${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Reported yesterday';
  return `Reported ${days}d ago`;
};

const FoundItems = (props) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimTarget, setClaimTarget] = useState(null);
  const [proofDescription, setProofDescription] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [claimedIds, setClaimedIds] = useState([]);

  const openClaimModal = (item) => {
    setClaimError('');
    setProofDescription('');
    setProofImage(null);
    setClaimTarget(item);
  };

  const submitClaim = async () => {
    if (!proofDescription.trim()) {
      setClaimError('Please describe how you can prove this item is yours.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setClaimError('You must be logged in to submit a claim.');
      return;
    }
    const payload = new FormData();
    payload.append('foundItemId', claimTarget._id);
    payload.append('proofDescription', proofDescription);
    if (proofImage) payload.append('proofImage', proofImage);

    try {
      setClaimSubmitting(true);
      setClaimError('');
      const response = await fetch(`${API_BASE}/claims`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit claim');
      setClaimedIds(prev => [...prev, claimTarget._id]);
      setClaimTarget(null);
      props.onClaimSuccess && props.onClaimSuccess();
    } catch (err) {
      setClaimError(err.message);
    } finally {
      setClaimSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/found-items/all`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load found items');
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const location = item.location?.buildingName || '';
    const matchesSearch = (item.itemName || '').toLowerCase().includes(searchQuery.toLowerCase()) || location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F0F0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; border: 1.5px solid #e8d0d0; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(128,0,32,0.08) !important; }
      `}</style>

      <div className="max-w-7xl mx-auto px-[4%] py-10">

        <div className="text-center mb-10">
          <h1 className="font-headings text-3xl md:text-4xl text-[#2e1a1a] mb-2">Found Items</h1>
          <p className="text-sm text-[#c07080] italic mb-1">(Please note that the pictures are for illustrative purposes only)</p>
          <p className="text-sm font-semibold text-[#800020]">Students are requested to collect or claim their items by contacting the Lost & Found Desk</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

          <aside className="bg-white rounded-2xl p-5 border border-[#e8d0d0] h-fit shadow-sm">
            <h3 className="font-headings text-lg text-[#2e1a1a] mb-4 pb-2 border-b border-[#e8d0d0]">Categories</h3>
            <ul className="flex flex-col gap-1.5">
              {CATEGORIES.map((cat) => (
                <li key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#800020] text-white font-bold shadow-md'
                      : 'text-[#5a3a3a] hover:bg-[#fff8f8] hover:text-[#800020]'
                  }`}>
                  {cat}
                </li>
              ))}
            </ul>
          </aside>

          <main>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search found items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e8d0d0] bg-white text-[#2e1a1a] outline-none focus:border-[#800020] shadow-sm"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-xl font-medium">{error}</div>
            )}

            {loading ? (
              <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-[#e8d0d0]">
                <p className="text-[#c07080] font-medium">Loading found items...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div key={item._id} className="card-hover bg-white rounded-[18px] p-[22px] flex flex-col shadow-sm">
                      <div className="w-full h-[140px] rounded-xl mb-4 overflow-hidden flex items-center justify-center relative bg-[#f0fdf4]">
                        {item.imageURL ? (
                          <img src={item.imageURL} alt={item.itemName} className="w-full h-full object-cover rounded-xl"
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="font-size:3.5rem">📦</span>'; }} />
                        ) : (
                          <span style={{ fontSize: '3.5rem' }}>📦</span>
                        )}
                      </div>
                      <span className="inline-block text-[0.72rem] font-bold uppercase tracking-wide rounded-md px-2 py-0.5 mb-2.5 self-start text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0]">
                        FOUND
                      </span>
                      <h4 className="m-0 mb-1.5 text-[1.05rem] font-bold text-[#2e1a1a]">{item.itemName}</h4>
                      <p className="text-[0.85rem] text-[#c07080] m-0 mb-4 flex-1 font-medium">📍 {item.location?.buildingName || 'Unknown location'}</p>
                      <div className="flex justify-between items-center text-[0.78rem] text-[#c07080] pt-3 border-t border-[#fff8f8] mb-2">
                        <span>{timeAgo(item.createdAt)}</span>
                        <button
                          onClick={() => props.onViewDetails && props.onViewDetails({ ...item, __type: 'FOUND' })}
                          className="bg-transparent text-[#800020] border-none font-bold cursor-pointer text-[0.83rem] hover:underline">
                          Details
                        </button>
                      </div>
                      {claimedIds.includes(item._id) ? (
                        <span className="text-center text-xs font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg py-2">✓ Claim Submitted</span>
                      ) : (
                        <button
                          onClick={() => openClaimModal(item)}
                          className="text-center text-xs font-bold text-white bg-[#800020] hover:bg-[#a0002a] rounded-lg py-2 cursor-pointer transition-colors">
                          Claim This Item
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-[#e8d0d0]">
                    <p className="text-[#c07080] font-medium">No found items match your filter.</p>
                  </div>
                )}
              </div>
            )}
          </main>

        </div>
      </div>

      {claimTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !claimSubmitting && setClaimTarget(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-headings text-xl font-bold text-[#2e1a1a] mb-1">Claim "{claimTarget.itemName}"</h3>
            <p className="text-sm text-[#c07080] mb-4">Describe identifying details only the true owner would know. The finder will review your claim.</p>

            {claimError && (
              <div className="mb-3 p-3 bg-red-100 text-red-700 text-sm rounded-xl font-medium">{claimError}</div>
            )}

            <textarea
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              rows={4}
              placeholder="e.g., It has a small scratch on the back and a blue sticker inside the front pocket..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#e8d0d0] bg-[#fff8f8] text-sm text-[#2e1a1a] outline-none focus:border-[#800020] resize-none mb-3"
            />

            <label className="block text-xs font-bold text-[#800020] mb-1.5">Proof Image (Optional)</label>
            {!proofImage ? (
              <div
                onClick={() => document.getElementById('claimImageInputFound').click()}
                className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors mb-4"
                style={{ borderColor: '#e8d0d0' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#800020'; e.currentTarget.style.backgroundColor = '#fff8f8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8d0d0'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <input type="file" id="claimImageInputFound" accept="image/*" onChange={(e) => setProofImage(e.target.files[0])} className="hidden" />
                <p className="text-xs font-semibold text-[#2e1a1a]">📷 Click to add a photo</p>
                <p className="text-[0.7rem] text-[#c07080] mt-0.5">Optional — helps prove the item is yours</p>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-[#fff8f8] rounded-xl px-3 py-2.5 border border-[#e8d0d0] mb-4">
                <span className="text-xs font-semibold text-[#2e1a1a] truncate">📎 {proofImage.name}</span>
                <button type="button" onClick={() => setProofImage(null)} className="text-xs font-bold text-[#800020] cursor-pointer ml-2 flex-shrink-0">Remove</button>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button onClick={() => setClaimTarget(null)} disabled={claimSubmitting}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer" style={{ color: '#2e1a1a', background: '#f5f0f0' }}>
                Cancel
              </button>
              <button onClick={submitClaim} disabled={claimSubmitting}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #800020, #4a0010)', opacity: claimSubmitting ? 0.7 : 1 }}>
                {claimSubmitting ? 'Submitting...' : 'Submit Claim'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoundItems;