import React, { useState } from 'react';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductGallery = ({ images = [], productName = 'Product Image' }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const galleryImages = images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'];

  const currentImg = galleryImages[selectedIdx] || galleryImages[0];

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleNext = () => {
    setSelectedIdx((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setSelectedIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Selector List */}
      {galleryImages.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[540px] py-1 shrink-0 scrollbar-none">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                selectedIdx === idx
                  ? 'border-[#064C32] ring-2 ring-[#064C32]/30 scale-95 shadow-md'
                  : 'border-[#E5E5E5] hover:border-gray-400 opacity-75 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Large Image Container */}
      <div className="relative flex-1 aspect-[3/4] bg-[#F8F8F8] rounded-3xl overflow-hidden border border-[#E5E5E5] shadow-sm select-none">
        <div
          className="relative w-full h-full cursor-crosshair overflow-hidden"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={currentImg}
            alt={productName}
            className={`w-full h-full object-cover object-center transition-transform duration-200 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  }
                : undefined
            }
          />
        </div>

        {/* Zoom Hint Icon */}
        <div className="absolute top-4 left-4 pointer-events-none bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E5E5E5] flex items-center gap-1.5 text-xs text-[#666666]">
          <ZoomIn className="w-3.5 h-3.5 text-[#064C32]" />
          <span>Hover to zoom</span>
        </div>

        {/* Next / Prev Buttons */}
        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#111111] hover:text-[#064C32] shadow-md flex items-center justify-center transition"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#111111] hover:text-[#064C32] shadow-md flex items-center justify-center transition"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
