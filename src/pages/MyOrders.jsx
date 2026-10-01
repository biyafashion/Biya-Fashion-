import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  MapPin,
  FileText,
  Printer,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  User,
  Phone,
  Mail,
  Edit2,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import * as storageService from '../services/storageService';
import {
  downloadOrderInvoice,
  downloadOrderShippingLabel,
} from '../services/apiService';
import STORE_CONFIG from '../config/storeConfig';

const MyOrders = () => {
  const { customer, isLoggedIn, openAuthModal, updateProfile, logout } = useCustomerAuth();
  const [downloadingId, setDownloadingId] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressData, setAddressData] = useState({
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || 'Tamil Nadu',
    pincode: customer?.pincode || '',
  });

  // Fetch all orders matching customer or local storage
  const allOrders = storageService.getOrders();

  const customerOrders = useMemo(() => {
    if (customer) {
      const cPhone = (customer.phone || '').trim().toLowerCase();
      const cEmail = (customer.email || '').trim().toLowerCase();
      return allOrders.filter((o) => {
        const oPhone = (o.customer?.phone || '').trim().toLowerCase();
        const oEmail = (o.customer?.email || '').trim().toLowerCase();
        return (cPhone && oPhone === cPhone) || (cEmail && oEmail === cEmail);
      });
    }
    // If not logged in, return all local orders so guest can still see recent orders
    return allOrders;
  }, [customer, allOrders]);

  const handleDownloadInvoice = async (order) => {
    try {
      setDownloadingId(`inv-${order.id}`);
      await downloadOrderInvoice(order);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadLabel = async (order) => {
    try {
      setDownloadingId(`lbl-${order.id}`);
      await downloadOrderShippingLabel(order);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    updateProfile(addressData);
    setIsEditingAddress(false);
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#064C32]">
              Customer Portal
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#111111]">
              My Orders & Receipts
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              Download tax invoices, print shipping labels, and track your wardrobe orders.
            </p>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-[#111111]">{customer.name}</p>
                <p className="text-[11px] text-[#666666]">{customer.phone}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="py-2 px-3.5 rounded-xl border border-[#E5E5E5] hover:bg-gray-100 text-xs font-bold text-[#111111] transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="py-2.5 px-5 rounded-xl bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-wider shadow transition"
            >
              Sign In To My Account
            </button>
          )}
        </div>

        {/* Saved Delivery Address Card (If Logged In) */}
        {isLoggedIn && (
          <div className="bg-[#F8F8F8] rounded-3xl border border-[#E5E5E5] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#064C32]" />
                <h3 className="font-serif font-bold text-sm text-[#111111]">
                  Default Delivery Address
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddressData({
                    address: customer.address || '',
                    city: customer.city || '',
                    state: customer.state || 'Tamil Nadu',
                    pincode: customer.pincode || '',
                  });
                  setIsEditingAddress(!isEditingAddress);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#064C32] hover:underline font-semibold"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditingAddress ? 'Cancel' : 'Edit Address'}</span>
              </button>
            </div>

            {isEditingAddress ? (
              <form onSubmit={handleSaveAddress} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Street Address / Door No.
                  </label>
                  <input
                    type="text"
                    required
                    value={addressData.address}
                    onChange={(e) =>
                      setAddressData({ ...addressData, address: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#E5E5E5] text-xs bg-white focus:outline-none focus:border-[#064C32]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={addressData.city}
                      onChange={(e) =>
                        setAddressData({ ...addressData, city: e.target.value })
                      }
                      className="w-full p-2 rounded-xl border border-[#E5E5E5] text-xs bg-white focus:outline-none focus:border-[#064C32]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={addressData.state}
                      onChange={(e) =>
                        setAddressData({ ...addressData, state: e.target.value })
                      }
                      className="w-full p-2 rounded-xl border border-[#E5E5E5] text-xs bg-white focus:outline-none focus:border-[#064C32]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      required
                      value={addressData.pincode}
                      onChange={(e) =>
                        setAddressData({ ...addressData, pincode: e.target.value })
                      }
                      className="w-full p-2 rounded-xl border border-[#E5E5E5] text-xs bg-white focus:outline-none focus:border-[#064C32]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-[#064C32] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Save Address
                </button>
              </form>
            ) : (
              <div className="text-xs text-[#666666] leading-relaxed">
                <p className="font-bold text-[#111111]">{customer.name} • {customer.phone}</p>
                <p>
                  {customer.address ? `${customer.address}, ` : 'No address set yet. '}
                  {customer.city}
                  {customer.state ? `, ${customer.state}` : ''}
                  {customer.pincode ? ` - ${customer.pincode}` : ''}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  💡 This address will automatically appear on all your delivery orders, courier shipping labels, and invoices.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Orders List Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-[#111111]">
              Order History ({customerOrders.length})
            </h2>
          </div>

          {customerOrders.length === 0 ? (
            <div className="bg-[#F8F8F8] rounded-3xl border border-[#E5E5E5] p-12 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-[#111111]">
                No orders found
              </h3>
              <p className="text-xs text-[#666666] max-w-sm mx-auto">
                {isLoggedIn
                  ? "You haven't placed any orders with this account yet."
                  : 'Sign in to view your orders, or browse our latest fashion collection.'}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                {!isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="py-2.5 px-5 rounded-xl border border-[#064C32] text-[#064C32] text-xs font-bold uppercase tracking-wider hover:bg-[#064C32]/5 transition"
                  >
                    Sign In
                  </button>
                )}
                <Link
                  to="/shop"
                  className="py-2.5 px-5 rounded-xl bg-[#064C32] text-white text-xs font-bold uppercase tracking-wider shadow transition"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {customerOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-[#E5E5E5] shadow-xs hover:shadow-md transition overflow-hidden"
                >
                  {/* Order Top Bar */}
                  <div className="bg-[#F8F8F8] p-4 sm:p-5 border-b border-[#E5E5E5] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                      <div>
                        <span className="text-[10px] text-[#666666] uppercase tracking-wider block">
                          Order Number
                        </span>
                        <span className="font-mono font-bold text-sm text-[#064C32]">
                          {order.id}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#666666] uppercase tracking-wider block">
                          Date
                        </span>
                        <span className="text-xs font-semibold text-[#111111]">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#666666] uppercase tracking-wider block">
                          Total Amount
                        </span>
                        <span className="text-xs font-bold text-[#111111]">
                          ₹{(order.total || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#064C32]/10 text-[#064C32] border border-[#064C32]/20">
                        {order.status || 'Confirmed'}
                      </span>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-5 sm:p-6 space-y-5">
                    {/* Items */}
                    <div className="space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666] block">
                        Items in this Order ({order.items?.length || 0})
                      </span>
                      <div className="divide-y divide-[#E5E5E5]">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-14 object-cover rounded-xl border border-[#E5E5E5]"
                                />
                              ) : (
                                <div className="w-12 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <h4 className="text-xs font-bold text-[#111111]">
                                  {item.name}
                                </h4>
                                <p className="text-[11px] text-[#666666]">
                                  Size: {item.selectedSize || 'Standard'} • Color:{' '}
                                  {item.selectedColor || 'Default'} • Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-[#111111]">
                              ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address & Customer Snapshot */}
                    <div className="pt-4 border-t border-[#E5E5E5] flex flex-col sm:flex-row justify-between gap-4 text-xs text-[#666666] bg-[#FAFAFA] p-3.5 rounded-2xl">
                      <div>
                        <span className="font-bold text-[#111111] block mb-0.5">
                          Delivery To: {order.customer?.name}
                        </span>
                        <p>
                          {order.customer?.address}, {order.customer?.city},{' '}
                          {order.customer?.state} - {order.customer?.pincode}
                        </p>
                        <p className="mt-0.5">WhatsApp: {order.customer?.phone}</p>
                      </div>
                      <div className="sm:text-right shrink-0">
                        <span className="text-[10px] uppercase tracking-wider text-[#666666] block">
                          Order Method
                        </span>
                        <span className="font-semibold text-[#111111]">
                          {order.paymentMethod || 'WhatsApp Order'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: Invoice & Shipping Label */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(order)}
                        disabled={downloadingId === `inv-${order.id}`}
                        className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#064C32] hover:bg-[#064C32]/5 text-[#111111] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition"
                      >
                        <FileText className="w-4 h-4 text-[#064C32]" />
                        <span>
                          {downloadingId === `inv-${order.id}`
                            ? 'Preparing...'
                            : 'Download Tax Invoice'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadLabel(order)}
                        disabled={downloadingId === `lbl-${order.id}`}
                        className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#064C32] hover:bg-[#064C32]/5 text-[#111111] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition"
                      >
                        <Printer className="w-4 h-4 text-[#064C32]" />
                        <span>Print Shipping Label (4x6)</span>
                      </button>

                      <a
                        href={`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                          `Hi BIYA FASHION, I have a query about my Order #${order.id}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp Support</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
