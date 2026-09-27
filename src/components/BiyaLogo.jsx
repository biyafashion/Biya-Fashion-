import React from 'react';
import { Link } from 'react-router-dom';

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
  const hangerStroke = isLight ? '#FFFFFF' : '#064C32';
  const crownFill = isLight ? '#F3D477' : '#D9A514';

  const Content = (
    <div className="flex items-center gap-3 group select-none">
      {/* Crown + Hanger Emblem */}
      <div className={`relative flex items-center justify-center shrink-0 ${isLarge ? 'w-14 h-14' : 'w-10 h-10'}`}>
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full transform transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Circular Glow Background */}
          <circle
            cx="32"
            cy="32"
            r="30"
            fill={isLight ? 'rgba(217, 165, 20, 0.12)' : 'rgba(6, 76, 50, 0.06)'}
            stroke={secondaryTextColor}
            strokeWidth="1.2"
            strokeDasharray="2 3"
          />

          {/* Royal Crown */}
          <path
            d="M21 24L26 29L32 18L38 29L43 24L41 33H23L21 24Z"
            fill={crownFill}
            filter="drop-shadow(0px 1px 1px rgba(0,0,0,0.15))"
          />
          <circle cx="21" cy="23" r="1.5" fill="#F3D477" />
          <circle cx="32" cy="17" r="2.0" fill="#FFFFFF" />
          <circle cx="43" cy="23" r="1.5" fill="#F3D477" />

          {/* Hanger Hook */}
          <path
            d="M32 30V32C32 34 30.5 35 29 36C27.5 37 27.5 39 29.5 40C31 40.5 32 41 32 42"
            stroke={secondaryTextColor}
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Hanger Triangular Structure */}
          <path
            d="M32 38L15 47.5C14.2 48 14.6 49 15.6 49H48.4C49.4 49 49.8 48 49 47.5L32 38Z"
            fill="none"
            stroke={hangerStroke}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Hanger Lower Gold Support Bar */}
          <line
            x1="16"
            y1="49"
            x2="48"
            y2="49"
            stroke={secondaryTextColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
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
