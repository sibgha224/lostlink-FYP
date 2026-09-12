import React, { useState } from 'react';

const API_BASE = 'http://localhost:5000/api';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const ItemDetails = ({ item, onBack, onClaimSuccess }) => {
  const [claimOpen, setClaimOpen] = useState(false);
  const [proofDescription, setProofDescription] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [claimSubmitted, setClaimSubmitted] = useState(false);

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

  const openClaimModal = () => {
    setClaimError('');
    setProofDescription('');
    setProofImage(null);
    setClaimOpen(true);
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
    payload.append('foundItemId', item._id);
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
      setClaimSubmitted(true);
      setClaimOpen(false);
      onClaimSuccess && onClaimSuccess();
    } catch (err) {
      setClaimError(err.message);
    } finally {
      setClaimSubmitting(false);
    }
  };

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

            <div className="pt-5 mb-6" style={{ borderTop: '1px solid #e8d0d0' }}>
              <p className="text-xs font-bold uppercase text-[#c07080] mb-2">Reported By</p>
              <p className="text-sm font-semibold text-[#2e1a1a]">{item.contactName || item.userId?.name || 'LostLink User'}</p>
              <p className="text-sm text-[#5a3a3a]">{item.contactEmail || item.userId?.email || 'Email not provided'}</p>
              <p className="text-xs text-[#c07080] mt-2">For your privacy, phone numbers are not shown here. Use the Claim feature below to connect through LostLink.</p>
            </div>

            {!isLost && (
              <div className="pt-5" style={{ borderTop: '1px solid #e8d0d0' }}>
                {claimSubmitted ? (
                  <span className="inline-block text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">✓ Claim Submitted</span>
                ) : (
                  <button
                    onClick={openClaimModal}
                    className="text-sm font-bold text-white bg-[#800020] hover:bg-[#a0002a] rounded-xl px-6 py-3 cursor-pointer transition-colors">
                    Claim This Item
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {claimOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !claimSubmitting && setClaimOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-headings text-xl font-bold text-[#2e1a1a] mb-1">Claim "{item.itemName}"</h3>
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
                onClick={() => document.getElementById('claimImageInputDetails').click()}
                className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors mb-4"
                style={{ borderColor: '#e8d0d0' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#800020'; e.currentTarget.style.backgroundColor = '#fff8f8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8d0d0'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <input type="file" id="claimImageInputDetails" accept="image/*" onChange={(e) => setProofImage(e.target.files[0])} className="hidden" />
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
              <button onClick={() => setClaimOpen(false)} disabled={claimSubmitting}
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

export default ItemDetails;