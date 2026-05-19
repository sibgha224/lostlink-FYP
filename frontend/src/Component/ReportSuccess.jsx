import React, { useState } from 'react';

const ReportSuccess = ({
  onGoToHome,
  onReportAnother,
  onGoToLostItems,
  onGoToFoundItems,
  onGoToProfile,
  itemData
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const item = itemData || {
    name: 'MacBook Pro Charger',
    location: 'Science Center, Room 304',
    dateTime: 'Oct 24, 2023 • 2:30 PM',
    referenceId: '#LOST-2023-882',
    category: 'Electronics',
    color: 'Silver',
    image: null,
    type: 'lost'
  };

  const isFound = item.type === 'found';
  const itemType = isFound ? 'Found' : 'Lost';

  // ===== NAVBAR ACTION HANDLERS =====
  const handleHome = () => {
    setMobileMenuOpen(false);
    if (onGoToHome) onGoToHome();
  };

  const handleLostItems = () => {
    setMobileMenuOpen(false);
    if (onGoToLostItems) {
      onGoToLostItems();
    } else {
      // Agar parent se function nahi aaya toh default behavior
      window.location.hash = '#/lost-items';
    }
  };

  const handleFoundItems = () => {
    setMobileMenuOpen(false);
    if (onGoToFoundItems) {
      onGoToFoundItems();
    } else {
      window.location.hash = '#/found-items';
    }
  };

  const handleProfile = () => {
    setMobileMenuOpen(false);
    if (onGoToProfile) {
      onGoToProfile();
    } else {
      window.location.hash = '#/profile';
    }
  };

  const handleViewItems = () => {
    if (isFound) {
      handleFoundItems();
    } else {
      handleLostItems();
    }
  };

  // Copy reference ID
  const handleCopyRef = () => {
    navigator.clipboard.writeText(item.referenceId).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f0f0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      
      {/* ===== NAVBAR - Fully Functional ===== */}
      <nav className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50" style={{ borderColor: '#e8d0d0' }}>
        
        {/* Logo - Click = Home */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none" onClick={handleHome}>
          <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #800020, #4a0010)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="2.5" className="sm:w-5 sm:h-5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-extrabold text-[#2e1a1a] tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>LostLink</span>
        </div>

        {/* Desktop Nav Links - Each with its own handler */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={handleHome}
            className="text-sm text-[#2e1a1a] hover:text-[#800020] transition-colors font-medium cursor-pointer bg-transparent border-none"
          >
            Home
          </button>
          <button
            onClick={handleLostItems}
            className="text-sm text-[#2e1a1a] hover:text-[#800020] transition-colors font-medium cursor-pointer bg-transparent border-none"
          >
            Lost Items
          </button>
          <button
            onClick={handleFoundItems}
            className="text-sm text-[#2e1a1a] hover:text-[#800020] transition-colors font-medium cursor-pointer bg-transparent border-none"
          >
            Found Items
          </button>
          <button
            onClick={handleProfile}
            className="text-sm text-[#2e1a1a] hover:text-[#800020] transition-colors font-medium cursor-pointer bg-transparent border-none"
          >
            Profile
          </button>
          <button
            onClick={handleProfile}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg, #800020, #4a0010)' }}
            title="Go to Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg cursor-pointer border-none"
          style={{ background: mobileMenuOpen ? '#f5f0f0' : 'transparent' }}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="#2e1a1a" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="#2e1a1a" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* ===== Mobile Dropdown Menu ===== */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b px-4 py-3" style={{ borderColor: '#e8d0d0' }}>
          <div className="flex flex-col gap-1">
            <button
              onClick={handleHome}
              className="text-left text-sm text-[#2e1a1a] hover:text-[#800020] hover:bg-[#f5f0f0] transition-colors font-medium cursor-pointer bg-transparent border-none py-2.5 px-3 rounded-lg"
            >
              🏠 Home
            </button>
            <button
              onClick={handleLostItems}
              className="text-left text-sm text-[#2e1a1a] hover:text-[#800020] hover:bg-[#f5f0f0] transition-colors font-medium cursor-pointer bg-transparent border-none py-2.5 px-3 rounded-lg"
            >
              🔍 Lost Items
            </button>
            <button
              onClick={handleFoundItems}
              className="text-left text-sm text-[#2e1a1a] hover:text-[#800020] hover:bg-[#f5f0f0] transition-colors font-medium cursor-pointer bg-transparent border-none py-2.5 px-3 rounded-lg"
            >
              📦 Found Items
            </button>
            <button
              onClick={handleProfile}
              className="text-left text-sm text-[#2e1a1a] hover:text-[#800020] hover:bg-[#f5f0f0] transition-colors font-medium cursor-pointer bg-transparent border-none py-2.5 px-3 rounded-lg"
            >
              👤 Profile
            </button>
          </div>
        </div>
      )}

      {/* ===== Main Content ===== */}
      <main className="max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-24">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center animate-bounce" style={{ background: '#22c55e' }}>
            <svg className="w-8 sm:w-10 h-8 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Success Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 sm:mb-4" style={{ color: '#2e1a1a', fontFamily: "'Fraunces', serif" }}>
            {itemType} Item Reported Successfully
          </h1>
          <p className="text-sm sm:text-lg" style={{ color: '#c07080' }}>
            {isFound 
              ? "Thank you for reporting this found item. The owner will be notified and can claim it from you."
              : "Thank you for reporting your lost item. Other users have been notified and will help you find it."}
          </p>
        </div>

        {/* Item Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-6 mb-6 sm:mb-8" style={{ borderColor: '#e8d0d0', boxShadow: '0 4px 15px rgba(128, 0, 32, 0.1)' }}>
          
          {/* Item Header */}
          <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #fff8f8, #f5f0f0)' }}>
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg sm:rounded-xl" />
              ) : (
                <svg className="w-10 sm:w-12 h-10 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#c07080' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4m0 0L4 7m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 10v10l8 4m0-4l8-4" />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-lg sm:text-2xl font-bold line-clamp-2" style={{ color: '#2e1a1a', fontFamily: "'Fraunces', serif" }}>
                  {item.name}
                </h2>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold flex-shrink-0 whitespace-nowrap" style={{ background: isFound ? '#e8f5e9' : '#fde8ec', color: isFound ? '#2e7d32' : '#800020' }}>
                  {itemType}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2 min-w-0">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#800020' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs sm:text-sm truncate" style={{ color: '#2e1a1a' }}>
                  {item.location}
                </p>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#800020' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs sm:text-sm truncate" style={{ color: '#c07080' }}>
                  {item.dateTime}
                </p>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: '#e8d0d0' }} className="mb-4 sm:mb-6"></div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <p className="text-xs font-bold mb-1 uppercase tracking-widest" style={{ color: '#800020' }}>Category</p>
              <p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{item.category}</p>
            </div>
            <div>
              <p className="text-xs font-bold mb-1 uppercase tracking-widest" style={{ color: '#800020' }}>Color</p>
              <p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{item.color}</p>
            </div>
          </div>

          <div style={{ height: '1px', background: '#e8d0d0' }} className="mb-4 sm:mb-6"></div>

          {/* Reference ID with Copy Feedback */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-semibold" style={{ color: '#c07080' }}>Reference ID</span>
            <div className="flex items-center gap-2">
              <code className="text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 sm:py-2 rounded-lg" style={{ background: '#fff8f8', color: '#800020' }}>
                {item.referenceId}
              </code>
              <button
                onClick={handleCopyRef}
                className="p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer border-none relative"
                style={{ background: copySuccess ? '#22c55e' : '#f5f0f0', color: copySuccess ? '#fff' : '#800020' }}
                title="Copy to clipboard"
              >
                {copySuccess ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8" style={{ background: '#fff8f8', border: '1px solid #e8d0d0' }}>
          <div className="flex gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#800020' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#2e1a1a' }}>Keep your reference ID safe</p>
              <p className="text-xs sm:text-sm" style={{ color: '#c07080' }}>
                {isFound 
                  ? "You can use this ID to track this item and communicate with the owner who claims it."
                  : "You can use this ID to track your lost item and communicate with anyone who might have found it."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={handleViewItems}
            className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base text-white transition-all cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg, #800020, #4a0010)', boxShadow: '0 4px 12px rgba(128, 0, 32, 0.25)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #a0002a, #800020)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #800020, #4a0010)'}
          >
            <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="hidden sm:inline">{isFound ? 'View Found Items' : 'View My Lost Items'}</span>
            <span className="sm:hidden">View Items</span>
          </button>

          <button
            onClick={onReportAnother}
            className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all cursor-pointer border-2 bg-white"
            style={{ borderColor: '#800020', color: '#800020' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#fff8f8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
          >
            <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">{isFound ? 'Report Another Found Item' : 'Report Another Lost Item'}</span>
            <span className="sm:hidden">Report Item</span>
          </button>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={handleHome}
            className="text-xs sm:text-sm font-semibold transition-colors hover:underline flex items-center justify-center gap-2 mx-auto bg-transparent border-none cursor-pointer"
            style={{ color: '#800020' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>

      </main>
    </div>
  );
};

export default ReportSuccess;