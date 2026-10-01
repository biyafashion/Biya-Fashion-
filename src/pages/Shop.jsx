import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import ProductFilter from '../components/ProductFilter';
import { useProducts } from '../context/ProductContext';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, loading } = useProducts();

  // Filters State
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const filterParam = searchParams.get('filter') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearchQuery(searchParams.get('search') || '');
    if (searchParams.get('sort')) {
      setSortBy(searchParams.get('sort'));
    }
  }, [searchParams]);

  // Handle category change and reflect in URL
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleToggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleToggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange([0, 4000]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setInStockOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (
        selectedCategory !== 'all' &&
        prod.category?.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name?.toLowerCase().includes(q);
        const matchesCat = prod.category?.toLowerCase().includes(q);
        const matchesDesc = prod.description?.toLowerCase().includes(q);
        const matchesSku = prod.sku?.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDesc && !matchesSku) {
          return false;
        }
      }

      // Special quick filter url param (e.g. ?filter=new)
      if (filterParam === 'new' && !prod.newArrival) {
        return false;
      }

      // Price filter
      const currentPrice = prod.discountPrice || prod.price;
      if (currentPrice > priceRange[1]) {
        return false;
      }

      // Size filter
      if (selectedSizes.length > 0) {
        const hasSize = prod.sizes?.some((s) => selectedSizes.includes(s));
        if (!hasSize) return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const hasColor = prod.colors?.some((c) =>
          selectedColors.some((sc) => c.toLowerCase().includes(sc.toLowerCase()))
        );
        if (!hasColor) return false;
      }

      // Stock filter
      if (inStockOnly && prod.stock <= 0) {
        return false;
      }

      return true;
    });
  }, [
    products,
    selectedCategory,
    searchQuery,
    filterParam,
    priceRange,
    selectedSizes,
    selectedColors,
    inStockOnly,
  ]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return list.sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
        );
      case 'price-high':
        return list.sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
        );
      case 'popular':
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'featured':
        return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      case 'newest':
      default:
        return list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6" data-aos="fade-down">
          <div className="flex items-center gap-2 text-xs text-[#666666] mb-2 uppercase tracking-wider">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#064C32] font-bold">Shop</span>
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="text-[#111111] font-semibold">{selectedCategory}</span>
              </>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#111111]">
            {selectedCategory === 'all' ? 'All Fashion Collection' : selectedCategory}
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Discover {sortedProducts.length} premium crafted garments designed for your everyday wardrobe.
          </p>
        </div>

        {/* Search query tag notice */}
        {searchQuery && (
          <div className="mb-4 inline-flex items-center gap-2 bg-[#F8F8F8] border border-[#E5E5E5] px-3 py-1.5 rounded-lg text-xs" data-aos="fade-in">
            <span>
              Search query: <strong className="text-[#064C32]">"{searchQuery}"</strong>
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('search');
                setSearchParams(newParams);
              }}
              className="text-gray-400 hover:text-black ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Toolbar: Filter Toggle on Mobile, Count, Sorting Dropdown */}
        <div className="flex items-center justify-between py-4 mb-6 border-y border-[#E5E5E5] gap-4" data-aos="fade-up">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E5E5] text-xs font-bold uppercase tracking-wider text-[#111111] hover:bg-[#F8F8F8] transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#064C32]" />
            <span>Filters</span>
          </button>

          <div className="hidden lg:block text-xs font-semibold text-[#666666] uppercase tracking-wider">
            Showing <strong className="text-[#111111]">{sortedProducts.length}</strong> items
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#064C32] hidden sm:block" />
            <label htmlFor="sortSelect" className="text-xs font-bold uppercase tracking-wider text-[#666666] hidden sm:block">
              Sort:
            </label>
            <select
              id="sortSelect"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#064C32] cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="popular">Popular & Highest Rated</option>
              <option value="featured">Featured Items</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div data-aos="fade-right">
            <ProductFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              priceRange={priceRange}
              onChangePriceRange={setPriceRange}
              selectedSizes={selectedSizes}
              onToggleSize={handleToggleSize}
              selectedColors={selectedColors}
              onToggleColor={handleToggleColor}
              inStockOnly={inStockOnly}
              onToggleInStock={setInStockOnly}
              onResetFilters={handleResetFilters}
              isOpen={isMobileFilterOpen}
              onClose={() => setIsMobileFilterOpen(false)}
            />
          </div>

          {/* Products Column */}
          <div className="flex-1 min-w-0" data-aos="fade-up" data-aos-delay="150">
            <ProductGrid
              products={sortedProducts}
              loading={loading}
              columns={3}
              emptyTitle="No Matching Products Found"
              emptyDescription="No clothing items meet your current combination of filters. Try clearing some filters or searching for something else."
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
