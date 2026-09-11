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

const LostItems = (props) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/lost-items/all`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load lost items');
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

      {/* ===== MAIN CONTENT WRAPPER ===== */}
      <div className="max-w-7xl mx-auto px-[4%] py-10">

        {/* Page Title & Notice */}
        <div className="text-center mb-10">
          <h1 className="font-headings text-3xl md:text-4xl text-[#2e1a1a] mb-2">Lost Items</h1>
          <p className="text-sm text-[#c07080] italic mb-1">(Please note that the pictures are for illustrative purposes only)</p>
          <p className="text-sm font-semibold text-[#800020]">Students are requested to help recover or report if found by contacting the Lost & Found Desk</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

          {/* LEFT SIDEBAR: Categories */}
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

          {/* RIGHT CONTENT: Search & Items Grid */}
          <main>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search lost items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e8d0d0] bg-white text-[#2e1a1a] outline-none focus:border-[#800020] shadow-sm"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-xl font-medium">{error}</div>
            )}

            {/* Items Grid */}
            {loading ? (
              <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-[#e8d0d0]">
                <p className="text-[#c07080] font-medium">Loading lost items...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div key={item._id} className="card-hover bg-white rounded-[18px] p-[22px] flex flex-col shadow-sm">
                      <div className="w-full h-[140px] rounded-xl mb-4 overflow-hidden flex items-center justify-center relative bg-[#fff8f8]">
                        {item.imageURL ? (
                          <img src={item.imageURL} alt={item.itemName} className="w-full h-full object-cover rounded-xl"
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="font-size:3.5rem">📦</span>'; }} />
                        ) : (
                          <span style={{ fontSize: '3.5rem' }}>📦</span>
                        )}
                      </div>
                      <span className="inline-block text-[0.72rem] font-bold uppercase tracking-wide rounded-md px-2 py-0.5 mb-2.5 self-start text-[#a0002a] bg-[#fff8f8] border border-[#e8d0d0]">
                        LOST
                      </span>
                      <h4 className="m-0 mb-1.5 text-[1.05rem] font-bold text-[#2e1a1a]">{item.itemName}</h4>
                      <p className="text-[0.85rem] text-[#c07080] m-0 mb-4 flex-1 font-medium">📍 {item.location?.buildingName || 'Unknown location'}</p>
                      <div className="flex justify-between items-center text-[0.78rem] text-[#c07080] pt-3 border-t border-[#fff8f8]">
                        <span>{timeAgo(item.createdAt)}</span>
                        <button
                          onClick={() => alert(`${item.itemName}\n\nCategory: ${item.category}\nDescription: ${item.description || 'N/A'}\nLocation: ${item.location?.buildingName || 'N/A'}${item.location?.specificLocation ? ', ' + item.location.specificLocation : ''}\nContact: ${item.contactName || item.userId?.name || 'N/A'} (${item.contactEmail || item.userId?.email || 'N/A'})`)}
                          className="bg-transparent text-[#800020] border-none font-bold cursor-pointer text-[0.83rem] hover:underline">
                          Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-[#e8d0d0]">
                    <p className="text-[#c07080] font-medium">No lost items match your filter.</p>
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

export default LostItems;
