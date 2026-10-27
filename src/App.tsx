import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public pages
import Home from './pages/Index';
import Register from './pages/auth/Register';
import AdminRegister from './pages/auth/AdminRegister';
import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';

import CustomerDashboard from './pages/CustomerDashboard';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import Bookings from './pages/Bookings';
import SavedDestinations from './pages/SavedDestinations';
import Profile from './pages/auth/Profile';
import Promotions from './pages/Promotions';
import Help from './pages/Help';

// Admin pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import DestinationsList from './pages/admin/Destinations';
import DestinationForm from './pages/admin/DestinationForm';
import AdminTransactions from './pages/admin/Transactions';

// Super Admin pages
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="admin/register" element={<AdminRegister />} />

          <Route path="destinasi" element={<Destinations />} />
          <Route path="destinasi/:id" element={<DestinationDetail />} />
          <Route path="promo" element={<Promotions />} />
          <Route path="bantuan" element={<Help />} />
          <Route path="help" element={<Help />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-cancel" element={<PaymentCancel />} />
          <Route path="saved-destinations" element={<SavedDestinations />} />

          {/* Customer Authenticated routes */}
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin', 'super_admin']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="bookings" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin', 'super_admin']}>
                <Bookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="payment/:id" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin', 'super_admin']}>
                <Payment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin', 'super_admin']}>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Admin routes (Admin & Super Admin) */}
          <Route 
            path="admin" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="destinations" element={<DestinationsList />} />
            <Route path="destinations/new" element={<DestinationForm />} />
            <Route path="destinations/:id/edit" element={<DestinationForm />} />
            <Route path="transactions" element={<AdminTransactions />} />
          </Route>

          {/* Super Admin Master routes (Super Admin only) */}
          <Route 
            path="super-admin" 
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SuperAdminDashboard />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
