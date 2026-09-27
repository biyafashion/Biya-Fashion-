import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const WishlistButton = ({ product, className = '', iconSize = 18 }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = product ? isInWishlist(product.id) : false;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) {
      toggleWishlist(product);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? `Remove ${product?.name} from wishlist` : `Add ${product?.name} to wishlist`}
      className={`relative p-2.5 rounded-full backdrop-blur-md transition-all duration-200 focus:outline-none ${
        active
          ? 'bg-[#064C32] text-[#F3D477] shadow-md scale-105'
          : 'bg-white/90 text-gray-700 hover:text-[#064C32] hover:bg-white shadow-sm hover:scale-110'
      } ${className}`}
    >
      <Heart
        size={iconSize}
        className={`transition-colors duration-200 ${active ? 'fill-current' : 'fill-transparent'}`}
      />
    </button>
  );
};

export default WishlistButton;
