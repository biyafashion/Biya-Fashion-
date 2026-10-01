import React, { useState, useEffect } from 'react';
import crownBLogo from '../assets/crown-b-logo.png';

/**
 * BIYA FASHION - 2-Second Introductory Brand Splash Screen
 * 
 * Requirements:
 * - Appears when the site first opens
 * - Displays for exactly 2 seconds
 * - Circular logo with an animated outer round ring around it
 * - Premium Shop Name: "BIYA FASHION" & "WEAR YOUR STYLE"
 * - Smooth luxury fade-out transition
 */
const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fading out at 2.0 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // Completely unmount after fade animation completes
    const unmountTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-in-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden={isFading}
    >
      <div className="flex flex-col items-center justify-center px-4 text-center transform transition-transform duration-700">
        {/* Circular Logo with Outer Animated Rings */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Outer Pulsing Glow Ring */}
          <div className="absolute -inset-5 rounded-full border border-[#D9A514]/30 animate-ping opacity-75" />

          {/* Outer Rotating Circular Ring */}
          <div className="absolute -inset-4 rounded-full border-2 border-dashed border-[#D9A514] animate-[spin_8s_linear_infinite]" />

          {/* Secondary Concentric Accent Ring */}
          <div className="absolute -inset-2 rounded-full border border-[#064C32]/30" />

          {/* Round Logo Shape */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-2.5 bg-white shadow-2xl border-2 border-[#D9A514] flex items-center justify-center overflow-hidden">
            <img
              src={crownBLogo}
              alt="BIYA FASHION Royal Emblem"
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => {
                e.currentTarget.src = '/crown-b-logo.png';
              }}
            />
          </div>
        </div>

        {/* Shop Name & Luxury Typography */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#064C32] tracking-wider">
              BIYA <span className="text-[#D9A514]">FASHION</span>
            </h1>
          </div>

          <p className="font-sans text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.3em] text-[#666666] mt-2">
            WEAR YOUR STYLE
          </p>

          {/* 2-Second Animated Progress Bar */}
          <div className="w-44 h-1 bg-[#F0F0F0] rounded-full overflow-hidden mt-6 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#064C32] via-[#D9A514] to-[#064C32] rounded-full transition-all duration-[2000ms] ease-out"
              style={{
                width: isFading ? '100%' : '100%',
                animation: 'splashBar 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes splashBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
