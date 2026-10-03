import React from 'react';
import { Link } from 'react-router-dom';
import crownBLogo from '../assets/crown-b-logo.png';

/**
 * BIYA FASHION - Master Brand Logo
 * Incorporates:
 * - Official Royal Crown & 'B' Emblem
 * - Brand Green (#064C32) & Brand Gold (#D9A514)
 * - Tagline: "WEAR YOUR STYLE"
 */
const BiyaLogo = ({ variant = 'default', size = 'normal', showTagline = true, to = '/' }) => {
  const isLight = variant === 'light'; // For dark green footer
  const isLarge = size === 'large';

  const primaryTextColor = isLight ? '#FFFFFF' : '#064C32';
  const secondaryTextColor = isLight ? '#F3D477' : '#D9A514';
  const taglineColor = isLight ? '#E5E5E5' : '#666666';

  const Content = (
    <div className="flex items-center gap-2 sm:gap-3 group select-none">
      {/* Official BIYA Royal Crown & 'B' Emblem */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 rounded-full overflow-hidden bg-white border-2 border-[#D9A514] shadow-sm ${
          isLarge ? 'w-16 h-16 p-1.5' : 'w-9 h-9 sm:w-12 sm:h-12 p-0.5 sm:p-1'
        } ${
          isLight ? 'shadow-md ring-2 ring-[#D9A514]/30' : ''
        }`}
      >
        <img
          src={crownBLogo}
          alt="BIYA FASHION Crown & B Emblem"
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = '/crown-b-logo.png';
          }}
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
          <span
            className={`font-serif font-black tracking-wider transition-colors duration-200 ${
              isLarge ? 'text-2xl sm:text-3xl' : 'text-base sm:text-2xl'
            }`}
            style={{ color: primaryTextColor }}
          >
            BIYA
          </span>
          <span
            className={`font-serif font-semibold tracking-widest ${
              isLarge ? 'text-2xl sm:text-3xl' : 'text-base sm:text-2xl'
            }`}
            style={{ color: secondaryTextColor }}
          >
            FASHION
          </span>
        </div>

        {showTagline && (
          <span
            className={`font-sans tracking-[0.2em] sm:tracking-[0.22em] uppercase font-semibold mt-0.5 sm:mt-1 transition-colors duration-200 ${
              isLarge ? 'text-xs' : 'text-[8px] sm:text-[10px]'
            }`}
            style={{ color: taglineColor }}
          >
            WEAR YOUR STYLE
          </span>
        )}
      </div>
    </div>
  );

  if (!to) {
    return Content;
  }

  return (
    <Link to={to} className="inline-flex items-center focus:outline-none" aria-label="Biya Fashion Home">
      {Content}
    </Link>
  );
};

export default BiyaLogo;
