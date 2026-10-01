import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Loading Component
import LoadingSpinner from './components/LoadingSpinner';

// Customer Pages (Lazy Loaded)
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Categories = lazy(() => import('./pages/Categories'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

// Admin Pages (Lazy Loaded)
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./admin/AdminProducts'));
const AddProduct = lazy(() => import('./admin/AddProduct'));
const EditProduct = lazy(() => import('./admin/EditProduct'));
const AdminCategories = lazy(() => import('./admin/AdminCategories'));
const AdminOrders = lazy(() => import('./admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./admin/AdminCustomers'));
const AdminSettings = lazy(() => import('./admin/AdminSettings'));

// Auto-refresh AOS and scroll to top on navigation
const AosRouteRefresher = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, [location.pathname]);
  return null;
};

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: false,
      offset: 40,
    });
  }, []);

  return (
    <ToastProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <AuthProvider>
              <CustomerAuthProvider>
                <Router>
                  <AosRouteRefresher />
                  <Suspense
                    fallback={
                      <div className="min-h-screen bg-white flex items-center justify-center">
                        <LoadingSpinner size="large" text="Opening BIYA FASHION..." />
                      </div>
                    }
                  >
                    <Routes>
                      {/* Customer Store Routes (MainLayout) */}
                      <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/order-success" element={<OrderSuccess />} />
                        <Route path="/my-orders" element={<MyOrders />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                      </Route>

                    {/* Admin Authentication Route */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Protected Admin Routes (AdminLayout) */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="products/add" element={<AddProduct />} />
                      <Route path="products/edit/:id" element={<EditProduct />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="customers" element={<AdminCustomers />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>

                    {/* Catch all 404 redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </Router>
            </CustomerAuthProvider>
          </AuthProvider>
        </WishlistProvider>
      </CartProvider>
    </ProductProvider>
  </ToastProvider>
  );
}

export default App;
