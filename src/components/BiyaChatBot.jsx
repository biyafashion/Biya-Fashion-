import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Package,
  ShoppingBag,
  User,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  Send,
  Sparkles,
  Phone,
  ShieldCheck,
  Languages,
  CreditCard,
  Tag,
  Shirt,
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import * as storageService from '../services/storageService';
import { fetchOrdersFromBackend } from '../services/apiService';
import STORE_CONFIG from '../config/storeConfig';
import chatbotAvatar from '../assets/chatbot-avatar.png';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LOTTIE_URL = "https://lottie.host/4a25f606-d3a9-42f8-8b76-f27894d114ec/Qj3IyODnAn.lottie";

/**
 * Bilingual Store Knowledge Base & UI Text (English & தமிழ்)
 */
const BOT_I18N = {
  en: {
    title: "BIYA CHATBOT",
    subtitle: "AI Assistant • Online",
    greeting: (name) => name ? `Hello ${name}! 👋 I am your Biya Assistant.` : `Welcome to BIYA FASHION! 👋 I am your Biya Assistant.`,
    languagePrompt: "Please choose your preferred language / மொழியை தேர்ந்தெடுக்கவும்:",
    actionsPrompt: "Select an option below or type your question in English or தமிழ்:",
    inputPlaceholder: "Type in English or தமிழ் (e.g. delivery, size)...",
    queryingDb: "Querying store database...",
    actions: {
      trackOrders: "Track My Orders",
      browseProducts: "Browse Products",
      myBag: "My Bag",
      deliveryInfo: "Delivery & Shipping",
      returnPolicy: "Return & Exchange",
      paymentInfo: "Payment Methods",
      fabricQuality: "Fabric & GSM Quality",
      storeContact: "Store Helpline",
    },
    delivery: `🚚 **Delivery & Shipping Details:**\n• Standard delivery charge: ₹49\n• **FREE Delivery** on orders above ₹999 across India!\n• Fast dispatch within 24 hours via express couriers.\n• Average delivery time: 2 - 4 business days.`,
    returns: `🔄 **7 Days Easy Returns & Exchanges:**\n• Hassle-free return or size exchange within 7 days of delivery.\n• Garments must be unworn, unwashed with original BIYA tags intact.\n• Doorstep pickup available. For exchange support: +91 94861 18211.`,
    payment: `💳 **Payment Options:**\n• We accept all UPI modes: Google Pay, PhonePe, Paytm, BHIM.\n• Net Banking & Direct Bank Transfer.\n• Official digital tax invoice generated automatically upon order confirmation.`,
    fabric: `✨ **Fabric & Craftsmanship:**\n• 100% Super-Combed Bio-Washed Organic Cotton.\n• Heavyweight 240 GSM fabric engineered for structural drape, zero shrinkage, and breathable all-day comfort.\n• High color fastness and anti-pilling longevity.`,
    sizing: `👕 **Size & Fit Guide:**\n• Available in S, M, L, XL, and XXL.\n• Tailored in both Relaxed Street Oversized Fit and Regular Contemporary Silhouette.\n• View detailed measurements on each product page.`,
    contact: `📞 **Store Information & Support:**\n• Store Helpline: +91 96556 25186\n• WhatsApp Orders: +91 94861 18211\n• Email: biyasfashion02@gmail.com\n• Atelier: Pandiyan Nagar, Karaiyapatti, Virudhunagar - 626106, Tamil Nadu.`,
    offer: `🏷️ **Exclusive Privileges & Discounts:**\n• Apply discount promo code **BIYASTYLE** at checkout for up to 35% seasonal privilege!\n• Free Express Delivery automatically applies above ₹999.`,
    noOrderFound: (q) => `No order found matching "${q}". Please verify the Order ID (e.g. BFA-2026-0001) or mobile number.`,
    foundOrders: (count) => `Found ${count} matching order(s) in database:`,
    foundProducts: (count, q) => `Found ${count} product(s) matching "${q}":`,
    noProductFound: (q) => `No products found matching "${q}". Try searching 'T-Shirt', 'Polo', or 'Black'.`,
    emptyCart: "Your shopping bag is currently empty. Explore our catalog to add luxury essentials!",
    fallback: "I am your Biya Assistant. I can track your orders, explain delivery and returns, search clothes in stock, or check your bag. How can I help?",
  },
  ta: {
    title: "பியா சாட்பாட்",
    subtitle: "லைவ் அசிஸ்டன்ட் • ஆன்லைன்",
    greeting: (name) => name ? `வணக்கம் ${name}! 👋 நான் உங்கள் பியா அசிஸ்டன்ட்.` : `பியா ஃபேஷனுக்கு உங்களை அன்போடு வரவேற்கிறோம்! 👋 நான் உங்கள் பியா அசிஸ்டன்ட்.`,
    languagePrompt: "உங்கள் விருப்ப மொழியை தேர்ந்தெடுக்கவும் / Choose your language:",
    actionsPrompt: "கீழுள்ள ஆப்ஷனை கிளிக் செய்யவும் அல்லது உங்கள் கேள்வியை தமிழ்/English-ல் டைப் செய்யவும்:",
    inputPlaceholder: "தமிழ் அல்லது ஆங்கிலத்தில் டைப் செய்யவும் (எ.கா: டெலிவரி, சைஸ்)...",
    queryingDb: "டேட்டாபேஸில் விபரம் சரிபார்க்கப்படுகிறது...",
    actions: {
      trackOrders: "என் ஆர்டர்களை பார்க்க",
      browseProducts: "உடைகளை பார்க்க",
      myBag: "என் ஷாப்பிங் பை",
      deliveryInfo: "டெலிவரி & கட்டணம்",
      returnPolicy: "ரிட்டர்ன் & எக்ஸ்சேஞ்ச்",
      paymentInfo: "பேமெண்ட் முறைகள்",
      fabricQuality: "துணியின் தரம் (GSM)",
      storeContact: "கடை உதவி எண்",
    },
    delivery: `🚚 **டெலிவரி & ஷிப்பிங் விபரங்கள்:**\n• வழக்கமான டெலிவரி கட்டணம்: ₹49\n• ₹999-க்கு மேல் உள்ள அனைத்து ஆர்டர்களுக்கும் **இலவச டெலிவரி (FREE Delivery)**!\n• 24 மணி நேரத்திற்குள் கொரியரில் அனுப்பப்படும்.\n• பொதுவாக 2 முதல் 4 நாட்களுக்குள் உங்கள் வீட்டுக்கு வந்து சேரும்.`,
    returns: `🔄 **7 நாட்கள் எளிதான ரிட்டர்ன் & எக்ஸ்சேஞ்ச்:**\n• டெலிவரி ஆன 7 நாட்களுக்குள் துணியை மாற்றிக்கொள்ளலாம் (Size Exchange).\n• துணியில் உள்ள Biya Fashion டேக் கிழியாமலும், வாஷ் செய்யாமலும் இருக்க வேண்டும்.\n• உங்கள் வீட்டிற்கே வந்து மாற்றிக்கொடுப்போம்! வாட்ஸ்அப்: +91 94861 18211.`,
    payment: `💳 **பேமெண்ட் முறைகள்:**\n• கூகுள் பே (GPay), PhonePe, Paytm, UPI மூலமாக சுலபமாக செலுத்தலாம்.\n• நெட் பேங்கிங் மற்றும் நேரடி வங்கி பரிவர்த்தனை வசதியும் உண்டு.\n• ஆர்டர் உறுதி செய்யப்பட்டவுடன் உடனடி ஜிஎஸ்டி இன்வாய்ஸ் பில் வழங்கப்படும்.`,
    fabric: `✨ **துணியின் தரம் மற்றும் மெட்டீரியல்:**\n• 100% தூய பயோ-வாஷ்ட் காம்ப்ட் காட்டன் (Combed Cotton).\n• 240 GSM தடிமன் கொண்ட பிரீமியம் ஃபேப்ரிக் — சாயம் போகாது, சுருங்காது.\n• நாள் முழுவதும் அணிய மிகவும் வசதியாகவும், ஸ்டைலாகவும் இருக்கும்.`,
    sizing: `👕 **சைஸ் (அளவு) விபரங்கள்:**\n• S, M, L, XL, XXL ஆகிய அனைத்து அளவுகளிலும் கிடைக்கும்.\n• டிரெண்டி ஓவர்சைஸ்டு (Oversized) மற்றும் ரெகுலர் ஃபிட் (Regular Fit) மாடல்கள் உள்ளன.\n• தயாரிப்பு பக்கத்தில் விரிவான அளவு விவரங்களை காணலாம்.`,
    contact: `📞 **கடை முகவரி மற்றும் தொடர்பு எண்கள்:**\n• கடை உதவி எண் (Helpline): +91 96556 25186\n• வாட்ஸ்அப் ஆர்டர்கள் (WhatsApp Orders): +91 94861 18211\n• இமெயில்: biyasfashion02@gmail.com\n• முகவரி: பாண்டியன் நகர், காரியாபட்டி, விருதுநகர் - 626106, தமிழ்நாடு.`,
    offer: `🏷️ **சிறப்பு தள்ளுபடி சலுகைகள்:**\n• செக் அவுட் செய்யும் போது **BIYASTYLE** என்ற கூப்பன் கோடை பயன்படுத்தி சிறப்பு தள்ளுபடி பெறுங்கள்!\n• ₹999-க்கு மேல் வாங்கினால் டெலிவரி முற்றிலும் இலவசம்.`,
    noOrderFound: (q) => `"${q}" என்ற எண்ணில் ஆர்டர் எதுவும் கிடைக்கவில்லை. உங்கள் Order ID அல்லது மொபைல் எண்ணை சரிபார்க்கவும்.`,
    foundOrders: (count) => `${count} ஆர்டர்கள் டேட்டாபேஸில் உள்ளன:`,
    foundProducts: (count, q) => `"${q}" பெயரில் ${count} ஆடைகள் உள்ளன:`,
    noProductFound: (q) => `மன்னிக்கவும், "${q}" என்ற பெயரில் ஆடைகள் இல்லை. 'T-Shirt', 'Polo' என தேடவும்.`,
    emptyCart: "உங்கள் ஷாப்பிங் பை காலியாக உள்ளது. புதிய ஆடைகளை சேர்க்க எங்கள் கேட்டலாக்கை பார்க்கவும்!",
    fallback: "நான் பியா ஃபேஷன் அசிஸ்டன்ட். ஆர்டர் டிராக் செய்தல், டெலிவரி விபரங்கள், ரிட்டர்ன் பாலிசி, துணியின் தரம் பற்றி உங்களுக்கு உதவ முடியும். உங்களுக்கு என்ன வேண்டும்?",
  }
};

