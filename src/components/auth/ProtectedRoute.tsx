import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Memverifikasi hak akses...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-red-100 p-8 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Akses Ditolak</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Halaman ini hanya dapat diakses oleh pengguna dengan peran{' '}
            <span className="font-semibold text-red-600">
              {allowedRoles.map(r => r.toUpperCase()).join(' atau ')}
            </span>
            . Akun Anda saat ini memiliki peran{' '}
            <span className="font-semibold text-gray-800 uppercase">{user.role}</span>.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Button 
              className="w-full bg-primary"
              onClick={() => {
                if (user.role === 'super_admin') window.location.href = '/super-admin';
                else if (user.role === 'admin') window.location.href = '/admin';
                else window.location.href = '/dashboard';
              }}
            >
              Kembali ke Dashboard Saya
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                window.location.href = '/';
              }}
            >
              Ke Halaman Utama
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
