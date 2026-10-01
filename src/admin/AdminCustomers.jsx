import React, { useState, useMemo, useEffect } from 'react';
import { Search, UserCheck } from 'lucide-react';
import * as storageService from '../services/storageService';
import {
  fetchCustomersFromBackend,
  syncCustomerToBackend,
  fetchOrdersFromBackend,
} from '../services/apiService';

/**
 * BIYA FASHION - Customer Directory
 * 
 * Aggregates customer profiles from Firebase Firestore and local store orders.
 */
const AdminCustomers = () => {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState(() => storageService.getCustomers());

  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

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
            Aggregated buyers and order histories extracted from local store transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-[#064C32] bg-[#064C32]/10 px-3.5 py-2 rounded-xl">
            {customers.length} Unique Customers
          </div>
        </div>
      </div>

      {/* Code Notice Banner */}
      <div className="p-4 rounded-2xl bg-[#064C32]/5 border border-[#064C32]/20 text-xs text-[#064C32] leading-relaxed">
        <strong>Frontend Architecture Notice:</strong> Customer records are dynamically computed from orders stored in <code>localStorage</code>. Data persists in this browser until local storage cache is cleared.
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
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
