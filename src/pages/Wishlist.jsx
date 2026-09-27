import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/EmptyState';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();

  const handleMoveToBag = (product) => {
    addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0] || 'Standard', 1);
    removeFromWishlist(product.id);
    openCart();
  };

  if (wishlist.length === 0) {
    return (
      <div className="bg-white min-h-[70vh] flex items-center justify-center py-12">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save your favorite Biya Fashion designs here to review or order later."
          actionLabel="Discover Collection"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E5E5] mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#111111]">
              My Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              {wishlist.length} saved item{wishlist.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={clearWishlist}
            className="text-xs text-red-600 hover:text-red-700 font-semibold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto hover:underline"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Wishlist</span>
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => {
            const originalPrice = Number(product.price);
            const currentPrice = product.discountPrice ? Number(product.discountPrice) : originalPrice;
            const hasDiscount = product.discountPrice && product.discountPrice < originalPrice;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-[#064C32]/30 transition"
              >
                <div className="relative aspect-[3/4] bg-[#F8F8F8] overflow-hidden">
                  <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-red-600 shadow-sm transition"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#064C32]">
                      {product.category}
                    </span>
                    <Link
                      to={`/product/${product.id}`}
                      className="font-semibold text-sm text-[#111111] hover:text-[#064C32] transition block mt-0.5 line-clamp-1"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-base font-bold text-[#064C32]">
                        ₹{currentPrice.toLocaleString('en-IN')}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-[#666666] line-through">
                          ₹{originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E5E5E5]">
                    <button
                      type="button"
                      onClick={() => handleMoveToBag(product)}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 shadow"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
