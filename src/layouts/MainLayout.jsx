import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import Toast from '../components/Toast';
import CustomerAuthModal from '../components/CustomerAuthModal';
import BiyaChatBot from '../components/BiyaChatBot';

const MainLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      <Toast />
      <CustomerAuthModal />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CartDrawer />
      <BiyaChatBot />
      <Footer />
    </div>
  );
};

export default MainLayout;
