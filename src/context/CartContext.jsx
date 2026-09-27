import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import * as storageService from '../services/storageService';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => storageService.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [settings] = useState(() => storageService.getSettings());
  const { toast } = useToast();

  // Add to cart
  const addToCart = useCallback(
    (product, selectedSize = null, selectedColor = null, quantity = 1) => {
      // Default to first size/color if not specified
      const size = selectedSize || (product.sizes && product.sizes[0]) || 'Standard';
      const color = selectedColor || (product.colors && product.colors[0]) || 'Standard';
      const unitPrice = product.discountPrice ? Number(product.discountPrice) : Number(product.price);
      const originalUnitPrice = Number(product.price);

      const cartItemId = `${product.id}-${size}-${color}`;

      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
        let updated;

        if (existingIndex > -1) {
          updated = [...prevCart];
          const newQty = updated[existingIndex].quantity + quantity;
          // check stock limit if available
          if (product.stock && newQty > product.stock) {
            toast.warning(`Maximum available stock reached (${product.stock}).`);
            updated[existingIndex].quantity = product.stock;
          } else {
            updated[existingIndex].quantity = newQty;
          }
        } else {
          const newItem = {
            cartItemId,
            productId: product.id,
            name: product.name,
            sku: product.sku,
            price: unitPrice,
            originalPrice: originalUnitPrice,
            image: (product.images && product.images[0]) || '',
            category: product.category,
            size,
            color,
            quantity: Math.min(quantity, product.stock || 99),
            maxStock: product.stock || 99,
          };
          updated = [newItem, ...prevCart];
        }

        storageService.updateCart(updated);
        return updated;
      });

      toast.success(`"${product.name}" added to bag.`);
    },
    [toast]
  );

  // Remove item
  const removeFromCart = useCallback(
    (cartItemId) => {
      setCart((prev) => {
        const item = prev.find((i) => i.cartItemId === cartItemId);
        const updated = prev.filter((i) => i.cartItemId !== cartItemId);
        storageService.updateCart(updated);
        if (item) {
          toast.info(`"${item.name}" removed from bag.`);
        }
        return updated;
      });
    },
    [toast]
  );

  // Update quantity
  const updateQuantity = useCallback(
    (cartItemId, newQty) => {
      if (newQty <= 0) {
        removeFromCart(cartItemId);
        return;
      }

      setCart((prev) => {
        const updated = prev.map((item) => {
          if (item.cartItemId === cartItemId) {
            const finalQty = Math.min(newQty, item.maxStock || 99);
            if (newQty > (item.maxStock || 99)) {
              toast.warning(`Only ${item.maxStock} items available in stock.`);
            }
            return { ...item, quantity: finalQty };
          }
          return item;
        });
        storageService.updateCart(updated);
        return updated;
      });
    },
    [removeFromCart, toast]
  );

  // Clear cart
  const clearCart = useCallback(() => {
    storageService.clearCart();
    setCart([]);
  }, []);

  // Drawer helpers
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  // Financial calculations
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const originalSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.originalPrice || item.price) * item.quantity, 0);
  }, [cart]);

  const totalDiscount = useMemo(() => {
    const disc = originalSubtotal - subtotal;
    return disc > 0 ? disc : 0;
  }, [originalSubtotal, subtotal]);

  const freeDeliveryThreshold = settings.freeDeliveryAbove || 999;
  const standardDeliveryCharge = settings.deliveryCharge || 99;

  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    return subtotal >= freeDeliveryThreshold ? 0 : standardDeliveryCharge;
  }, [cart.length, subtotal, freeDeliveryThreshold, standardDeliveryCharge]);

  const grandTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    return subtotal + deliveryFee;
  }, [cart.length, subtotal, deliveryFee]);

  const value = {
    cart,
    cartCount,
    subtotal,
    originalSubtotal,
    totalDiscount,
    deliveryFee,
    freeDeliveryThreshold,
    standardDeliveryCharge,
    grandTotal,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
