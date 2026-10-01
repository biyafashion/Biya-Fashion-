import React, { useState, useMemo, useEffect } from 'react';
import { Search, UserCheck, Edit2, Trash2, X, Save } from 'lucide-react';
import * as storageService from '../services/storageService';
import {
  fetchCustomersFromBackend,
  syncCustomerToBackend,
  fetchOrdersFromBackend,
  updateCustomerOnBackend,
  deleteCustomerOnBackend,
} from '../services/apiService';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

/**
 * BIYA FASHION - Customer Directory
 * 
 * Aggregates customer profiles from Firebase Firestore and local store orders.
 */
const AdminCustomers = () => {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState(() => storageService.getCustomers());
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    // 1. Initial local load
    setCustomers(storageService.getCustomers());

    // 2. Auto-sync any existing local customer accounts to Firebase Firestore
    const localAccounts = storageService.getCustomerAccounts();

      // 3. Fetch fresh customer records from Firebase Firestore
      const remote = await fetchCustomersFromBackend();
      if (remote && Array.isArray(remote)) {
        const remotePhones = new Set(
          remote.map((r) => (r.phone || '').trim().toLowerCase())
        );

        // Upload any local accounts not yet in Firebase
        for (const acc of localAccounts) {
          const accPhone = (acc.phone || '').trim().toLowerCase();
          if (accPhone && !remotePhones.has(accPhone)) {
            await syncCustomerToBackend(acc);
          }
        }

        const existingAccounts = storageService.getCustomerAccounts();
        const existingPhones = new Set(
          existingAccounts.map((a) => (a.phone || '').trim().toLowerCase())
        );

        let changed = false;
        remote.forEach((r) => {
          const rPhone = (r.phone || '').trim().toLowerCase();
          if (rPhone && !existingPhones.has(rPhone)) {
            existingAccounts.push(r);
            changed = true;
          }
        });

        if (changed) {
          localStorage.setItem('biya_fashion_customer_accounts', JSON.stringify(existingAccounts));
        }
      }

      // 4. Fetch latest orders from Firebase to aggregate total spend & order count
      const remoteOrders = await fetchOrdersFromBackend();
      if (remoteOrders && Array.isArray(remoteOrders) && remoteOrders.length > 0) {
        storageService.setOrdersCache(remoteOrders);
      }

      setCustomers(storageService.getCustomers());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEdit = (cust) => {
    setEditingCustomer(cust);
    setEditFormData({
      name: cust.name || '',
      phone: cust.phone || '',
      email: cust.email === 'N/A' ? '' : cust.email || '',
      address: cust.address || '',
      city: cust.city === 'N/A' ? '' : cust.city || '',
      state: cust.state === 'N/A' ? 'Tamil Nadu' : cust.state || 'Tamil Nadu',
      pincode: cust.pincode || '',
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setIsSaving(true);
    try {
      storageService.updateCustomer(editingCustomer.id, editFormData);
      await updateCustomerOnBackend(editingCustomer.id, editFormData);
      // Refresh list
      setCustomers(storageService.getCustomers());
      toast.success(`Customer "${editFormData.name}" updated successfully.`);
      setEditingCustomer(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update customer.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      storageService.deleteCustomer(customerToDelete.id);
      await deleteCustomerOnBackend(customerToDelete.id);
      // Refresh list
      setCustomers(storageService.getCustomers());
      toast.success(`Customer "${customerToDelete.name}" deleted.`);
      setCustomerToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete customer.');
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const totalSpentByAll = useMemo(() => {
    return customers.reduce((sum, c) => sum + c.totalSpent, 0);
  }, [customers]);

  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111111]">
            Customer Management
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Aggregated buyers and order histories extracted from Firebase Firestore & local store.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-[#064C32] bg-[#064C32]/10 px-3.5 py-2 rounded-xl">
            {customers.length} Unique Customers
          </div>
        </div>
      </div>

      {/* Code Notice Banner */}
      <div className="p-4 rounded-2xl bg-[#064C32]/5 border border-[#064C32]/20 text-xs text-[#064C32] leading-relaxed flex items-center justify-between">
        <div>
          <strong>Admin Live Management:</strong> You can edit any customer profile or delete records from Firebase Firestore and local database.
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-[#F8F8F8] p-4 rounded-2xl border border-[#E5E5E5]">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, phone..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
          />
        </div>

        <div className="text-xs text-[#666666] font-semibold">
          Lifetime Revenue: <strong className="text-[#064C32]">₹{totalSpentByAll.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F8F8] text-[#111111] uppercase tracking-wider font-bold border-b border-[#E5E5E5]">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Email</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-center">Orders Count</th>
                <th className="p-4 text-right">Total Spent</th>
                <th className="p-4">Last Order</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No customer records found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#064C32] text-[#F3D477] font-bold flex items-center justify-center text-xs">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-[#111111]">{cust.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#666666] font-medium">{cust.phone}</td>
                    <td className="p-4 text-[#666666]">{cust.email}</td>
                    <td className="p-4 text-[#666666]">
                      <div className="font-medium text-[#111111]">{cust.city || 'N/A'}, {cust.state || ''}</div>
                      {cust.address && <div className="text-[10px] text-gray-400 truncate max-w-[180px]">{cust.address}</div>}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block bg-[#064C32]/10 text-[#064C32] px-2.5 py-0.5 rounded-full font-bold">
                        {cust.ordersCount}
                      </span>
                    </td>
                    <td className="p-4 text-right font-extrabold text-[#064C32]">
                      ₹{(cust.totalSpent || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-[#666666]">
                      {cust.lastOrderDate ? (
                        new Date(cust.lastOrderDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      ) : (
                        <span className="text-gray-400 italic">No orders yet</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cust)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#064C32] hover:bg-gray-100 transition"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerToDelete(cust)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E5E5E5] relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditingCustomer(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pb-4 mb-6 border-b border-[#E5E5E5]">
              <Edit2 className="w-5 h-5 text-[#064C32]" />
              <h2 className="font-serif font-bold text-xl text-[#111111]">
                Edit Customer Details
              </h2>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#111111] uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#111111] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Delivery Address
                </label>
                <textarea
                  rows={2}
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#111111] uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#111111] uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={editFormData.state}
                    onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#111111] uppercase tracking-wider mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={editFormData.pincode}
                    onChange={(e) => setEditFormData({ ...editFormData, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#064C32] hover:bg-[#033B27] rounded-xl shadow transition active:scale-95 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(customerToDelete)}
        title="Delete Customer"
        message={`Are you sure you want to delete customer "${customerToDelete?.name}" (${customerToDelete?.phone})? This will remove the record from both local database and Firebase Firestore.`}
        confirmText="Delete Customer"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCustomerToDelete(null)}
      />
    </div>
  );
};

export default AdminCustomers;
