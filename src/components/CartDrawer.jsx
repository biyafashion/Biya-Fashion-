import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    grandTotal,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#064C32]" />
              <h2 className="font-serif font-bold text-lg text-[#111111]">
                Shopping Bag ({cart.reduce((t, i) => t + i.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="bg-[#064C32]/5 px-6 py-3 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#064C32] mb-1.5">
                <Truck className="w-4 h-4 text-[#D9A514]" />
                {amountNeededForFreeDelivery > 0 ? (
                  <span>
                    Add <strong className="text-[#064C32]">₹{amountNeededForFreeDelivery}</strong> more for{' '}
                    <strong className="text-[#D9A514]">FREE DELIVERY</strong>
                  </span>
                ) : (
                  <span className="text-[#064C32] font-bold">
                    🎉 You have unlocked FREE DELIVERY!
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#D9A514] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${freeDeliveryPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#E5E5E5]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F8F8F8] flex items-center justify-center text-[#666666] mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#064C32]/40" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#111111]">Your bag is empty</h3>
                <p className="text-xs text-[#666666] mt-1 max-w-xs">
                  Discover our premium selection of T-shirts, casual wear, and luxury fashion essentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-[#064C32] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#033B27] transition shadow"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-xl border border-[#E5E5E5] shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/product/${item.productId}`}
                          onClick={closeCart}
                          className="font-semibold text-sm text-[#111111] hover:text-[#064C32] transition line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-400 hover:text-red-600 transition p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-[#666666]">
                        <span className="bg-[#F8F8F8] px-2 py-0.5 rounded border border-[#E5E5E5]">
                          Size: {item.size}
                        </span>
                        <span className="bg-[#F8F8F8] px-2 py-0.5 rounded border border-[#E5E5E5]">
                          {item.color}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#E5E5E5] rounded-lg overflow-hidden bg-[#F8F8F8]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-200 text-gray-700 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-[#111111]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-200 text-gray-700 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <span className="font-bold text-sm text-[#064C32]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Totals & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#E5E5E5] bg-[#F8F8F8] space-y-3">
              <div className="space-y-1.5 text-xs text-[#666666]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111111]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-[#064C32] font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#111111] pt-2 border-t border-[#E5E5E5]">
                  <span>Total Amount</span>
                  <span className="text-[#064C32] text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 px-4 bg-[#064C32] hover:bg-[#033B27] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#D9A514]" />
                </button>

                <button
                  type="button"
                  onClick={handleViewCartClick}
                  className="w-full py-2.5 px-4 bg-white hover:bg-gray-100 text-[#111111] border border-[#E5E5E5] font-semibold text-xs uppercase tracking-wider rounded-xl transition"
                >
                  View Full Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
