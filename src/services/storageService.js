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
  const CATALOG_VERSION = 'v2_tshirt_polo_only';
  const currentVersion = localStorage.getItem('biya_catalog_version');

  if (currentVersion !== CATALOG_VERSION) {
    safeSet(KEYS.PRODUCTS, DEMO_PRODUCTS);
    safeSet(KEYS.CATEGORIES, DEMO_CATEGORIES);
    localStorage.setItem('biya_catalog_version', CATALOG_VERSION);
  } else {
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
      safeSet(KEYS.PRODUCTS, DEMO_PRODUCTS);
    }
    if (!localStorage.getItem(KEYS.CATEGORIES)) {
      safeSet(KEYS.CATEGORIES, DEMO_CATEGORIES);
    }
  }

  if (!localStorage.getItem(KEYS.ORDERS)) {
    safeSet(KEYS.ORDERS, DEMO_ORDERS);
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    safeSet(KEYS.SETTINGS, DEMO_SETTINGS);
  }
  if (!localStorage.getItem(KEYS.CART)) {
    safeSet(KEYS.CART, []);
  }
  if (!localStorage.getItem(KEYS.WISHLIST)) {
    safeSet(KEYS.WISHLIST, []);
  }
};

// ==================== PRODUCTS ====================

export const getProducts = () => {
  initializeStorage();
  return safeGet(KEYS.PRODUCTS, DEMO_PRODUCTS);
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
  const orders = getOrders();
  const customerMap = {};

  orders.forEach((order) => {
    const cust = order.customer;
    if (!cust) return;
    const key = (cust.email || cust.phone || cust.name).toLowerCase().trim();

    if (!customerMap[key]) {
      customerMap[key] = {
        id: `cust-${Object.keys(customerMap).length + 1}`,
        name: cust.name,
        email: cust.email || 'N/A',
        phone: cust.phone || 'N/A',
        city: cust.city || 'N/A',
        state: cust.state || 'N/A',
        ordersCount: 0,
        totalSpent: 0,
        lastOrderDate: order.createdAt
      };
    }

    customerMap[key].ordersCount += 1;
    customerMap[key].totalSpent += Number(order.total) || 0;
    if (new Date(order.createdAt) > new Date(customerMap[key].lastOrderDate)) {
      customerMap[key].lastOrderDate = order.createdAt;
    }
  });

  return Object.values(customerMap);
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
