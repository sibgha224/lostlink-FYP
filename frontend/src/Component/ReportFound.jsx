import React, { useState } from 'react';

const ReportFound = ({ onGoToHome, onGoToReportLost, onGoToFoundItems, onGoToMyReports, onReportSuccess }) => {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    dateFound: '',
    description: '',
    building: '',
    floor: '',
    specificLocation: '',
    additionalDetails: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    preferredContact: 'email',
    color: '',
    brand: '',
    timeFound: '',
    itemImage: null,
  });

  const categories = [
    'Electronics', 'Books & Notes', 'Clothing', 'Keys',
    'Wallet / Purse', 'ID Card', 'Jewelry', 'Bag / Backpack', 'Other'
  ];

  const buildings = [
    'Science Block','Library',
    'Cafeteria', 'Admin Block',
    'IT Block', 'Computer Lab', 'FA Block',
    'English Block', 'Pol Science Block', 'Cafeteria Area',
    'Staff Room', 'Clerical Office'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setFormData({ ...formData, itemImage: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, itemImage: null });
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (!onReportSuccess) {
      console.error('onReportSuccess prop is not defined');
      return;
    }

    const referenceId = `#FOUND-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
    
    onReportSuccess({
      name: formData.itemName,
      location: `${formData.building}${formData.floor ? `, ${formData.floor}` : ''}`,
      dateTime: `${new Date(formData.dateFound).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}${formData.timeFound ? ` • ${formData.timeFound}` : ''}`,
      referenceId: referenceId,
      category: formData.category,
      color: formData.color,
      image: imagePreview,
      type: 'found'
    });
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-[#e8d0d0] bg-[#fff8f8] text-[0.9rem] text-[#2e1a1a] outline-none focus:border-[#800020] focus:bg-white transition-all duration-200";
  const labelClass = "block text-[0.82rem] font-bold text-[#800020] mb-1.5 uppercase tracking-widest";

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", backgroundColor: '#f5f0f0' }}>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .fade-down { animation: fadeInDown 0.5s ease forwards; }
        .fade-up { animation: fadeInUp 0.5s ease forwards; }
        .slide-in { animation: slideIn 0.4s ease forwards; }
        .step-card { animation: fadeInUp 0.4s ease forwards; }
        input:focus, select:focus, textarea:focus {
          box-shadow: 0 0 0 3px rgba(128, 0, 32, 0.1);
        }
      `}</style>

      {/* ===== NAVBAR ===== */}
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-[1000] fade-down" style={{ borderColor: '#e8d0d0', boxShadow: '0 2px 20px rgba(128, 0, 32, 0.06)' }}>

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={onGoToHome}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #800020, #4a0010)', boxShadow: '0 4px 12px rgba(128, 0, 32, 0.3)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <span className="text-xl font-extrabold text-[#2e1a1a] tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>LostLink</span>
        </div>

        {/* Nav Links */}
      {/* Nav Links */}
