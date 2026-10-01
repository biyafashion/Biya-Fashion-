import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Truck,
  MessageCircle,
  Lock,
  ShoppingBag,
  User,
  CheckCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import * as storageService from '../services/storageService';
import { syncOrderToBackend, syncCustomerToBackend } from '../services/apiService';
import STORE_CONFIG from '../config/storeConfig';

const Checkout = () => {
  const { cart, subtotal, deliveryFee, grandTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form State
  const { customer, isLoggedIn, openAuthModal, updateProfile } = useCustomerAuth();
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    notes: '',
  });

  // Pre-fill form if customer is logged in
  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        fullName: customer.name || prev.fullName,
        phone: customer.phone || prev.phone,
        email: customer.email || prev.email,
        address: customer.address || prev.address,
        city: customer.city || prev.city,
        state: customer.state || prev.state || 'Tamil Nadu',
        pincode: customer.pincode || prev.pincode,
      }));
    }
  }, [customer]);

  const [paymentMethod, setPaymentMethod] = useState('whatsapp'); // 'whatsapp' (no DB) or 'cod' (stores in DB)
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="font-serif text-2xl font-bold text-[#111111]">Your bag is currently empty</h2>
        <p className="text-xs text-[#666666] mt-2 max-w-sm">
          Please add items to your shopping bag before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="mt-6 px-6 py-3 rounded-xl bg-[#064C32] text-white text-xs font-bold uppercase tracking-wider"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateOrderId = () => {
    const existingOrders = storageService.getOrders();
    const count = existingOrders.length + 1;
    return `BFA-2026-${String(count).padStart(4, '0')}`;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error('Please fill in your name, mobile number, and delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLoggedIn && saveAddressToProfile) {
        updateProfile({
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        });
      }

      const orderId = generateOrderId();
      const orderPayload = {
        id: orderId,
        customerId: customer?.id || null,
        customer: {
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          notes: formData.notes,
        },
        items: cart.map((item) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.size,
          selectedColor: item.color,
          image: item.image,
        })),
        subtotal,
        deliveryFee,
        total: grandTotal,
        paymentMethod: 'WhatsApp Order',
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };

      // Save locally so the customer can view their receipt & label
      storageService.createOrder(orderPayload);

      // Save order to Firebase Firestore backend
      syncOrderToBackend(orderPayload);

      // Save customer record to Firebase Firestore
      if (orderPayload.customer) {
        syncCustomerToBackend({
          id: orderPayload.customerId || `cust-${Date.now()}`,
          name: orderPayload.customer.name,
          phone: orderPayload.customer.phone,
          email: orderPayload.customer.email,
          address: orderPayload.customer.address,
          city: orderPayload.customer.city,
          state: orderPayload.customer.state,
          pincode: orderPayload.customer.pincode,
        });
      }

      clearCart();
      toast.success(`Order ${orderId} registered!`);

      // If WhatsApp order selected, open WhatsApp conversation with full shipping & item details
      if (paymentMethod === 'whatsapp') {
        const itemsListText = cart
          .map(
            (i, idx) =>
              `${idx + 1}. *${i.name}*\n   • Size: ${i.size} | Color: ${i.color}\n   • Qty: ${i.quantity} x ₹${i.price} = ₹${i.price * i.quantity}`
          )
          .join('\n\n');

        const message = `🛍️ *NEW BIYA FASHION ORDER* 🛍️\n----------------------------------------\n*Order ID:* ${orderId}\n*Date:* ${new Date().toLocaleDateString('en-IN')}\n\n👤 *CUSTOMER & SHIPPING DETAILS:*\n• *Customer Name:* ${formData.fullName}\n• *Mobile Number:* ${formData.phone}\n• *Email:* ${formData.email || 'N/A'}\n• *Delivery Address:*\n  ${formData.address}\n  ${formData.city}, ${formData.state} - ${formData.pincode}${formData.notes ? `\n• *Delivery Instructions:* ${formData.notes}` : ''}\n\n👗 *ORDERED APPAREL (${cart.length}):*\n${itemsListText}\n\n💰 *BILLING SUMMARY:*\n• *Subtotal:* ₹${subtotal}\n• *Delivery Fee:* ${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}\n• *Grand Total Payable:* ₹${grandTotal}\n• *Payment Mode:* Send to WhatsApp Order\n----------------------------------------\n👑 *BIYA FASHION • WEAR YOUR STYLE*\n_Pandiyan Nagar, Karaiyapatti, Virudhunagar - 626106_\n_Please confirm my order dispatch. Thank you!_`;

        const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
          message
        )}`;
        window.open(waUrl, '_blank');
      }

      navigate(`/order-success?id=${orderId}`);
    } catch (err) {
      console.error('Order creation error:', err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="pb-6 border-b border-[#E5E5E5] mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#111111]">
            Checkout
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Provide your delivery details to complete your order.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form: Delivery Address & Payment Method (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact & Shipping Address */}
            <div className="bg-[#F8F8F8] p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#064C32]" />
                  <h2 className="font-serif font-bold text-lg text-[#111111]">
                    1. Shipping Information
                  </h2>
                </div>
                {!isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="text-xs font-bold text-[#064C32] hover:underline"
                  >
                    Sign In to Autofill →
                  </button>
                )}
              </div>

              {/* Login / Prefill Banner */}
              {isLoggedIn ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#064C32]/10 rounded-2xl border border-[#064C32]/20">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#064C32] shrink-0" />
                    <span className="text-xs font-semibold text-[#064C32]">
                      Logged in as <strong>{customer.name}</strong> ({customer.phone})
                    </span>
                  </div>
                  <label className="flex items-center gap-1.5 text-[11px] text-[#064C32] font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveAddressToProfile}
                      onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                      className="rounded accent-[#064C32]"
                    />
                    <span>Save updates to default address</span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#E5E5E5] text-xs shadow-xs">
                  <div className="flex items-center gap-2 text-[#666666]">
                    <User className="w-4 h-4 text-[#064C32]" />
                    <span>Have a Biya Fashion account?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="font-bold text-[#064C32] hover:underline"
                  >
                    Sign In Here
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. rahul@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Street Address / House No. / Landmark *
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. Flat 301, Silver Oak Society, Ring Road"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Surat"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Gujarat"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Pincode / Postal Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="e.g. 395002"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Ring doorbell twice"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-[#F8F8F8] p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5E5]">
                <Lock className="w-5 h-5 text-[#064C32]" />
                <h2 className="font-serif font-bold text-lg text-[#111111]">
                  2. Payment Method
                </h2>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-[#064C32] bg-white ring-2 ring-[#064C32]/10 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[#111111]">
                      Direct WhatsApp Order & Payment
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#25D366]/15 text-[#064C32] px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">
                    Instantly sends your full delivery address and ordered items directly to BIYA FASHION WhatsApp (+91 94861 18211) for immediate dispatch confirmation.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-[#064C32] font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>UPI, Google Pay, PhonePe & Bank Transfer accepted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F8F8F8] p-6 sm:p-8 rounded-3xl border border-[#E5E5E5] space-y-6 sticky top-24">
              <h2 className="font-serif font-bold text-lg text-[#111111] pb-3 border-b border-[#E5E5E5]">
                Order Items ({cart.length})
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-18 object-cover rounded-lg border border-[#E5E5E5] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#111111] truncate">{item.name}</h4>
                      <p className="text-[11px] text-[#666666]">
                        {item.size} • {item.color} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#064C32]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="pt-4 border-t border-[#E5E5E5] space-y-2 text-xs text-[#666666]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#111111]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-[#064C32] font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#111111] pt-3 border-t border-[#E5E5E5]">
                  <span>Total Payable</span>
                  <span className="text-[#064C32]">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-[#064C32]/25 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Processing Order...'
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 text-[#F3D477]" />
                      <span>ORDER VIA WHATSAPP</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-[#666666]">
                  By placing this order, you agree to Biya Fashion's Terms & Conditions.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
