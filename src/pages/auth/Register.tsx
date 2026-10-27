import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import SocialLogin from '@/components/auth/SocialLogin';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    }

    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Anda harus menyetujui syarat dan ketentuan';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      // Try backend endpoint if available
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
        signal: AbortSignal.timeout(2000),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Registrasi Berhasil!",
          description: "Selamat datang di Wisata Jelajah Indonesia."
        });
        login(data.token, data.user);
        navigate('/dashboard');
        return;
      }
    } catch {
      // Offline fallback: register directly with userService
    }

    // Client/Serverless registration fallback
    const registered = userService.registerOrSyncUser({
      name: formData.name,
      email: formData.email,
      role: 'customer' // All self-service registrations default to customer
    });

    const userSession = {
      id: registered.id,
      name: registered.name,
      email: registered.email,
      role: registered.role,
      imageUrl: registered.avatarUrl
    };

    login(`token_${Date.now()}`, userSession);
    toast({
      title: "Pendaftaran Berhasil!",
      description: `Akun wisatawan atas nama ${registered.name} berhasil dibuat.`
    });
    navigate('/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 bg-gray-50">
        <div className="container-custom max-w-md">
          <Card className="shadow-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <Link to="/" className="inline-flex items-center gap-2 group">
                  <img 
                    src="/logo.png" 
                    alt="Wisata Jelajah Indonesia" 
                    className="h-16 w-16 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105" 
                  />
                </Link>
              </div>
              <CardTitle className="text-2xl font-bold">Buat Akun Baru</CardTitle>
              <CardDescription>
                Daftar sebagai Wisatawan untuk memesan tiket wisata & menikmati e-tiket digital
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nama Lengkap */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nama Lengkap
                    <span className="text-red-500"> *</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Nama lengkap Anda"
                      value={formData.name}
                      onChange={handleChange}
                      className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                    <span className="text-red-500"> *</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="contoh@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
                
                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                    <span className="text-red-500"> *</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimal 6 karakter"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </div>
                
                {/* Terms and Conditions */}
                <div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            agreeTerms: checked === true
                          }));
                          
                          if (errors.agreeTerms) {
                            setErrors(prev => {
                              const newErrors = {...prev};
                              delete newErrors.agreeTerms;
                              return newErrors;
                            });
                          }
                        }}
                      />
                    </div>
                    <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-600">
                      Saya menyetujui <Link to="/terms" className="text-primary hover:underline">Syarat dan Ketentuan</Link>
                    </label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-xs text-red-500 mt-1">{errors.agreeTerms}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-semibold" disabled={isLoading}>
                  {isLoading ? 'Membuat Akun...' : 'Daftar Sekarang'}
                </Button>
              </form>
              
              <SocialLogin />
            </CardContent>
            
            <CardFooter className="justify-center">
              <p className="text-sm text-gray-600">
                Sudah memiliki akun?{' '}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Masuk sekarang
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
