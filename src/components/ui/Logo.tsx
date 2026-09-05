'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'full';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  showSubtitle = true,
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* Brand Initials "DT" */}
      <div className="flex items-center justify-center leading-none tracking-tight">
        <span
          className="font-serif font-bold text-4xl sm:text-5xl text-[#00B050]"
          style={{ fontFamily: 'Georgia, Cambria, serif', letterSpacing: '-0.05em' }}
        >
          D
        </span>
        <span
          className="font-serif font-bold text-4xl sm:text-5xl text-[#00B050] -ml-1"
          style={{ fontFamily: 'Georgia, Cambria, serif' }}
        >
          T
        </span>
      </div>

      {/* Sub-text 1: DRIVE & TALK */}
      <div className="mt-1 text-[#00B050] font-black text-xs sm:text-sm tracking-[0.25em] uppercase leading-tight">
        DRIVE &amp; TALK
      </div>

      {/* Sub-text 2: English · Dutch · Driving */}
      {showSubtitle && (
        <div
          className={`mt-0.5 text-[9px] sm:text-[10px] tracking-[0.18em] font-medium leading-none ${
            isDark ? 'text-gray-300' : 'text-[#00B050]/80'
          }`}
        >
          English · Dutch · Driving
        </div>
      )}
    </div>
  );
};

export default Logo;
