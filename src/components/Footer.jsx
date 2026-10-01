import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon, WhatsAppIcon } from './SocialIcons';
import BiyaLogo from './BiyaLogo';
import STORE_CONFIG from '../config/storeConfig';

const Footer = () => {
  return (
    <footer className="bg-[#033B27] text-white border-t border-[#064C32]">
      {/* Brand Value Pillars */}
      <div className="border-b border-[#064C32]/60 bg-[#022c1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#064C32] flex items-center justify-center text-[#F3D477] shrink-0 border border-[#D9A514]/30">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Free Shipping</h4>
                <p className="text-[11px] text-gray-300 mt-0.5">On orders above ₹{STORE_CONFIG.freeDeliveryThreshold}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#064C32] flex items-center justify-center text-[#F3D477] shrink-0 border border-[#D9A514]/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">100% Cotton</h4>
                <p className="text-[11px] text-gray-300 mt-0.5">Combed luxury organic weave</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#064C32] flex items-center justify-center text-[#F3D477] shrink-0 border border-[#D9A514]/30">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">{STORE_CONFIG.returnPolicyDays} Days Returns</h4>
                <p className="text-[11px] text-gray-300 mt-0.5">Hassle-free exchange policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#064C32] flex items-center justify-center text-[#F3D477] shrink-0 border border-[#D9A514]/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Wear Your Style</h4>
                <p className="text-[11px] text-gray-300 mt-0.5">Original craftsmanship</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BiyaLogo variant="light" size="large" />
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-sm mt-3">
              BIYA FASHION brings you the apex of modern everyday luxury. Designed for effortless elegance, uncompromised comfort, and durable textile perfection.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href={STORE_CONFIG.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#064C32] hover:bg-[#D9A514] hover:text-[#111111] text-[#F3D477] flex items-center justify-center transition border border-[#D9A514]/20"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={STORE_CONFIG.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#064C32] hover:bg-[#D9A514] hover:text-[#111111] text-[#F3D477] flex items-center justify-center transition border border-[#D9A514]/20"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={STORE_CONFIG.socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#064C32] hover:bg-[#D9A514] hover:text-[#111111] text-[#F3D477] flex items-center justify-center transition border border-[#D9A514]/20"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href={STORE_CONFIG.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#064C32] hover:bg-[#D9A514] hover:text-[#111111] text-[#F3D477] flex items-center justify-center transition border border-[#D9A514]/20"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-[#F3D477]">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Biya Fashion
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition">
                  View Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-[#F3D477]">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link to="/shop?category=T-Shirts" className="hover:text-white transition">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Polo%20T-Shirts" className="hover:text-white transition">
                  Polo T-Shirts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-[#F3D477]">
              Store Information
            </h4>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D9A514] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{STORE_CONFIG.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D9A514] shrink-0" />
                <span>{STORE_CONFIG.supportPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D9A514] shrink-0" />
                <span>{STORE_CONFIG.supportEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#064C32] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Biya Fashion. All Rights Reserved. Wear Your Style.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <Link to="/about" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-white transition">
              Terms & Conditions
            </Link>
            <Link to="/admin/login" className="text-[#D9A514] hover:underline">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
