import React, { useState } from 'react';

const OtpVerification = (props) => {
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Automatically focus next input box
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 4) {
      alert(`OTP Verified Successfully: ${enteredOtp}`);
      if (props.onVerificationSuccess) {
        props.onVerificationSuccess();
      }
    } else {
      alert('Please enter a valid 4-digit OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center px-4" style={{ backgroundImage: "url('/college_bg.jpeg')" }}>
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-[#e8d0d0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#800020] text-white rounded-2xl mx-auto flex items-center justify-center mb-3 text-xl font-bold">🔒</div>
          <h2 className="text-2xl font-bold text-[#2e1a1a]">Enter OTP Verification</h2>
          <p className="text-sm text-[#c07080] mt-1">We've sent a 4-digit code to your email.</p>
        </div>

        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-[#e8d0d0] rounded-xl outline-none focus:border-[#800020] bg-[#fff8f8]"
              />
            ))}
          </div>

          <button 
            type="submit" 
            className="w-full py-3 rounded-xl bg-[#800020] text-white font-bold text-base cursor-pointer hover:opacity-90 shadow-md">
            Verify OTP
          </button>
        </form>

        <div className="text-center mt-4">
          <button 
            onClick={props.onBack} 
            className="text-sm text-[#800020] bg-transparent border-none cursor-pointer hover:underline">
            ← Back to Login / Signup
          </button>
        </div>

      </div>
    </div>
  );
};

export default OtpVerification;