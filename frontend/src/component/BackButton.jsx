import React from 'react';

const BackButton = ({ onClick, label = 'Home', className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full bg-white border border-[#ecdcdc] text-[#800020] text-sm font-semibold shadow-sm hover:bg-[#fbf3f4] hover:border-[#dcbcc1] hover:shadow transition-all cursor-pointer ${className}`}
    style={{ fontFamily: "'DM Sans', sans-serif" }}>
    <span className="w-7 h-7 rounded-full bg-[#fbf3f4] group-hover:bg-[#800020] group-hover:text-white flex items-center justify-center transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </span>
    {label}
  </button>
);

export default BackButton;
