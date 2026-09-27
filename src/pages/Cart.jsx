import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/EmptyState';

const Cart = () => {
  const {
    cart,
    cartCount,
    subtotal,
    originalSubtotal,
    totalDiscount,
    deliveryFee,
    freeDeliveryThreshold,
    grandTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'BIYASTYLE') {
      const disc = Math.round(subtotal * 0.1); // 10% coupon discount
      setCouponDiscount(disc);
      setAppliedCoupon('BIYASTYLE (10% OFF)');
      toast.success('Coupon "BIYASTYLE" applied! 10% discount added.');
    } else {
      toast.error('Invalid coupon code. Try "BIYASTYLE".');
    }
  };

  const finalTotal = Math.max(0, grandTotal - couponDiscount);
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="bg-white min-h-[70vh] flex items-center justify-center py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Bag is Empty"
          description="Looks like you haven't added any luxury clothing pieces to your bag yet."
          actionLabel="Explore Shop"
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
              Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              {cartCount} item{cartCount > 1 ? 's' : ''} in your cart
            </p>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-red-600 hover:text-red-700 font-semibold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto hover:underline"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Bag</span>
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-[#064C32]/5 p-4 rounded-2xl border border-[#064C32]/20 mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-[#064C32] mb-2">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D9A514]" />
              {amountNeededForFreeDelivery > 0 ? (
                <span>
                  Add <strong className="text-[#111111]">₹{amountNeededForFreeDelivery}</strong> more to unlock{' '}
                  <strong className="text-[#D9A514]">FREE DELIVERY</strong>
                </span>
              ) : (
                <span className="font-bold">🎉 Congratulations! You qualify for FREE Delivery</span>
              )}
            </span>
            <span className="font-bold">{freeDeliveryPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#D9A514] h-full transition-all duration-300 rounded-full"
              style={{ width: `${freeDeliveryPercent}%` }}
            />
          </div>
        </div>

        {/* Grid: Cart Items (Left 8 cols) & Order Summary (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items Table/List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] divide-y divide-[#E5E5E5] overflow-hidden">
              {cart.map((item) => (
                <div key={item.cartItemId} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Image */}
                  <Link to={`/product/${item.productId}`} className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-32 sm:w-28 sm:h-36 object-cover rounded-xl border border-[#E5E5E5]"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#064C32]">
                            {item.category}
                          </span>
                          <Link
                            to={`/product/${item.productId}`}
                            className="font-serif font-bold text-base sm:text-lg text-[#111111] hover:text-[#064C32] transition block mt-0.5"
                          >
                            {item.name}
                          </Link>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-400 hover:text-red-600 transition p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#666666]">
                        <span className="bg-[#F8F8F8] px-2.5 py-1 rounded-md border border-[#E5E5E5]">
                          Size: <strong className="text-[#111111]">{item.size}</strong>
                        </span>
                        <span className="bg-[#F8F8F8] px-2.5 py-1 rounded-md border border-[#E5E5E5]">
                          Color: <strong className="text-[#111111]">{item.color}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E5E5E5]">
                      {/* Quantity Modifier */}
                      <div className="flex items-center border border-[#E5E5E5] rounded-xl overflow-hidden bg-[#F8F8F8] h-10">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-3 h-full hover:bg-gray-200 text-gray-700 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#111111]">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-3 h-full hover:bg-gray-200 text-gray-700 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right">
                        <span className="text-base sm:text-lg font-extrabold text-[#064C32]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.quantity > 1 && (
                          <p className="text-[11px] text-[#666666]">
                            ₹{item.price} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                to="/shop"
                className="text-xs font-bold uppercase tracking-wider text-[#064C32] hover:underline"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] shadow-sm space-y-5">
              <h2 className="font-serif font-bold text-lg text-[#111111] pb-3 border-b border-[#E5E5E5]">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon (BIYASTYLE)"
                    className="flex-1 px-3 py-2 text-xs uppercase bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#064C32]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#064C32] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#033B27] transition"
                  >
                    Apply
                  </button>
                </form>
                {appliedCoupon && (
                  <div className="mt-2 text-xs text-[#064C32] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#064C32]" />
                    <span>Applied: {appliedCoupon}</span>
                  </div>
                )}
              </div>

              {/* Price Details Breakdown */}
              <div className="space-y-2.5 text-xs text-[#666666] pt-2 border-t border-[#E5E5E5]">
                <div className="flex justify-between">
                  <span>Bag Total (MRP)</span>
                  <span className="font-medium text-[#111111]">₹{originalSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-[#064C32]">
                    <span>Product Discount</span>
                    <span>-₹{totalDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#064C32]">
                    <span>Coupon Savings</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#111111]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-[#064C32] font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#111111] pt-3 border-t border-[#E5E5E5]">
                  <span>Grand Total</span>
                  <span className="text-[#064C32]">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-[#064C32]/20 flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#D9A514]" />
              </button>

              <div className="text-[11px] text-[#666666] flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#064C32]" />
                <span>Guaranteed Safe & Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
