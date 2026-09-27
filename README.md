# BIYA FASHION — Premium Textile & E-Commerce Web Application

> **WEAR YOUR STYLE** • Luxury Fashion & Textile Apparel Store

A complete, high-performance, fully responsive frontend e-commerce web application built for **BIYA FASHION**. Designed with an editorial white luxury aesthetic, deep brand green accents (`#064C32` / `#033B27`), radiant gold touches (`#D9A514` / `#F3D477`), and modern responsive typography.

---

## 👑 Brand Identity

* **Brand Name:** BIYA FASHION
* **Tagline:** WEAR YOUR STYLE
* **Emblem:** Royal 5-Point Crown + Fashion Hanger Structure
* **Color System:**
  * **Primary Background:** `#FFFFFF` (80–90% visual ratio)
  * **Secondary Background:** `#F8F8F8`
  * **Primary Text:** `#111111`
  * **Secondary Text:** `#666666`
  * **Brand Green:** `#064C32`
  * **Dark Green:** `#033B27` (Used on footer and brand accents)
  * **Brand Gold:** `#D9A514`
  * **Light Gold:** `#F3D477`
  * **Borders:** `#E5E5E5`

---

## ⚡ Tech Stack

* **Framework:** React 19 + Vite 8
* **Styling:** Tailwind CSS v4 + Custom Luxury Theme Tokens
* **Routing:** React Router v7 (`react-router-dom`)
* **Icons:** Lucide React Icons + Custom SVG Vector Identity
* **Data Layer:** Centralized `storageService` with persistent browser `localStorage`
* **Architecture:** 100% Frontend-only (No external database or server required)

---

## 🚀 Quick Start Guide

### 1. Installation

Ensure you have Node.js (v18+) installed on your machine.

```bash
# Navigate to the project directory
cd "c:\Users\Lenovo\Desktop\salam bro"

# Install all required packages
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Visit the local development URL provided in the terminal (usually `http://localhost:5173`).

### 3. Production Build

```bash
npm run build
npm run preview
```

---

## 🛡️ Admin Portal & Credentials

The application includes a complete, dedicated administrative back-office system accessible at:

* **Admin Login Route:** `/admin/login`
* **Dashboard Route:** `/admin`

### Default Admin Credentials:

* **Username:** `admin`
* **Password:** `Biya@2026`

> [!WARNING]
> **IMPORTANT SECURITY NOTE**
> This application is intentionally engineered as a frontend-only demonstration store. Hardcoded credentials and localStorage sessions are **NOT secure for a production enterprise environment**. A live production store requires server-side authentication (e.g. Node.js/Express, Go, or Python), bcrypt password hashing, HTTP-only JWT/Session cookies, and an authenticated database.

---

## ☁️ Google Drive Image Picker Configuration

The **Add Product** and **Edit Product** admin forms feature a **"SELECT IMAGE FROM GOOGLE DRIVE"** button.

### How it works:
* If Google Drive credentials are configured, the official Google Picker modal opens allowing administrators to select product photography directly from their Google Drive cloud storage.
* If credentials are **not configured**, the application **never breaks**; it displays an informative advisory and provides an **Image URL** input with instant live preview.

### Step-by-Step Google Cloud Setup:

