import React, { useState, useEffect } from 'react';
import { Save, Check, Store, Truck, MessageCircle, Mail } from 'lucide-react';
import * as storageService from '../services/storageService';
import { useToast } from '../context/ToastContext';

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState(storageService.getSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(storageService.getSettings());
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    storageService.updateSettings(settings);
    setSaved(true);
    toast.success('Store settings updated successfully.');
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 bg-white max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111111]">
            Store Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Configure global store identity, WhatsApp order recipient, and shipping fee thresholds.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Brand Information Section */}
        <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5E5]">
            <Store className="w-5 h-5 text-[#064C32]" />
            <h2 className="font-serif font-bold text-base text-[#111111]">
              Brand Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Store Name
              </label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName || 'BIYA FASHION'}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] font-semibold focus:outline-none focus:border-[#064C32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline || 'WEAR YOUR STYLE'}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] font-semibold focus:outline-none focus:border-[#064C32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Currency Symbol
              </label>
              <input
                type="text"
                name="currency"
                value={settings.currency || '₹'}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] font-semibold focus:outline-none focus:border-[#064C32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Currency Code
              </label>
              <input
                type="text"
                name="currencyCode"
                value={settings.currencyCode || 'INR'}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] font-semibold focus:outline-none focus:border-[#064C32]"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp & Orders Configuration */}
        <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5E5]">
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <h2 className="font-serif font-bold text-base text-[#111111]">
              WhatsApp Orders
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                WhatsApp Phone Number (with Country Code, no + or spaces)
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={settings.whatsappNumber || '919486118211'}
                onChange={handleInputChange}
                placeholder="919486118211"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#064C32]"
              />
              <span className="text-[10px] text-[#666666] mt-1 block">
                Direct customer orders and customer support chat will be directed here.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Support Helpline Display
              </label>
              <input
                type="text"
                name="supportPhone"
                value={settings.supportPhone || '+91 96556 25186'}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Configuration */}
        <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5E5]">
            <Truck className="w-5 h-5 text-[#064C32]" />
            <h2 className="font-serif font-bold text-base text-[#111111]">
              Shipping Charges
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Standard Delivery Charge (₹)
              </label>
              <input
                type="number"
                name="deliveryCharge"
                min={0}
                value={settings.deliveryCharge ?? 49}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Free Delivery Above Threshold (₹)
              </label>
              <input
                type="number"
                name="freeDeliveryAbove"
                min={0}
                value={settings.freeDeliveryAbove || 999}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
              />
              <span className="text-[10px] text-[#666666] mt-1 block">
                Orders equal or exceeding this amount receive free shipping.
              </span>
            </div>
          </div>
        </div>

        {/* Support & Physical Address */}
        <div className="bg-[#F8F8F8] p-6 rounded-3xl border border-[#E5E5E5] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5E5]">
            <Mail className="w-5 h-5 text-[#064C32]" />
            <h2 className="font-serif font-bold text-base text-[#111111]">
              Store Contacts & Address
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Support Email
              </label>
              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail || 'biyasfashion02@gmail.com'}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Physical Atelier / Store Address
              </label>
              <textarea
                name="address"
                rows={2}
                value={settings.address || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2"
          >
            {saved ? <Check className="w-4 h-4 text-[#F3D477]" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Settings Saved' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
