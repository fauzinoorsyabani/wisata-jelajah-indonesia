import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  BarChart3, 
  Activity, 
  LogOut, 
  Menu, 
  X, 
  Shield,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const SuperAdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    {
      title: 'Ringkasan Master',
      icon: Shield,
      path: '/super-admin',
      hash: '',
    },
    {
      title: 'Manajemen Pengguna',
      icon: Users,
      path: '/super-admin#users',
      hash: '#users',
    },
    {
      title: 'Keuangan & Komisi (5%)',
      icon: BarChart3,
      path: '/super-admin#finance',
      hash: '#finance',
    },
    {
      title: 'Audit & Status Sistem',
      icon: Activity,
      path: '/super-admin#audit',
      hash: '#audit',
    },
  ];

  const currentHash = location.hash;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Logo" className="h-7 w-7 object-contain" />
          <div>
            <span className="font-bold text-sm text-slate-900">WisataJelajah</span>
            <span className="block text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Super Admin</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-slate-700 hover:bg-slate-100"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Sidebar Navigation - Clean, Minimalist & Modern */}
      <aside className={`
        fixed lg:sticky top-0 h-screen w-64 bg-white border-r border-slate-200 z-40 
        transition-transform duration-200 ease-in-out flex flex-col justify-between
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link to="/super-admin" className="flex items-center gap-2.5">
              <img 
                src="/logo.png" 
                alt="Logo Wisata Jelajah" 
                className="h-8 w-8 object-contain" 
              />
              <div>
                <span className="text-sm font-bold text-slate-900 tracking-tight block">
                  WisataJelajah
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                  Super Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* User Profile Card */}
          <div className="p-3 mx-3 my-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                SA
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-xs text-slate-900 truncate">{user?.name || 'Master Super Admin'}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || 'superadmin@wisata.id'}</p>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="px-3 py-2 space-y-1 flex-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Navigasi Utama
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.hash === '' 
                ? (currentHash === '' || currentHash === '#') 
                : currentHash === item.hash;

              return (
                <Link
                  key={item.title}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                    ${isActive 
                      ? 'bg-slate-900 text-white font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-100 space-y-1">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <span>Lihat Web Publik</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 h-auto"
            >
              <LogOut className="w-3.5 h-3.5 mr-2 text-slate-400" />
              Keluar dari Sesi
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
