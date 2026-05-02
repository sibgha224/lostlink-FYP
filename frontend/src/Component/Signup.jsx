import React, { useState } from 'react';

const Signup = ({ onGoToLogin }) => {
  const [level, setLevel] = useState('BS');

  const bsDepartments = ["BS I.T", "BS Botany", "BS Chemistry", "BS Mathematics", "BS Physics", "BS Zoology", "BS English", "BS BBA"];
  const interDepartments = ["F.Sc (Pre-Medical)", "F.Sc (Pre-Engineering)", "ICS (Physics)", "I.Com", "F.A"];
  const currentDepartments = level === 'BS' ? bsDepartments : interDepartments;

  const inputClass = "w-full py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[0.8rem] text-slate-700 outline-none focus:border-blue-500 transition-colors mt-0.5 box-border";
  const labelClass = "text-[0.75rem] font-bold text-slate-700 block text-left";

  return (
    <div className="w-full h-screen flex justify-center items-center p-4">

      {/* Top-Left Logo */}
      <div className="fixed top-4 left-4 flex items-center gap-2.5 z-10">
        <div className="bg-blue-600 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <span className="text-2xl font-bold text-white tracking-tight drop-shadow-md">LostLink</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-[400px] max-h-[88vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10">

        {/* Card Header */}
        <div className="bg-slate-100 px-5 py-3 text-center border-b-2 border-slate-200 shrink-0">
          <h2 className="m-0 text-[1.05rem] font-extrabold text-slate-800">Create Account</h2>
          <p className="mt-0.5 text-[0.7rem] text-slate-500">Join the lost and found portal.</p>
        </div>

        {/* Card Body - scrollable */}
        <div className="px-4 py-3 overflow-y-auto">
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
                  <label className="flex-1 border border-slate-200 py-1.5 text-center rounded-lg text-[0.73rem] cursor-pointer bg-slate-50">
                    <input type="radio" name="shift" className="mr-1" /> Morning
                  </label>
                  <label className="flex-1 border border-slate-200 py-1.5 text-center rounded-lg text-[0.73rem] cursor-pointer bg-slate-50">
                    <input type="radio" name="shift" className="mr-1" /> Evening
                  </label>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              className="col-span-2 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-[0.88rem] rounded-lg border-none cursor-pointer transition-all mt-1 shadow-md shadow-blue-500/30"
            >
              Create Account →
            </button>

          </form>

          <p className="text-center mt-2 text-[0.75rem] text-slate-500">
            Already have an account?{' '}
            <span onClick={onGoToLogin} className="text-blue-600 cursor-pointer font-bold hover:underline">Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;