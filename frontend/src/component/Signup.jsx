import React, { useState } from 'react';

const API_BASE = 'http://localhost:5000/api/auth';

const Signup = ({ onSignupSuccess, onGoToLogin }) => {
  const [step, setStep] = useState('details'); // 'details' ya 'otp'
  const [level, setLevel] = useState('BS');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNo: '',
    department: '',
    session: '',
    shift: 'Morning',
    phone: ''
  });

  const bsDepartments = [
    "BS I.T", "BS Botany", "BS Chemistry", "BS Mathematics",
    "BS Physics", "BS Zoology", "BS English", "BBA"
  ];

  const interDepartments = [
    "F.Sc (Pre-Medical)", "F.Sc (Pre-Engineering)", "ICS (Physics)", "I.Com", "F.A"
  ];

  const currentDepartments = level === 'BS' ? bsDepartments : interDepartments;

  const rollNoPlaceholder = level === 'BS' ? 'e.g. 085675' : 'e.g. 08524';
  const sessionPlaceholder = level === 'BS' ? 'e.g. 2022-2026' : 'e.g. 2024-2026';

  const EyeIcon = ({ open }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <>
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.6 18.6 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );

  const inputClass =
    "w-full py-1.5 px-2.5 rounded-lg border border-[#e8d0d0] bg-white text-[0.78rem] text-[#2e1a1a] outline-none focus:border-[#800020] focus:bg-[#fff8f8] transition-colors mt-0.5 box-border";

  const labelClass =
    "text-[0.72rem] font-bold text-[#800020] block text-left";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.department) {
      setError('Please select a program/department');
      return;
    }

    const rollNoRegex = level === 'BS' ? /^\d{5,8}$/ : /^\d{2,5}$/;
    if (!rollNoRegex.test(formData.rollNo)) {
      setError(level === 'BS' ? 'Roll Number must be 5-8 digits (e.g., 085675).' : 'Roll Number must be 2-5 digits (e.g., 08524).');
      return;
    }

    const sessionMatch = formData.session.match(/^(\d{4})-(\d{4})$/);
    const requiredDuration = level === 'BS' ? 4 : 2;
    if (!sessionMatch || (parseInt(sessionMatch[2]) - parseInt(sessionMatch[1])) !== requiredDuration) {
      setError(level === 'BS' ? 'Session must be a valid 4-year duration (e.g., 2022-2026).' : 'Session must be a valid 2-year duration (e.g., 2024-2026).');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.phone && !/^03\d{9}$/.test(formData.phone)) {
      setError('Phone number must be in the format 03XXXXXXXXX (11 digits)');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          rollNo: formData.rollNo,
          department: formData.department,
          shift: formData.shift,
          session: formData.session,
          academicLevel: level,
          phone: formData.phone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.errors ? data.errors.join(' ') : (data.message || 'Registration failed');
        throw new Error(msg);
      }

      setUserId(data.userId);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 6) {
      setError('Please enter the full 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp: enteredOtp })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onSignupSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            {step === 'details' ? 'Join the lost and found system.' : 'Enter the 6-digit code sent to your email.'}
          </p>
        </div>

        {/* Card Body */}
        <div className="px-4 py-2.5 max-h-[75vh] overflow-y-auto">

          {error && (
            <div className="mb-2 p-2 bg-red-100 text-red-700 text-[0.7rem] rounded-lg font-medium">
              {error}
            </div>
          )}

          {step === 'details' ? (
            /* --- STEP 1: REGISTRATION FORM --- */
            <form onSubmit={handleRegisterSubmit} className="grid grid-cols-2 gap-1.5">

              {/* Full Name */}
              <div>
                <label className={labelClass}>Full Name <span className="text-red-600">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Name" className={inputClass} />
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email <span className="text-red-600">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@com" className={inputClass} />
              </div>

              {/* Academic Level */}
              <div className="col-span-2">
                <label className={labelClass}>Academic Level <span className="text-red-600">*</span></label>
                <select
                  className={inputClass}
                  value={level}
                  onChange={(e) => {
                    const newLevel = e.target.value;
                    setLevel(newLevel);
                    // Intermediate has no Morning/Evening shift — clear it when switching
                    setFormData({ ...formData, department: '', shift: newLevel === 'BS' ? 'Morning' : '' });
                  }}
                >
                  <option value="BS">Bachelor (BS Programs)</option>
                  <option value="Inter">Intermediate (FA/FSC/ICS)</option>
                </select>
              </div>

              {/* Program → maps to backend `department` */}
              <div className="col-span-2">
                <label className={labelClass}>Program <span className="text-red-600">*</span></label>
                <select name="department" value={formData.department} onChange={handleChange} className={inputClass} required>
                  <option value="">Select</option>
                  {currentDepartments.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Roll No */}
              <div>
                <label className={labelClass}>Roll No <span className="text-red-600">*</span></label>
                <input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} required placeholder={rollNoPlaceholder} className={inputClass} />
              </div>

              {/* Session */}
              <div>
                <label className={labelClass}>Session <span className="text-red-600">*</span></label>
                <input type="text" name="session" value={formData.session} onChange={handleChange} required placeholder={sessionPlaceholder} className={inputClass} />
              </div>

              {/* Phone (optional) */}
              <div className="col-span-2">
                <label className={labelClass}>Phone Number <span className="text-[#c07080] font-normal">(optional)</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="03XXXXXXXXX" className={inputClass} />
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>Password <span className="text-red-600">*</span></label>
                <div className="relative mt-0.5">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required placeholder="********" className={inputClass + ' !mt-0 pr-7'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#c07080] cursor-pointer bg-transparent border-none p-0 flex items-center" tabIndex={-1}>
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={labelClass}>Confirm Password <span className="text-red-600">*</span></label>
                <div className="relative mt-0.5">
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="********" className={inputClass + ' !mt-0 pr-7'} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#c07080] cursor-pointer bg-transparent border-none p-0 flex items-center" tabIndex={-1}>
                    <EyeIcon open={showConfirmPassword} />
                  </button>
                </div>
              </div>

              {/* Shift — BS programs only, Intermediate doesn't have shifts */}
              {level === 'BS' && (
                <div className="col-span-2">
                  <label className={labelClass}>Shift <span className="text-red-600">*</span></label>
                  <div className="flex gap-2 mt-0.5">
                    <label className="flex-1 border border-[#e8d0d0] py-1 text-center rounded-lg text-[0.7rem] cursor-pointer bg-[#F5F0F0] text-[#2e1a1a] hover:border-[#800020] transition-colors">
                      <input type="radio" name="shift" value="Morning" checked={formData.shift === 'Morning'} onChange={handleChange} required className="mr-1 accent-[#800020]" />
                      Morning
                    </label>
                    <label className="flex-1 border border-[#e8d0d0] py-1 text-center rounded-lg text-[0.7rem] cursor-pointer bg-[#F5F0F0] text-[#2e1a1a] hover:border-[#800020] transition-colors">
                      <input type="radio" name="shift" value="Evening" checked={formData.shift === 'Evening'} onChange={handleChange} required className="mr-1 accent-[#800020]" />
                      Evening
                    </label>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="col-span-2 py-2 bg-gradient-to-r from-[#800020] to-[#4a0010] hover:from-[#a0002a] hover:to-[#800020] active:scale-95 text-[#fde8ec] font-bold text-[0.85rem] rounded-lg border-none cursor-pointer transition-all mt-1 shadow-md"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Creating...' : 'Create Account →'}
              </button>

            </form>
          ) : (
            /* --- STEP 2: OTP VERIFICATION FORM (6 digits, matches backend) --- */
            <form onSubmit={handleVerifyOtp} className="py-6 text-center">
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    className="w-10 h-12 text-center text-xl font-bold border-2 border-[#e8d0d0] rounded-xl outline-none focus:border-[#800020] bg-[#fff8f8] text-[#2e1a1a]"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#800020] to-[#4a0010] hover:from-[#a0002a] hover:to-[#800020] active:scale-95 text-[#fde8ec] font-bold text-[0.85rem] rounded-lg border-none cursor-pointer transition-all shadow-md"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Verifying...' : 'Verify & Register →'}
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