<div className="hidden md:flex items-center gap-6">
  <button
    onClick={() => onGoToHome && onGoToHome()}
    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
  >
    Home
  </button>

  <button
    onClick={() => onGoToReportLost && onGoToReportLost()}
    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
  >
    Report an Item
  </button>

  <button
    onClick={() => onGoToFoundItems && onGoToFoundItems()}
    className="text-sm font-semibold pb-0.5 transition-colors"
    style={{ color: '#800020', borderBottom: '2px solid #800020' }}
  >
    Found Items
  </button>

  <button
    onClick={() => onGoToMyReports && onGoToMyReports()}
    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
  >
    My Reports
  </button>

  {/* Profile Icon */}
  <div
    className="w-8 h-8 rounded-full flex items-center justify-center ml-2 cursor-pointer"
    style={{
      background: 'linear-gradient(135deg, #800020, #4a0010)',
      boxShadow: '0 4px 12px rgba(128, 0, 32, 0.3)'
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-white"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  </div>
</div>
        </nav>
      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6 fade-down" style={{ animationDelay: '0.1s', color: '#c07080' }}>
          {[
            { label: 'Item Details', stepNum: 1 },
            { label: 'Location', stepNum: 2 },
            { label: 'Contact Info', stepNum: 3 },
            { label: 'Review', stepNum: 4 }
          ].map((item, i, arr) => (
            <React.Fragment key={item.stepNum}>
              <span
                className="cursor-pointer hover:underline transition-colors"
                onClick={() => setStep(item.stepNum)}
                style={{ color: step === item.stepNum ? '#2e1a1a' : step > item.stepNum ? '#800020' : '#c5a3a3', fontWeight: step === item.stepNum ? 600 : 400 }}>
                {item.label}
              </span>
              {i < arr.length - 1 && <span style={{ color: '#e8d0d0' }}>›</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Page Title */}
        <div className="mb-8 fade-up" style={{ animationDelay: '0.15s' }}>
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight" style={{ color: '#2e1a1a', fontFamily: "'Fraunces', serif" }}>
            {step === 4 ? 'Review Your Found Item Report' : 'Report a Found Item'}
          </h1>
          <p className="text-sm" style={{ color: '#c07080' }}>
            {step === 4
              ? 'Please confirm the details below are correct before submitting.'
              : "Help us return this item to its owner by providing details."}
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center mb-8 fade-up" style={{ animationDelay: '0.2s' }}>
          {[
            ['1', 'Basic Details'],
            ['2', 'Location'],
            ['3', 'Contact Info'],
            ['4', 'Review']
          ].map(([num, label], i) => (
            <React.Fragment key={num}>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep(i + 1)}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.82rem] font-bold transition-all duration-300"
                  style={step === i + 1 ? { background: 'linear-gradient(135deg, #800020, #4a0010)', color: '#fde8ec', boxShadow: '0 4px 12px rgba(128, 0, 32, 0.3)' } : step > i + 1 ? { background: '#22c55e', color: '#ffffff' } : { background: '#f5f0f0', color: '#c5a3a3' }}>
                  {step > i + 1 ? '✓' : num}
                </div>
                <span className="text-[0.85rem] font-semibold hidden sm:block transition-colors"
                  style={step === i + 1 ? { color: '#800020' } : step > i + 1 ? { color: '#22c55e' } : { color: '#c5a3a3' }}>
                  {label}
                </span>
              </div>
              {i < 3 && (
                <div className="flex-1 mx-3 h-[2px] rounded-full transition-all duration-500"
                  style={{ background: step > i + 1 ? '#22c55e' : '#e8d0d0' }}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ===== STEP 1: Basic Details ===== */}
        {step === 1 && (
          <div className="bg-white rounded-xl border p-8 step-card" style={{ borderColor: '#e8d0d0' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>Item Name</label>
                <input type="text" name="itemName" value={formData.itemName} onChange={handleChange}
                  placeholder="e.g., Silver MacBook Pro Charger"
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Item Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                  <option value="">Select a category...</option>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className={labelClass}>Date Found</label>
                <input type="date" name="dateFound" value={formData.dateFound} onChange={handleChange}
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Time (Approx)</label>
                <input type="time" name="timeFound" value={formData.timeFound} onChange={handleChange}
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Primary Color</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange}
                  placeholder="e.g., Silver"
                  className={inputClass} />
              </div>
            </div>

            <div className="mb-5">
              <label className={labelClass}>Brand / Manufacturer</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange}
                placeholder="e.g., Apple, Samsung, etc."
                className={inputClass} />
            </div>

            {/* IMAGE UPLOAD SECTION */}
            <div className="mb-5">
              <label className={labelClass}>Item Photo <span className="text-[#c5a3a3] font-normal">(Optional)</span></label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200" style={{ borderColor: '#e8d0d0' }}
                  onClick={() => document.getElementById('imageInput').click()}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#800020'; e.currentTarget.style.backgroundColor = '#fff8f8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8d0d0'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                  <input
                    type="file"
                    id="imageInput"
                    name="itemImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#c07080' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-semibold text-[0.9rem]" style={{ color: '#2e1a1a' }}>Click to upload image</p>
                  <p className="text-[0.8rem] mt-1" style={{ color: '#c07080' }}>or drag and drop</p>
                  <p className="text-[0.75rem] mt-2" style={{ color: '#c5a3a3' }}>JPG, PNG, GIF or WebP (Max 5MB)</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: '#e8d0d0' }}>
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 text-white rounded-full p-2 transition-colors"
                    style={{ background: '#800020' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#a0002a'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#800020'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('imageInput').click()}
                    className="absolute bottom-2 left-2 text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                    style={{ background: '#800020' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#a0002a'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#800020'}
                  >
                    Change Image
                  </button>
                  <input
                    type="file"
                    id="imageInput"
                    name="itemImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div className="mb-2">
              <div className="flex justify-between items-center mb-1.5">
                <label className={labelClass + " mb-0"}>Description</label>
                <span className="text-[0.75rem]" style={{ color: '#c5a3a3' }}>{formData.description.length} / 500</span>
              </div>
              <textarea name="description" value={formData.description} onChange={handleChange}
                maxLength={500} rows={4}
                placeholder="Include any identifying details, condition, brand, visible marks, etc."
                className={inputClass + " resize-none"} />
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: '1px solid #e8d0d0' }}>
              <button
                onClick={onGoToHome}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
                style={{ color: '#2e1a1a', background: '#f5f0f0' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e8d0d0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f5f0f0'}>
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white cursor-pointer transition-colors"
                style={{ background: 'linear-gradient(135deg, #800020, #4a0010)', boxShadow: '0 4px 12px rgba(128, 0, 32, 0.25)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #a0002a, #800020)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #800020, #4a0010)'}>
                Next: Add Location Details →
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 2: Set Location ===== */}
        {step === 2 && (
          <div className="slide-in">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
              {/* Left: Form */}
              <div className="bg-white rounded-xl border p-8" style={{ borderColor: '#e8d0d0' }}>
                {/* Header Section */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#2e1a1a', fontFamily: "'Fraunces', serif" }}>Where did you find it?</h3>
                  <p className="text-sm" style={{ color: '#c07080' }}>
                    Use the search bar or select from the dropdown below.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#c07080' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search for a building, library, or cafe..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition"
                      style={{ border: '1px solid #e8d0d0', background: '#fff8f8', color: '#2e1a1a' }}
                      onFocus={(e) => { e.target.style.borderColor = '#800020'; e.target.style.backgroundColor = '#ffffff'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e8d0d0'; e.target.style.backgroundColor = '#fff8f8'; }}
                    />
                  </div>
                </div>

                {/* Location Details Section */}
                <div style={{ borderTop: '1px solid #e8d0d0' }} className="pt-5">
                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-1 uppercase tracking-widest" style={{ color: '#800020' }}>
                      Location Details <span style={{ color: '#800020' }}>*</span>
                    </label>
                  </div>

                  <div className="space-y-4">
                    {/* Building Name */}
                    <div>
                      <label className="block text-sm font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#800020' }}>Building Name</label>
                      <select
                        name="building"
                        value={formData.building}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select building...</option>
                        {buildings.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>

                    {/* Floor / Level */}
                    <div>
                      <label className="block text-sm font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#800020' }}>Floor / Level</label>
                      <select
                        name="floor"
                        value={formData.floor}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select floor...</option>
                        {['1st Floor', '2nd Floor'].map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>

                    {/* Nearby Landmark / Room # */}
                    <div>
                      <label className="block text-sm font-bold mb-1.5 uppercase tracking-widest" style={{ color: '#800020' }}>Nearby Landmark / Room #</label>
                      <input
                        type="text"
                        name="specificLocation"
                        value={formData.specificLocation}
                        onChange={handleChange}
                        placeholder="e.g. Near the main entrance, Outside Room 204"
                        className={inputClass}
                      />
                    </div>

                    {/* Additional Details */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-sm font-bold uppercase tracking-widest" style={{ color: '#800020' }}>Additional Details</label>
                        <span className="text-xs" style={{ color: '#c5a3a3' }}>{formData.additionalDetails?.length || 0} / 300</span>
                      </div>
                      <textarea
                        name="additionalDetails"
                        value={formData.additionalDetails}
                        onChange={handleChange}
                        maxLength={300}
                        rows={3}
                        placeholder="Any extra info about the location..."
                        className={inputClass + " resize-none"}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: '1px solid #e8d0d0' }}>
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2.5 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
                    style={{ color: '#2e1a1a', background: '#f5f0f0' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e8d0d0'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f5f0f0'}>
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white cursor-pointer transition-colors"
                    style={{ background: 'linear-gradient(135deg, #800020, #4a0010)', boxShadow: '0 4px 12px rgba(128, 0, 32, 0.25)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #a0002a, #800020)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #800020, #4a0010)'}>
                    Next: Contact Info →
                  </button>
                </div>
              </div>

              {/* Right: Map Placeholder */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-xl border p-4 sticky top-[100px]" style={{ borderColor: '#e8d0d0' }}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: '#2e1a1a' }}>Found Location</h3>
                  <div className="rounded-lg overflow-hidden border h-64 flex items-center justify-center" style={{ borderColor: '#e8d0d0', background: '#f5f0f0' }}>
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#c07080' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <p className="text-sm font-medium" style={{ color: '#800020' }}>
                        {formData.building || 'Select a location'}
                      </p>
                      {formData.specificLocation && (
                        <p className="text-xs mt-1" style={{ color: '#c07080' }}>{formData.specificLocation}</p>
                      )}
                    </div>
                  </div>
                  {formData.building && (
                    <p className="text-sm mt-3" style={{ color: '#2e1a1a' }}>{formData.specificLocation || formData.building}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 3: Contact Info ===== */}
        {step === 3 && (
          <div className="bg-white rounded-xl border p-8 step-card" style={{ borderColor: '#e8d0d0' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>Your Name</label>
                <input type="text" name="contactName" value={formData.contactName} onChange={handleChange}
                  placeholder="Full name"
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange}
                  placeholder="your@email.com"
                  className={inputClass} />
              </div>
            </div>

            <div className="mb-5">
              <label className={labelClass}>Phone Number (Optional)</label>
              <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange}
                placeholder="+92..."
                className={inputClass} />
            </div>

            <div className="mb-2">
              <label className={labelClass}>Preferred Contact Method</label>
              <div className="flex gap-3 mt-1">
                {['email', 'phone', 'both'].map(method => (
                  <label key={method}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border cursor-pointer transition-all duration-200 text-[0.85rem] font-semibold capitalize"
                    style={{
                      borderColor: formData.preferredContact === method ? '#800020' : '#e8d0d0',
                      background: formData.preferredContact === method ? '#fff8f8' : '#ffffff',
                      color: formData.preferredContact === method ? '#800020' : '#c07080'
                    }}>
                    <input type="radio" name="preferredContact" value={method}
                      checked={formData.preferredContact === method}
                      onChange={handleChange} className="hidden" />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            {/* Summary Preview */}
            <div className="mt-6 p-4 rounded-xl" style={{ background: '#fff8f8', border: '1px solid #e8d0d0' }}>
              <p className="text-sm font-bold mb-3" style={{ color: '#800020' }}>📋 Quick Summary</p>
              <div className="grid grid-cols-2 gap-2 text-sm" style={{ color: '#2e1a1a' }}>
                <span className="font-bold">Item:</span><span>{formData.itemName || '—'}</span>
                <span className="font-bold">Category:</span><span>{formData.category || '—'}</span>
                <span className="font-bold">Date Found:</span><span>{formatDate(formData.dateFound) || '—'}</span>
                <span className="font-bold">Location:</span><span>{formData.building || '—'}{formData.floor ? `, ${formData.floor}` : ''}</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: '1px solid #e8d0d0' }}>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
                style={{ color: '#2e1a1a', background: '#f5f0f0' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e8d0d0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f5f0f0'}>
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white cursor-pointer transition-colors"
                style={{ background: 'linear-gradient(135deg, #800020, #4a0010)', boxShadow: '0 4px 12px rgba(128, 0, 32, 0.25)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #a0002a, #800020)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #800020, #4a0010)'}>
                Review Report →
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 4: Review ===== */}
        {step === 4 && (
          <div className="slide-in">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

              {/* ── LEFT COLUMN ── */}
              <div className="flex flex-col gap-5">

                {/* Item Details Card */}
                <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e8d0d0' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold" style={{ color: '#2e1a1a', fontFamily: "'Fraunces', serif" }}>Item Details</h2>
                    <button onClick={() => setStep(1)} className="text-sm font-medium hover:underline" style={{ color: '#800020' }}>
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-5 pb-5" style={{ borderBottom: '1px solid #e8d0d0' }}>
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Item Name</p>
                      <p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.itemName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Item Category</p>
                      <p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.category || '—'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5 py-5" style={{ borderBottom: '1px solid #e8d0d0' }}>
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Primary Color</p>
                      <p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.color || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Brand / Manufacturer</p>
                      <p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.brand || '—'}</p>
                    </div>
                  </div>

                  <div className="py-5" style={{ borderBottom: '1px solid #e8d0d0' }}>
                    <p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Date and Time Found</p>
                    <p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>
                      {formatDate(formData.dateFound)}{formData.timeFound ? `, around ${formData.timeFound}` : ''}
                    </p>
                  </div>

                  <div className="pt-5">
                    <p className="text-xs mb-2" style={{ color: '#c5a3a3' }}>Detailed Description</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#2e1a1a' }}>
                      {formData.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e8d0d0' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold" style={{ color: '#2e1a1a', fontFamily: "'Fraunces', serif" }}>Location</h2>
                    <button onClick={() => setStep(2)} className="text-sm font-medium hover:underline" style={{ color: '#800020' }}>
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-5 pb-5" style={{ borderBottom: '1px solid #e8d0d0' }}>
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Building / Block</p>
                      <p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.building || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Area / Floor</p>
                      <p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.floor || '—'}</p>
                    </div>
                  </div>

                  <div className="pt-5">
                    <p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Additional Details</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#2e1a1a' }}>
                      {formData.specificLocation
                        ? formData.specificLocation + (formData.additionalDetails ? '. ' + formData.additionalDetails : '')
                        : formData.additionalDetails || 'No additional details provided.'}
                    </p>
                  </div>
                </div>

                {/* Contact Info Card */}
                <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e8d0d0' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold" style={{ color: '#2e1a1a', fontFamily: "'Fraunces', serif" }}>Contact Information</h2>
                    <button onClick={() => setStep(3)} className="text-sm font-medium hover:underline" style={{ color: '#800020' }}>
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-5 pb-5" style={{ borderBottom: '1px solid #e8d0d0' }}>
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Full Name</p>
                      <p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.contactName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Preferred Contact</p>
                      <p className="text-sm font-semibold capitalize" style={{ color: '#2e1a1a' }}>{formData.preferredContact}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5 pt-5">
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Email Address</p>
                      <p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.contactEmail || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Phone Number</p>
                      <p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.contactPhone || '—'}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="flex flex-col gap-5">

                {/* Item Photo Card */}
                <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#e8d0d0' }}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: '#2e1a1a' }}>Item Photo</h3>
                  <div className="rounded-lg overflow-hidden border h-44 flex items-center justify-center" style={{ borderColor: '#e8d0d0', background: '#f5f0f0' }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Item" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#c5a3a3' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs" style={{ color: '#c5a3a3' }}>No photo uploaded</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Found Location Card */}
                <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#e8d0d0' }}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: '#2e1a1a' }}>Found Location</h3>
                  <div className="rounded-lg overflow-hidden border h-36 flex items-center justify-center" style={{ borderColor: '#e8d0d0', background: '#fff8f8' }}>
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#c07080' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <p className="text-sm font-medium" style={{ color: '#800020' }}>{formData.building || 'Location not specified'}</p>
                    </div>
                  </div>
                  {formData.specificLocation && (
                    <p className="text-sm mt-3" style={{ color: '#2e1a1a' }}>{formData.specificLocation}</p>
                  )}
                </div>

              </div>
            </div>

            {/* ===== ACTION BAR ===== */}
            <div className="mt-6 bg-white rounded-xl border px-6 py-4 flex justify-between items-center" style={{ borderColor: '#e8d0d0' }}>
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors"
                style={{ color: '#2e1a1a', background: '#f5f0f0' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e8d0d0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f5f0f0'}>
                ← Back to Edit
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 text-sm font-medium text-white rounded-lg cursor-pointer transition-colors"
                style={{ background: 'linear-gradient(135deg, #800020, #4a0010)', boxShadow: '0 4px 12px rgba(128, 0, 32, 0.25)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #a0002a, #800020)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #800020, #4a0010)'}>
                ✓ Submit Report
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ReportFound;