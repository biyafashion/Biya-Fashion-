import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Package,
  ShoppingBag,
  User,
  Search,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  Send,
  Sparkles,
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import * as storageService from '../services/storageService';
import { fetchOrdersFromBackend } from '../services/apiService';
import crownBLogo from '../assets/crown-b-logo.png';
import chatbotAvatar from '../assets/chatbot-avatar.png';

/**
 * BIYA FASHION - Live Database & Account Action Assistant
 * 
 * Strict Requirements:
 * - NO WhatsApp fallback button
 * - NO hardcoded static knowledge base
 * - Real-time Database & Account Actions only:
 *    1. Live Order Tracking (fetch from Firebase & storageService)
 *    2. Live Product Catalog Search & In-stock display
 *    3. Customer Account Profile & Address Lookup
 *    4. Live Bag / Cart Status & Checkout action
 */
const BiyaChatBot = () => {
  const navigate = useNavigate();
  const { customer, openAuthModal } = useCustomerAuth();
  const { products = [] } = useProducts();
  const { cart = [], subtotal, deliveryFee, grandTotal, openCart } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Initial welcome message based on customer auth state
  useEffect(() => {
    if (messages.length === 0) {
      resetConversation();
    }
  }, [customer]);

  const resetConversation = () => {
    const greetingText = customer?.name
      ? `Hello ${customer.name}! 👋 I am your Biya Chatbot. How may I assist you with your account or orders today?`
      : `Welcome to BIYA FASHION! 👋 I am your Biya Chatbot. Select an option below to track orders, search products, or check your bag.`;

    setMessages([
      {
        id: 'msg-welcome-1',
        sender: 'bot',
        text: greetingText,
        type: 'text',
      },
      {
        id: 'msg-welcome-2',
        sender: 'bot',
        text: 'Select a live database action below or type an Order ID or product name:',
        type: 'actions',
      },
    ]);
  };

  // Helper to fetch customer orders from both LocalStorage & Backend Firebase
  const getLiveOrders = async () => {
    let allOrders = storageService.getOrders() || [];
    try {
      const remoteOrders = await fetchOrdersFromBackend();
      if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
        const orderMap = new Map();
        [...allOrders, ...remoteOrders].forEach((o) => {
          if (o && o.id) orderMap.set(String(o.id), o);
        });
        allOrders = Array.from(orderMap.values());
      }
    } catch {
      // Use local orders fallback
    }
    return allOrders;
  };

  // 1. ACTION: Track My Orders
  const handleTrackOrders = async () => {
    setIsSearching(true);
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: 'Track My Orders' },
    ]);

    try {
      const allOrders = await getLiveOrders();
      let customerOrders = [];

      if (customer) {
        const cPhone = (customer.phone || '').trim().toLowerCase();
        const cEmail = (customer.email || '').trim().toLowerCase();
        const cId = String(customer.id || '');

        customerOrders = allOrders.filter((o) => {
          const oPhone = (o.customer?.phone || '').trim().toLowerCase();
          const oEmail = (o.customer?.email || '').trim().toLowerCase();
          const oCustId = String(o.customer?.id || '');
          return (
            (cPhone && oPhone === cPhone) ||
            (cEmail && oEmail === cEmail) ||
            (cId && oCustId === cId)
          );
        });
      }

      if (customerOrders.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            type: 'orders_list',
            text: `Found ${customerOrders.length} order(s) registered under your account:`,
            orders: customerOrders,
          },
        ]);
      } else if (customer) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            type: 'text',
            text: `No active orders found for account (${customer.phone || customer.email}). If you placed an order as guest, please enter your Order ID (e.g. BFA-2026-0001) below to search.`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            type: 'guest_order_lookup',
            text: `You are currently browsing as a Guest. Please sign in to see your full order history, or enter your Order ID (e.g. BFA-2026-0001) or phone number below:`,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'text',
          text: 'Unable to retrieve orders at this moment. Please check your network connection.',
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  // 2. ACTION: Browse Products
  const handleBrowseProducts = () => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: 'Browse Live Products' },
    ]);

    const inStockProducts = products.filter((p) => (p.stock === undefined || p.stock > 0));

    if (inStockProducts.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'products_list',
          text: `Here are ${inStockProducts.length} live product(s) available in store:`,
          products: inStockProducts.slice(0, 6),
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'text',
          text: 'Catalog is currently being updated. No in-stock products available right now.',
        },
      ]);
    }
  };

  // 3. ACTION: My Account Details
  const handleAccountDetails = () => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: 'My Account Details' },
    ]);

    if (customer) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'account_card',
          text: 'Here are your verified account details from our database:',
          account: customer,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'guest_prompt',
          text: 'You are currently browsing as a Guest. Sign in to view and manage your profile and shipping address.',
        },
      ]);
    }
  };

  // 4. ACTION: My Bag Status
  const handleCartStatus = () => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: 'My Bag Status' },
    ]);

    if (cart.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'cart_summary',
          text: `You currently have ${cart.length} item(s) in your shopping bag:`,
          cartItems: cart,
          subtotal,
          deliveryFee,
          grandTotal,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'text',
          text: 'Your shopping bag is currently empty. Explore our catalog to add luxury essentials!',
        },
      ]);
    }
  };

  // Handle Free-Text Submission
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const query = inputText.trim();
    if (!query) return;

    setInputText('');
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: query },
    ]);

    setIsSearching(true);
    const lowerQuery = query.toLowerCase();

    // Check if query is an Order ID or Phone number search
    const isOrderQuery =
      lowerQuery.includes('bfa-') ||
      lowerQuery.includes('order') ||
      lowerQuery.includes('track') ||
      /^[0-9]{5,12}$/.test(query.replace(/\s+/g, ''));

    if (isOrderQuery) {
      try {
        const allOrders = await getLiveOrders();
        const cleanQuery = query.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();

        const matched = allOrders.filter((o) => {
          const idMatch = String(o.id || '').toLowerCase().includes(cleanQuery);
          const phoneMatch = String(o.customer?.phone || '').replace(/\D/g, '').includes(cleanQuery);
          return idMatch || phoneMatch;
        });

        if (matched.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              type: 'orders_list',
              text: `Found ${matched.length} matching order(s) in database:`,
              orders: matched,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              type: 'text',
              text: `No order found matching "${query}". Please verify the Order ID (e.g. BFA-2026-0001) or mobile number.`,
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            type: 'text',
            text: 'Error checking database. Please try again.',
          },
        ]);
      } finally {
        setIsSearching(false);
      }
      return;
    }

    // Check if query matches products in live database
    const matchedProducts = products.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return name.includes(lowerQuery) || cat.includes(lowerQuery) || desc.includes(lowerQuery);
    });

    if (matchedProducts.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'products_list',
          text: `Found ${matchedProducts.length} product(s) matching "${query}":`,
          products: matchedProducts.slice(0, 6),
        },
      ]);
      setIsSearching(false);
      return;
    }

    // Check if query is about bag / cart
    if (lowerQuery.includes('cart') || lowerQuery.includes('bag') || lowerQuery.includes('checkout')) {
      handleCartStatus();
      setIsSearching(false);
      return;
    }

    // Check if query is about profile / account
    if (
      lowerQuery.includes('account') ||
      lowerQuery.includes('profile') ||
      lowerQuery.includes('address') ||
      lowerQuery.includes('login')
    ) {
      handleAccountDetails();
      setIsSearching(false);
      return;
    }

    // Default fallback: prompt user with live database action buttons
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        type: 'actions',
        text: `I am your Biya Chatbot. I can look up live orders, show products in stock, or check your account details:`,
      },
    ]);
    setIsSearching(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 sm:gap-2.5 pl-2 pr-3.5 sm:pl-2.5 sm:pr-4 py-1.5 sm:py-2 bg-[#064C32] hover:bg-[#033B27] text-white rounded-full shadow-2xl border-2 border-[#D9A514] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Open Store Assistant"
        >
          {/* Animated pulse ring */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#25D366] border-2 border-white"></span>
          </span>

          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 p-0.5 flex items-center justify-center overflow-hidden border border-[#D9A514]/40 shadow-inner group-hover:scale-110 transition-transform">
            <img src={chatbotAvatar} alt="Biya Bot" className="w-full h-full object-contain" />
          </div>

          <div className="text-left">
            <span className="block font-serif font-black text-xs sm:text-sm tracking-wide text-white">
              Chat Bot
            </span>
            <span className="block text-[9px] text-[#F3D477] font-semibold uppercase tracking-wider">
              Online Help
            </span>
          </div>
        </button>
      )}

      {/* Main Chat Assistant Modal */}
      {isOpen && (
        <div className="w-[calc(100vw-24px)] sm:w-[390px] max-w-[390px] h-[520px] sm:h-[550px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-[#E5E5E5] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#033B27] px-4 py-3 flex items-center justify-between border-b-2 border-[#D9A514]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white p-1 flex items-center justify-center border-2 border-[#D9A514] shadow-sm shrink-0">
                <img src={chatbotAvatar} alt="Biya Bot" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-serif font-black text-xs sm:text-sm text-white tracking-wider flex items-center gap-1.5">
                  BIYA CHATBOT
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                  <span className="text-[10px] text-[#D9A514] font-semibold tracking-wide">
                    Live Assistant • Online
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetConversation}
                title="Restart chat"
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-[#FAF9F6]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-white border border-[#D9A514]/40 p-0.5 shrink-0 self-start mt-0.5 shadow-xs">
                    <img src={chatbotAvatar} alt="Bot" className="w-full h-full object-contain" />
                  </div>
                )}
                <div
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}
                >
                  {/* Standard Message Bubble */}
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#064C32] text-white rounded-br-none shadow-sm'
                        : 'bg-white text-[#111111] border border-[#E5E5E5] rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                {/* Database Quick Actions Chips */}
                {msg.type === 'actions' && (
                  <div className="mt-2.5 w-full grid grid-cols-2 gap-2">
                    <button
                      onClick={handleTrackOrders}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F3F4F6] border border-[#064C32]/30 hover:border-[#064C32] rounded-xl text-[11px] font-bold text-[#064C32] transition shadow-xs"
                    >
                      <Package className="w-3.5 h-3.5 text-[#064C32] shrink-0" />
                      <span className="truncate">Track My Orders</span>
                    </button>

                    <button
                      onClick={handleBrowseProducts}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F3F4F6] border border-[#064C32]/30 hover:border-[#064C32] rounded-xl text-[11px] font-bold text-[#064C32] transition shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#064C32] shrink-0" />
                      <span className="truncate">Browse Products</span>
                    </button>

                    <button
                      onClick={handleAccountDetails}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F3F4F6] border border-[#064C32]/30 hover:border-[#064C32] rounded-xl text-[11px] font-bold text-[#064C32] transition shadow-xs"
                    >
                      <User className="w-3.5 h-3.5 text-[#064C32] shrink-0" />
                      <span className="truncate">My Account</span>
                    </button>

                    <button
                      onClick={handleCartStatus}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F3F4F6] border border-[#064C32]/30 hover:border-[#064C32] rounded-xl text-[11px] font-bold text-[#064C32] transition shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#D9A514] shrink-0" />
                      <span className="truncate">My Bag ({cart.length})</span>
                    </button>
                  </div>
                )}

                {/* Orders List View from Database */}
                {msg.type === 'orders_list' && (
                  <div className="mt-2 w-full space-y-2">
                    {msg.orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white p-3 rounded-2xl border border-[#E5E5E5] shadow-xs text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[#064C32] text-[11px]">
                            {ord.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              ord.status === 'Delivered'
                                ? 'bg-[#e6f4ea] text-[#137333]'
                                : 'bg-[#e8f0fe] text-[#1a73e8]'
                            }`}
                          >
                            {ord.status || 'Confirmed'}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#666666]">
                          {(ord.items || []).map((it, idx) => (
                            <div key={idx} className="truncate">
                              • {it.name} ({it.selectedSize || 'Free Size'}) x {it.quantity || 1}
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-[#F0F0F0]">
                          <span className="font-bold text-[#111111] text-[11px]">
                            Total: ₹{ord.total}
                          </span>
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              navigate('/my-orders');
                            }}
                            className="text-[10px] font-bold text-[#064C32] hover:underline flex items-center gap-1"
                          >
                            View Order <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Products List View from Database */}
                {msg.type === 'products_list' && (
                  <div className="mt-2 w-full space-y-2">
                    {msg.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white p-2.5 rounded-2xl border border-[#E5E5E5] shadow-xs flex items-center gap-3 text-xs"
                      >
                        <img
                          src={(prod.images && prod.images[0]) || '/placeholder.png'}
                          alt={prod.name}
                          className="w-12 h-14 object-cover rounded-lg border border-[#F0F0F0] shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#111111] text-[11px] truncate">
                            {prod.name}
                          </h4>
                          <span className="text-[10px] text-[#666666] block">
                            {prod.category || 'Apparel'}
                          </span>
                          <span className="font-bold text-[#064C32] text-xs mt-0.5 block">
                            ₹{prod.discountPrice || prod.price}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            navigate(`/product/${prod.id}`);
                          }}
                          className="px-2.5 py-1.5 bg-[#064C32] text-white rounded-lg text-[10px] font-bold hover:bg-[#033B27] shrink-0"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Account Card from Database */}
                {msg.type === 'account_card' && (
                  <div className="mt-2 w-full bg-white p-3 rounded-2xl border border-[#E5E5E5] shadow-xs text-xs space-y-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#F0F0F0]">
                      <div className="w-7 h-7 rounded-full bg-[#064C32]/10 flex items-center justify-center font-bold text-[#064C32]">
                        {msg.account.name ? msg.account.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-[#111111] text-xs">
                          {msg.account.name}
                        </div>
                        <div className="text-[10px] text-[#666666]">
                          {msg.account.phone} • {msg.account.email || 'No email registered'}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#444444] space-y-0.5">
                      <div className="font-bold text-[#111111] text-[10px] uppercase tracking-wider">
                        Registered Address:
                      </div>
                      <div>{msg.account.address || 'No street address saved'}</div>
                      <div>
                        {msg.account.city ? `${msg.account.city}, ` : ''}
                        {msg.account.state || ''}
                        {msg.account.pincode ? ` - ${msg.account.pincode}` : ''}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/my-orders');
                      }}
                      className="w-full py-1.5 bg-[#F8F8F8] hover:bg-[#EAEAEA] text-[#064C32] font-bold text-[10px] rounded-lg border border-[#E5E5E5] text-center"
                    >
                      Go to My Orders & Profile
                    </button>
                  </div>
                )}

                {/* Guest Account Sign-in Prompt */}
                {(msg.type === 'guest_prompt' || msg.type === 'guest_order_lookup') && (
                  <div className="mt-2 w-full">
                    <button
                      onClick={() => openAuthModal('signin')}
                      className="w-full py-2 bg-[#064C32] hover:bg-[#033B27] text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      Sign In / Register
                    </button>
                  </div>
                )}

                {/* Cart Summary Card */}
                {msg.type === 'cart_summary' && (
                  <div className="mt-2 w-full bg-white p-3 rounded-2xl border border-[#E5E5E5] shadow-xs text-xs space-y-2">
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {msg.cartItems.map((ci) => (
                        <div key={ci.cartItemId} className="flex justify-between text-[11px]">
                          <span className="truncate max-w-[170px]">
                            {ci.name} ({ci.size}) x {ci.quantity}
                          </span>
                          <span className="font-bold text-[#111111]">
                            ₹{ci.price * ci.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#F0F0F0] space-y-1 text-[11px]">
                      <div className="flex justify-between text-[#666666]">
                        <span>Subtotal:</span>
                        <span>₹{msg.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-[#666666]">
                        <span>Delivery Fee:</span>
                        <span>{msg.deliveryFee === 0 ? 'FREE' : `₹${msg.deliveryFee}`}</span>
                      </div>
                      <div className="flex justify-between font-bold text-[#064C32] text-xs pt-1 border-t border-[#F0F0F0]">
                        <span>Grand Total:</span>
                        <span>₹{msg.grandTotal}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/checkout');
                      }}
                      className="w-full py-2 bg-[#064C32] hover:bg-[#033B27] text-white rounded-xl font-bold text-xs transition shadow-sm"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}
                </div>
              </div>
            ))}

            {isSearching && (
              <div className="flex items-center gap-2 text-xs text-[#666666] italic">
                <span className="w-2 h-2 rounded-full bg-[#064C32] animate-ping"></span>
                Querying store database...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Search Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-[#E5E5E5] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Search Order ID, product, or account..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5] text-xs text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#064C32]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-[#064C32] text-white hover:bg-[#033B27] disabled:opacity-40 disabled:pointer-events-none transition"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BiyaChatBot;
