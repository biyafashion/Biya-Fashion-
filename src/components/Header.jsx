import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';
import BiyaLogo from './BiyaLogo';
import SearchBar from './SearchBar';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import STORE_CONFIG from '../config/storeConfig';

const NAV_LINKS = [
  { name: 'HOME', path: '/' },
  { name: 'SHOP', path: '/shop' },
  { name: 'CATEGORIES', path: '/categories' },
  { name: 'NEW ARRIVALS', path: '/shop?filter=new' },
  { name: 'ABOUT', path: '/about' },
  { name: 'CONTACT', path: '/contact' },
];

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#033B27] text-white text-[11px] sm:text-xs py-2 px-4 border-b border-[#064C32]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-gray-300">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#D9A514]" />
              WhatsApp Support: {STORE_CONFIG.formattedWhatsApp}
            </span>
          </div>

          <div className="mx-auto md:mx-0 text-center font-medium tracking-wide">
            <span className="text-[#F3D477] font-bold">PREMIUM LUXURY APPAREL</span>
            <span className="mx-2 text-white/50">•</span>
            <span>Free Shipping Above ₹{STORE_CONFIG.freeDeliveryThreshold}</span>
            <span className="mx-2 text-white/50">•</span>
            <span className="text-white/90">Wear Your Style</span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs">
            <Link
              to="/admin/login"
              className="flex items-center gap-1 text-gray-300 hover:text-[#F3D477] transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D9A514]" />
              <span>{isAuthenticated ? 'Admin Portal' : 'Admin'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Brand Logo */}
            <div className="flex-shrink-0">
              <BiyaLogo />
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.path.split('?')[0]);

                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={`relative text-xs font-bold tracking-widest uppercase transition-colors py-2 group ${
                      isActive ? 'text-[#064C32]' : 'text-[#111111] hover:text-[#064C32]'
                    }`}
                  >
                    <span>{link.name}</span>
                    {/* Subtle Gold Underline */}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[2.5px] bg-[#D9A514] rounded-full transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </NavLink>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-[#111111] hover:text-[#064C32] hover:bg-gray-100 rounded-full transition"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="relative p-2.5 text-[#111111] hover:text-[#064C32] hover:bg-gray-100 rounded-full transition"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#D9A514] text-[#111111] font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2.5 text-[#111111] hover:text-[#064C32] hover:bg-gray-100 rounded-full transition"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#064C32] text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-xs animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account / Admin Link */}
              <Link
                to={isAuthenticated ? '/admin' : '/admin/login'}
                className="hidden sm:inline-flex p-2.5 text-[#111111] hover:text-[#064C32] hover:bg-gray-100 rounded-full transition"
                title={isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#111111] hover:text-[#064C32] rounded-lg transition"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Bar Modal */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slideRight">
            {/* Mobile Header */}
            <div>
              <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between">
                <BiyaLogo showTagline={false} />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="py-4 px-3 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold tracking-wider text-[#111111] hover:bg-[#F8F8F8] hover:text-[#064C32] transition"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </Link>
                ))}
              </div>

              <div className="px-5 pt-3 border-t border-[#E5E5E5]">
                <div className="text-xs font-bold uppercase tracking-wider text-[#666666] mb-2">
                  Featured Categories
                </div>
                <div className="space-y-1">
                  {['T-Shirts', 'Casual Wear', 'Shirts', 'Polo T-Shirts', 'Hoodies', 'Jeans'].map((cat) => (
                    <Link
                      key={cat}
                      to={`/shop?category=${encodeURIComponent(cat)}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-1.5 text-xs text-gray-600 hover:text-[#064C32] hover:bg-[#F8F8F8] rounded-lg transition"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Footer Area */}
            <div className="p-5 border-t border-[#E5E5E5] bg-[#F8F8F8] space-y-3">
              <Link
                to={isAuthenticated ? '/admin' : '/admin/login'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-[#064C32] shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#D9A514]" />
                <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
              </Link>
              <div className="text-center text-[10px] text-[#666666]">
                © 2026 BIYA FASHION • WEAR YOUR STYLE
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
