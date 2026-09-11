import React, { useState } from 'react';

const API_BASE = 'http://localhost:5000/api';

const ReportLostFound = ({ onGoToHome, onGoToDashboard, onReportSuccess, onGoToFoundItems, onGoToMyReports, onGoToReportItem }) => {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [reportType, setReportType] = useState('lost'); // 'lost' | 'found'
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    dateLost: '',
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
    timeLost: '',
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
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, itemImage: null });
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    setSubmitError('');

    // Basic required-field guard so we don't fire an invalid request
    if (!formData.itemName || !formData.category || !formData.dateLost || !formData.description) {
      setSubmitError('Please fill in the required item details (name, category, date, description).');
      setStep(1);
      return;
    }
    if (!formData.building) {
      setSubmitError('Please select a building/location.');
      setStep(2);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setSubmitError('You must be logged in to submit a report.');
      return;
    }

    const isFound = reportType === 'found';
    const endpoint = isFound ? `${API_BASE}/found-items/report` : `${API_BASE}/lost-items/report`;

    const payload = new FormData();
    payload.append('itemName', formData.itemName);
    payload.append('category', formData.category);
    payload.append('description', formData.description);
    payload.append('color', formData.color);
    payload.append('brand', formData.brand);
    payload.append('contactName', formData.contactName);
    payload.append('contactEmail', formData.contactEmail);
    payload.append('contactPhone', formData.contactPhone);
    payload.append('preferredContact', formData.preferredContact);
    payload.append('buildingName', formData.building);
    payload.append('floor', formData.floor);
    payload.append('specificLocation', formData.specificLocation);
    payload.append('additionalDetails', formData.additionalDetails);
    if (isFound) {
      payload.append('dateFound', formData.dateLost);
      payload.append('timeFound', formData.timeLost);
    } else {
      payload.append('dateLost', formData.dateLost);
      payload.append('timeLost', formData.timeLost);
    }
    if (formData.itemImage) {
      payload.append('image', formData.itemImage);
    }

    try {
      setSubmitting(true);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit report');
      }

      const created = data.lostItem || data.foundItem || data.item || data;
      const referenceId = created?._id ? `#${isFound ? 'FOUND' : 'LOST'}-${created._id.slice(-6).toUpperCase()}` : `#${isFound ? 'FOUND' : 'LOST'}-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;

      if (onReportSuccess) {
        onReportSuccess({
          name: formData.itemName,
          location: `${formData.building}${formData.floor ? `, ${formData.floor}` : ''}`,
          dateTime: `${new Date(formData.dateLost).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}${formData.timeLost ? ` • ${formData.timeLost}` : ''}`,
          referenceId,
          category: formData.category,
          color: formData.color,
          image: imagePreview,
          type: reportType,
        });
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-[#e8d0d0] bg-[#fff8f8] text-[0.9rem] text-[#2e1a1a] outline-none focus:border-[#800020] focus:bg-white transition-all duration-200";
  const labelClass = "block text-[0.85rem] font-bold text-[#800020] mb-1.5 capitalize";

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

      {/* ===== MAIN CONTENT ===== */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1">

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
            {step === 4 ? 'Review Your Lost Or Found Item Report' : 'Report Lost & Found Item'}
          </h1>
          <p className="text-sm" style={{ color: '#c07080' }}>
            {step === 4
              ? 'Please confirm the details below are correct before submitting.'
              : "Let's get some basic information about what you've lost or found."}
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
            <div className="mb-6">
              <label className={labelClass}>What are you reporting? <span className="text-red-500">*</span></label>
              <div className="flex gap-3 mt-1">
                {[['lost', "I Lost Something"], ['found', "I Found Something"]].map(([val, lbl]) => (
                  <button type="button" key={val} onClick={() => setReportType(val)}
                    className="flex-1 py-3 rounded-xl border cursor-pointer transition-all duration-200 text-sm font-bold"
                    style={{
                      borderColor: reportType === val ? '#800020' : '#e8d0d0',
                      background: reportType === val ? 'linear-gradient(135deg, #800020, #4a0010)' : '#ffffff',
                      color: reportType === val ? '#fde8ec' : '#800020'
                    }}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>Item Name <span className="text-red-500">*</span></label>
                <input type="text" name="itemName" value={formData.itemName} onChange={handleChange}
                  placeholder="e.g., Black Hydro Flask Water Bottle" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Item Category <span className="text-red-500">*</span></label>
                <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                  <option value="">Select a category...</option>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className={labelClass}>Date {reportType === 'found' ? 'Found' : 'Lost'} <span className="text-red-500">*</span></label>
                <input type="date" name="dateLost" value={formData.dateLost} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Time (Approx)</label>
                <input type="time" name="timeLost" value={formData.timeLost} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Primary Color</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="e.g., Black" className={inputClass} />
              </div>
            </div>

            <div className="mb-5">
              <label className={labelClass}>Brand / Manufacturer</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange}
                placeholder="e.g., Herschel, Apple, Nike" className={inputClass} />
            </div>

            <div className="mb-5">
              <label className={labelClass}>Item Photo <span className="text-[#c5a3a3] font-normal">(Optional)</span></label>
              {!imagePreview ? (
                <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200" style={{ borderColor: '#e8d0d0' }}
                  onClick={() => document.getElementById('imageInputLost').click()}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#800020'; e.currentTarget.style.backgroundColor = '#fff8f8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8d0d0'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                  <input type="file" id="imageInputLost" name="itemImage" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#c07080' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-semibold text-[0.9rem]" style={{ color: '#2e1a1a' }}>Click to upload image</p>
                  <p className="text-[0.8rem] mt-1" style={{ color: '#c07080' }}>or drag and drop</p>
                  <p className="text-[0.75rem] mt-2" style={{ color: '#c5a3a3' }}>JPG, PNG, GIF or WebP (Max 5MB)</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border bg-white flex items-center justify-center p-3 max-w-sm mx-auto shadow-sm" style={{ borderColor: '#e8d0d0' }}>
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-contain rounded-lg" />
                  <button type="button" onClick={removeImage} className="absolute top-2 right-2 text-white rounded-full p-1.5 transition-colors" style={{ background: '#800020' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#a0002a'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#800020'}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button type="button" onClick={() => document.getElementById('imageInputLost').click()}
                    className="absolute bottom-2 left-2 text-white rounded-lg px-2.5 py-1 text-xs font-medium transition-colors" style={{ background: '#800020' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#a0002a'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#800020'}>
                    Change Image
                  </button>
                  <input type="file" id="imageInputLost" name="itemImage" accept="image/*" onChange={handleImageChange} className="hidden" />
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
                placeholder="Include any identifying details like brand, color, scratches, stickers, etc."
                className={inputClass + " resize-none"} />
            </div>

            <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: '1px solid #e8d0d0' }}>
              <button onClick={onGoToHome} className="px-6 py-2.5 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
                style={{ color: '#2e1a1a', background: '#f5f0f0' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e8d0d0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f5f0f0'}>
                Cancel
              </button>
              <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white cursor-pointer transition-colors"
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
              <div className="bg-white rounded-xl border p-8" style={{ borderColor: '#e8d0d0' }}>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#2e1a1a', fontFamily: "'Fraunces', serif" }}>Where did you last see it?</h3>
                  <p className="text-sm" style={{ color: '#c07080' }}>Use the search bar or select from the dropdown below.</p>
                </div>
                <div className="mb-6">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#c07080' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" placeholder="Search for a building, library, or cafe..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition"
                      style={{ border: '1px solid #e8d0d0', background: '#fff8f8', color: '#2e1a1a' }}
                      onFocus={(e) => { e.target.style.borderColor = '#800020'; e.target.style.backgroundColor = '#ffffff'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e8d0d0'; e.target.style.backgroundColor = '#fff8f8'; }} />
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #e8d0d0' }} className="pt-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-1.5 capitalize" style={{ color: '#800020' }}>Building Name <span className="text-red-500">*</span></label>
                      <select name="building" value={formData.building} onChange={handleChange} className={inputClass}>
                        <option value="">Select building...</option>
                        {buildings.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 capitalize" style={{ color: '#800020' }}>Floor / Level</label>
                      <select name="floor" value={formData.floor} onChange={handleChange} className={inputClass}>
                        <option value="">Select floor...</option>
                        {['1st Floor', '2nd Floor'].map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 capitalize" style={{ color: '#800020' }}>Nearby Landmark / Room #</label>
                      <input type="text" name="specificLocation" value={formData.specificLocation} onChange={handleChange}
                        placeholder="e.g. Room 204, near the main entrance" className={inputClass} />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-sm font-bold capitalize" style={{ color: '#800020' }}>Additional Details</label>
                        <span className="text-xs" style={{ color: '#c5a3a3' }}>{formData.additionalDetails?.length || 0} / 300</span>
                      </div>
                      <textarea name="additionalDetails" value={formData.additionalDetails} onChange={handleChange}
                        maxLength={300} rows={3} placeholder="Any extra info about the location..."
                        className={inputClass + " resize-none"} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: '1px solid #e8d0d0' }}>
                  <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
                    style={{ color: '#2e1a1a', background: '#f5f0f0' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e8d0d0'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f5f0f0'}>
                    ← Back
                  </button>
                  <button onClick={() => setStep(3)} className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white cursor-pointer transition-colors"
                    style={{ background: 'linear-gradient(135deg, #800020, #4a0010)', boxShadow: '0 4px 12px rgba(128, 0, 32, 0.25)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #a0002a, #800020)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #800020, #4a0010)'}>
                    Next: Contact Info →
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white rounded-xl border p-4 sticky top-[100px]" style={{ borderColor: '#e8d0d0' }}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: '#2e1a1a' }}>Last Seen Location</h3>
                  <div className="rounded-lg overflow-hidden border h-64 flex items-center justify-center" style={{ borderColor: '#e8d0d0', background: '#f5f0f0' }}>
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#c07080' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <p className="text-sm font-medium" style={{ color: '#800020' }}>{formData.building || 'Select a location'}</p>
                      {formData.specificLocation && <p className="text-xs mt-1" style={{ color: '#c07080' }}>{formData.specificLocation}</p>}
                    </div>
                  </div>
                  {formData.building && <p className="text-sm mt-3" style={{ color: '#2e1a1a' }}>{formData.specificLocation || formData.building}</p>}
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
                <label className={labelClass}>Your Name <span className="text-red-500">*</span></label>
                <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Full name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="your@email.com" className={inputClass} />
              </div>
            </div>
            <div className="mb-5">
              <label className={labelClass}>Phone Number (Optional)</label>
              <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="+92..." className={inputClass} />
            </div>
            <div className="mb-2">
              <label className={labelClass}>Preferred Contact Method</label>
              <div className="flex gap-3 mt-1">
                {['email', 'phone', 'both'].map(method => (
                  <label key={method} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border cursor-pointer transition-all duration-200 text-[0.85rem] font-semibold capitalize"
                    style={{ borderColor: formData.preferredContact === method ? '#800020' : '#e8d0d0', background: formData.preferredContact === method ? '#fff8f8' : '#ffffff', color: formData.preferredContact === method ? '#800020' : '#c07080' }}>
                    <input type="radio" name="preferredContact" value={method} checked={formData.preferredContact === method} onChange={handleChange} className="hidden" />
                    {method}
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-6 p-4 rounded-xl" style={{ background: '#fff8f8', border: '1px solid #e8d0d0' }}>
              <p className="text-sm font-bold mb-3" style={{ color: '#800020' }}>📋 Quick Summary</p>
              <div className="grid grid-cols-2 gap-2 text-sm" style={{ color: '#2e1a1a' }}>
                <span className="font-bold">Item:</span><span>{formData.itemName || '—'}</span>
                <span className="font-bold">Category:</span><span>{formData.category || '—'}</span>
                <span className="font-bold">Date Lost:</span><span>{formatDate(formData.dateLost) || '—'}</span>
                <span className="font-bold">Location:</span><span>{formData.building || '—'}{formData.floor ? `, ${formData.floor}` : ''}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: '1px solid #e8d0d0' }}>
              <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
                style={{ color: '#2e1a1a', background: '#f5f0f0' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e8d0d0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f5f0f0'}>
                ← Back
              </button>
              <button onClick={() => setStep(4)} className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white cursor-pointer transition-colors"
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
              <div className="flex flex-col gap-5">
                <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e8d0d0' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold" style={{ color: '#2e1a1a', fontFamily: "'Fraunces', serif" }}>Item Details</h2>
                    <button onClick={() => setStep(1)} className="text-sm font-medium hover:underline" style={{ color: '#800020' }}>Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-5 pb-5" style={{ borderBottom: '1px solid #e8d0d0' }}>
                    <div><p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Item Name</p><p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.itemName || '—'}</p></div>
                    <div><p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Item Category</p><p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.category || '—'}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-5 py-5" style={{ borderBottom: '1px solid #e8d0d0' }}>
                    <div><p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Primary Color</p><p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.color || '—'}</p></div>
                    <div><p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Brand / Manufacturer</p><p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.brand || '—'}</p></div>
                  </div>
                  <div className="py-5" style={{ borderBottom: '1px solid #e8d0d0' }}>
                    <p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Date and Time Lost</p>
                    <p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formatDate(formData.dateLost)}{formData.timeLost ? `, around ${formData.timeLost}` : ''}</p>
                  </div>
                  <div className="pt-5">
                    <p className="text-xs mb-2" style={{ color: '#c5a3a3' }}>Detailed Description</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#2e1a1a' }}>{formData.description || 'No description provided.'}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e8d0d0' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold" style={{ color: '#2e1a1a', fontFamily: "'Fraunces', serif" }}>Location</h2>
                    <button onClick={() => setStep(2)} className="text-sm font-medium hover:underline" style={{ color: '#800020' }}>Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-5 pb-5" style={{ borderBottom: '1px solid #e8d0d0' }}>
                    <div><p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Building / Block</p><p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.building || '—'}</p></div>
                    <div><p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Area / Floor</p><p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.floor || '—'}</p></div>
                  </div>
                  <div className="pt-5">
                    <p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Additional Details</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#2e1a1a' }}>{formData.specificLocation ? formData.specificLocation + (formData.additionalDetails ? '. ' + formData.additionalDetails : '') : formData.additionalDetails || 'No additional details provided.'}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e8d0d0' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold" style={{ color: '#2e1a1a', fontFamily: "'Fraunces', serif" }}>Contact Information</h2>
                    <button onClick={() => setStep(3)} className="text-sm font-medium hover:underline" style={{ color: '#800020' }}>Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-5 pb-5" style={{ borderBottom: '1px solid #e8d0d0' }}>
                    <div><p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Full Name</p><p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.contactName || '—'}</p></div>
                    <div><p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Preferred Contact</p><p className="text-sm font-semibold capitalize" style={{ color: '#2e1a1a' }}>{formData.preferredContact}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-5 pt-5">
                    <div><p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Email Address</p><p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.contactEmail || '—'}</p></div>
                    <div><p className="text-xs mb-1" style={{ color: '#c5a3a3' }}>Phone Number</p><p className="text-sm font-semibold" style={{ color: '#2e1a1a' }}>{formData.contactPhone || '—'}</p></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#e8d0d0' }}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: '#2e1a1a' }}>Item Photo</h3>
                  <div className="rounded-lg overflow-hidden border h-48 flex items-center justify-center bg-black/5 p-2" style={{ borderColor: '#e8d0d0' }}>
                    {imagePreview ? <img src={imagePreview} alt="Item" className="w-full h-full object-contain" /> : (
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#c5a3a3' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs" style={{ color: '#c5a3a3' }}>No photo uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#e8d0d0' }}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: '#2e1a1a' }}>Last Seen Location</h3>
                  <div className="rounded-lg overflow-hidden border h-36 flex items-center justify-center" style={{ borderColor: '#e8d0d0', background: '#fff8f8' }}>
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#c07080' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <p className="text-sm font-medium" style={{ color: '#800020' }}>{formData.building || 'Location not specified'}</p>
                    </div>
                  </div>
                  {formData.specificLocation && <p className="text-sm mt-3" style={{ color: '#2e1a1a' }}>{formData.specificLocation}</p>}
                </div>
              </div>
            </div>
            {submitError && (
              <div className="mt-6 p-3 bg-red-100 text-red-700 text-sm rounded-xl font-medium">
                {submitError}
              </div>
            )}
            <div className="mt-6 bg-white rounded-xl border px-6 py-4 flex justify-between items-center" style={{ borderColor: '#e8d0d0' }}>
              <button onClick={() => setStep(3)} disabled={submitting} className="px-5 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors"
                style={{ color: '#2e1a1a', background: '#f5f0f0' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e8d0d0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f5f0f0'}>
                ← Back to Edit
              </button>
              <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 text-sm font-medium text-white rounded-lg cursor-pointer transition-colors"
                style={{ background: 'linear-gradient(135deg, #800020, #4a0010)', boxShadow: '0 4px 12px rgba(128, 0, 32, 0.25)', opacity: submitting ? 0.7 : 1 }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #a0002a, #800020)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #800020, #4a0010)'}>
                {submitting ? 'Submitting...' : '✓ Submit Report'}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ReportLostFound;