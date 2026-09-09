import React, { useState } from 'react';

const FoundItems = (props) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Mobile Phones',
    'ID Card / Official Documents',
    'Watches / Camera',
    'Wearables',
    'Laptops / Tablets',
    'USB / Portal HD / Mem Card',
    'Wallets / Bags / Currency',
    'Water Bottle / Lunch Box',
    'Accessories',
    'Miscellaneous Items'
  ];

  // Sirf Found items rakhi hain yahan
  const foundItemsList = [
    { 
      id: 1, 
      category: 'Accessories', 
      name: 'Apple AirPods', 
      location: 'Library', 
      status: 'Found', 
      statusTime: 'Reported 12h ago',
      image: '/airpods.jpeg' 
    },
    { 
      id: 2, 
      category: 'Laptops / Tablets', 
      name: 'Scientific Calculator', 
      location: 'Admin Block', 
      status: 'Found', 
      statusTime: 'Reported yesterday',
      image: '/calculator.jpeg' 
    }
  ];

  const filteredItems = foundItemsList.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase());
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
          <h1 className="font-headings text-3xl md:text-4xl text-[#2e1a1a] mb-2">Found Items</h1>
          <p className="text-sm text-[#c07080] italic mb-1">(Please note that the pictures are for illustrative purposes only)</p>
          <p className="text-sm font-semibold text-[#800020]">Students are requested to collect or claim their items by contacting the Lost & Found Desk</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

          {/* LEFT SIDEBAR: Categories */}
          <aside className="bg-white rounded-2xl p-5 border border-[#e8d0d0] h-fit shadow-sm">
            <h3 className="font-headings text-lg text-[#2e1a1a] mb-4 pb-2 border-b border-[#e8d0d0]">Categories</h3>
            <ul className="flex flex-col gap-1.5">
              {categories.map((cat) => (
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
                placeholder="Search found items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e8d0d0] bg-white text-[#2e1a1a] outline-none focus:border-[#800020] shadow-sm"
              />
            </div>

            {/* Items Grid matching Home page card style */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.id} className="card-hover bg-white rounded-[18px] p-[22px] flex flex-col shadow-sm">
                    <div className="w-full h-[140px] rounded-xl mb-4 overflow-hidden flex items-center justify-center relative bg-[#f0fdf4]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" 
                        onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML='<span style="font-size:3.5rem">📦</span>'; }} />
                    </div>
                    <span className="inline-block text-[0.72rem] font-bold uppercase tracking-wide rounded-md px-2 py-0.5 mb-2.5 self-start text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0]">
                      {item.status}
                    </span>
                    <h4 className="m-0 mb-1.5 text-[1.05rem] font-bold text-[#2e1a1a]">{item.name}</h4>
                    <p className="text-[0.85rem] text-[#c07080] m-0 mb-4 flex-1 font-medium">📍 {item.location}</p>
                    <div className="flex justify-between items-center text-[0.78rem] text-[#c07080] pt-3 border-t border-[#fff8f8]">
                      <span>{item.statusTime}</span>
                      <button 
                        onClick={() => alert(`Details for: ${item.name}`)}
                        className="bg-transparent text-[#800020] border-none font-bold cursor-pointer text-[0.83rem] hover:underline">
                        Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-[#e8d0d0]">
                  <p className="text-[#c07080] font-medium">No found items match your filter.</p>
                </div>
              )}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default FoundItems;