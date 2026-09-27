import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import BiyaLogo from '../components/BiyaLogo';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const ADMIN_MENU = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Products', path: '/admin/products', icon: Package, end: true },
  { name: 'Add Product', path: '/admin/products/add', icon: PlusCircle },
  { name: 'Categories', path: '/admin/categories', icon: FolderTree },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout = () => {
  const { isAuthenticated, authLoading, logout, adminUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Auth gate check
  if (!authLoading && !isAuthenticated) {
    navigate('/admin/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Admin Brand Emblem */}
        <div className="p-6 border-b border-[#064C32]">
          <BiyaLogo variant="light" size="normal" to="/admin" />
          <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
            <span className="flex items-center gap-1.5 text-[#F3D477] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Portal
            </span>
            <span className="bg-[#064C32] px-2 py-0.5 rounded text-[10px] text-white">v2.0</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1.5">
          {ADMIN_MENU.map((item) => {
            const Icon = item.icon;
            const isActive = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                  isActive
                    ? 'bg-[#D9A514] text-[#111111] shadow-md font-extrabold translate-x-1'
                    : 'text-gray-300 hover:bg-[#064C32] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#111111]' : 'text-[#F3D477]'}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: View Store & Logout */}
      <div className="p-4 border-t border-[#064C32] space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:bg-[#064C32] hover:text-white transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-[#D9A514]" />
            View Live Store
          </span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-200 transition text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout ({adminUser || 'Admin'})</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row text-[#111111]">
      <Toast />

      {/* Desktop Sidebar: Dark Green */}
      <aside className="hidden md:flex flex-col w-64 bg-[#033B27] shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-[#064C32]">
        {navContent}
      </aside>

      {/* Mobile Admin Header & Off-canvas Sidebar */}
      <div className="md:hidden bg-[#033B27] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-[#064C32]">
        <BiyaLogo variant="light" size="normal" to="/admin" />
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg bg-[#064C32] text-white"
          aria-label="Open admin menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative w-64 bg-[#033B27] h-full shadow-2xl flex flex-col justify-between z-10">
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {navContent}
          </div>
        </div>
      )}

      {/* Main Content Area: White Background */}
      <div className="flex-1 flex flex-col min-w-0 bg-white min-h-screen">
        {/* Top bar inside content */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E5E5E5]">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#666666]">
              Admin Control Panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-[#111111]">{adminUser || 'Administrator'}</p>
              <p className="text-[10px] text-[#666666]">Store Manager</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#064C32] text-[#F3D477] font-bold text-xs flex items-center justify-center border border-[#D9A514]/40">
              {(adminUser || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-white overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
