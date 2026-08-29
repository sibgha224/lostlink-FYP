import React, { useState } from 'react';

const Signup = ({ onGoToLogin }) => {
  const [level, setLevel] = useState('BS');

  const bsDepartments = [
    "BS I.T", "BS Botany", "BS Chemistry", "BS Mathematics", 
    "BS Physics", "BS Zoology", "BS English", "BBA"
  ];

  const interDepartments = [
    "F.Sc (Pre-Medical)", "F.Sc (Pre-Engineering)", "ICS (Physics)", "I.Com", "F.A"
  ];

  const currentDepartments = level === 'BS' ? bsDepartments : interDepartments;

  const inputClass =
    "w-full py-1 px-2.5 rounded-lg border border-[#e8d0d0] bg-white text-[0.78rem] text-[#2e1a1a] outline-none focus:border-[#800020] focus:bg-[#fff8f8] transition-colors mt-0.5 box-border";

  const labelClass =
    "text-[0.72rem] font-bold text-[#800020] block text-left";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,800&display=swap');
        .font-headings { font-family: 'Fraunces', serif; }
      `}</style>

      {/* Top-Left Logo */}
      <div className="fixed top-4 left-4 flex items-center gap-2.5 z-10">
        <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #800020, #4a0010)', boxShadow: '0 4px 12px rgba(128,0,32,0.2)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <span className="font-headings text-[1.35rem] text-[#2e1a1a] tracking-tight">
          LostLink
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-[390px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden my-auto">

        {/* Card Header */}
        <div className="bg-gradient-to-r from-[#4a0010] to-[#800020] px-4 py-3 text-center shrink-0">
          <h2 className="m-0 text-[1.05rem] font-extrabold text-[#fde8ec]">
            Create Account
          </h2>
          <p className="mt-0.5 text-[0.68rem] text-[#c5a3a3]">
            Join the lost and found system.
          </p>
        </div>

        {/* Card Body */}
        <div className="px-4 py-2.5">
          <form className="grid grid-cols-2 gap-1.5">

            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name <span className="text-red-600">*</span></label>
              <input type="text" placeholder="Name" className={inputClass} />
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email <span className="text-red-600">*</span></label>
              <input type="email" placeholder="email@com" className={inputClass} />
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
              <select className={inputClass}>
                <option>Select</option>
                {currentDepartments.map((d, i) => (
                  <option key={i}>{d}</option>
                ))}
              </select>
            </div>

            {/* Semester / Year */}
            <div>
              <label className={labelClass}>
                {level === 'BS' ? 'Semester' : 'Year'} <span className="text-red-600">*</span>
              </label>
              <select className={inputClass}>
                {level === 'BS'
                  ? [1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s}>{s}th Sem</option>
                    ))
                  : [
                      <option key="1">1st Year</option>,
                      <option key="2">2nd Year</option>
                    ]}
              </select>
            </div>

            {/* Phone (Optional - No star) */}
            <div className="col-span-2">
              <label className={labelClass}>Phone (Optional)</label>
              <input type="text" placeholder="+92..." className={inputClass} />
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Password <span className="text-red-600">*</span></label>
              <input type="password" placeholder="********" className={inputClass} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClass}>Confirm Password <span className="text-red-600">*</span></label>
              <input type="password" placeholder="********" className={inputClass} />
            </div>

            {/* Batch / Roll No */}
            <div className="col-span-2">
              <label className={labelClass}>
                {level === 'BS' ? 'Batch / Session' : 'College Roll No'} <span className="text-red-600">*</span>
              </label>
              <input type="text" className={inputClass} />
            </div>

            {/* Shift - BS only */}
            {level === 'BS' && (
              <div className="col-span-2">
                <label className={labelClass}>Shift <span className="text-red-600">*</span></label>
                <div className="flex gap-2 mt-0.5">
                  <label className="flex-1 border border-[#e8d0d0] py-1 text-center rounded-lg text-[0.7rem] cursor-pointer bg-[#F5F0F0] text-[#2e1a1a] hover:border-[#800020] transition-colors">
                    <input type="radio" name="shift" className="mr-1 accent-[#800020]" />
                    Morning
                  </label>
                  <label className="flex-1 border border-[#e8d0d0] py-1 text-center rounded-lg text-[0.7rem] cursor-pointer bg-[#F5F0F0] text-[#2e1a1a] hover:border-[#800020] transition-colors">
                    <input type="radio" name="shift" className="mr-1 accent-[#800020]" />
                    Evening
                  </label>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              className="col-span-2 py-2 bg-gradient-to-r from-[#800020] to-[#4a0010] hover:from-[#a0002a] hover:to-[#800020] active:scale-95 text-[#fde8ec] font-bold text-[0.85rem] rounded-lg border-none cursor-pointer transition-all mt-1 shadow-md shadow-[#800020]/30"
            >
              Create Account →
            </button>

          </form>

          {/* Login Link */}
          <p className="text-center mt-2 text-[0.72rem] text-[#5a3a3a] font-medium">
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
    </>
  );
};

export default Signup;