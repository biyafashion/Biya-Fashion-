import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'];
const COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Dark Green', hex: '#064C32' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Heather Grey', hex: '#9ca3af' },
  { name: 'Olive', hex: '#556b2f' },
];

const ProductFilter = ({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  priceRange = [0, 5000],
  maxPriceLimit = 5000,
  onChangePriceRange,
  selectedSizes = [],
  onToggleSize,
  selectedColors = [],
  onToggleColor,
  inStockOnly = false,
  onToggleInStock,
  onResetFilters,
  isOpen = false,
  onClose,
}) => {
  const content = (
    <div className="space-y-6">
      {/* Header for Filter Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#064C32]" />
          <span className="font-serif font-bold text-[#111111] uppercase tracking-wider text-sm">
            Filters
          </span>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs text-[#064C32] hover:text-[#033B27] font-semibold hover:underline"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3">Categories</h4>
        <div className="flex flex-col space-y-1">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-[#064C32] text-white font-semibold'
                : 'text-[#666666] hover:bg-[#F8F8F8] hover:text-[#111111]'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
              selectedCategory.toLowerCase() === cat.slug?.toLowerCase();
            return (
              <button
                key={cat.id || cat.name}
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#064C32] text-white font-semibold'
                    : 'text-[#666666] hover:bg-[#F8F8F8] hover:text-[#111111]'
                }`}
              >
                <span>{cat.name}</span>
                {cat.itemCount > 0 && (
                  <span className={`text-xs ${isSelected ? 'text-[#F3D477]' : 'text-gray-400'}`}>
                    {cat.itemCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-[#E5E5E5]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Max Price</h4>
          <span className="text-xs font-bold text-[#064C32]">₹{priceRange[1]}</span>
        </div>
        <input
          type="range"
          min={500}
          max={maxPriceLimit}
          step={100}
          value={priceRange[1]}
          onChange={(e) => onChangePriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-[#064C32] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-[#666666] mt-1.5">
          <span>₹500</span>
          <span>₹{maxPriceLimit}</span>
        </div>
      </div>

      {/* Size Filter */}
      <div className="pt-4 border-t border-[#E5E5E5]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3">Sizes</h4>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => onToggleSize(size)}
                className={`py-2 text-xs font-semibold rounded-lg border transition ${
                  isSelected
                    ? 'bg-[#064C32] text-[#F3D477] border-[#064C32] shadow-sm'
                    : 'bg-white text-gray-700 border-[#E5E5E5] hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div className="pt-4 border-t border-[#E5E5E5]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3">Colors</h4>
        <div className="flex flex-wrap gap-2.5">
          {COLORS.map((col) => {
            const isSelected = selectedColors.includes(col.name);
            return (
              <button
                key={col.name}
                type="button"
                onClick={() => onToggleColor(col.name)}
                title={col.name}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isSelected ? 'ring-2 ring-offset-2 ring-[#064C32] scale-110' : 'hover:scale-105'
                } ${col.border ? 'border border-[#E5E5E5]' : ''}`}
                style={{ backgroundColor: col.hex }}
              >
                {isSelected && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      col.name === 'White' ? 'bg-[#111111]' : 'bg-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Filter */}
      <div className="pt-4 border-t border-[#E5E5E5]">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-4 h-4 rounded text-[#064C32] focus:ring-[#064C32] accent-[#064C32]"
          />
          <span className="text-xs font-medium text-[#111111]">In Stock Items Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-sm sticky top-24 self-start">
        {content}
      </aside>

      {/* Mobile Filter Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] mb-4">
                <span className="font-serif font-bold text-lg text-[#111111]">Refine Products</span>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>
            <div className="pt-6 mt-6 border-t border-[#E5E5E5]">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-[#064C32] text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilter;
