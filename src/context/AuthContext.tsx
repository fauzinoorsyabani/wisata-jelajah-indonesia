import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ClerkProvider, useUser, useClerk } from '@clerk/clerk-react';
import { userService, UserRole, UserProfile } from '@/services/userService';

export type { UserRole };

export interface User {
  id: string | number;
  email: string;
  name?: string;
  role: UserRole;
  imageUrl?: string;
  status?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isCustomer: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (token: string, userData: User) => void;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoSuperAdmin: () => void;
  loginAsDemoAdmin: () => void;
  loginAsDemoUser: () => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  isClerkEnabled: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isCustomer: false,
  isAdmin: false,
  isSuperAdmin: false,
  login: () => {},
  loginWithGoogle: async () => {},
  loginAsDemoSuperAdmin: () => {},
  loginAsDemoAdmin: () => {},
  loginAsDemoUser: () => {},
  switchRole: () => {},
  logout: () => {},
  isClerkEnabled: false,
});

export const useAuth = () => useContext(AuthContext);

// Inner component that handles Clerk synchronization and local user session
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
    // Outside of ClerkProvider or Clerk not configured
  }

  // Load active session from localStorage and reconcile with userService
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed: User = JSON.parse(storedUser);
        // Sync with persisted user store
        const found = userService.getUserByEmail(parsed.email);
        if (found) {
          parsed.role = found.role;
          parsed.status = found.status;
        }
        setLocalUser(parsed);
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
      const existing = userService.getUserByEmail(email);

      let assignedRole: UserRole = 'customer';
      if (existing) {
        assignedRole = existing.role;
      } else if (email === 'superadmin@wisata.id' || clerkUser.publicMetadata?.role === 'super_admin') {
        assignedRole = 'super_admin';
      } else if (email === 'admin@wisata.id' || clerkUser.publicMetadata?.role === 'admin' || email.includes('admin')) {
        assignedRole = 'admin';
      }

      const synchedUser = userService.registerOrSyncUser({
        name: clerkUser.fullName || clerkUser.firstName || email.split('@')[0],
        email,
        role: assignedRole,
        avatarUrl: clerkUser.imageUrl
      });

      const userSession: User = {
        id: synchedUser.id,
        email: synchedUser.email,
        name: synchedUser.name,
        role: synchedUser.role,
        imageUrl: synchedUser.avatarUrl,
        status: synchedUser.status
      };

      setLocalUser(userSession);
      localStorage.setItem('user', JSON.stringify(userSession));
      localStorage.setItem('token', `clerk_${clerkUser.id}`);
    }
  }, [clerkUser]);

  const login = (token: string, userData: User) => {
    // Ensure user is recorded in user repository
    const registered = userService.registerOrSyncUser({
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      role: userData.role,
      avatarUrl: userData.imageUrl
    });

    const sessionUser: User = {
      ...userData,
      role: registered.role,
      status: registered.status
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(sessionUser));
    setLocalUser(sessionUser);

    toast({
      title: "Login berhasil",
      description: `Selamat datang kembali, ${sessionUser.name || sessionUser.email}! (${sessionUser.role.toUpperCase()})`,
    });
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);

      // Try Clerk Google OAuth if enabled and initialized
      if (clerk && typeof clerk.openSignIn === 'function') {
        try {
          await clerk.openSignIn({
            strategy: 'oauth_google',
            redirectUrl: window.location.origin + '/dashboard',
          });
          return;
        } catch (clerkErr) {
          console.warn('Clerk modal unavailable, using instant Google SSO fallback', clerkErr);
        }
      }

      // Seamless Instant Google SSO Fallback (defaults to Customer role)
      const existingGoogleUser = userService.getUserByEmail("wisatawan.google@gmail.com");
      const assignedRole: UserRole = existingGoogleUser ? existingGoogleUser.role : 'customer';

      const googleUser: User = {
        id: existingGoogleUser ? existingGoogleUser.id : `google_${Date.now()}`,
        email: "wisatawan.google@gmail.com",
        name: "Wisatawan Google (Tasikmalaya Explorer)",
        role: assignedRole,
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&fm=webp&w=150&q=80"
      };

      login(`token_google_${Date.now()}`, googleUser);

      // Redirect based on role
      setTimeout(() => {
        if (assignedRole === 'super_admin') {
          window.location.href = '/super-admin';
        } else if (assignedRole === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }, 500);

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

  const loginAsDemoSuperAdmin = () => {
    const superAdminUser: User = {
      id: "usr_super_1",
      email: "superadmin@wisata.id",
      name: "Master Super Admin",
      role: "super_admin",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&fm=webp&w=150&q=80"
    };
    login("demo_super_token_2026", superAdminUser);
    setTimeout(() => {
      window.location.href = '/super-admin';
    }, 400);
  };

  const loginAsDemoAdmin = () => {
    const adminUser: User = {
      id: "usr_admin_1",
      email: "admin@wisata.id",
      name: "Pengelola Wisata Galunggung",
      role: "admin",
      imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&fm=webp&w=150&q=80"
    };
    login("demo_admin_token_2026", adminUser);
    setTimeout(() => {
      window.location.href = '/admin';
    }, 400);
  };

  const loginAsDemoUser = () => {
    const regularUser: User = {
      id: "usr_cust_1",
      email: "wisatawan@wisata.id",
      name: "Fauzi Noor Syabani",
      role: "customer",
      imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&fm=webp&w=150&q=80"
    };
    login("demo_user_token_2026", regularUser);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 400);
  };

  const switchRole = (newRole: UserRole) => {
    if (!localUser) return;
    const updated = userService.updateUserRole(String(localUser.id), newRole);
    const updatedUser: User = {
      ...localUser,
      role: updated.role
    };
    setLocalUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    toast({
      title: "Peran Diubah",
      description: `Beralih ke mode ${newRole.toUpperCase()}. Mengarahkan ke dashboard...`
    });

    setTimeout(() => {
      if (newRole === 'super_admin') {
        window.location.href = '/super-admin';
      } else if (newRole === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    }, 500);
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
  const isSuperAdmin = activeUser?.role === 'super_admin';
  const isAdmin = activeUser?.role === 'admin' || isSuperAdmin;
  const isCustomer = activeUser?.role === 'customer';

  const value: AuthContextType = {
    user: activeUser,
    isLoading,
    isAuthenticated: !!activeUser,
    isCustomer,
    isAdmin,
    isSuperAdmin,
    login,
    loginWithGoogle,
    loginAsDemoSuperAdmin,
    loginAsDemoAdmin,
    loginAsDemoUser,
    switchRole,
    logout,
    isClerkEnabled: Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (
    publishableKey && 
    typeof publishableKey === 'string' && 
    (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'))
  ) {
    return (
      <ClerkProvider publishableKey={publishableKey}>
        <ClerkSync>{children}</ClerkSync>
      </ClerkProvider>
    );
  }

  // Autonomous resilient ClerkSync provider
  return <ClerkSync>{children}</ClerkSync>;
};