1. **Create a Google Cloud Project:**
   Visit [Google Cloud Console](https://console.cloud.google.com/) and create a new project (e.g. `Biya-Fashion-Drive-Picker`).
2. **Enable Required APIs:**
   * Go to **APIs & Services > Library**.
   * Search for and enable **Google Drive API**.
   * Search for and enable **Google Picker API**.
3. **Configure OAuth Consent Screen:**
   * Go to **APIs & Services > OAuth consent screen**.
   * Select **External** or **Internal**, enter your App Name and Support Email, then save.
4. **Create API Key:**
   * Go to **APIs & Services > Credentials > Create Credentials > API Key**.
   * Copy your generated API key.
5. **Create OAuth 2.0 Client ID:**
   * Click **Create Credentials > OAuth client ID**.
   * Application type: **Web application**.
   * Under **Authorized JavaScript origins**, add your website origin:
     * `http://localhost:5173` (for local development)
     * Your live domain (e.g. `https://your-production-domain.com`)
   * Copy your generated Client ID and Project Number (App ID).
6. **Insert Credentials into Config:**
   Open [src/config/googleDriveConfig.js](file:///c:/Users/Lenovo/Desktop/salam%20bro/src/config/googleDriveConfig.js) and update the values:

```javascript
export const GOOGLE_DRIVE_CONFIG = {
  GOOGLE_API_KEY: "YOUR_GOOGLE_API_KEY_HERE",
  GOOGLE_CLIENT_ID: "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com",
  GOOGLE_APP_ID: "YOUR_GOOGLE_PROJECT_NUMBER_HERE",
};
```

---

## 📱 WhatsApp Direct Ordering

Customers can place orders either via **Cash on Delivery (COD)** or **WhatsApp Direct Order**.

When a customer selects WhatsApp ordering at checkout:
1. An official order ID is generated (e.g. `BFA-2026-0001`).
2. The order is stored into local storage for the admin dashboard.
3. A preformatted WhatsApp message is generated with the customer's name, phone, full delivery address, item list, quantities, and order total.
4. WhatsApp is launched via `https://wa.me/{whatsappNumber}?text=...` to directly message the store manager.

You can configure the store's recipient WhatsApp phone number at any time in [src/config/storeConfig.js](file:///c:/Users/Lenovo/Desktop/salam%20bro/src/config/storeConfig.js) or via the **Admin Settings** page (`/admin/settings`).

---

## 📁 Project Architecture & File Directory

```
src/
├── assets/                  # Branding vectors and static media
├── components/
│   ├── BiyaLogo.jsx         # Crown + Hanger master brand SVG emblem
│   ├── CartDrawer.jsx       # Slide-out shopping bag drawer with shipping meter
│   ├── ConfirmModal.jsx     # Reusable destructive action confirmation modal
│   ├── EmptyState.jsx       # Empty states for cart, wishlist, and search
│   ├── Footer.jsx           # Dark green brand footer with quick links
│   ├── GoogleDrivePickerModal.jsx # Drive picker & image URL fallback
│   ├── Header.jsx           # Sticky white navigation with search & drawer
│   ├── LoadingSpinner.jsx   # Sleek branded spinner & loading states
│   ├── ProductCard.jsx      # Luxury card with hover zoom & quick add
│   ├── ProductFilter.jsx    # Category, price slider, size, color filters
│   ├── ProductGallery.jsx   # Interactive gallery with mouse hover zoom
│   ├── ProductGrid.jsx      # Responsive grid with skeletons
│   ├── SearchBar.jsx        # Instant search modal with recommendations
│   ├── SocialIcons.jsx      # Clean SVG icons for Instagram, WhatsApp, etc.
│   ├── Toast.jsx            # Animated notification toast alerts
│   └── WishlistButton.jsx   # Interactive heart wishlist button
│
├── pages/
│   ├── Home.jsx             # Editorial fashion homepage with 10 sections
│   ├── Shop.jsx             # Filterable product catalog with URL sync
│   ├── ProductDetails.jsx   # High-detail product page with tabs & related items
│   ├── Categories.jsx       # Category showcase index
│   ├── Cart.jsx             # Dedicated shopping bag with coupon discounts
│   ├── Wishlist.jsx         # Saved items management
│   ├── Checkout.jsx         # Delivery form with COD & WhatsApp ordering
│   ├── OrderSuccess.jsx     # Confirmation screen with invoice breakdown
│   ├── About.jsx            # Brand story & textile craftsmanship
│   └── Contact.jsx          # Concierge support form & WhatsApp link
│
├── admin/
│   ├── AdminLogin.jsx       # Admin login with credential autofill
│   ├── AdminDashboard.jsx   # Executive metrics, recent orders, stock alerts
│   ├── AdminProducts.jsx    # Catalog table (search, filter, sort, actions)
│   ├── AddProduct.jsx       # New product creator with Drive picker
│   ├── EditProduct.jsx      # Product editor
│   ├── AdminCategories.jsx  # Category CRUD management
│   ├── AdminOrders.jsx      # Order fulfillment & status updates
│   ├── AdminCustomers.jsx   # Customer directory aggregated from orders
│   └── AdminSettings.jsx    # Store identity, WhatsApp number, and delivery fee
│
├── layouts/
│   ├── MainLayout.jsx       # Customer page layout with sticky header & footer
│   └── AdminLayout.jsx      # Admin layout with dark green sidebar & white workspace
│
├── context/
│   ├── ProductContext.jsx   # Products & categories global state
│   ├── CartContext.jsx      # Cart items, drawer, and financial calculations
│   ├── WishlistContext.jsx  # Wishlist state & persistence
│   ├── AuthContext.jsx      # Admin session authentication state
│   └── ToastContext.jsx     # Global toast notification dispatch
│
├── services/
│   └── storageService.js    # Centralized browser localStorage CRUD service
│
├── config/
│   ├── adminConfig.js       # Admin credentials & session expiry
│   ├── storeConfig.js       # Store contact, WhatsApp, and delivery fees
│   └── googleDriveConfig.js # Google Drive API & Picker configuration
│
├── data/
│   └── demoProducts.js      # Seed catalog items, categories, and sample orders
│
├── App.jsx                  # Main router with code splitting & suspense
├── index.css                # Tailwind CSS v4 tokens, luxury fonts, custom scrollbars
└── main.jsx                 # React root mount
```

---

## 🎨 Design Philosophy & Principles

1. **White Dominance:** 80–90% clean white background keeps the focus on product photography and textile texture.
2. **Editorial Typography:** Classic serif headings (`Cinzel`) paired with geometric sans-serif UI elements (`Plus Jakarta Sans`).
3. **Restrained Luxury Accents:** Deep Forest Green (`#064C32`) provides an anchor of trust and authority; Warm Gold (`#D9A514`) highlights buttons, badges, and discounts.
4. **Immediate Responsiveness:** Tested and optimized for mobile screens (375px), tablets (768px), and wide desktop displays (1440px+).

---

© 2026 BIYA FASHION. All Rights Reserved. **WEAR YOUR STYLE.**
