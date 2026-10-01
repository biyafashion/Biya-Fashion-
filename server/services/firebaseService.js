import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getFirestoreDb, isFirebaseReady } from '../config/firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');

// Helper to safely read JSON file
const readJsonFile = (filePath, fallback = []) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
  return fallback;
};

// Helper to safely write JSON file
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
    return false;
  }
};

// Seed initial orders if empty
const initialOrders = [
  {
    id: "BFA-2026-0001",
    customer: {
      name: "Rahul Verma",
      phone: "+91 98234 56789",
      email: "rahul.verma@example.com",
      address: "Flat 402, Green Meadows Apartment, Park Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    },
    items: [
      {
        id: "prod-1",
        name: "Classic Black T-Shirt",
        price: 699,
        quantity: 2,
        selectedSize: "L",
        selectedColor: "Black",
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "prod-5",
        name: "Premium Polo T-Shirt",
        price: 1099,
        quantity: 1,
        selectedSize: "XL",
        selectedColor: "Emerald Green",
        image: "https://images.unsplash.com/photo-1625910513413-7e289e6eb7bc?auto=format&fit=crop&w=400&q=80"
      }
    ],
    subtotal: 2497,
    deliveryFee: 0,
    total: 2497,
    paymentMethod: "Cash on Delivery",
    status: "Delivered",
    createdAt: "2026-09-20T10:30:00.000Z"
  },
  {
    id: "BFA-2026-0002",
    customer: {
      name: "Pooja Sharma",
      phone: "+91 97123 45678",
      email: "pooja.sharma@example.com",
      address: "15, Lotus Enclave, Satellite Road",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380015"
    },
    items: [
      {
        id: "prod-6",
        name: "Classic Hoodie",
        price: 1799,
        quantity: 1,
        selectedSize: "M",
        selectedColor: "Deep Forest Green",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80"
      }
    ],
    subtotal: 1799,
    deliveryFee: 0,
    total: 1799,
    paymentMethod: "WhatsApp Order",
    status: "Shipped",
    createdAt: "2026-09-25T14:15:00.000Z"
  }
];

if (!fs.existsSync(ORDERS_FILE)) {
  writeJsonFile(ORDERS_FILE, initialOrders);
}

// ==================== ORDER OPERATIONS ====================

export const saveOrderToFirebase = async (orderData) => {
  const db = getFirestoreDb();
  const currentYear = new Date().getFullYear();
  const orders = readJsonFile(ORDERS_FILE, []);

  const orderId = orderData.id || `BFA-${currentYear}-${String(orders.length + 1).padStart(4, '0')}`;
  const orderRecord = {
    ...orderData,
    id: orderId,
    createdAt: orderData.createdAt || new Date().toISOString(),
    status: orderData.status || 'Confirmed',
    updatedAt: new Date().toISOString(),
  };

  // 1. Save to Firebase Firestore if connected
  if (isFirebaseReady() && db) {
    try {
      await db.collection('orders').doc(orderId).set(orderRecord);
      console.log(`[Firebase] Order ${orderId} saved to Firestore successfully.`);
    } catch (err) {
      console.error(`[Firebase] Failed to write order ${orderId} to Firestore:`, err.message);
    }
  }

  // 2. Always persist to local storage cache as guarantee
  const updatedOrders = [orderRecord, ...orders.filter((o) => o.id !== orderId)];
  writeJsonFile(ORDERS_FILE, updatedOrders);

  return orderRecord;
};

export const getOrdersFromFirebase = async () => {
  const db = getFirestoreDb();

  // Try fetching from Firebase Firestore
  if (isFirebaseReady() && db) {
    try {
      const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
      if (!snapshot.empty) {
        const firestoreOrders = [];
        snapshot.forEach((doc) => {
          firestoreOrders.push({ id: doc.id, ...doc.data() });
        });
        // Sync local cache
        writeJsonFile(ORDERS_FILE, firestoreOrders);
        return firestoreOrders;
      }
    } catch (err) {
      console.warn('[Firebase] Firestore read warning, falling back to local store:', err.message);
    }
  }

  // Fallback to local store
  return readJsonFile(ORDERS_FILE, initialOrders);
};

export const getOrderByIdFromFirebase = async (orderId) => {
  const db = getFirestoreDb();

  if (isFirebaseReady() && db) {
    try {
      const doc = await db.collection('orders').doc(orderId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
    } catch (err) {
      console.warn(`[Firebase] Error fetching order ${orderId} from Firestore:`, err.message);
    }
  }

  const orders = readJsonFile(ORDERS_FILE, initialOrders);
  return orders.find((o) => String(o.id) === String(orderId)) || null;
};

export const updateOrderStatusInFirebase = async (orderId, newStatus) => {
  const db = getFirestoreDb();
  let updatedOrder = null;

  if (isFirebaseReady() && db) {
    try {
      await db.collection('orders').doc(orderId).update({
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      console.log(`[Firebase] Order ${orderId} updated to ${newStatus} in Firestore.`);
    } catch (err) {
      console.warn(`[Firebase] Error updating order in Firestore:`, err.message);
    }
  }

  // Update local file
  const orders = readJsonFile(ORDERS_FILE, initialOrders);
  const updatedList = orders.map((o) => {
    if (String(o.id) === String(orderId)) {
      updatedOrder = { ...o, status: newStatus, updatedAt: new Date().toISOString() };
      return updatedOrder;
    }
    return o;
  });

  writeJsonFile(ORDERS_FILE, updatedList);
  return updatedOrder;
};

// ==================== PRODUCT SERVICES ====================

export const saveProductToFirebase = async (productData) => {
  const db = getFirestoreDb();
  const id = productData.id || `prod-${Date.now()}`;
  const timestamp = new Date().toISOString();

  const productToSave = {
    ...productData,
    id,
    createdAt: productData.createdAt || timestamp,
    updatedAt: timestamp,
  };

  if (isFirebaseReady() && db) {
    try {
      await db.collection('products').doc(id).set(productToSave);
      console.log(`[Firebase] Product ${id} (${productToSave.name}) saved to Firestore.`);
    } catch (err) {
      console.warn(`[Firebase] Error saving product to Firestore:`, err.message);
    }
  }

  // Update local file cache
  const products = readJsonFile(PRODUCTS_FILE, []);
  const filtered = products.filter((p) => String(p.id) !== String(id));
  const updated = [productToSave, ...filtered];
  writeJsonFile(PRODUCTS_FILE, updated);

  return productToSave;
};

export const getProductsFromFirebase = async () => {
  const db = getFirestoreDb();

  if (isFirebaseReady() && db) {
    try {
      const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
      if (!snapshot.empty) {
        const firestoreProducts = [];
        snapshot.forEach((doc) => {
          firestoreProducts.push({ id: doc.id, ...doc.data() });
        });
        writeJsonFile(PRODUCTS_FILE, firestoreProducts);
        return firestoreProducts;
      }
    } catch (err) {
      console.warn('[Firebase] Error reading products from Firestore:', err.message);
    }
  }

  return readJsonFile(PRODUCTS_FILE, []);
};

export const getProductByIdFromFirebase = async (productId) => {
  const db = getFirestoreDb();

  if (isFirebaseReady() && db) {
    try {
      const doc = await db.collection('products').doc(productId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
    } catch (err) {
      console.warn(`[Firebase] Error fetching product ${productId} from Firestore:`, err.message);
    }
  }

  const products = readJsonFile(PRODUCTS_FILE, []);
  return products.find((p) => String(p.id) === String(productId)) || null;
};

export const updateProductInFirebase = async (productId, updatedFields) => {
  const db = getFirestoreDb();
  let updatedProduct = null;

  if (isFirebaseReady() && db) {
    try {
      await db.collection('products').doc(productId).update({
        ...updatedFields,
        updatedAt: new Date().toISOString(),
      });
      console.log(`[Firebase] Product ${productId} updated in Firestore.`);
    } catch (err) {
      console.warn(`[Firebase] Error updating product in Firestore:`, err.message);
    }
  }

  const products = readJsonFile(PRODUCTS_FILE, []);
  const updatedList = products.map((p) => {
    if (String(p.id) === String(productId)) {
      updatedProduct = { ...p, ...updatedFields, updatedAt: new Date().toISOString() };
      return updatedProduct;
    }
    return p;
  });

  writeJsonFile(PRODUCTS_FILE, updatedList);
  return updatedProduct;
};

export const deleteProductFromFirebase = async (productId) => {
  const db = getFirestoreDb();

  if (isFirebaseReady() && db) {
    try {
      await db.collection('products').doc(productId).delete();
      console.log(`[Firebase] Product ${productId} deleted from Firestore.`);
    } catch (err) {
      console.warn(`[Firebase] Error deleting product from Firestore:`, err.message);
    }
  }

  const products = readJsonFile(PRODUCTS_FILE, []);
  const updated = products.filter((p) => String(p.id) !== String(productId));
  writeJsonFile(PRODUCTS_FILE, updated);
  return true;
};

// ==================== CUSTOMER SERVICES ====================

export const saveCustomerToFirebase = async (customerData) => {
  const db = getFirestoreDb();
  const id = customerData.id || `cust-${Date.now()}`;
  const timestamp = new Date().toISOString();

  const customerToSave = {
    ...customerData,
    id,
    createdAt: customerData.createdAt || timestamp,
    updatedAt: timestamp,
  };

  if (isFirebaseReady() && db) {
    try {
      await db.collection('customers').doc(id).set(customerToSave);
      console.log(`[Firebase] Customer ${id} (${customerToSave.name}) saved to Firestore.`);
    } catch (err) {
      console.warn(`[Firebase] Error saving customer to Firestore:`, err.message);
    }
  }

  // Update local file cache
  const customers = readJsonFile(CUSTOMERS_FILE, []);
  const filtered = customers.filter(
    (c) => String(c.id) !== String(id) && (customerToSave.phone && c.phone !== customerToSave.phone)
  );
  const updated = [customerToSave, ...filtered];
  writeJsonFile(CUSTOMERS_FILE, updated);

  return customerToSave;
};

export const getCustomersFromFirebase = async () => {
  const db = getFirestoreDb();

  if (isFirebaseReady() && db) {
    try {
      const snapshot = await db.collection('customers').orderBy('createdAt', 'desc').get();
      if (!snapshot.empty) {
        const firestoreCustomers = [];
        snapshot.forEach((doc) => {
          firestoreCustomers.push({ id: doc.id, ...doc.data() });
        });
        writeJsonFile(CUSTOMERS_FILE, firestoreCustomers);
        return firestoreCustomers;
      }
    } catch (err) {
      console.warn('[Firebase] Error reading customers from Firestore:', err.message);
    }
  }

  return readJsonFile(CUSTOMERS_FILE, []);
};


