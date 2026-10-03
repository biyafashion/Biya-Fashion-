import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  TrendingUp,
  Tag,
  Mail,
  Shirt,
  Heart,
  Crown,
  Quote,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { InstagramIcon } from '../components/SocialIcons';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import STORE_CONFIG from '../config/storeConfig';

const Home = () => {
  const { products, categories, newArrivals } = useProducts();
  const showcaseProducts = newArrivals && newArrivals.length > 0 ? newArrivals : products;

  const heroBanners = [
    {
      id: 1,
      image: '/banners/hero-banner-1.jpg',
      title: 'Trendy Outfits For A Better You - BIYA FASHION',
      link: '/shop',
    },
    {
      id: 2,
      image: '/banners/hero-banner-2.jpg',
      title: 'Modern Looks For A Better You - BIYA FASHION',
      link: '/shop',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-play carousel every 5 seconds unless hovered/interacting
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, heroBanners.length]);

  const handlePrev = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setCurrentSlide((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const instagramPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      handle: '@biya_urban',
      tag: '#WearYourStyle',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
      handle: '@stylewithbiya',
      tag: '#StreetwearLuxury',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1625910513413-7e289e6eb7bc?auto=format&fit=crop&w=600&q=80',
      handle: '@mensfashiondaily',
      tag: '#PoloElegance',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
      handle: '@biyafashion_official',
      tag: '#CozyVibes',
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. HERO BANNER CAROUSEL */}
      <section className="relative bg-white pt-2 sm:pt-4 pb-8 sm:pb-12 border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-neutral-900 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Carousel Slides Container */}
            <div
              className="flex transition-transform duration-700 ease-in-out w-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {heroBanners.map((banner, index) => (
                <div key={banner.id} className="min-w-full w-full flex-shrink-0 relative">
                  <Link
                    to={banner.link}
                    className="block relative w-full aspect-[16/9] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-[1.01]"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </Link>
                </div>
              ))}
            </div>

            {/* Left Chevron Button */}
            <button
              onClick={handlePrev}
              type="button"
              aria-label="Previous Slide"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#064C32] text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-all duration-200 opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 z-20 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Chevron Button */}
            <button
              onClick={handleNext}
              type="button"
              aria-label="Next Slide"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#064C32] text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-all duration-200 opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 z-20 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dots Pagination */}
            <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-2.5 z-20 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
              {heroBanners.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentSlide === index
                      ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-[#D9A514] shadow-md'
                      : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Quick Trust Highlights Below Carousel */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] hover:border-[#064C32]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#064C32]/10 text-[#064C32] flex items-center justify-center shrink-0">
                <Shirt className="w-5 h-5 text-[#064C32]" />
              </div>
              <div className="text-left">
                <p className="font-serif font-bold text-xs sm:text-sm text-[#111111]">100% Combed Cotton</p>
                <p className="text-[11px] text-[#666666]">240 GSM Bio-Washed</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] hover:border-[#064C32]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#064C32]/10 text-[#064C32] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#064C32]" />
              </div>
              <div className="text-left">
                <p className="font-serif font-bold text-xs sm:text-sm text-[#111111]">Free Express Delivery</p>
                <p className="text-[11px] text-[#666666]">On Orders Above ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] hover:border-[#064C32]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#064C32]/10 text-[#064C32] flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-[#064C32]" />
              </div>
              <div className="text-left">
                <p className="font-serif font-bold text-xs sm:text-sm text-[#111111]">7 Days Easy Return</p>
                <p className="text-[11px] text-[#666666]">Hassle-Free Exchange</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] hover:border-[#064C32]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#064C32]/10 text-[#064C32] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#064C32]" />
              </div>
              <div className="text-left">
                <p className="font-serif font-bold text-xs sm:text-sm text-[#111111]">100% Authentic Label</p>
                <p className="text-[11px] text-[#666666]">Direct From BIYA Loom</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10" data-aos="fade-up">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#064C32]">
                Curated Wardrobe
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] mt-1">
                Shop By Category
              </h2>
            </div>
            <Link
              to="/categories"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#064C32] hover:text-[#033B27] group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-6 sm:gap-8">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id || cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group flex items-center gap-5 bg-[#F8F8F8] rounded-3xl p-5 sm:p-6 border border-[#E5E5E5] hover:border-[#064C32] hover:shadow-xl transition-all duration-300"
                data-aos="zoom-in"
                data-aos-delay={idx * 150}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300 bg-white shrink-0 flex items-center justify-center">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#064C32] to-[#033B27] flex items-center justify-center text-[#F3D477]">
                      <Shirt className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A514] bg-[#064C32]/5 px-2.5 py-0.5 rounded-full border border-[#064C32]/10">
                    Department
                  </span>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#111111] group-hover:text-[#064C32] transition mt-1.5">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#666666] line-clamp-2 mt-1 font-light">
                    {cat.description || 'Premium combed cotton apparel'}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#064C32] mt-3 group-hover:translate-x-1 transition-transform">
                    Explore Collection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="py-16 sm:py-20 bg-[#F8F8F8] border-t border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10" data-aos="fade-up">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D9A514]">
                <Sparkles className="w-4 h-4" /> Fresh Off The Loom
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] mt-1">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop?filter=new"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#064C32] hover:text-[#033B27] group"
            >
              <span>See What's New</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {showcaseProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {showcaseProducts.slice(0, 8).map((product, pIdx) => (
                <div key={product.id} data-aos="fade-up" data-aos-delay={pIdx * 100}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs max-w-xl mx-auto" data-aos="zoom-in">
              <div className="w-12 h-12 rounded-2xl bg-[#064C32]/10 text-[#064C32] flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-[#D9A514]" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111111]">
                Exclusive Collection Dropping Soon
              </h3>
              <p className="text-xs text-[#666666] mt-1.5 max-w-sm mx-auto">
                Our signature handcrafted T-Shirts & Polo T-Shirts are being cataloged. Stay tuned for new arrivals.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. SPECIAL THANKS - TRIBUTE SECTION */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-[#064C32]/5 to-white relative overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D9A514]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#064C32]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#064C32] via-[#033B27] to-[#012216] text-white p-8 sm:p-12 lg:p-14 shadow-2xl border-2 border-[#D9A514]/50 animate-royal-pulse overflow-hidden" data-aos="zoom-in" data-aos-duration="1000">
            {/* Ambient gold radial corners */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#D9A514]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#F3D477]/15 rounded-full blur-2xl pointer-events-none" />

            {/* Floating Top Crown / Sparkle Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-[#D9A514]/50 shadow-inner animate-gentle-float">
                <Crown className="w-5 h-5 text-[#F3D477]" />
                <span className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-[#F3D477]">
                  A Heartfelt Tribute
                </span>
                <Sparkles className="w-4 h-4 text-[#F3D477]" />
              </div>
            </div>

            {/* Shimmering Title */}
            <div className="text-center space-y-3 mb-8">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide uppercase animate-gold-shimmer drop-shadow-md">
                SPECIAL THANKS
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D9A514] to-transparent mx-auto rounded-full" />
            </div>

            {/* Quote Body with Heartbeat icon */}
            <div className="relative text-center max-w-2xl mx-auto">
              <Quote className="w-10 h-10 text-[#D9A514]/30 mx-auto mb-4 rotate-180" />
              
              <p className="font-serif text-base sm:text-lg lg:text-xl text-gray-100 leading-relaxed font-normal tracking-wide">
                A Heartfelt Thank You to My Beloved Brother,{' '}
                <span className="font-extrabold text-[#F3D477] underline decoration-[#D9A514]/60 underline-offset-4 tracking-wider">
                  Thangapandii
                </span>
                , for Being a Great Inspiration Behind My Business Journey. Your Constant Support, Encouragement, and Belief in Me Mean More Than Words Can Express.
              </p>

              {/* Heart pulse icon */}
              <div className="flex justify-center items-center gap-2 mt-8">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-[#D9A514]/40 animate-heart-beat shadow-lg shadow-[#064C32]">
                  <Heart className="w-6 h-6 text-[#F3D477] fill-[#F3D477]" />
                </div>
              </div>

              {/* Signature / Brand Stamp */}
              <div className="mt-6 pt-6 border-t border-white/15 inline-block">
                <p className="font-serif text-xl sm:text-2xl font-black tracking-widest text-[#F3D477] uppercase drop-shadow-sm">
                  BIYA FASHION
                </p>
                <p className="text-[11px] sm:text-xs text-gray-300 uppercase tracking-widest font-medium mt-1">
                  Wear Your Style
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE BIYA FASHION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12" data-aos="fade-up">
            <span className="text-xs font-bold uppercase tracking-widest text-[#064C32]">
              The Biya Difference
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] mt-1">
              Why Choose BIYA Fashion
            </h2>
            <p className="text-sm text-[#666666] mt-2">
              We engineer garments that merge timeless elegance with uncompromised textile durability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] hover:border-[#064C32]/40 hover:shadow-lg transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#064C32] shadow-sm mb-4 border border-[#E5E5E5]">
                <ShieldCheck className="w-6 h-6 text-[#064C32]" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#111111] uppercase tracking-wide">
                PREMIUM QUALITY
              </h3>
              <p className="text-xs text-[#666666] mt-2 leading-relaxed">
                100% bio-washed organic cotton with high color fastness and anti-pilling longevity.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] hover:border-[#064C32]/40 hover:shadow-lg transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#064C32] shadow-sm mb-4 border border-[#E5E5E5]">
                <HeartHandshake className="w-6 h-6 text-[#064C32]" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#111111] uppercase tracking-wide">
                COMFORTABLE FIT
              </h3>
              <p className="text-xs text-[#666666] mt-2 leading-relaxed">
                Ergonomically tailored patterns that allow natural breathability and unrestricted movement.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] hover:border-[#064C32]/40 hover:shadow-lg transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#064C32] shadow-sm mb-4 border border-[#E5E5E5]">
                <TrendingUp className="w-6 h-6 text-[#064C32]" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#111111] uppercase tracking-wide">
                TRENDY STYLES
              </h3>
              <p className="text-xs text-[#666666] mt-2 leading-relaxed">
                Contemporary street silhouettes, oversized aesthetics, and clean minimal European cuts.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] hover:border-[#064C32]/40 hover:shadow-lg transition-all duration-300" data-aos="fade-up" data-aos-delay="400">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#064C32] shadow-sm mb-4 border border-[#E5E5E5]">
                <Tag className="w-6 h-6 text-[#064C32]" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#111111] uppercase tracking-wide">
                AFFORDABLE PRICES
              </h3>
              <p className="text-xs text-[#666666] mt-2 leading-relaxed">
                Direct-from-loom pricing without inflated middleman markups for true accessible luxury.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PROMOTIONAL BANNER (White/light-gray background, green & gold accents) */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-[#F8F8F8] border-2 border-[#064C32]/20 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-lg" data-aos="zoom-in" data-aos-duration="800">
            {/* Subtle decorative gold badge accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9A514]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#064C32] text-white text-[11px] font-extrabold uppercase tracking-widest">
                Exclusive Season Offer
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] leading-tight">
                UP TO 35% OFF ON <span className="text-[#064C32]">CASUAL ESSENTIALS</span>
              </h2>
              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                Elevate your daily rotation with heavyweight cotton tees, polo t-shirts, and tailored casual shirts. Use code{' '}
                <strong className="text-[#064C32] font-mono font-bold bg-[#D9A514]/20 px-2 py-0.5 rounded">
                  BIYASTYLE
                </strong>{' '}
                at checkout.
              </p>

              <div className="pt-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#064C32] hover:bg-[#033B27] text-white font-bold text-xs uppercase tracking-widest shadow-md transition active:scale-95"
                >
                  <span>SHOP PROMOTION</span>
                  <ArrowRight className="w-4 h-4 text-[#F3D477]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 9. INSTAGRAM / SOCIAL SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10" data-aos="fade-up">
            <span className="text-xs font-bold uppercase tracking-widest text-[#064C32]">
              Join The Community
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] mt-1">
              #WearYourStyle on Instagram
            </h2>
            <p className="text-xs text-[#666666] mt-2">
              Tag @biyafashion on Instagram to be featured on our official showcase.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {instagramPosts.map((post, idx) => (
              <a
                key={post.id}
                href={STORE_CONFIG.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden border border-[#E5E5E5] block"
                data-aos="zoom-in"
                data-aos-delay={idx * 100}
              >
                <img
                  src={post.image}
                  alt={`Biya Fashion look ${post.id}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                  <InstagramIcon className="w-6 h-6 text-[#F3D477] mb-2" />
                  <span className="text-xs font-bold">{post.handle}</span>
                  <span className="text-[10px] text-gray-200 mt-0.5">{post.tag}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 10. NEWSLETTER SECTION */}
      <section className="py-16 bg-[#F8F8F8] border-t border-[#E5E5E5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center" data-aos="fade-up">
          <div className="w-12 h-12 rounded-2xl bg-[#064C32] text-[#F3D477] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">
            Be the First to Know
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto mt-2">
            Subscribe for early VIP access to limited drops, textile innovations, and private seasonal promotions.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing to BIYA FASHION VIP newsletter!');
            }}
            className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] placeholder-gray-400 focus:outline-none focus:border-[#064C32]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-wider shadow transition"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[10px] text-gray-400 mt-3">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
