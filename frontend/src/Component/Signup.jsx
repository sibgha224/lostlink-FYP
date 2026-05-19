import React, { useState } from 'react';

const Signup = ({ onGoToLogin }) => {
  const [level, setLevel] = useState('BS');

  const bsDepartments = ["BS I.T", "BS Botany", "BS Chemistry", "BS Mathematics", "BS Physics", "BS Zoology", "BS English", "BS BBA"];
  const interDepartments = ["F.Sc (Pre-Medical)", "F.Sc (Pre-Engineering)", "ICS (Physics)", "I.Com", "F.A"];
  const currentDepartments = level === 'BS' ? bsDepartments : interDepartments;

  const inputClass = "w-full py-1.5 px-2.5 rounded-lg border border-[#e8d0d0] bg-[#fff8f8] text-[0.8rem] text-[#2e1a1a] outline-none focus:border-[#800020] transition-colors mt-0.5 box-border font-[DM_Sans]";
  const labelClass = "text-[0.75rem] font-bold text-[#800020] block text-left font-[DM_Sans] uppercase tracking-widest";

  return (
    <div
      className="w-full h-screen flex justify-center items-center p-4"
      style={{
        backgroundImage: "url('/college_bg.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

      {/* Top-Left Logo */}
      <div className="fixed top-4 left-4 flex items-center gap-2.5 z-10">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#800020' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fde8ec" strokeWidth="3">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <span
          className="text-2xl tracking-tight drop-shadow-md"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, color: '#fde8ec' }}
        >
          LostLink
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-[400px] max-h-[88vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
        style={{ border: '0.5px solid #e8d0d0' }}
      >

        {/* Card Header */}
        <div
          className="px-5 py-3 text-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #4a0010 0%, #800020 100%)', borderBottom: '2px solid #4a0010' }}
        >
          <h2
            className="m-0 text-[1.05rem]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, color: '#fde8ec' }}
          >
            Create Account
          </h2>
          <p className="mt-0.5 text-[0.7rem]" style={{ color: '#c07080' }}>
            Join the lost and found portal.
          </p>
        </div>

        {/* Card Body - scrollable */}
        <div className="px-4 py-3 overflow-y-auto" style={{ background: '#ffffff' }}>
          <form className="grid grid-cols-2 gap-[7px]">

            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" placeholder="Name" className={inputClass} />
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" placeholder="email@com" className={inputClass} />
            </div>

            {/* Academic Level */}
            <div className="col-span-2">
              <label className={labelClass}>Academic Level</label>
              <select className={inputClass} value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="BS">Bachelor (BS Programs)</option>
                <option value="Inter">Intermediate (FA/FSC/ICS)</option>
              </select>
            </div>

            {/* Program */}
            <div>
              <label className={labelClass}>Program</label>
              <select className={inputClass}>
                <option>Select</option>
                {currentDepartments.map((d, i) => <option key={i}>{d}</option>)}
              </select>
            </div>

            {/* Semester / Year */}
            <div>
              <label className={labelClass}>{level === 'BS' ? 'Semester' : 'Year'}</label>
              <select className={inputClass}>
                {level === 'BS'
                  ? [1,2,3,4,5,6,7,8].map(s => <option key={s}>{s}th Sem</option>)
                  : [<option key="1">1st Year</option>, <option key="2">2nd Year</option>]
                }
              </select>
            </div>

            {/* Phone */}
            <div className="col-span-2">
              <label className={labelClass}>Phone (Optional)</label>
              <input type="text" placeholder="+92..." className={inputClass} />
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Password</label>
              <input type="password" placeholder="********" className={inputClass} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClass}>Confirm Password</label>
              <input type="password" placeholder="********" className={inputClass} />
            </div>

            {/* Batch / Roll No */}
            <div className="col-span-2">
              <label className={labelClass}>{level === 'BS' ? 'Batch / Session' : 'College Roll No'}</label>
              <input type="text" className={inputClass} />
            </div>

            {/* Shift - BS only */}
            {level === 'BS' && (
              <div className="col-span-2">
                <label className={labelClass}>Shift</label>
                <div className="flex gap-2 mt-1">
                  <label
                    className="flex-1 py-1.5 text-center rounded-lg text-[0.73rem] cursor-pointer font-bold"
                    style={{ border: '1px solid #e8d0d0', background: '#fff8f8', color: '#2e1a1a', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <input type="radio" name="shift" className="mr-1" /> Morning
                  </label>
                  <label
                    className="flex-1 py-1.5 text-center rounded-lg text-[0.73rem] cursor-pointer font-bold"
                    style={{ border: '1px solid #e8d0d0', background: '#fff8f8', color: '#2e1a1a', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <input type="radio" name="shift" className="mr-1" /> Evening
                  </label>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              className="col-span-2 py-2.5 active:scale-95 text-[0.88rem] rounded-lg border-none cursor-pointer transition-all mt-1"
              style={{
                background: 'linear-gradient(135deg, #800020 0%, #4a0010 100%)',
                color: '#fde8ec',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 700,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, #a0002a 0%, #800020 100%)'}
              onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, #800020 0%, #4a0010 100%)'}
            >
              Create Account →
            </button>

          </form>

          <p className="text-center mt-2 text-[0.75rem]" style={{ color: '#800020', fontWeight: 600 }}>
            Already have an account?{' '}
            <span
              onClick={onGoToLogin}
              className="cursor-pointer font-bold hover:underline"
              style={{ color: '#800020' }}
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