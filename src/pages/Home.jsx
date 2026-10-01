import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  TrendingUp,
  Tag,
  Star,
  CheckCircle2,
  Mail,
  Shirt,
  Heart,
  Crown,
  Quote,
} from 'lucide-react';
import { InstagramIcon } from '../components/SocialIcons';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import STORE_CONFIG from '../config/storeConfig';

const Home = () => {
  const { categories, newArrivals } = useProducts();

  const reviews = [
    {
      name: 'Aditya Kashyap',
      rating: 5,
      date: '2 days ago',
      title: 'Remarkable fabric & fit',
      comment:
        'The Heavyweight Green T-Shirt is phenomenal. The 240 GSM cotton feels heavy yet super soft and breathable. Easily rivals international luxury brands.',
      verified: true,
      product: 'Oversized Green T-Shirt',
    },
    {
      name: 'Sneha Kulkarni',
      rating: 5,
      date: '1 week ago',
      title: 'Pristine white perfection',
      comment:
        'Finding a non-see-through white tee is rare. Biya Fashion nailed the thickness, neckline, and tailoring. Washed it 3 times already—no shrinkage!',
      verified: true,
      product: 'Premium White T-Shirt',
    },
    {
      name: 'Vikramaditya Rao',
      rating: 5,
      date: '2 weeks ago',
      title: 'Unmatched comfort for casual wear',
      comment:
        'Ordered both the Classic Black T-Shirt and the Hoodie. The gold accents and subtle branding give a distinct luxury vibe. Delivery was fast too!',
      verified: true,
      product: 'Classic Hoodie',
    },
  ];

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
      {/* 1. HERO SECTION (White Background, Clean Editorial Design) */}
      <section className="relative overflow-hidden bg-white border-b border-[#E5E5E5] pt-8 pb-16 lg:py-24">
        {/* Subtle decorative gold-green glow background element */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#064C32]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#D9A514]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Text Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#064C32]/5 border border-[#064C32]/20">
                <Sparkles className="w-4 h-4 text-[#D9A514]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#064C32]">
                  New Season Collection 2026
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] leading-[1.1] tracking-tight">
                  BIYA <span className="text-[#064C32]">FASHION</span>
                </h1>
                <p className="font-serif italic text-2xl sm:text-3xl text-[#D9A514] font-medium tracking-wide">
                  WEAR YOUR STYLE
                </p>
              </div>

              <p className="text-base sm:text-lg text-[#666666] leading-relaxed max-w-xl font-normal">
                Premium Fashion. Everyday Comfort. Crafted from pure combed cotton, tailored silhouettes, and understated luxury detailing designed to endure.
              </p>

              {/* Call to Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-4 sm:items-center">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#064C32] hover:bg-[#033B27] text-white text-xs sm:text-sm font-bold uppercase tracking-widest shadow-xl shadow-[#064C32]/20 hover:shadow-2xl transition-all duration-300 active:scale-95 group"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-4 h-4 text-[#F3D477] transform group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/categories"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white hover:bg-[#F8F8F8] text-[#064C32] border-2 border-[#064C32] text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 active:scale-95"
                >
                  <span>EXPLORE COLLECTION</span>
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-[#E5E5E5] grid grid-cols-3 gap-4">
                <div>
                  <p className="font-serif font-black text-xl sm:text-2xl text-[#064C32]">100%</p>
                  <p className="text-xs text-[#666666] uppercase tracking-wider font-semibold">Combed Cotton</p>
                </div>
                <div>
                  <p className="font-serif font-black text-xl sm:text-2xl text-[#064C32]">₹0</p>
                  <p className="text-xs text-[#666666] uppercase tracking-wider font-semibold">Free Delivery Above ₹999</p>
                </div>
                <div>
                  <p className="font-serif font-black text-xl sm:text-2xl text-[#064C32]">4.9★</p>
                  <p className="text-xs text-[#666666] uppercase tracking-wider font-semibold">Customer Loved</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Editorial Layout */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Photo */}
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#F8F8F8] relative">
                  <img
                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85"
                    alt="Biya Fashion Model - Wear Your Style"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Floating Floating Luxury Badge 1: 100% Combed Cotton */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-[#E5E5E5] flex items-center gap-3 backdrop-blur-md animate-bounce-slow">
                  <div className="w-12 h-12 rounded-xl bg-[#064C32] text-[#F3D477] flex items-center justify-center shrink-0">
                    <Shirt className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111111]">Artisan Tailored</p>
                    <p className="text-[11px] text-[#666666]">Original Textile Heritage</p>
                  </div>
                </div>

                {/* Floating Luxury Badge 2: Crown Emblem */}
                <div className="absolute -top-4 -right-4 bg-white/95 p-3.5 rounded-2xl shadow-xl border border-[#D9A514]/40 flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#D9A514] animate-ping" />
                  <span className="text-xs font-bold tracking-wider text-[#064C32] uppercase">
                    Authentic Biya Label
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
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
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group flex items-center gap-5 bg-[#F8F8F8] rounded-3xl p-5 sm:p-6 border border-[#E5E5E5] hover:border-[#064C32] hover:shadow-xl transition-all duration-300"
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
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
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

          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs max-w-xl mx-auto">
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
          <div className="relative rounded-3xl bg-gradient-to-br from-[#064C32] via-[#033B27] to-[#012216] text-white p-8 sm:p-12 lg:p-14 shadow-2xl border-2 border-[#D9A514]/50 animate-royal-pulse overflow-hidden">
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
          <div className="text-center max-w-2xl mx-auto mb-12">
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
            <div className="p-6 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] hover:border-[#064C32]/40 hover:shadow-lg transition-all duration-300">
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
            <div className="p-6 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] hover:border-[#064C32]/40 hover:shadow-lg transition-all duration-300">
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
            <div className="p-6 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] hover:border-[#064C32]/40 hover:shadow-lg transition-all duration-300">
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
            <div className="p-6 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] hover:border-[#064C32]/40 hover:shadow-lg transition-all duration-300">
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
          <div className="relative rounded-3xl bg-[#F8F8F8] border-2 border-[#064C32]/20 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-lg">
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

      {/* 8. CUSTOMER REVIEWS */}
      <section className="py-16 sm:py-20 bg-[#F8F8F8] border-t border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#064C32]">
              Real Feedback
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] mt-1">
              What Our Customers Say
            </h2>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="ml-2 text-xs font-bold text-gray-700">4.9 / 5 Overall Satisfaction</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400">{rev.date}</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#111111] mb-2">
                    "{rev.title}"
                  </h4>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#111111]">{rev.name}</p>
                    <p className="text-[10px] text-[#666666] mt-0.5">{rev.product}</p>
                  </div>
                  {rev.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#064C32] bg-[#064C32]/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-[#064C32]" /> Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. INSTAGRAM / SOCIAL SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
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
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href={STORE_CONFIG.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden border border-[#E5E5E5] block"
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
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
