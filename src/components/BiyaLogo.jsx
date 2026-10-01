import React from 'react';
import { Link } from 'react-router-dom';
import brandLogo from '../assets/logo-round.png';

/**
 * BIYA FASHION - Master Brand Logo
 * Incorporates:
 * - Fashion Hanger Icon
 * - Royal Crown Element
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
    <div className="flex items-center gap-3 group select-none">
      {/* Official BIYA Royal Crown & 'B' Emblem - Round Format */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 rounded-full overflow-hidden ${
          isLarge ? 'w-16 h-16' : 'w-12 h-12'
        } ${
          isLight
            ? 'shadow-md border border-[#D9A514]/60 bg-white'
            : 'shadow-sm bg-white'
        }`}
      >
        <img
          src={brandLogo}
          alt="BIYA FASHION Emblem"
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = '/logo-round.png'; }}
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-serif font-black tracking-wider transition-colors duration-200 ${
              isLarge ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
            }`}
            style={{ color: primaryTextColor }}
          >
            BIYA
          </span>
          <span
            className={`font-serif font-semibold tracking-widest ${
              isLarge ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
            }`}
            style={{ color: secondaryTextColor }}
          >
            FASHION
          </span>
        </div>

        {showTagline && (
          <span
            className={`font-sans tracking-[0.22em] uppercase font-semibold mt-1 transition-colors duration-200 ${
              isLarge ? 'text-xs' : 'text-[10px]'
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
