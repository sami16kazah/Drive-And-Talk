'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'full';
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const isDark = variant === 'dark';

  const sizeClasses = {
    sm: 'h-10 w-auto',
    md: 'h-14 sm:h-16 w-auto',
    lg: 'h-20 sm:h-24 w-auto',
  };

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${
        isDark ? 'bg-white p-2.5 rounded-2xl shadow-md border border-brand-green/30' : ''
      } ${className}`}
    >
      <img
        src="/logo.png"
        alt="Drive & Talk"
        className={`${sizeClasses[size]} object-contain drop-shadow-sm`}
      />
    </div>
  );
};

export default Logo;
