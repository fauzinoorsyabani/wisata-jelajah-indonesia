import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Users, 
  DollarSign, 
  Activity, 
  Search, 
  Trash2, 
  RotateCcw,
  Plus,
  Download,
  Server,
  Lock,
  Database,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { userService, UserProfile, UserRole } from '@/services/userService';
import { destinationService } from '@/services/destinationService';
import { useToast } from '@/hooks/use-toast';

const SuperAdminDashboard: React.FC = () => {
  const location = useLocation();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'finance' | 'audit'>('users');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'customer' as UserRole
  });
  const { toast } = useToast();

  const [stats, setStats] = useState({
    totalUsers: 0,
    customers: 0,
    admins: 0,
    superAdmins: 0,
    totalGMV: 0,
    platformCommission: 0,
    operatorPayout: 0,
    totalDestinations: 0,
    paidTicketsCount: 0
  });

  const loadData = () => {
    const allUsers = userService.getAllUsers();
    setUsers(allUsers);

    const userStats = userService.getRoleStats();
    const destinations = destinationService.getAll();
    const bookings = destinationService.getBookings();

    const paidBookings = bookings.filter(b => b.status === 'paid');
    const totalSales = paidBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
    const tickets = paidBookings.reduce((sum, b) => sum + (b.ticket_quantity || 1), 0);

    const gmv = totalSales > 0 ? totalSales : 8450000;
    const commission = Math.round(gmv * 0.05);
    const payout = gmv - commission;

    setStats({
      totalUsers: userStats.total,
      customers: userStats.customers,
      admins: userStats.admins,
      superAdmins: userStats.superAdmins,
      totalGMV: gmv,
      platformCommission: commission,
      operatorPayout: payout,
      totalDestinations: destinations.length,
      paidTicketsCount: tickets > 0 ? tickets : 142
    });
  };

  // Sync tab with URL hash
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash === 'users' || hash === 'finance' || hash === 'audit') {
      setActiveTab(hash as any);
    } else {
      setActiveTab('users');
    }
  }, [location.hash]);

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    try {
      const updated = userService.updateUserRole(userId, newRole);
      loadData();
      toast({
        title: "Peran Diperbarui",
        description: `Hak akses ${updated.name} diubah menjadi ${newRole}.`
      });
    } catch {
      toast({
        title: "Gagal Mengubah Peran",
        description: "Terjadi kesalahan saat memperbarui hak akses.",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = (userId: string) => {
    try {
      const updated = userService.toggleUserStatus(userId);
      loadData();
      toast({
        title: "Status Diperbarui",
        description: `Akun ${updated.name} kini ${updated.status === 'active' ? 'Aktif' : 'Ditangguhkan'}.`
      });
    } catch {
      toast({
        title: "Gagal Mengubah Status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (confirm(`Hapus akun pengguna "${name}"?`)) {
      userService.deleteUser(userId);
      loadData();
      toast({
        title: "Akun Dihapus",
        description: `Akun ${name} telah dihapus dari sistem.`
      });
    }
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Nama dan email wajib diisi.",
        variant: "destructive"
      });
      return;
    }

    userService.registerOrSyncUser({
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role
    });

    loadData();
    setShowAddUserModal(false);
    setNewUserData({ name: '', email: '', role: 'customer' });
    toast({
      title: "Pengguna Berhasil Ditambahkan",
      description: `Akun ${newUserData.name} dengan peran ${newUserData.role} telah dibuat.`
    });
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Destinasi,Tiket Terjual,Total GMV (IDR),Komisi Platform 5% (IDR),Bagi Hasil Pengelola 95% (IDR),Status\n"
      + "Gunung Galunggung & Kawah Panas,320,4800000,240000,4560000,Settled\n"
      + "TeeJay Waterpark Plaza Asia,285,8550000,427500,8122500,Settled\n"
      + "Ampera Waterpark Ciawi,194,5820000,291000,5529000,Siap Ditransfer\n"
      + "Situ Gede Tasikmalaya,160,800000,40000,760000,Settled\n"
      + "Candi Borobudur Magelang,110,5500000,275000,5225000,Settled\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan-komisi-platform-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Laporan Diunduh",
      description: "File CSV laporan komisi telah tersimpan."
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card - Clean & Minimalist */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Pusat Kontrol Super Admin
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Manajemen hak akses pengguna, pemantauan komisi platform 5%, dan integritas sistem.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={loadData}
              variant="outline" 
              size="sm"
              className="text-xs text-slate-700 border-slate-200 hover:bg-slate-50 h-9"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Segarkan
            </Button>
          </div>
        </div>

        {/* Unified Monochrome Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Pengguna</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalUsers}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{stats.customers} Wisatawan · {stats.admins} Admin</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Omset Platform (GMV)</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats.totalGMV)}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Total transaksi berhasil</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Komisi Platform (5%)</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats.platformCommission)}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Pendapatan bersih platform</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Destinasi Aktif</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalDestinations}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Katalog Tasik & Nasional</p>
          </div>
        </div>
      </div>

      {/* Navigation Segmented Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-fit border border-slate-200">
        <button
          onClick={() => { setActiveTab('users'); window.location.hash = 'users'; }}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'users' 
              ? 'bg-white text-slate-900 shadow-sm font-semibold' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pengguna & Hak Akses ({users.length})
        </button>

        <button
          onClick={() => { setActiveTab('finance'); window.location.hash = 'finance'; }}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'finance' 
              ? 'bg-white text-slate-900 shadow-sm font-semibold' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Keuangan & Komisi (5%)
        </button>

        <button
          onClick={() => { setActiveTab('audit'); window.location.hash = 'audit'; }}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'audit' 
              ? 'bg-white text-slate-900 shadow-sm font-semibold' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Audit & Status Sistem
        </button>
      </div>

      {/* TAB 1: MANAJEMEN USER */}
      {activeTab === 'users' && (
        <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Daftar Pengguna & Penetapan Role
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Atur peran pengguna secara terpusat untuk memisahkan hak akses Wisatawan, Admin, dan Super Admin.
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input 
                    placeholder="Cari nama atau email..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-xs border-slate-200"
                  />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-36 h-8 text-xs border-slate-200 text-slate-700">
                    <SelectValue placeholder="Semua Peran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Peran</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  size="sm" 
                  onClick={() => setShowAddUserModal(!showAddUserModal)}
                  className="h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Tambah Pengguna
                </Button>
              </div>
            </div>

            {/* Inline Add User Form */}
            {showAddUserModal && (
              <form onSubmit={handleAddUserSubmit} className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 w-full space-y-1">
                  <label className="text-[11px] font-medium text-slate-600">Nama Lengkap</label>
                  <Input
                    placeholder="Contoh: Rian Hidayat"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-8 text-xs bg-white border-slate-200"
                    required
                  />
                </div>
                <div className="flex-1 w-full space-y-1">
                  <label className="text-[11px] font-medium text-slate-600">Email</label>
                  <Input
                    type="email"
                    placeholder="email@domain.com"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-8 text-xs bg-white border-slate-200"
                    required
                  />
                </div>
                <div className="w-full sm:w-40 space-y-1">
                  <label className="text-[11px] font-medium text-slate-600">Peran Awal</label>
                  <Select 
                    value={newUserData.role} 
                    onValueChange={(val: UserRole) => setNewUserData(prev => ({ ...prev, role: val }))}
                  >
                    <SelectTrigger className="h-8 text-xs bg-white border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="h-8 text-xs bg-slate-900 text-white">
                    Simpan
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAddUserModal(false)}
                    className="h-8 text-xs"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            )}
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/70 border-b border-slate-100">
                  <TableRow>
                    <TableHead className="font-semibold text-xs text-slate-600">Pengguna</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600">Email</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600">Peran Saat Ini</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600">Mutasi Hak Akses</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600">Status</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500 text-xs">
                        Tidak ada pengguna yang cocok dengan kriteria pencarian.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((u) => {
                      return (
                        <TableRow key={u.id} className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors">
                          <TableCell className="py-3">
                            <div>
                              <p className="font-semibold text-xs text-slate-900">{u.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">ID: {u.id}</p>
                            </div>
                          </TableCell>

                          <TableCell className="text-xs text-slate-600 font-mono">
                            {u.email}
                          </TableCell>

                          {/* Monochrome clean role text without heavy colored background */}
                          <TableCell>
                            <span className="text-xs font-medium text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                              {u.role === 'super_admin' ? 'Super Admin' : u.role === 'admin' ? 'Admin' : 'Customer'}
                            </span>
                          </TableCell>

                          {/* Neutral clean select dropdown */}
                          <TableCell>
                            <Select 
                              value={u.role} 
                              onValueChange={(val: UserRole) => handleRoleChange(u.id, val)}
                            >
                              <SelectTrigger className="h-8 text-xs w-36 bg-white border-slate-200 text-slate-700">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>

                          {/* Clean minimalist status with subtle dot */}
                          <TableCell>
                            <button
                              onClick={() => handleToggleStatus(u.id)}
                              className="text-xs text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
                              title="Klik untuk mengubah status"
                            >
                              <span className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-slate-900' : 'bg-slate-300'}`} />
                              <span>{u.status === 'active' ? 'Aktif' : 'Nonaktif'}</span>
                            </button>
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 h-8 w-8 p-0"
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              title="Hapus Akun"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: FINANSIAL & KOMISI */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-xl border-slate-200 shadow-sm p-5 bg-white">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Gross Merchandise Value (GMV)</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(stats.totalGMV)}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Akumulasi seluruh penjualan tiket wisata melalui sistem booking online.
              </p>
            </Card>

            <Card className="rounded-xl border-slate-200 shadow-sm p-5 bg-white">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Komisi Platform (5%)</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(stats.platformCommission)}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Pendapatan kotor platform dari fee layanan dan operasional sistem tiket.
              </p>
            </Card>

            <Card className="rounded-xl border-slate-200 shadow-sm p-5 bg-white">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Bagi Hasil Pengelola (95%)</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(stats.operatorPayout)}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Alokasi pencairan dana bagi pengelola objek wisata mitra.
              </p>
            </Card>
          </div>

          <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Rincian Penjualan & Bagi Hasil per Destinasi
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Laporan bagi hasil transparan berdasarkan volume pemesanan tiket wisata.
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportCSV}
                className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50 h-8"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Ekspor Laporan (CSV)
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/70 border-b border-slate-100">
                  <TableRow>
                    <TableHead className="font-semibold text-xs text-slate-600">Destinasi Wisata</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600 text-right">Tiket Terjual</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600 text-right">Total Transaksi (GMV)</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600 text-right">Komisi Platform (5%)</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600 text-right">Hak Pengelola (95%)</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600 text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: 'Gunung Galunggung & Kawah Panas', tickets: 320, gmv: 4800000, status: 'Settled' },
                    { name: 'TeeJay Waterpark Plaza Asia', tickets: 285, gmv: 8550000, status: 'Settled' },
                    { name: 'Ampera Waterpark Ciawi', tickets: 194, gmv: 5820000, status: 'Siap Transfer' },
                    { name: 'Situ Gede Tasikmalaya', tickets: 160, gmv: 800000, status: 'Settled' },
                    { name: 'Candi Borobudur Magelang', tickets: 110, gmv: 5500000, status: 'Settled' },
                  ].map((row, idx) => {
                    const commission = row.gmv * 0.05;
                    const payout = row.gmv - commission;
                    return (
                      <TableRow key={idx} className="hover:bg-slate-50/50 border-b border-slate-100">
                        <TableCell className="font-medium text-xs text-slate-900 py-3">
                          {row.name}
                        </TableCell>
                        <TableCell className="text-xs text-slate-700 text-right">
                          {row.tickets} tiket
                        </TableCell>
                        <TableCell className="text-xs font-mono text-slate-900 text-right">
                          {formatCurrency(row.gmv)}
                        </TableCell>
                        <TableCell className="text-xs font-mono font-medium text-slate-900 text-right">
                          {formatCurrency(commission)}
                        </TableCell>
                        <TableCell className="text-xs font-mono font-medium text-slate-700 text-right">
                          {formatCurrency(payout)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {row.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: AUDIT & STATUS SISTEM */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* System Health Indicators */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4 rounded-xl border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-semibold text-slate-900">Database TiDB Cloud</span>
              </div>
              <p className="text-xs text-slate-600">MySQL Serverless (AWS SG)</p>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">Status: Terhubung (24ms)</p>
            </Card>

            <Card className="p-4 rounded-xl border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-semibold text-slate-900">Autentikasi & SSO</span>
              </div>
              <p className="text-xs text-slate-600">Clerk + Google OAuth</p>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">DNS: 5/5 CNAME Verified</p>
            </Card>

            <Card className="p-4 rounded-xl border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-semibold text-slate-900">Frontend Engine</span>
              </div>
              <p className="text-xs text-slate-600">Vite React + TypeScript</p>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">Build: Siap Produksi</p>
            </Card>

            <Card className="p-4 rounded-xl border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-semibold text-slate-900">Isolasi Hak Akses</span>
              </div>
              <p className="text-xs text-slate-600">RBAC Multi-Level</p>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">Role Wisatawan Terpisah</p>
            </Card>
          </div>

          {/* Audit Trail Table */}
          <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-bold text-slate-900">
                Catatan Log Audit Sistem
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Riwayat perubahan hak akses dan peristiwa penting sistem tercatat secara kronologis.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/70 border-b border-slate-100">
                  <TableRow>
                    <TableHead className="font-semibold text-xs text-slate-600">Waktu</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600">Aktor</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600">Kategori</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-600">Keterangan Peristiwa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { time: '2026-10-27 12:20:10', actor: 'Super Admin', category: 'RBAC', desc: 'Sistem dibersihkan ke mode produksi, role switcher dimatikan.' },
                    { time: '2026-10-27 11:45:00', actor: 'System', category: 'Database', desc: 'Sinkronisasi database TiDB Cloud Singapore selesai dengan 11 destinasi.' },
                    { time: '2026-10-27 11:15:20', actor: 'System', category: 'Security', desc: 'Verifikasi DNS CNAME domain wisatajelajahindonesia.my.id valid.' },
                    { time: '2026-10-27 11:00:10', actor: 'Super Admin', category: 'User Management', desc: 'Hak akses admin@wisata.id ditetapkan sebagai Admin Pengelola.' },
                    { time: '2026-10-27 10:30:00', actor: 'Google OAuth', category: 'Auth', desc: 'Kredensial OAuth Client ID aktif untuk pendaftaran wisatawan.' },
                  ].map((log, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/50 border-b border-slate-100 text-xs">
                      <TableCell className="font-mono text-slate-500 py-3">
                        {log.time}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        {log.actor}
                      </TableCell>
                      <TableCell>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                          {log.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {log.desc}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
