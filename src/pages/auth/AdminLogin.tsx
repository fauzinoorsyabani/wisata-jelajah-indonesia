import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';

const AdminLogin = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          isAdmin: true
        }),
        signal: AbortSignal.timeout(2000),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user);
        navigate('/admin');
        return;
      }
    } catch {
      // Backend unavailable: fallback to demo admin login
    }

    // Verification against userService registry
    const existing = userService.getUserByEmail(formData.email);
    if (existing && existing.role === 'customer') {
      setError('Akses ditolak: Akun ini terdaftar sebagai Wisatawan. Silakan masuk melalui halaman login pengunjung di /login.');
      setIsLoading(false);
      return;
    }

    const isSuper = formData.email === 'superadmin@wisata.id' || existing?.role === 'super_admin';
    const isAdmin = formData.email === 'admin@wisata.id' || existing?.role === 'admin';

    if (!isSuper && !isAdmin) {
      setError('Kredensial pengelola tidak valid atau belum terdaftar. Silakan hubungi Super Admin.');
      setIsLoading(false);
      return;
    }

    const adminUser = {
      id: existing ? existing.id : (isSuper ? 'usr_super_1' : 'usr_admin_1'),
      name: existing ? existing.name : (isSuper ? 'Master Super Admin' : 'Admin Wisata Indonesia'),
      email: formData.email,
      role: isSuper ? ('super_admin' as const) : ('admin' as const)
    };

    login(`admin_token_${Date.now()}`, adminUser);
    toast({
      title: isSuper ? "Login Super Admin Berhasil" : "Login Admin Berhasil",
      description: isSuper ? "Selamat datang di Panel Master Super Admin." : "Selamat datang di Panel Administrasi Wisata Jelajah Indonesia."
    });
    navigate(isSuper ? '/super-admin' : '/admin');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-3">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="Wisata Jelajah Indonesia Logo" 
                  className="h-16 w-16 object-contain drop-shadow-md" 
                />
                <span className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full shadow">
                  <Shield className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Portal</CardTitle>
            <CardDescription>
              Akses khusus pengelola Wisata Jelajah Indonesia
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    name="email"
                    type="email" 
                    placeholder="admin@wisata.id" 
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Login to Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLogin;
