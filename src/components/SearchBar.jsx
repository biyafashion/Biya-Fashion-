import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { products } = useProducts();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.sku?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleProductSelect = (id) => {
    navigate(`/product/${id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E5E5E5] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center px-5 py-4 border-b border-[#E5E5E5]">
          <Search className="w-5 h-5 text-[#064C32] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search premium T-shirts, casual wear, shirts, hoodies..."
            className="w-full text-base sm:text-lg text-[#111111] placeholder-[#666666] focus:outline-none bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-700 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-[#064C32] rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Live Results or Suggestions */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {query.trim() ? (
            filteredProducts.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#666666] px-2 mb-2">
                  Matching Products ({filteredProducts.length})
                </div>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8F8F8] cursor-pointer group transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg border border-[#E5E5E5]"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-[#111111] group-hover:text-[#064C32] transition">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[#666666]">{product.category}</span>
                          <span className="text-xs font-bold text-[#064C32]">
                            ₹{product.discountPrice || product.price}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#D9A514] transform group-hover:translate-x-1 transition" />
                  </div>
                ))}
                <button
                  onClick={handleSearchSubmit}
                  className="w-full text-center py-2.5 mt-2 text-xs font-bold uppercase tracking-wider text-[#064C32] hover:text-[#033B27] bg-[#064C32]/5 hover:bg-[#064C32]/10 rounded-lg transition"
                >
                  View all results for "{query}"
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No products found matching "{query}"</p>
                <p className="text-xs text-[#666666] mt-1">Try checking for spelling or searching with broader keywords.</p>
              </div>
            )
          ) : (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#666666] px-2 mb-3">
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2 px-2 pb-2">
                {['Black T-Shirt', 'Green Hoodie', 'Cotton Shirt', 'Polo T-Shirts', 'Oversized', 'Jeans'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      navigate(`/shop?search=${encodeURIComponent(term)}`);
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs font-medium bg-[#F8F8F8] hover:bg-[#064C32] hover:text-white rounded-full text-[#111111] border border-[#E5E5E5] transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
