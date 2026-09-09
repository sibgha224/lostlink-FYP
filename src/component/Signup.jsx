import React, { useState } from 'react';

const Signup = ({ onSignupSuccess, onGoToLogin }) => {
  const [step, setStep] = useState('details'); // 'details' ya 'otp'
  const [level, setLevel] = useState('BS');
  const [otp, setOtp] = useState(['', '', '', '']);

  const bsDepartments = [
    "BS I.T", "BS Botany", "BS Chemistry", "BS Mathematics", 
    "BS Physics", "BS Zoology", "BS English", "BBA"
  ];

  const interDepartments = [
    "F.Sc (Pre-Medical)", "F.Sc (Pre-Engineering)", "ICS (Physics)", "I.Com", "F.A"
  ];

  const currentDepartments = level === 'BS' ? bsDepartments : interDepartments;

  const inputClass =
    "w-full py-1.5 px-2.5 rounded-lg border border-[#e8d0d0] bg-white text-[0.78rem] text-[#2e1a1a] outline-none focus:border-[#800020] focus:bg-[#fff8f8] transition-colors mt-0.5 box-border";

  const labelClass =
    "text-[0.72rem] font-bold text-[#800020] block text-left";

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setStep('otp'); // Details fill karne ke baad OTP screen par le jaye ga
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 4) {
      onSignupSuccess(); // Verification complete hone ke baad home page par bhej dein
    } else {
      alert('Please enter a valid 4-digit OTP');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      {/* Top-Left Logo */}
      <div className="absolute top-4 left-4 flex items-center gap-2.5 z-10">
        <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #800020, #4a0010)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <span className="font-headings text-[1.35rem] text-[#2e1a1a] tracking-tight drop-shadow-sm font-bold">
          LostLink
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-[390px] bg-white rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden my-auto mt-16 mb-6 border border-[#e8d0d0]">

        {/* Card Header */}
        <div className="bg-gradient-to-r from-[#4a0010] to-[#800020] px-4 py-3 text-center shrink-0">
          <h2 className="m-0 text-[1.05rem] font-extrabold text-[#fde8ec]">
            {step === 'details' ? 'Create Account' : 'OTP Verification'}
          </h2>
          <p className="mt-0.5 text-[0.68rem] text-[#c5a3a3]">
            {step === 'details' ? 'Join the lost and found system.' : 'Enter the 4-digit code sent to your email.'}
          </p>
        </div>

        {/* Card Body */}
        <div className="px-4 py-2.5 max-h-[75vh] overflow-y-auto">
          
          {step === 'details' ? (
            /* --- STEP 1: REGISTRATION FORM --- */
            <form onSubmit={handleRegisterSubmit} className="grid grid-cols-2 gap-1.5">

              {/* Full Name */}
              <div>
                <label className={labelClass}>Full Name <span className="text-red-600">*</span></label>
                <input type="text" required placeholder="Name" className={inputClass} />
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email <span className="text-red-600">*</span></label>
                <input type="email" required placeholder="email@com" className={inputClass} />
              </div>

              {/* Academic Level */}
              <div className="col-span-2">
                <label className={labelClass}>Academic Level <span className="text-red-600">*</span></label>
                <select className={inputClass} value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="BS">Bachelor (BS Programs)</option>
                  <option value="Inter">Intermediate (FA/FSC/ICS)</option>
                </select>
              </div>

              {/* Program */}
              <div>
                <label className={labelClass}>Program <span className="text-red-600">*</span></label>
                <select className={inputClass} required>
                  <option value="">Select</option>
                  {currentDepartments.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Semester / Year */}
              <div>
                <label className={labelClass}>
                  {level === 'BS' ? 'Semester' : 'Year'} <span className="text-red-600">*</span>
                </label>
                <select className={inputClass} required>
                  {level === 'BS'
                    ? [1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>{s}th Sem</option>
                      ))
                    : [
                        <option key="1" value="1st Year">1st Year</option>,
                        <option key="2" value="2nd Year">2nd Year</option>
                      ]}
                </select>
              </div>

              {/* Phone */}
              <div className="col-span-2">
                <label className={labelClass}>Phone (Optional)</label>
                <input type="text" placeholder="+92..." className={inputClass} />
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>Password <span className="text-red-600">*</span></label>
                <input type="password" required placeholder="********" className={inputClass} />
              </div>

              {/* Confirm Password */}
              <div>
                <label className={labelClass}>Confirm Password <span className="text-red-600">*</span></label>
                <input type="password" required placeholder="********" className={inputClass} />
              </div>

              {/* Batch / Roll No */}
              <div className="col-span-2">
                <label className={labelClass}>
                  {level === 'BS' ? 'Batch / Session' : 'College Roll No'} <span className="text-red-600">*</span>
                </label>
                <input type="text" required className={inputClass} />
              </div>

              {/* Shift - BS only */}
              {level === 'BS' && (
                <div className="col-span-2">
                  <label className={labelClass}>Shift <span className="text-red-600">*</span></label>
                  <div className="flex gap-2 mt-0.5">
                    <label className="flex-1 border border-[#e8d0d0] py-1 text-center rounded-lg text-[0.7rem] cursor-pointer bg-[#F5F0F0] text-[#2e1a1a] hover:border-[#800020] transition-colors">
                      <input type="radio" name="shift" required className="mr-1 accent-[#800020]" />
                      Morning
                    </label>
                    <label className="flex-1 border border-[#e8d0d0] py-1 text-center rounded-lg text-[0.7rem] cursor-pointer bg-[#F5F0F0] text-[#2e1a1a] hover:border-[#800020] transition-colors">
                      <input type="radio" name="shift" required className="mr-1 accent-[#800020]" />
                      Evening
                    </label>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="col-span-2 py-2 bg-gradient-to-r from-[#800020] to-[#4a0010] hover:from-[#a0002a] hover:to-[#800020] active:scale-95 text-[#fde8ec] font-bold text-[0.85rem] rounded-lg border-none cursor-pointer transition-all mt-1 shadow-md"
              >
                Create Account →
              </button>

            </form>
          ) : (
            /* --- STEP 2: OTP VERIFICATION FORM --- */
            <form onSubmit={handleVerifyOtp} className="py-6 text-center">
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-[#e8d0d0] rounded-xl outline-none focus:border-[#800020] bg-[#fff8f8] text-[#2e1a1a]"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#800020] to-[#4a0010] hover:from-[#a0002a] hover:to-[#800020] active:scale-95 text-[#fde8ec] font-bold text-[0.85rem] rounded-lg border-none cursor-pointer transition-all shadow-md"
              >
                Verify & Register →
              </button>
            </form>
          )}

          {/* Login Link */}
          <p className="text-center mt-3 text-[0.72rem] text-[#5a3a3a] font-medium">
            Already have an account?{' '}
            <span
              onClick={onGoToLogin}
              className="text-[#800020] cursor-pointer font-bold hover:text-[#a0002a] hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;