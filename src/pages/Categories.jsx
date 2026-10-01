import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shirt } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const Categories = () => {
  const { categories, products } = useProducts();

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#064C32]/5 text-[#064C32] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A514]" />
            Collection Index
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111]">
            Shop By Category
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-2 leading-relaxed">
            Explore our signature combed cotton T-Shirts and refined Polo T-Shirts collection crafted for luxury and everyday comfort.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6 sm:gap-8">
          {categories.map((cat) => {
            const countInCat = products.filter(
              (p) => p.category?.toLowerCase() === cat.name?.toLowerCase()
            ).length;

            return (
              <Link
                key={cat.id || cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-3xl overflow-hidden border border-[#E5E5E5] bg-[#F8F8F8] shadow-sm hover:shadow-xl hover:border-[#064C32]/40 transition-all duration-300 flex flex-col justify-end min-h-[380px]"
              >
                {/* Background Image with Zoom */}
                <div className="absolute inset-0 z-0">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#064C32] via-[#033B27] to-[#111111] flex items-center justify-center">
                      <Shirt className="w-24 h-24 text-[#D9A514]/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 p-6 text-white space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F3D477] bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#D9A514]/30">
                    {countInCat || cat.itemCount || 10} Items Available
                  </span>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-[#F3D477] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed font-light">
                    {cat.description}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#F3D477] transition">
                    <span>Explore Department</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
