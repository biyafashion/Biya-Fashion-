/**
 * BIYA FASHION - Centralized Storage Service
 * 
 * Manages all browser localStorage operations for:
 * - Products
 * - Categories
 * - Cart
 * - Wishlist
 * - Orders
 * - Customers
 * - Admin Session
 * - Store Settings
 * 
 * NOTE: Frontend-only application. Data is persisted exclusively in the user's browser.
 */

import { DEMO_PRODUCTS, DEMO_CATEGORIES, DEMO_ORDERS, DEMO_SETTINGS } from '../data/demoProducts';
import { ADMIN_CONFIG } from '../config/adminConfig';

const KEYS = {
  PRODUCTS: 'biya_fashion_products',
  CATEGORIES: 'biya_fashion_categories',
  CART: 'biya_fashion_cart',
  WISHLIST: 'biya_fashion_wishlist',
  ORDERS: 'biya_fashion_orders',
  SETTINGS: 'biya_fashion_settings',
  ADMIN_SESSION: ADMIN_CONFIG.SESSION_STORAGE_KEY,
  CUSTOMER_ACCOUNTS: 'biya_fashion_customer_accounts',
  CUSTOMER_SESSION: 'biya_fashion_customer_session',
};

// Safe localStorage helper
const safeGet = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`[StorageService] Error reading key "${key}":`, err);
    return fallback;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[StorageService] Error writing key "${key}":`, err);
    return false;
  }
};

/**
 * Initialize storage with demo data ONLY if it does not already exist.
 * Automatically migrates to updated catalog versions (e.g. T-Shirts & Polo T-Shirts exclusive).
 */
export const initializeStorage = () => {
  const CATALOG_VERSION = 'v6_absolute_purge_zero_demo';
  const currentVersion = localStorage.getItem('biya_catalog_version');

  if (currentVersion !== CATALOG_VERSION) {
    safeSet(KEYS.PRODUCTS, []);
    safeSet(KEYS.CATEGORIES, DEMO_CATEGORIES);
    safeSet(KEYS.ORDERS, []);
    safeSet(KEYS.CART, []);
    safeSet(KEYS.WISHLIST, []);
    localStorage.setItem('biya_catalog_version', CATALOG_VERSION);
  }

  // Double Check: If any demo products linger in browser storage, force-purge them immediately
  const existingProds = safeGet(KEYS.PRODUCTS, []);
  const demoIds = ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8'];
  if (Array.isArray(existingProds) && existingProds.some((p) => demoIds.includes(String(p?.id)))) {
    safeSet(KEYS.PRODUCTS, []);
    safeSet(KEYS.ORDERS, []);
  }

  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    safeSet(KEYS.PRODUCTS, []);
  }
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    safeSet(KEYS.CATEGORIES, DEMO_CATEGORIES);
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    safeSet(KEYS.ORDERS, []);
  }
  if (!localStorage.getItem(KEYS.CART)) {
    safeSet(KEYS.CART, []);
  }
  if (!localStorage.getItem(KEYS.WISHLIST)) {
    safeSet(KEYS.WISHLIST, []);
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    safeSet(KEYS.SETTINGS, DEMO_SETTINGS);
  } else {
    const existingSettings = safeGet(KEYS.SETTINGS, {});
    let settingsUpdated = false;
    if (existingSettings.deliveryCharge === 99) {
      existingSettings.deliveryCharge = 49;
      settingsUpdated = true;
    }
    if (existingSettings.whatsappNumber === '919655625186') {
      existingSettings.whatsappNumber = '919486118211';
      settingsUpdated = true;
    }
    if (existingSettings.supportPhone === '+91 96556 25186') {
      existingSettings.supportPhone = '+91 94861 18211';
      settingsUpdated = true;
    }
    if (settingsUpdated) {
      safeSet(KEYS.SETTINGS, existingSettings);
    }
  }
};

// ==================== PRODUCTS ====================

export const clearAllProducts = () => {
  safeSet(KEYS.PRODUCTS, []);
  return true;
};

export const setProductsCache = (products) => {
  if (Array.isArray(products)) {
    safeSet(KEYS.PRODUCTS, products);
  }
};

export const getProducts = () => {
  initializeStorage();
  const prods = safeGet(KEYS.PRODUCTS, []);
  
  // Permanent blacklist filter: Never allow demo products to be displayed
  const demoIds = ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8'];
  const demoNames = [
    'Classic Black T-Shirt',
    'Premium White T-Shirt',
    'Oversized Emerald Green T-Shirt',
    'Luxury Graphic Street T-Shirt',
    'Classic Navy Pique Polo T-Shirt',
    'White Gold-Tipped Polo T-Shirt',
    'Signature Royal Polo T-Shirt',
    'Forest Green Textured Polo T-Shirt',
    'Classic Hoodie'
  ];

  const cleaned = prods.filter(
    (p) => !demoIds.includes(String(p?.id)) && !demoNames.includes(p?.name)
  );

  if (cleaned.length !== prods.length) {
    safeSet(KEYS.PRODUCTS, cleaned);
  }

  return cleaned;
};

export const getProductById = (id) => {
  const products = getProducts();
  return products.find((p) => String(p.id) === String(id)) || null;
};

export const addProduct = (newProduct) => {
  const products = getProducts();
  const productWithId = {
    ...newProduct,
    id: newProduct.id || `prod-${Date.now()}`,
    rating: newProduct.rating || 5.0,
    reviewsCount: newProduct.reviewsCount || 0,
    createdAt: newProduct.createdAt || new Date().toISOString(),
  };
  const updated = [productWithId, ...products];
  safeSet(KEYS.PRODUCTS, updated);
  return productWithId;
};

export const updateProduct = (id, updatedFields) => {
  const products = getProducts();
  let updatedProduct = null;
  const updated = products.map((p) => {
    if (String(p.id) === String(id)) {
      updatedProduct = { ...p, ...updatedFields, updatedAt: new Date().toISOString() };
      return updatedProduct;
    }
    return p;
  });
  safeSet(KEYS.PRODUCTS, updated);
  return updatedProduct;
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const updated = products.filter((p) => String(p.id) !== String(id));
  safeSet(KEYS.PRODUCTS, updated);
  return true;
};

// ==================== CATEGORIES ====================

export const getCategories = () => {
  initializeStorage();
  return safeGet(KEYS.CATEGORIES, DEMO_CATEGORIES);
};

export const addCategory = (category) => {
  const categories = getCategories();
  const newCat = {
    ...category,
    id: category.id || `cat-${Date.now()}`,
    slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
    itemCount: category.itemCount || 0,
    status: category.status || 'Active'
  };
  const updated = [...categories, newCat];
  safeSet(KEYS.CATEGORIES, updated);
  return newCat;
};

export const updateCategory = (id, updatedFields) => {
  const categories = getCategories();
  let updatedCat = null;
  const updated = categories.map((c) => {
    if (String(c.id) === String(id)) {
      updatedCat = { ...c, ...updatedFields };
      return updatedCat;
    }
    return c;
  });
  safeSet(KEYS.CATEGORIES, updated);
  return updatedCat;
};

export const deleteCategory = (id) => {
  const categories = getCategories();
  const updated = categories.filter((c) => String(c.id) !== String(id));
  safeSet(KEYS.CATEGORIES, updated);
  return true;
};

// ==================== CART ====================

export const getCart = () => {
  initializeStorage();
  return safeGet(KEYS.CART, []);
};

export const updateCart = (cartItems) => {
  safeSet(KEYS.CART, cartItems);
  return cartItems;
};

export const clearCart = () => {
  safeSet(KEYS.CART, []);
  return [];
};

// ==================== WISHLIST ====================

export const getWishlist = () => {
  initializeStorage();
  return safeGet(KEYS.WISHLIST, []);
};

export const updateWishlist = (wishlistItems) => {
  safeSet(KEYS.WISHLIST, wishlistItems);
  return wishlistItems;
};

export const clearWishlist = () => {
  safeSet(KEYS.WISHLIST, []);
  return [];
};

// ==================== ORDERS ====================

export const setOrdersCache = (orders) => {
  if (Array.isArray(orders)) {
    safeSet(KEYS.ORDERS, orders);
  }
};

export const getOrders = () => {
  initializeStorage();
  return safeGet(KEYS.ORDERS, DEMO_ORDERS);
};

export const createOrder = (orderData) => {
  const orders = getOrders();
  const currentYear = new Date().getFullYear();
  const count = orders.length + 1;
  const formattedCount = String(count).padStart(4, '0');
  const orderId = orderData.id || `BFA-${currentYear}-${formattedCount}`;

  const newOrder = {
    ...orderData,
    id: orderId,
    createdAt: orderData.createdAt || new Date().toISOString(),
    status: orderData.status || 'Pending'
  };

  const updated = [newOrder, ...orders];
  safeSet(KEYS.ORDERS, updated);
  return newOrder;
};

export const updateOrder = (id, updatedFields) => {
  const orders = getOrders();
  let updatedOrder = null;
  const updated = orders.map((o) => {
    if (String(o.id) === String(id)) {
      updatedOrder = { ...o, ...updatedFields, updatedAt: new Date().toISOString() };
      return updatedOrder;
    }
    return o;
  });
  safeSet(KEYS.ORDERS, updated);
  return updatedOrder;
};

export const deleteOrder = (id) => {
  const orders = getOrders();
  const filtered = orders.filter((o) => String(o.id) !== String(id));
  safeSet(KEYS.ORDERS, filtered);
  return true;
};

export const getOrderById = (id) => {
  const orders = getOrders();
  return orders.find((o) => String(o.id) === String(id)) || null;
};

// ==================== CUSTOMERS ====================
/**
 * Customer records derived from locally stored orders.
 * Note: Since this is a frontend-only application, customer data exists only in browser localStorage.
 */
export const getCustomers = () => {
  const accounts = getCustomerAccounts();
  const orders = getOrders();
  const customerMap = {};

  // 1. Seed with registered accounts
  accounts.forEach((acc) => {
    const key = (acc.phone || acc.email || acc.name).toLowerCase().trim();
    customerMap[key] = {
      id: acc.id,
      name: acc.name,
      email: acc.email || 'N/A',
      phone: acc.phone || 'N/A',
      city: acc.city || 'N/A',
      state: acc.state || 'N/A',
      address: acc.address || '',
      isRegistered: true,
      ordersCount: 0,
      totalSpent: 0,
      lastOrderDate: acc.createdAt || null,
    };
  });

  // 2. Merge order history and guest customers
  orders.forEach((order) => {
    const cust = order.customer;
    if (!cust) return;
    const key = (cust.phone || cust.email || cust.name).toLowerCase().trim();

    if (!customerMap[key]) {
      customerMap[key] = {
        id: `cust-guest-${Object.keys(customerMap).length + 1}`,
        name: cust.name,
        email: cust.email || 'N/A',
        phone: cust.phone || 'N/A',
        city: cust.city || 'N/A',
        state: cust.state || 'N/A',
        address: cust.address || '',
        isRegistered: false,
        ordersCount: 0,
        totalSpent: 0,
        lastOrderDate: order.createdAt,
      };
    }

    customerMap[key].ordersCount += 1;
    customerMap[key].totalSpent += Number(order.total) || 0;
    if (!customerMap[key].lastOrderDate || new Date(order.createdAt) > new Date(customerMap[key].lastOrderDate)) {
      customerMap[key].lastOrderDate = order.createdAt;
    }
  });

  return Object.values(customerMap);
};

// ==================== CUSTOMER ACCOUNTS & AUTH ====================

export const getCustomerAccounts = () => {
  return safeGet(KEYS.CUSTOMER_ACCOUNTS, []);
};

export const registerCustomer = (data) => {
  const accounts = getCustomerAccounts();
  const phone = (data.phone || '').trim();
  const email = (data.email || '').trim().toLowerCase();

  // Check duplicate
  const exists = accounts.find(
    (acc) =>
      (phone && acc.phone === phone) ||
      (email && acc.email && acc.email.toLowerCase() === email)
  );

  if (exists) {
    return {
      success: false,
      error: 'An account with this phone number or email already exists. Please sign in.',
    };
  }

  const newCustomer = {
    id: `cust-${Date.now()}`,
    name: (data.name || '').trim(),
    phone,
    email: email || '',
    password: data.password || '',
    address: (data.address || '').trim(),
    city: (data.city || '').trim(),
    state: (data.state || 'Tamil Nadu').trim(),
    pincode: (data.pincode || '').trim(),
    createdAt: new Date().toISOString(),
  };

  const updatedAccounts = [...accounts, newCustomer];
  safeSet(KEYS.CUSTOMER_ACCOUNTS, updatedAccounts);

  // Auto-login session (omit password from session)
  const session = {
    id: newCustomer.id,
    name: newCustomer.name,
    phone: newCustomer.phone,
    email: newCustomer.email,
    address: newCustomer.address,
    city: newCustomer.city,
    state: newCustomer.state,
    pincode: newCustomer.pincode,
  };
  safeSet(KEYS.CUSTOMER_SESSION, session);

  return { success: true, customer: session };
};

export const loginCustomer = (identifier, password) => {
  const accounts = getCustomerAccounts();
  const idClean = (identifier || '').trim().toLowerCase();
  const passClean = (password || '').trim();

  const found = accounts.find((acc) => {
    const pMatch = acc.phone && acc.phone.trim().toLowerCase() === idClean;
    const eMatch = acc.email && acc.email.trim().toLowerCase() === idClean;
    return pMatch || eMatch;
  });

  if (!found) {
    return {
      success: false,
      error: 'No account found with this Mobile Number or Email. Please check or register a new account.',
    };
  }

  if (found.password && found.password !== passClean) {
    return {
      success: false,
      error: 'Incorrect password. Please try again.',
    };
  }

  const session = {
    id: found.id,
    name: found.name,
    phone: found.phone,
    email: found.email,
    address: found.address,
    city: found.city,
    state: found.state,
    pincode: found.pincode,
  };
  safeSet(KEYS.CUSTOMER_SESSION, session);

  return { success: true, customer: session };
};

export const getCurrentCustomer = () => {
  return safeGet(KEYS.CUSTOMER_SESSION, null);
};

export const updateCustomerProfile = (updates) => {
  const session = getCurrentCustomer();
  if (!session) return null;

  const accounts = getCustomerAccounts();
  const updatedAccounts = accounts.map((acc) => {
    if (acc.id === session.id || acc.phone === session.phone) {
      return { ...acc, ...updates };
    }
    return acc;
  });
  safeSet(KEYS.CUSTOMER_ACCOUNTS, updatedAccounts);

  const updatedSession = { ...session, ...updates };
  safeSet(KEYS.CUSTOMER_SESSION, updatedSession);
  return updatedSession;
};

export const logoutCustomer = () => {
  try {
    localStorage.removeItem(KEYS.CUSTOMER_SESSION);
    return true;
  } catch {
    return false;
  }
};

export const updateCustomer = (id, updates) => {
  const accounts = getCustomerAccounts();
  let updatedCust = null;
  const updatedAccounts = accounts.map((acc) => {
    if (String(acc.id) === String(id) || (acc.phone && updates.phone && acc.phone === updates.phone)) {
      updatedCust = { ...acc, ...updates };
      return updatedCust;
    }
    return acc;
  });
  safeSet(KEYS.CUSTOMER_ACCOUNTS, updatedAccounts);
  return updatedCust;
};

export const deleteCustomer = (id) => {
  const accounts = getCustomerAccounts();
  const filtered = accounts.filter((acc) => String(acc.id) !== String(id));
  safeSet(KEYS.CUSTOMER_ACCOUNTS, filtered);
  return true;
};

export const getCustomerOrders = (customer) => {
  const orders = getOrders();
  if (!customer) return orders;
  const cPhone = (customer.phone || '').trim().toLowerCase();
  const cEmail = (customer.email || '').trim().toLowerCase();

  return orders.filter((o) => {
    const oPhone = (o.customer?.phone || '').trim().toLowerCase();
    const oEmail = (o.customer?.email || '').trim().toLowerCase();
    return (cPhone && oPhone === cPhone) || (cEmail && oEmail === cEmail);
  });
};



// ==================== SETTINGS ====================

export const getSettings = () => {
  initializeStorage();
  return safeGet(KEYS.SETTINGS, DEMO_SETTINGS);
};

export const updateSettings = (updatedFields) => {
  const current = getSettings();
  const updated = { ...current, ...updatedFields };
  safeSet(KEYS.SETTINGS, updated);
  return updated;
};

// ==================== ADMIN SESSION ====================

export const getAdminSession = () => {
  try {
    const session = safeGet(KEYS.ADMIN_SESSION, null);
    if (!session) return null;
    
    // Check expiration
    if (session.expiresAt && Date.now() > session.expiresAt) {
      clearAdminSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

export const setAdminSession = (username) => {
  const expiryTime = Date.now() + ADMIN_CONFIG.SESSION_EXPIRY_HOURS * 60 * 60 * 1000;
  const session = {
    username,
    authenticated: true,
    loginAt: Date.now(),
    expiresAt: expiryTime
  };
  safeSet(KEYS.ADMIN_SESSION, session);
  return session;
};

export const clearAdminSession = () => {
  try {
    localStorage.removeItem(KEYS.ADMIN_SESSION);
    return true;
  } catch {
    return false;
  }
};

// Initialize on file load
initializeStorage();
