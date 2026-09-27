import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as storageService from '../services/storageService';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const saved = storageService.getWishlist();
    setWishlist(saved);
  }, []);

  const isInWishlist = useCallback(
    (productId) => {
      return wishlist.some((item) => String(item.id) === String(productId));
    },
    [wishlist]
  );

  const addToWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        if (prev.some((item) => String(item.id) === String(product.id))) {
          return prev;
        }
        const updated = [product, ...prev];
        storageService.updateWishlist(updated);
        return updated;
      });
      toast.success(`"${product.name}" added to wishlist.`);
    },
    [toast]
  );

  const removeFromWishlist = useCallback(
    (productId) => {
      setWishlist((prev) => {
        const item = prev.find((i) => String(i.id) === String(productId));
        const updated = prev.filter((i) => String(i.id) !== String(productId));
        storageService.updateWishlist(updated);
        if (item) {
          toast.info(`"${item.name}" removed from wishlist.`);
        }
        return updated;
      });
    },
    [toast]
  );

  const toggleWishlist = useCallback(
    (product) => {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    },
    [isInWishlist, removeFromWishlist, addToWishlist]
  );

  const moveToCart = useCallback(
    (product, size = null, color = null) => {
      addToCart(product, size, color, 1);
      removeFromWishlist(product.id);
    },
    [addToCart, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => {
    storageService.clearWishlist();
    setWishlist([]);
    toast.info('Wishlist cleared.');
  }, [toast]);

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    moveToCart,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
