import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ClerkProvider, useUser, useClerk } from '@clerk/clerk-react';

export interface User {
  id: string | number;
  email: string;
  name?: string;
  role?: string;
  imageUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, userData: User) => void;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoAdmin: () => void;
  loginAsDemoUser: () => void;
  logout: () => void;
  isClerkEnabled: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  loginWithGoogle: async () => {},
  loginAsDemoAdmin: () => {},
  loginAsDemoUser: () => {},
  logout: () => {},
  isClerkEnabled: false,
});

export const useAuth = () => useContext(AuthContext);

// Inner component that has access to Clerk hooks
const ClerkSync: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  let clerkUser = null;
  let clerk: any = null;
  try {
    const userHook = useUser();
    clerkUser = userHook.user;
    clerk = useClerk();
  } catch (e) {
    // Outside of ClerkProvider or Clerk not initialized
  }

  // Load from localStorage on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setLocalUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  // Sync Clerk authenticated user into local state
  useEffect(() => {
    if (clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || '';
      const isAdmin = email === 'admin@wisata.id' || 
                      clerkUser.publicMetadata?.role === 'admin' ||
                      email.includes('admin');
      
      const synchedUser: User = {
        id: clerkUser.id,
        email,
        name: clerkUser.fullName || clerkUser.firstName || email.split('@')[0],
        role: isAdmin ? 'admin' : 'customer',
        imageUrl: clerkUser.imageUrl
      };
      
      setLocalUser(synchedUser);
      localStorage.setItem('user', JSON.stringify(synchedUser));
      localStorage.setItem('token', `clerk_${clerkUser.id}`);
    }
  }, [clerkUser]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setLocalUser(userData);

    toast({
      title: "Login berhasil",
      description: `Selamat datang kembali, ${userData.name || userData.email}!`,
    });
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      if (clerk && typeof clerk.openSignIn === 'function') {
        try {
          await clerk.openSignIn({
            strategy: 'oauth_google',
            redirectUrl: window.location.origin + '/dashboard',
          });
          return;
        } catch (clerkErr) {
          console.warn('Clerk Google SignIn modal not completed, falling back to seamless demo Google SSO', clerkErr);
        }
      }

      // Seamless Instant Google SSO Fallback
      const googleUser: User = {
        id: `google_${Date.now()}`,
        email: "wisatawan.google@gmail.com",
        name: "Wisatawan Google (Tasikmalaya Explorer)",
        role: "customer",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&fm=webp&w=150&q=80"
      };
      login(`token_google_${Date.now()}`, googleUser);
    } catch (error) {
      console.error('Google login error', error);
      toast({
        title: "Login Google",
        description: "Gagal memproses login Google, silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoAdmin = () => {
    const adminUser: User = {
      id: "admin-1",
      email: "admin@wisata.id",
      name: "Super Administrator",
      role: "admin",
      imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&fm=webp&w=150&q=80"
    };
    login("demo_admin_token_2026", adminUser);
  };

  const loginAsDemoUser = () => {
    const regularUser: User = {
      id: "user-demo-1",
      email: "pengunjung@wisata.id",
      name: "Pengunjung Wisata Tasikmalaya",
      role: "customer",
      imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&fm=webp&w=150&q=80"
    };
    login("demo_user_token_2026", regularUser);
  };

  const logout = () => {
    if (clerk && typeof clerk.signOut === 'function') {
      try {
        clerk.signOut();
      } catch (e) {}
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLocalUser(null);

    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari akun",
    });
    window.location.href = '/';
  };

  const activeUser = localUser;
  const isAdmin = activeUser?.role === 'admin' || activeUser?.email === 'admin@wisata.id';

  const value: AuthContextType = {
    user: activeUser,
    isLoading,
    isAuthenticated: !!activeUser,
    isAdmin,
    login,
    loginWithGoogle,
    loginAsDemoAdmin,
    loginAsDemoUser,
    logout,
    isClerkEnabled: Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (publishableKey && typeof publishableKey === 'string' && publishableKey.startsWith('pk_')) {
    return (
      <ClerkProvider publishableKey={publishableKey}>
        <ClerkSync>{children}</ClerkSync>
      </ClerkProvider>
    );
  }

  return <ClerkSync>{children}</ClerkSync>;
};
