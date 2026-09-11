import React from 'react';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const ItemDetails = ({ item, onBack }) => {
  if (!item) {
    return (
      <div className="min-h-screen bg-[#F5F0F0] flex items-center justify-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="text-center">
          <p className="text-[#c07080] font-medium mb-4">No item selected.</p>
          <span onClick={onBack} className="text-[#800020] font-bold cursor-pointer hover:underline">← Back to All Items</span>
        </div>
      </div>
    );
  }

  const isLost = item.__type === 'LOST';

  return (
    <div className="min-h-screen bg-[#F5F0F0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 py-10">

        <span onClick={onBack} className="text-sm font-semibold cursor-pointer hover:underline" style={{ color: '#800020' }}>← Back to All Items</span>

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 mt-6">

          <div className="rounded-2xl overflow-hidden border flex items-center justify-center h-[280px]"
            style={{ borderColor: '#e8d0d0', background: isLost ? '#fff8f8' : '#f0fdf4' }}>
            {item.imageURL ? (
              <img src={item.imageURL} alt={item.itemName} className="w-full h-full object-cover" />
            ) : (
              <span style={{ fontSize: '4.5rem' }}>📦</span>
            )}
          </div>

          <div className="bg-white rounded-2xl border p-8" style={{ borderColor: '#e8d0d0' }}>
            <span className="inline-block text-[0.72rem] font-bold uppercase tracking-wide rounded-md px-2.5 py-1 mb-3"
              style={{
                color: isLost ? '#a0002a' : '#16a34a',
                background: isLost ? '#fff8f8' : '#f0fdf4',
                border: `1px solid ${isLost ? '#e8d0d0' : '#bbf7d0'}`
              }}>
              {item.__type}
            </span>

            <h1 className="font-headings text-2xl md:text-3xl text-[#2e1a1a] mb-6 font-bold">{item.itemName}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <p className="text-xs font-bold uppercase text-[#c07080] mb-1">Category</p>
                <p className="text-sm font-semibold text-[#2e1a1a]">{item.category || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-[#c07080] mb-1">Color</p>
                <p className="text-sm font-semibold text-[#2e1a1a]">{item.color || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-[#c07080] mb-1">Brand</p>
                <p className="text-sm font-semibold text-[#2e1a1a]">{item.brand || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-[#c07080] mb-1">{isLost ? 'Date Lost' : 'Date Found'}</p>
                <p className="text-sm font-semibold text-[#2e1a1a]">{formatDate(item.dateLost || item.dateFound)}{(item.timeLost || item.timeFound) ? `, around ${item.timeLost || item.timeFound}` : ''}</p>
              </div>
            </div>

            <div className="pt-5 mb-6" style={{ borderTop: '1px solid #e8d0d0' }}>
              <p className="text-xs font-bold uppercase text-[#c07080] mb-1">Location</p>
              <p className="text-sm font-semibold text-[#2e1a1a]">{item.location?.buildingName || 'Unknown location'}{item.location?.floor ? `, ${item.location.floor}` : ''}</p>
              {item.location?.specificLocation && (
                <p className="text-sm text-[#5a3a3a] mt-1">{item.location.specificLocation}</p>
              )}
            </div>

            <div className="pt-5 mb-6" style={{ borderTop: '1px solid #e8d0d0' }}>
              <p className="text-xs font-bold uppercase text-[#c07080] mb-2">Description</p>
              <p className="text-sm text-[#5a3a3a] leading-relaxed">{item.description || 'No description provided.'}</p>
            </div>

            <div className="pt-5" style={{ borderTop: '1px solid #e8d0d0' }}>
              <p className="text-xs font-bold uppercase text-[#c07080] mb-2">Reported By</p>
              <p className="text-sm font-semibold text-[#2e1a1a]">{item.contactName || item.userId?.name || 'LostLink User'}</p>
              <p className="text-sm text-[#5a3a3a]">{item.contactEmail || item.userId?.email || 'Email not provided'}</p>
              <p className="text-xs text-[#c07080] mt-2">For your privacy, phone numbers are not shown here. Use the Claim feature on the Found Items or Lost Items page to connect through LostLink.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;