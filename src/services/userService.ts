// Service for User Management and Role-Based Access Control (RBAC)

export type UserRole = 'customer' | 'admin' | 'super_admin';
export type UserStatus = 'active' | 'suspended';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  avatarUrl?: string;
  totalBookings?: number;
}

const STORAGE_KEY = 'wisata_users_v1';

const SEED_USERS: UserProfile[] = [
  {
    id: 'usr_super_1',
    name: 'Master Super Admin',
    email: 'superadmin@wisata.id',
    role: 'super_admin',
    status: 'active',
    createdAt: '2026-01-01T08:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&fm=webp&w=150&q=80',
    totalBookings: 0,
  },
  {
    id: 'usr_admin_1',
    name: 'Pengelola Wisata Galunggung',
    email: 'admin@wisata.id',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-15T09:30:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&fm=webp&w=150&q=80',
    totalBookings: 12,
  },
  {
    id: 'usr_cust_1',
    name: 'Fauzi Noor Syabani',
    email: 'wisatawan@wisata.id',
    role: 'customer',
    status: 'active',
    createdAt: '2026-02-01T14:20:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&fm=webp&w=150&q=80',
    totalBookings: 3,
  },
  {
    id: 'usr_cust_2',
    name: 'Siti Rahmawati (Tasikmalaya)',
    email: 'siti.rahma@gmail.com',
    role: 'customer',
    status: 'active',
    createdAt: '2026-03-10T11:15:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&fm=webp&w=150&q=80',
    totalBookings: 2,
  }
];

export const userService = {
  getAllUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
        return SEED_USERS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_USERS;
    }
  },

  getUserById(id: string): UserProfile | undefined {
    return this.getAllUsers().find(u => u.id === id);
  },

  getUserByEmail(email: string): UserProfile | undefined {
    const cleanEmail = email.toLowerCase().trim();
    return this.getAllUsers().find(u => u.email.toLowerCase().trim() === cleanEmail);
  },

  saveUsers(users: UserProfile[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users into localStorage', e);
    }
  },

  registerOrSyncUser(data: { name: string; email: string; role?: UserRole; avatarUrl?: string }): UserProfile {
    const users = this.getAllUsers();
    const existing = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());

    if (existing) {
      return existing;
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: data.name,
      email: data.email,
      role: data.role || 'customer',
      status: 'active',
      createdAt: new Date().toISOString(),
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&fm=webp&w=150&q=80',
      totalBookings: 0,
    };

    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  },

  updateUserRole(userId: string, newRole: UserRole): UserProfile {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error('User tidak ditemukan');
    }

    users[index] = {
      ...users[index],
      role: newRole
    };

    this.saveUsers(users);

    // If currently logged-in user is updated, update active session
    try {
      const current = localStorage.getItem('user');
      if (current) {
        const parsed = JSON.parse(current);
        if (parsed.id === userId || parsed.email === users[index].email) {
          parsed.role = newRole;
          localStorage.setItem('user', JSON.stringify(parsed));
        }
      }
    } catch {}

    return users[index];
  },

  toggleUserStatus(userId: string): UserProfile {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error('User tidak ditemukan');
    }

    const currentStatus = users[index].status;
    users[index] = {
      ...users[index],
      status: currentStatus === 'active' ? 'suspended' : 'active'
    };

    this.saveUsers(users);
    return users[index];
  },

  deleteUser(userId: string): boolean {
    const users = this.getAllUsers();
    const filtered = users.filter(u => u.id !== userId);
    if (filtered.length !== users.length) {
      this.saveUsers(filtered);
      return true;
    }
    return false;
  },

  getRoleStats() {
    const users = this.getAllUsers();
    return {
      total: users.length,
      customers: users.filter(u => u.role === 'customer').length,
      admins: users.filter(u => u.role === 'admin').length,
      superAdmins: users.filter(u => u.role === 'super_admin').length,
      active: users.filter(u => u.status === 'active').length,
    };
  }
};
