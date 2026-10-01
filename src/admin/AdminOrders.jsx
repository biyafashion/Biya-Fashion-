import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  FileText,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';
import * as storageService from '../services/storageService';
import {
  downloadOrderInvoice,
  downloadOrderShippingLabel,
  exportOrdersAsCSV,
  fetchOrdersFromBackend,
  updateOrderStatusOnBackend,
  syncOrderToBackend,
} from '../services/apiService';
import { useToast } from '../context/ToastContext';

const STATUSES = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { toast } = useToast();

  const loadOrders = async () => {
    // 1. Instant local load
    const local = storageService.getOrders();
    setOrders(local);

    // 2. Fetch fresh orders from Firebase Firestore
    try {
      const remote = await fetchOrdersFromBackend();
      if (remote && Array.isArray(remote)) {
        // Auto-sync any local orders to Firebase Firestore if not yet present
        const remoteIds = new Set(remote.map((r) => String(r.id)));
        const unSynced = local.filter((l) => !remoteIds.has(String(l.id)));
        for (const order of unSynced) {
          await syncOrderToBackend(order);
        }

        const localMap = new Map(local.map((o) => [String(o.id), o]));
        remote.forEach((r) => {
          localMap.set(String(r.id), r);
        });
        unSynced.forEach((u) => {
          localMap.set(String(u.id), u);
        });
        const merged = Array.from(localMap.values()).sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setOrders(merged);
        localStorage.setItem('biya_fashion_orders', JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('Orders sync skipped:', err.message);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const updated = storageService.updateOrder(orderId, { status: newStatus });
    if (updated) {
      // Sync to Firebase backend
      await updateOrderStatusOnBackend(orderId, newStatus);
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      toast.success(`Order ${orderId} marked as ${newStatus}.`);
    }
  };

  const handleExportCSV = async () => {
    toast.info('Exporting orders CSV...');
    const result = await exportOrdersAsCSV(orders);
    if (result.success) {
      toast.success('Orders CSV exported successfully!');
    } else {
      toast.error('Failed to export orders CSV.');
    }
  };

  const handleDownloadInvoice = async (order) => {
    toast.info(`Preparing Tax Invoice for ${order.id}...`);
    const result = await downloadOrderInvoice(order);
    if (result.success) {
      toast.success(result.mode === 'print' ? 'Invoice opened for printing/PDF.' : 'Tax invoice PDF downloaded!');
    } else {
      toast.error('Could not download invoice.');
    }
  };

  const handleDownloadShippingLabel = async (order) => {
    toast.info(`Preparing Shipping Label for ${order.id}...`);
    const result = await downloadOrderShippingLabel(order);
    if (result.success) {
      toast.success(result.mode === 'print' ? 'Shipping label opened for printing.' : 'Shipping label PDF downloaded!');
    } else {
      toast.error('Could not download shipping label.');
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesId = o.id?.toLowerCase().includes(q);
        const matchesName = o.customer?.name?.toLowerCase().includes(q);
        const matchesPhone = o.customer?.phone?.toLowerCase().includes(q);
        return matchesId || matchesName || matchesPhone;
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Packed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Confirmed':
        return 'bg-[#064C32]/10 text-[#064C32] border-[#064C32]/20';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111111]">
            Order Management
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Track customer orders, update shipping progress, and review invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 text-xs font-bold bg-[#064C32] hover:bg-[#033B27] text-white px-3.5 py-2 rounded-xl shadow-sm transition"
            title="Download complete orders list as CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#F3D477]" />
            <span>Export CSV</span>
          </button>

          <div className="text-xs font-bold text-[#064C32] bg-[#064C32]/10 px-3.5 py-2 rounded-xl">
            Total Orders: {orders.length}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F8F8F8] p-4 rounded-2xl border border-[#E5E5E5]">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, customer, phone..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#064C32]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#064C32] cursor-pointer"
          >
            <option value="all">All Statuses ({orders.length})</option>
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F8F8] text-[#111111] uppercase tracking-wider font-bold border-b border-[#E5E5E5]">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Date</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-4 font-mono font-bold text-[#064C32]">{ord.id}</td>
                    <td className="p-4 font-bold text-[#111111]">{ord.customer?.name}</td>
                    <td className="p-4 text-[#666666]">{ord.customer?.phone}</td>
                    <td className="p-4 text-[#666666]">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 font-medium">{ord.items?.length || 0} pcs</td>
                    <td className="p-4 font-bold text-[#111111]">
                      ₹{ord.total?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-[#666666]">{ord.paymentMethod}</td>
                    <td className="p-4">
                      {/* Status Dropdown */}
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(ord)}
                          className="p-1.5 rounded-lg text-[#064C32] bg-[#064C32]/5 hover:bg-[#064C32]/15 transition"
                          title="Download Tax Invoice (PDF)"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadShippingLabel(ord)}
                          className="p-1.5 rounded-lg text-[#064C32] bg-[#064C32]/5 hover:bg-[#064C32]/15 transition"
                          title="Download Shipping Label (PDF)"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#064C32] hover:bg-gray-100 transition"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E5E5E5] relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-[#E5E5E5]">
              <div className="w-10 h-10 rounded-xl bg-[#064C32]/10 text-[#064C32] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#111111]">
                  Order {selectedOrder.id}
                </h3>
                <p className="text-xs text-[#666666]">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Status Selector */}
            <div className="my-4 p-3 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Current Status
              </span>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer ${getStatusBadge(
                  selectedOrder.status
                )}`}
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Details */}
            <div className="space-y-2 py-3 border-b border-[#E5E5E5] text-xs">
              <h4 className="font-bold text-[#111111] uppercase tracking-wider">
                Customer & Shipping
              </h4>
              <p className="text-sm font-bold text-[#111111]">{selectedOrder.customer?.name}</p>
              <div className="flex items-center gap-2 text-[#666666]">
                <Phone className="w-3.5 h-3.5 text-[#064C32]" />
                <span>{selectedOrder.customer?.phone}</span>
              </div>
              {selectedOrder.customer?.email && (
                <div className="flex items-center gap-2 text-[#666666]">
                  <Mail className="w-3.5 h-3.5 text-[#064C32]" />
                  <span>{selectedOrder.customer?.email}</span>
                </div>
              )}
              <div className="flex items-start gap-2 text-[#666666] pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#064C32] shrink-0 mt-0.5" />
                <span>
                  {selectedOrder.customer?.address}, {selectedOrder.customer?.city},{' '}
                  {selectedOrder.customer?.state} - {selectedOrder.customer?.pincode}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="py-4 border-b border-[#E5E5E5] space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                Ordered Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-cover rounded-lg border border-[#E5E5E5]"
                      />
                      <div>
                        <p className="font-bold text-[#111111]">{item.name}</p>
                        <p className="text-[11px] text-[#666666]">
                          Size: {item.selectedSize} • Color: {item.selectedColor} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-[#064C32]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="pt-4 space-y-1.5 text-xs text-[#666666]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {selectedOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#111111] pt-2 border-t border-[#E5E5E5]">
                <span>Grand Total</span>
                <span className="text-[#064C32]">₹{selectedOrder.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Document Generation & Downloads */}
            <div className="mt-6 pt-4 border-t border-[#E5E5E5] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666] block">
                Official Documents & Dispatch
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(selectedOrder)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#064C32] hover:bg-[#064C32]/5 text-xs font-bold text-[#111111] transition shadow-sm"
                >
                  <FileText className="w-4 h-4 text-[#064C32]" />
                  <span>Download Tax Invoice (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadShippingLabel(selectedOrder)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#064C32] hover:bg-[#064C32]/5 text-xs font-bold text-[#111111] transition shadow-sm"
                >
                  <Printer className="w-4 h-4 text-[#064C32]" />
                  <span>Print Shipping Label (PDF)</span>
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
