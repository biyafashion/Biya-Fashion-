import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Share2,
  PackageCheck,
  Minus,
  Plus,
  Ruler,
} from 'lucide-react';
import ProductGallery from '../components/ProductGallery';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import STORE_CONFIG from '../config/storeConfig';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  const product = useMemo(() => {
    return products.find((p) => String(p.id) === String(id));
  }, [products, id]);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isCopied, setIsCopied] = useState(false);

  // Set default size and color when product loads
  useEffect(() => {
    if (product) {
      if (product.sizes?.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors?.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <EmptyState
          title="Product Not Found"
          description="The garment you are looking for may have been retired or does not exist."
          actionLabel="Return to Shop"
          actionTo="/shop"
        />
      </div>
    );
  }

  const originalPrice = Number(product.price);
  const currentPrice = product.discountPrice ? Number(product.discountPrice) : originalPrice;
  const hasDiscount = product.discountPrice && product.discountPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const inWishlist = isInWishlist(product.id);

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && String(p.id) !== String(product.id))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('This product is currently out of stock.');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    openCart();
  };

  const handleBuyNow = () => {
    if (product.stock === 0) {
      toast.error('This product is currently out of stock.');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    toast.success('Product link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#666666] mb-8 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#064C32]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#064C32]">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#064C32]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Grid: Left Gallery + Right Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images || []} productName={product.name} />
          </div>

          {/* Details & Actions Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-[#666666] uppercase tracking-wider mb-2">
                <span className="font-bold text-[#064C32]">{product.category}</span>
                <span>SKU: {product.sku || 'BF-2026'}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111111] leading-snug">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  {product.rating || '4.8'} ({product.reviewsCount || 48} reviews)
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-[#064C32] font-semibold flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5 text-[#064C32]" />
                  {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                </span>
              </div>

              {/* Price Block */}
              <div className="mt-4 p-4 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#064C32]">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-[#666666] line-through">
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
                <span className="ml-auto text-[11px] text-[#666666]">Inclusive of all taxes</span>
              </div>
            </div>

            {/* Description Short */}
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                  <span>Select Size: <strong className="text-[#064C32]">{selectedSize}</strong></span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('sizeGuide')}
                    className="flex items-center gap-1 text-[#064C32] hover:text-[#033B27] lowercase font-medium hover:underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>size chart</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[46px] h-11 px-3 rounded-xl text-xs font-bold tracking-wider transition ${
                        selectedSize === size
                          ? 'bg-[#064C32] text-[#F3D477] border-2 border-[#064C32] shadow-sm'
                          : 'bg-white text-gray-800 border border-[#E5E5E5] hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                  Select Color: <strong className="text-[#064C32]">{selectedColor}</strong>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        selectedColor === color
                          ? 'bg-[#064C32] text-white border-[#064C32]'
                          : 'bg-[#F8F8F8] text-gray-700 border-[#E5E5E5] hover:bg-gray-100'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity modifier */}
                <div className="flex items-center border border-[#E5E5E5] rounded-xl overflow-hidden bg-[#F8F8F8] h-12">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 h-full hover:bg-gray-200 text-gray-700 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm text-[#111111]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    className="px-3.5 h-full hover:bg-gray-200 text-gray-700 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 h-12 rounded-xl bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#064C32]/20 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                {/* Wishlist toggle */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition shrink-0 ${
                    inWishlist
                      ? 'bg-[#064C32] text-[#F3D477] border-[#064C32]'
                      : 'border-[#E5E5E5] text-gray-700 hover:border-[#064C32]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full h-12 rounded-xl bg-[#D9A514] hover:bg-[#c29311] text-[#111111] text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md active:scale-95 transition disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>

            {/* Quick Delivery & Security Features */}
            <div className="pt-4 border-t border-[#E5E5E5] space-y-2.5 text-xs text-[#666666]">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-[#064C32] shrink-0" />
                <span>Free delivery on orders over ₹{STORE_CONFIG.freeDeliveryThreshold}</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4 text-[#064C32] shrink-0" />
                <span>Easy {STORE_CONFIG.returnPolicyDays} days return & replacement</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#064C32] shrink-0" />
                <span>Cash on Delivery & WhatsApp Ordering supported</span>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-2 text-xs text-[#064C32] hover:underline pt-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isCopied ? 'Link Copied!' : 'Share with friends'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16 pt-8 border-t border-[#E5E5E5]">
          <div className="flex border-b border-[#E5E5E5] space-x-6 sm:space-x-8 overflow-x-auto scrollbar-none">
            {[
              { id: 'description', label: 'Description & Fabric' },
              { id: 'sizeGuide', label: 'Size Guide' },
              { id: 'shipping', label: 'Shipping & Delivery' },
              { id: 'returns', label: 'Returns & Exchanges' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#064C32] text-[#064C32]'
                    : 'border-transparent text-[#666666] hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8 max-w-3xl">
            {activeTab === 'description' && (
              <div className="space-y-4 text-xs sm:text-sm text-[#666666] leading-relaxed">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  <div className="p-3.5 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5]">
                    <span className="font-bold text-[#111111] block mb-1">Fabric Composition</span>
                    <span>{product.details?.fabric || '100% Super-Combed Cotton (220 GSM)'}</span>
                  </div>
                  <div className="p-3.5 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5]">
                    <span className="font-bold text-[#111111] block mb-1">Fit Silhouette</span>
                    <span>{product.details?.fit || 'Tailored Regular Comfort Fit'}</span>
                  </div>
                  <div className="p-3.5 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5]">
                    <span className="font-bold text-[#111111] block mb-1">Care Guidelines</span>
                    <span>{product.details?.care || 'Machine wash cold inside out. Gentle cycle.'}</span>
                  </div>
                  <div className="p-3.5 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5]">
                    <span className="font-bold text-[#111111] block mb-1">Origin</span>
                    <span>Crafted with Pride in India</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sizeGuide' && (
              <div className="space-y-4">
                <p className="text-xs text-[#666666]">
                  All measurements are in inches. Fits true to standard Indian and international sizing.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-[#E5E5E5] rounded-xl overflow-hidden">
                    <thead className="bg-[#F8F8F8] font-bold text-[#111111] uppercase tracking-wider">
                      <tr>
                        <th className="p-3 border-b border-[#E5E5E5]">Size</th>
                        <th className="p-3 border-b border-[#E5E5E5]">Chest (in)</th>
                        <th className="p-3 border-b border-[#E5E5E5]">Length (in)</th>
                        <th className="p-3 border-b border-[#E5E5E5]">Shoulder (in)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      <tr>
                        <td className="p-3 font-bold text-[#064C32]">S</td>
                        <td className="p-3">38"</td>
                        <td className="p-3">27"</td>
                        <td className="p-3">17.5"</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-[#064C32]">M</td>
                        <td className="p-3">40"</td>
                        <td className="p-3">28"</td>
                        <td className="p-3">18.5"</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-[#064C32]">L</td>
                        <td className="p-3">42"</td>
                        <td className="p-3">29"</td>
                        <td className="p-3">19.5"</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-[#064C32]">XL</td>
                        <td className="p-3">44"</td>
                        <td className="p-3">30"</td>
                        <td className="p-3">20.5"</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-[#064C32]">XXL</td>
                        <td className="p-3">46"</td>
                        <td className="p-3">31"</td>
                        <td className="p-3">21.5"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 text-xs sm:text-sm text-[#666666] leading-relaxed">
                <p>
                  <strong>Dispatch:</strong> Orders placed before 3:00 PM are dispatched on the same business day from our fulfillment hub.
                </p>
                <p>
                  <strong>Delivery Timeline:</strong> Standard metro deliveries take 2–4 business days. Regional and rest of India takes 4–6 business days.
                </p>
                <p>
                  <strong>Shipping Costs:</strong> Orders of ₹{STORE_CONFIG.freeDeliveryThreshold} or higher enjoy <strong className="text-[#064C32]">FREE SHIPPING</strong> across India. For orders below ₹{STORE_CONFIG.freeDeliveryThreshold}, a flat fee of ₹{STORE_CONFIG.standardDeliveryCharge} applies.
                </p>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="space-y-3 text-xs sm:text-sm text-[#666666] leading-relaxed">
                <p>
                  We offer a generous <strong>{STORE_CONFIG.returnPolicyDays}-Day Hassle-Free Return & Exchange Window</strong> for all unworn garments with original tags attached.
                </p>
                <p>
                  Doorstep reverse pickup will be scheduled upon your return request via our WhatsApp support or contact page.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-bold text-[#111111]">
                Complete Your Look
              </h2>
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-bold uppercase tracking-wider text-[#064C32] hover:underline"
              >
                More in {product.category} →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
