import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, Shirt, Compass } from 'lucide-react';
import BiyaLogo from '../components/BiyaLogo';

const About = () => {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Brand Mission Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex justify-center mb-4">
            <BiyaLogo size="large" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#064C32] bg-[#064C32]/5 px-3 py-1 rounded-full">
            The Biya Fashion Story
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111]">
            Elevating Everyday Wear into Modern Luxury
          </h1>
          <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
            Founded with a vision to redefine textile excellence, <strong>BIYA FASHION</strong> creates wardrobe foundations that merge regal elegance with pure, unrestricted comfort. Our motto is simple: <em>Wear Your Style</em>.
          </p>
        </div>

        {/* Narrative Section with Editorial Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5 text-sm sm:text-base text-[#666666] leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">
              Rooted in Textile Heritage, Crafted for the Modern World
            </h2>
            <p>
              Born in Surat, the textile heartland of India, BIYA FASHION was established to solve an everyday dilemma: why should comfortable clothing compromise on tailoring and luxury?
            </p>
            <p>
              Every garment in our catalog begins at the fiber level. We source long-staple organic cotton, undergo rigorous bio-washing to eliminate pilling, and inspect every seam to guarantee an uncompromised drape.
            </p>
            <p>
              The <strong>Crown</strong> in our insignia represents our commitment to regal quality; the <strong>Hanger</strong> signifies our dedication to wearable daily utility.
            </p>

            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#064C32] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#033B27] transition"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="w-4 h-4 text-[#D9A514]" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-[#E5E5E5] bg-[#F8F8F8]">
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80"
              alt="Biya Fashion craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Brand Values 4 Pillars */}
        <div className="pt-8 border-t border-[#E5E5E5]">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#064C32]">Our Core Pillars</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] mt-1">
              What Defines Biya Fashion
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#F8F8F8] border border-[#E5E5E5] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#064C32] text-[#F3D477] flex items-center justify-center">
                <Shirt className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#111111]">100% Super-Combed Cotton</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                We select premium long-staple cotton yarns engineered to be exceptionally soft, breathable in high temperatures, and resistant to shrinking.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8F8F8] border border-[#E5E5E5] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#064C32] text-[#F3D477] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#111111]">Precision Craftsmanship</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Double-needle stitching, anti-sag reinforced ribbed collars, and custom metallic hardware make every Biya garment built to last.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8F8F8] border border-[#E5E5E5] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#064C32] text-[#F3D477] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#111111]">Wear Your Style</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Fashion should empower personal confidence. From casual oversized street aesthetics to clean tailored formal essentials, style is your signature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
