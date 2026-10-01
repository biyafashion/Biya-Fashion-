import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Check, Edit2, Trash2 } from 'lucide-react';
import WishlistButton from './WishlistButton';
import ConfirmModal from './ConfirmModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { deleteProduct } = useProducts();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!product) return null;

  const originalPrice = Number(product.price);
  const currentPrice = product.discountPrice ? Number(product.discountPrice) : originalPrice;
  const hasDiscount = product.discountPrice && product.discountPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600';
  const secondaryImage = product.images?.[1] || primaryImage;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0] || 'Standard', 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#064C32]/10 hover:border-[#064C32]/30">
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F8F8F8]">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600';
            }}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Subtle Hover Secondary Image Crossfade if available */}
          {secondaryImage !== primaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = primaryImage;
              }}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.bestSeller && (
            <span className="bg-[#064C32] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
              Bestseller
            </span>
          )}
          {product.newArrival && (
            <span className="bg-[#D9A514] text-[#111111] text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
              {discountPercent}% Off
            </span>
          )}
        </div>

        {/* Action Controls & Wishlist */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          {isAuthenticated && (
            <div className="flex items-center gap-0.5 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-amber-300">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/admin/products/edit/${product.id}`);
                }}
                className="p-1 rounded-lg text-gray-700 hover:text-[#064C32] hover:bg-gray-100 transition"
                title="Edit Product"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#064C32]" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
                className="p-1 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition"
                title="Delete Product"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
              </button>
            </div>
          )}
          <WishlistButton product={product} />
        </div>

        {/* Quick Add Overlay on desktop hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all duration-200 ${
              isAdded
                ? 'bg-[#033B27] text-[#F3D477]'
                : product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#064C32] text-white hover:bg-[#033B27] active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" /> Added to Bag
              </>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#666666] mb-1.5">
            <span className="uppercase tracking-wider font-medium text-[11px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-semibold text-gray-700 text-xs">
                {product.rating || '4.8'}
              </span>
            </div>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-[#064C32] transition">
            <h3 className="font-semibold text-[#111111] text-sm sm:text-base leading-snug line-clamp-1 hover:text-[#064C32] transition">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Mobile Add Button */}
        <div className="mt-3 pt-3 border-t border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-[#064C32]">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#666666] line-through font-normal">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Mobile direct Add to Cart icon button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className="sm:hidden p-2 rounded-lg bg-[#064C32] text-white hover:bg-[#033B27] active:scale-95 transition"
            aria-label="Add to cart"
          >
            {isAdded ? <Check className="w-4 h-4 text-[#F3D477]" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Admin Quick Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Product"
        message={`Are you sure you want to delete "${product?.name}"? It will be removed permanently from your store catalog and Firebase Firestore.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={() => {
          deleteProduct(product.id);
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default ProductCard;