/**
 * BIYA FASHION - Bilingual Hybrid Smart Assistant
 */
const BiyaChatBot = () => {
  const navigate = useNavigate();
  const { customer, openAuthModal } = useCustomerAuth();
  const { products = [] } = useProducts();
  const { cart = [], subtotal, deliveryFee, grandTotal } = useCart();

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('biya_bot_lang') || 'en';
  });
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef(null);

  const t = BOT_I18N[language] || BOT_I18N.en;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (messages.length === 0) {
      resetConversation(language);
    }
  }, [customer]);

  const switchLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('biya_bot_lang', newLang);
    const isTa = newLang === 'ta';
    setMessages((prev) => [
      ...prev,
      {
        id: `user-lang-${Date.now()}`,
        sender: 'user',
        text: isTa ? '🇮🇳 தமிழ் (Tamil)' : '🇬🇧 English',
      },
      {
        id: `bot-lang-confirm-${Date.now()}`,
        sender: 'bot',
        text: isTa
          ? 'மொழி தமிழுக்கு மாற்றப்பட்டது! 🇮🇳 உங்களுக்கு எவ்வாறு உதவ வேண்டும்? கீழே உள்ள ஆப்ஷன்களை தேர்ந்தெடுக்கலாம் அல்லது உங்கள் கேள்வியை டைப் செய்யலாம்:'
          : 'Language set to English! 🇬🇧 How can I help you today? Select an option below or type your question:',
        type: 'actions',
      },
    ]);
  };

  const resetConversation = (lang = language) => {
    const i18n = BOT_I18N[lang] || BOT_I18N.en;
    setMessages([
      {
        id: 'msg-welcome-1',
        sender: 'bot',
        text: i18n.greeting(customer?.name),
        type: 'text',
      },
      {
        id: 'msg-welcome-lang',
        sender: 'bot',
        text: i18n.languagePrompt,
        type: 'language_choice',
      },
      {
        id: 'msg-welcome-2',
        sender: 'bot',
        text: i18n.actionsPrompt,
        type: 'actions',
      },
    ]);
  };

  // Helper to fetch customer orders from LocalStorage & Backend Firebase
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
      // Local fallback
    }
    return allOrders;
  };

  // Action: Track Orders
  const handleTrackOrders = async () => {
    setIsSearching(true);
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: t.actions.trackOrders },
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
            text: t.foundOrders(customerOrders.length),
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
            text: language === 'ta'
              ? `உங்கள் கணக்கில் (${customer.phone || customer.email}) ஆர்டர்கள் எதுவும் இல்லை. நீங்கள் ஆர்டர் செய்திருந்தால் உங்கள் Order ID-ஐ கீழே டைப் செய்யவும்.`
              : `No active orders found for account (${customer.phone || customer.email}). Enter your Order ID below to search.`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            type: 'guest_order_lookup',
            text: language === 'ta'
              ? `முழு ஆர்டர் வரலாற்றை பார்க்க Sign In செய்யவும் அல்லது உங்கள் Order ID (எ.கா: BFA-2026-0001) அல்லது மொபைல் எண்ணை கீழே உள்ளீடு செய்யவும்:`
              : `Please sign in to see your full order history, or enter your Order ID (e.g. BFA-2026-0001) or phone number below:`,
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
          text: language === 'ta'
            ? 'டேட்டாபேஸ் தகவலை பெறுவதில் தாமதம் ஏற்பட்டுள்ளது. மீண்டும் முயற்சிக்கவும்.'
            : 'Unable to retrieve orders at this moment. Please check your network connection.',
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  // Action: Browse Catalog
  const handleBrowseProducts = () => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: t.actions.browseProducts },
    ]);

    const inStockProducts = products.filter((p) => p.inStock !== false);
    if (inStockProducts.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'products_list',
          text: language === 'ta'
            ? `தற்போது கடையில் உள்ள பிரீமியம் ஆடைகள் (${inStockProducts.length}):`
            : `Here are ${inStockProducts.length} live product(s) available in store:`,
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
          text: language === 'ta'
            ? 'புதிய ஆடைகள் விரைவில் சேர்க்கப்பட உள்ளன. காத்திருக்கவும்!'
            : 'Catalog is currently being updated. No in-stock products available right now.',
        },
      ]);
    }
  };

  // Action: My Bag Status
  const handleCartStatus = () => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: t.actions.myBag },
    ]);

    if (cart.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'cart_summary',
          text: language === 'ta'
            ? `உங்கள் ஷாப்பிங் பையில் ${cart.length} பொருட்கள் உள்ளன:`
            : `You currently have ${cart.length} item(s) in your shopping bag:`,
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
          text: t.emptyCart,
        },
      ]);
    }
  };

  // Action: Delivery Info
  const handleDeliveryInfo = () => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: t.actions.deliveryInfo },
      { id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: t.delivery },
    ]);
  };

  // Action: Return Policy
  const handleReturnInfo = () => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: t.actions.returnPolicy },
      { id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: t.returns },
    ]);
  };

  // Action: Payment Info
  const handlePaymentInfo = () => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: t.actions.paymentInfo },
      { id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: t.payment },
    ]);
  };

  // Action: Fabric & Quality
  const handleFabricInfo = () => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: t.actions.fabricQuality },
      { id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: t.fabric },
    ]);
  };

  // Action: Store Contact
  const handleContactInfo = () => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: t.actions.storeContact },
      { id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: t.contact },
    ]);
  };

  // Hybrid AI Generator (Optional Google Gemini API)
  const askGeminiAI = async (query, lang) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
      const systemPrompt = `You are the friendly, polite AI assistant for BIYA FASHION (premium streetwear and casual apparel brand, tagline: "WEAR YOUR STYLE").
Store Highlights:
- Store Phone: +91 96556 25186, WhatsApp Orders: +91 94861 18211.
- Free shipping on all orders above ₹999 across India (standard ₹49).
- 7 days easy return/exchange with doorstep pickup.
- 100% Combed Cotton, 240 GSM bio-washed heavy cotton.
- Sizes: S, M, L, XL, XXL (Oversized & Regular fit).
- Coupon code: BIYASTYLE for seasonal discount.
Answer the customer warmly, concisely, and accurately in ${lang === 'ta' ? 'Tamil / Tanglish' : 'English'}. Keep response under 3-4 sentences.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nCustomer question: ${query}` }],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch {
      return null;
    }
  };

  // Smart Multi-Language Intent Parser (Handles English, Tamil script, and Tanglish)
  const parseIntent = (text) => {
    const tLower = text.toLowerCase().trim();

    // Language switch
    if (tLower === 'tamil' || tLower === 'தமிழ்' || tLower.includes('tamil-la') || tLower.includes('tamil la') || tLower.includes('தமிழ்ல') || tLower.includes('tamil pesu')) {
      return 'switch_to_ta';
    }
    if (tLower === 'english' || tLower.includes('english-la') || tLower.includes('english la') || tLower.includes('in english')) {
      return 'switch_to_en';
    }

    // Delivery & shipping
    if (
      tLower.includes('deliver') || tLower.includes('ship') || tLower.includes('courier') ||
      tLower.includes('charge') || tLower.includes('fee') || tLower.includes('rate') ||
      tLower.includes('cost') || tLower.includes('free delivery') || tLower.includes('free shipping') ||
      tLower.includes('டெலிவரி') || tLower.includes('ஷிப்பிங்') || tLower.includes('கட்டணம்') ||
      tLower.includes('eppo varum') || tLower.includes('ethana naal') || tLower.includes('how many days') ||
      tLower.includes('reach') || tLower.includes('dispatch')
    ) {
      return 'delivery';
    }

    // Return & exchange
    if (
      tLower.includes('return') || tLower.includes('exchange') || tLower.includes('replace') ||
      tLower.includes('refund') || tLower.includes('damage') || tLower.includes('cancel') ||
      tLower.includes('ரிட்டர்ன்') || tLower.includes('எக்ஸ்சேஞ்ச்') || tLower.includes('மாற்ற') ||
      tLower.includes('panna mudiyuma') || tLower.includes('thirumba') || tLower.includes('money back')
    ) {
      return 'returns';
    }

    // Payment & COD
    if (
      tLower.includes('payment') || tLower.includes('pay') || tLower.includes('cod') ||
      tLower.includes('cash on delivery') || tLower.includes('gpay') || tLower.includes('phonepe') ||
      tLower.includes('upi') || tLower.includes('bhim') || tLower.includes('net banking') ||
      tLower.includes('பணம்') || tLower.includes('பேமெண்ட்') || tLower.includes('காசு') ||
      tLower.includes('kaasu') || tLower.includes('panam') || tLower.includes('epidi pay') || tLower.includes('how to pay')
    ) {
      return 'payment';
    }

    // Fabric, Cotton, GSM, Quality
    if (
      tLower.includes('fabric') || tLower.includes('cotton') || tLower.includes('gsm') ||
      tLower.includes('quality') || tLower.includes('cloth') || tLower.includes('material') ||
      tLower.includes('துணி') || tLower.includes('பருத்தி') || tLower.includes('தரம்') ||
      tLower.includes('pure cotton') || tLower.includes('bio wash') || tLower.includes('combed') ||
      tLower.includes('surunguma') || tLower.includes('color poguma') || tLower.includes('thick')
    ) {
      return 'fabric';
    }

    // Sizing & Fit
    if (
      tLower.includes('size') || tLower.includes('fit') || tLower.includes('chart') ||
      tLower.includes('oversize') || tLower.includes('regular') || tLower.includes('measurement') ||
      tLower.includes('அளவு') || tLower.includes('சைஸ்') || tLower.includes('xxl') || tLower.includes('xl')
    ) {
      return 'sizing';
    }

    // Contact, Owner, Helpline, Phone, Address
    if (
      tLower.includes('contact') || tLower.includes('phone') || tLower.includes('number') ||
      tLower.includes('address') || tLower.includes('call') || tLower.includes('owner') ||
      tLower.includes('helpline') || tLower.includes('mobile') || tLower.includes('location') ||
      tLower.includes('தொடர்பு') || tLower.includes('முகவரி') || tLower.includes('போன்') ||
      tLower.includes('enga irukku') || tLower.includes('number enna') || tLower.includes('kadai enga') ||
      tLower.includes('kadai') || tLower.includes('shop')
    ) {
      return 'contact';
    }

    // Offers, Coupons, Discounts
    if (
      tLower.includes('offer') || tLower.includes('discount') || tLower.includes('coupon') ||
      tLower.includes('promo') || tLower.includes('code') || tLower.includes('deal') ||
      tLower.includes('ஆபர்') || tLower.includes('தள்ளுபடி') || tLower.includes('kammi') ||
      tLower.includes('discount irukka') || tLower.includes('coupon code') || tLower.includes('biyastyle')
    ) {
      return 'offer';
    }

    // Greetings
    if (
      tLower === 'hi' || tLower === 'hello' || tLower === 'hey' || tLower === 'vanakkam' ||
      tLower === 'வணக்கம்' || tLower === 'namaste' || tLower === 'halo'
    ) {
      return 'greeting';
    }

    // Order tracking
    if (
      tLower.includes('bfa-') || tLower.includes('order') || tLower.includes('track') ||
      tLower.includes('ஆர்டர்') || tLower.includes('டிராக்') || /^[0-9]{5,12}$/.test(tLower.replace(/\s+/g, ''))
    ) {
      return 'order_query';
    }

    // Bag / Cart
    if (tLower.includes('cart') || tLower.includes('bag') || tLower.includes('checkout') || tLower.includes('பை')) {
      return 'cart';
    }

    return 'unknown';
  };

  // Handle Free-Text Submission from Customer
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
    const intent = parseIntent(query);

    // 1. Language switch intent
    if (intent === 'switch_to_ta') {
      switchLanguage('ta');
      setIsSearching(false);
      return;
    }
    if (intent === 'switch_to_en') {
      switchLanguage('en');
      setIsSearching(false);
      return;
    }

    // 2. Direct intent matches
    if (intent === 'delivery') {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: t.delivery },
      ]);
      setIsSearching(false);
      return;
    }
    if (intent === 'returns') {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: t.returns },
      ]);
      setIsSearching(false);
      return;
    }
    if (intent === 'payment') {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: t.payment },
      ]);
      setIsSearching(false);
      return;
    }
    if (intent === 'fabric') {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: t.fabric },
      ]);
      setIsSearching(false);
      return;
    }
    if (intent === 'sizing') {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: t.sizing },
      ]);
      setIsSearching(false);
      return;
    }
    if (intent === 'contact') {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: t.contact },
      ]);
      setIsSearching(false);
      return;
    }
    if (intent === 'offer') {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: 'bot', type: 'text', text: t.offer },
      ]);
      setIsSearching(false);
      return;
    }
    if (intent === 'greeting') {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'text',
          text: language === 'ta'
            ? 'வணக்கம்! நான் பியா ஃபேஷன் அசிஸ்டன்ட். உங்களுக்கு என்ன உதவி வேண்டும்?'
            : 'Hello! I am your Biya Assistant. How can I assist you with your shopping or orders today?',
        },
      ]);
      setIsSearching(false);
      return;
    }
    if (intent === 'cart') {
      handleCartStatus();
      setIsSearching(false);
      return;
    }

    // 3. Order Query lookup in live database
    if (intent === 'order_query') {
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
              text: t.foundOrders(matched.length),
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
              text: t.noOrderFound(query),
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
            text: language === 'ta' ? 'டேட்டாபேஸ் சரிபார்க்க முடியவில்லை.' : 'Error checking database. Please try again.',
          },
        ]);
      } finally {
        setIsSearching(false);
      }
      return;
    }

    // 4. Products search in live database
    const lowerQuery = query.toLowerCase();
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
          text: t.foundProducts(matchedProducts.length, query),
          products: matchedProducts.slice(0, 6),
        },
      ]);
      setIsSearching(false);
      return;
    }

    // 5. Hybrid Fallback: Attempt Gemini AI if key exists, otherwise smart fallback
    const aiAnswer = await askGeminiAI(query, language);
    if (aiAnswer) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'text',
          text: aiAnswer,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'actions',
          text: t.fallback,
        },
      ]);
    }
    setIsSearching(false);
  };

  const currentActionList = [
    { id: 'track', label: `📦 ${t.actions.trackOrders}`, onClick: handleTrackOrders },
    { id: 'products', label: `🛍️ ${t.actions.browseProducts}`, onClick: handleBrowseProducts },
    { id: 'delivery', label: `🚚 ${t.actions.deliveryInfo}`, onClick: handleDeliveryInfo },
    { id: 'returns', label: `🔄 ${t.actions.returnPolicy}`, onClick: handleReturnInfo },
    { id: 'payment', label: `💳 ${t.actions.paymentInfo}`, onClick: handlePaymentInfo },
    { id: 'fabric', label: `✨ ${t.actions.fabricQuality}`, onClick: handleFabricInfo },
    { id: 'contact', label: `📞 ${t.actions.storeContact}`, onClick: handleContactInfo },
    { id: 'cart', label: `🛍️ ${t.actions.myBag} (${cart.length})`, onClick: handleCartStatus },
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none">
      {/* Floating Trigger Button: Pure Lottie Mascot Character */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer drop-shadow-2xl focus:outline-none"
          aria-label="Open Store Assistant"
          title="Chat with Biya Assistant"
        >
          {/* Subtle online pulse badge */}
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex h-3.5 w-3.5 z-10 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#25D366] border-2 border-white shadow-xs"></span>
          </span>

          {/* Lottie Animation Character */}
          <div className="w-full h-full filter drop-shadow-lg">
            <DotLottieReact
              src={LOTTIE_URL}
              loop
              autoplay
              className="w-full h-full"
            />
          </div>
        </button>
      )}

      {/* Main Chat Assistant Modal */}
      {isOpen && (
        <div className="w-[calc(100vw-24px)] sm:w-[410px] max-w-[420px] h-[540px] sm:h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-[#E5E5E5] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#033B27] px-4 py-3 flex items-center justify-between border-b-2 border-[#D9A514]">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-full bg-white p-0.5 flex items-center justify-center border-2 border-[#D9A514] shadow-sm shrink-0 overflow-hidden">
                <DotLottieReact
                  src={LOTTIE_URL}
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>
              <div>
                <h3 className="font-serif font-black text-xs sm:text-sm text-white tracking-wider flex items-center gap-1.5">
                  {t.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                  <span className="text-[10px] text-[#D9A514] font-semibold tracking-wide">
                    {t.subtitle}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Language Switcher Button in Header */}
              <button
                onClick={() => switchLanguage(language === 'en' ? 'ta' : 'en')}
                className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#F3D477] border border-[#D9A514]/40 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                title="Change Language / மொழியை மாற்ற"
              >
                <Languages className="w-3 h-3" />
                <span>{language === 'en' ? '🇮🇳 தமிழ்' : '🇬🇧 EN'}</span>
              </button>

              <button
                onClick={() => resetConversation(language)}
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
                  <div className="w-8 h-8 rounded-full bg-white border border-[#D9A514]/40 p-0.5 shrink-0 self-start mt-0.5 shadow-xs overflow-hidden">
                    <DotLottieReact
                      src={LOTTIE_URL}
                      loop
                      autoplay
                      className="w-full h-full"
                    />
                  </div>
                )}
                <div
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}
                >
                  {/* Standard Message Bubble */}
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-[#064C32] text-white rounded-br-none shadow-sm'
                        : 'bg-white text-[#111111] border border-[#E5E5E5] rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Language Selection Chips */}
                  {msg.type === 'language_choice' && (
                    <div className="mt-2 w-full flex items-center gap-2">
                      <button
                        onClick={() => switchLanguage('en')}
                        className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                          language === 'en'
                            ? 'bg-[#064C32] text-white border-[#064C32]'
                            : 'bg-white hover:bg-gray-50 text-[#111111] border-[#E5E5E5]'
                        }`}
                      >
                        <span>🇬🇧</span>
                        <span>English</span>
                      </button>
                      <button
                        onClick={() => switchLanguage('ta')}
                        className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                          language === 'ta'
                            ? 'bg-[#064C32] text-white border-[#064C32]'
                            : 'bg-white hover:bg-gray-50 text-[#111111] border-[#E5E5E5]'
                        }`}
                      >
                        <span>🇮🇳</span>
                        <span>தமிழ் (Tamil)</span>
                      </button>
                    </div>
                  )}

                  {/* Bilingual Quick Actions Chips */}
                  {msg.type === 'actions' && (
                    <div className="mt-2.5 w-full grid grid-cols-2 gap-1.5 sm:gap-2">
                      {currentActionList.map((action) => (
                        <button
                          key={action.id}
                          onClick={action.onClick}
                          className="flex items-center gap-1.5 px-2.5 py-2 bg-white hover:bg-[#F3F4F6] border border-[#064C32]/25 hover:border-[#064C32] rounded-xl text-[11px] font-bold text-[#064C32] transition shadow-xs text-left cursor-pointer"
                        >
                          <span className="truncate">{action.label}</span>
                        </button>
                      ))}
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
                              className="text-[10px] font-bold text-[#064C32] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>{language === 'ta' ? 'விபரம் காண்க' : 'View Order'}</span>
                              <ExternalLink className="w-3 h-3" />
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
                          className="bg-white p-2.5 rounded-2xl border border-[#E5E5E5] shadow-xs flex items-center gap-3"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                            {prod.images && prod.images[0] ? (
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                👕
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 text-left">
                            <h4 className="font-bold text-xs text-[#111111] truncate">
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-bold text-[#064C32] text-xs">
                                ₹{prod.price}
                              </span>
                              {prod.originalPrice > prod.price && (
                                <span className="text-[10px] text-gray-400 line-through">
                                  ₹{prod.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setIsOpen(false);
                              navigate(`/product/${prod.id}`);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-[#064C32] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#033B27] shrink-0 cursor-pointer"
                          >
                            {language === 'ta' ? 'வாங்க' : 'Shop'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Guest Account Sign-in Prompt */}
                  {msg.type === 'guest_order_lookup' && (
                    <div className="mt-2 w-full">
                      <button
                        onClick={() => openAuthModal('signin')}
                        className="w-full py-2 bg-[#064C32] hover:bg-[#033B27] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        {language === 'ta' ? 'Sign In / கணக்கு தொடங்க' : 'Sign In / Register'}
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
                        className="w-full py-2 bg-[#064C32] hover:bg-[#033B27] text-white rounded-xl font-bold text-xs transition shadow-sm cursor-pointer"
                      >
                        {language === 'ta' ? 'செக் அவுட் செல்லவும்' : 'Proceed to Checkout'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isSearching && (
              <div className="flex items-center gap-2 text-xs text-[#666666] italic">
                <span className="w-2 h-2 rounded-full bg-[#064C32] animate-ping"></span>
                <span>{t.queryingDb}</span>
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
              placeholder={t.inputPlaceholder}
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5] text-xs text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#064C32]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-[#064C32] text-white hover:bg-[#033B27] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
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
