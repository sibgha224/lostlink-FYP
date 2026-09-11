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

const AllItems = ({ initialSearchQuery, onViewDetails, ...props }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialSearchQuery) setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [lostRes, foundRes] = await Promise.all([
          fetch(`${API_BASE}/lost-items/all`, { headers }),
          fetch(`${API_BASE}/found-items/all`, { headers }),
        ]);
        const lostData = await lostRes.json();
        const foundData = await foundRes.json();
        if (!lostRes.ok) throw new Error(lostData.message || 'Failed to load lost items');
        if (!foundRes.ok) throw new Error(foundData.message || 'Failed to load found items');

        const combined = [
          ...(Array.isArray(lostData) ? lostData : []).map(i => ({ ...i, __type: 'LOST' })),
          ...(Array.isArray(foundData) ? foundData : []).map(i => ({ ...i, __type: 'FOUND' })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setItems(combined);
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
          <h1 className="font-headings text-3xl md:text-4xl text-[#2e1a1a] mb-2">All Reported Items</h1>
          <p className="text-sm text-[#c07080] italic mb-1">(Browse all lost and found reports from across the college)</p>
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
            <div className="mb-6 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="#c07080" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search all items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e8d0d0] bg-white text-[#2e1a1a] outline-none focus:border-[#800020] shadow-sm"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-xl font-medium">{error}</div>
            )}

            {loading ? (
              <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-[#e8d0d0]">
                <p className="text-[#c07080] font-medium">Loading items...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const isLost = item.__type === 'LOST';
                    return (
                      <div key={item._id} className="card-hover bg-white rounded-[18px] p-[22px] flex flex-col shadow-sm">
                        <div className="w-full h-[140px] rounded-xl mb-4 overflow-hidden flex items-center justify-center relative"
                          style={{ background: isLost ? '#fff8f8' : '#f0fdf4' }}>
                          {item.imageURL ? (
                            <img src={item.imageURL} alt={item.itemName} className="w-full h-full object-cover rounded-xl"
                              onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="font-size:3.5rem">📦</span>'; }} />
                          ) : (
                            <span style={{ fontSize: '3.5rem' }}>📦</span>
                          )}
                        </div>
                        <span className="inline-block text-[0.72rem] font-bold uppercase tracking-wide rounded-md px-2 py-0.5 mb-2.5 self-start"
                          style={{
                            color: isLost ? '#a0002a' : '#16a34a',
                            background: isLost ? '#fff8f8' : '#f0fdf4',
                            border: `1px solid ${isLost ? '#e8d0d0' : '#bbf7d0'}`
                          }}>
                          {item.__type}
                        </span>
                        <h4 className="m-0 mb-1.5 text-[1.05rem] font-bold text-[#2e1a1a]">{item.itemName}</h4>
                        <p className="text-[0.85rem] text-[#c07080] m-0 mb-4 flex-1 font-medium">📍 {item.location?.buildingName || 'Unknown location'}</p>
                        <div className="flex justify-between items-center text-[0.78rem] text-[#c07080] pt-3 border-t border-[#fff8f8]">
                          <span>{timeAgo(item.createdAt)}</span>
                          <button onClick={() => onViewDetails && onViewDetails(item)} className="bg-transparent text-[#800020] border-none font-bold cursor-pointer text-[0.83rem] hover:underline">
                            Details
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-[#e8d0d0]">
                    <p className="text-[#c07080] font-medium">No items match your filter.</p>
                  </div>
                )}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default AllItems;