import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  MapPin,
  FileText,
  Printer,
  Download,
} from 'lucide-react';
import * as storageService from '../services/storageService';
import {
  downloadOrderInvoice,
  downloadOrderShippingLabel,
} from '../services/apiService';
import STORE_CONFIG from '../config/storeConfig';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const [isDownloading, setIsDownloading] = useState(false);

  const order = useMemo(() => {
    if (!orderId) return null;
    return storageService.getOrderById(orderId);
  }, [orderId]);

  const handleDownloadInvoice = async () => {
    if (!order) return;
    setIsDownloading(true);
    await downloadOrderInvoice(order);
    setIsDownloading(false);
  };

  const handleDownloadLabel = async () => {
    if (!order) return;
    await downloadOrderShippingLabel(order);
  };

  const handleWhatsAppShare = () => {
    if (!order) return;
    const itemsList = order.items
      ?.map((i) => `• ${i.name} (Qty: ${i.quantity}) - ₹${i.price * i.quantity}`)
      .join('\n');

    const msg = `Hello BIYA FASHION,\n\nI have placed an order on your store!\n\n*Order ID:* ${order.id}\n*Customer:* ${order.customer?.name}\n*Total:* ₹${order.total}\n*Delivery Address:* ${order.customer?.address}, ${order.customer?.city}\n\n*Items:*\n${itemsList}\n\nPlease confirm my order dispatch. Thank you!`;

    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Card Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-20 h-20 rounded-full bg-[#064C32]/10 border-2 border-[#064C32] text-[#064C32] flex items-center justify-center mx-auto shadow-md animate-scaleUp">
            <CheckCircle2 className="w-10 h-10 text-[#064C32]" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#064C32]/10 text-[#064C32] text-xs font-bold uppercase tracking-widest">
            Order Confirmed
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#111111]">
            Order Placed Successfully!
          </h1>

          <p className="text-sm text-[#666666] max-w-md mx-auto">
            Thank you for shopping with <strong className="text-[#064C32]">BIYA FASHION</strong>. Your order has been registered in our system and is being processed.
          </p>
        </div>

        {order ? (
          <div className="bg-[#F8F8F8] rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Meta Row: Order ID, Date, Status */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-[#E5E5E5]">
              <div>
                <span className="text-[11px] text-[#666666] uppercase tracking-wider block">Order ID</span>
                <span className="font-mono font-bold text-sm text-[#064C32]">{order.id}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#666666] uppercase tracking-wider block">Date</span>
                <span className="font-medium text-xs text-[#111111]">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#666666] uppercase tracking-wider block">Payment</span>
                <span className="font-medium text-xs text-[#111111]">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#666666] uppercase tracking-wider block">Status</span>
                <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-[#064C32] text-white">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Delivery Address Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                <MapPin className="w-4 h-4 text-[#064C32]" />
                <span>Delivery Address</span>
              </div>
              <p className="text-sm font-semibold text-[#111111]">{order.customer?.name}</p>
              <p className="text-xs text-[#666666]">
                {order.customer?.address}, {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
              </p>
              <p className="text-xs text-[#666666]">Phone: {order.customer?.phone}</p>
            </div>

            {/* Items Purchased */}
            <div className="pt-4 border-t border-[#E5E5E5] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block">
                Purchased Garments ({order.items?.length || 0})
              </span>
              <div className="space-y-3 divide-y divide-[#E5E5E5]">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="pt-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-16 object-cover rounded-xl border border-[#E5E5E5]"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-[#111111]">{item.name}</h4>
                        <p className="text-[11px] text-[#666666]">
                          Size: {item.selectedSize} • Color: {item.selectedColor} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#064C32]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Financial Summary */}
            <div className="pt-4 border-t border-[#E5E5E5] space-y-1.5 text-xs text-[#666666]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#111111] pt-2 border-t border-[#E5E5E5]">
                <span>Grand Total</span>
                <span className="text-[#064C32]">₹{order.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Document Download Buttons */}
            <div className="pt-4 border-t border-[#E5E5E5] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666] block">
                Official Order Documents
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  disabled={isDownloading}
                  className="py-3 px-4 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#064C32] hover:bg-[#064C32]/5 text-[#111111] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <FileText className="w-4 h-4 text-[#064C32]" />
                  <span>{isDownloading ? 'Generating...' : 'Download Tax Invoice (PDF)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadLabel}
                  className="py-3 px-4 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#064C32] hover:bg-[#064C32]/5 text-[#111111] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Printer className="w-4 h-4 text-[#064C32]" />
                  <span>Print Shipping Label</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#E5E5E5] flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Notify Via WhatsApp</span>
              </button>

              <Link
                to="/shop"
                className="flex-1 py-3 px-4 rounded-xl bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow transition text-center"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4 text-[#D9A514]" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-[#F8F8F8] p-8 rounded-3xl border border-[#E5E5E5] text-center space-y-4">
            <p className="text-sm text-[#666666]">
              Your order confirmation details have been safely stored.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#064C32] text-white text-xs font-bold uppercase tracking-wider"
            >
              <span>Return to Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;
