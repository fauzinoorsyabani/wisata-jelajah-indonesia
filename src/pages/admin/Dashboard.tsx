
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Users, Map, TrendingUp, Activity, ArrowUp } from 'lucide-react';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Users, Map, TrendingUp, Activity, ArrowUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  totalSales: number;
  totalUsers: number;
  totalDestinations: number;
  salesGrowth: number;
  userGrowth: number;
  destGrowth: number;
  recentTransactions: any[];
  popularDestinations: any[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalUsers: 0,
    totalDestinations: 0,
    salesGrowth: 0,
    userGrowth: 0,
    destGrowth: 0,
    recentTransactions: [],
    popularDestinations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      
      setStats({
        totalSales: data.totalSales || 0,
        totalUsers: data.totalUsers || 0,
        totalDestinations: data.totalDestinations || 0,
        salesGrowth: 12.5, // Mock growth for now
        userGrowth: 8.2, // Mock growth
        destGrowth: 4.1, // Mock growth
        recentTransactions: data.recentTransactions || [],
        popularDestinations: data.popularDestinations || []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Gagal memuat statistik dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard Admin</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : formatCurrency(stats.totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.salesGrowth}% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.userGrowth}% pengguna baru
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Destinasi Aktif</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalDestinations}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.destGrowth}% destinasi baru
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Konversi</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24%</div>
            <p className="text-xs text-muted-foreground">
              +5% dari bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Penjualan Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Grafik penjualan akan ditampilkan di sini</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Destinasi Terpopuler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-sm text-gray-500">Memuat data...</div>
              ) : stats.popularDestinations.length > 0 ? (
                stats.popularDestinations.map((destination, i) => (
                  <div key={i} className="flex items-center">
                    <div className="font-medium flex-1 truncate pr-2">{destination.name}</div>
                    <div className="text-right">
                      <div className="font-medium">{destination.booking_count} Bookings</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500">Belum ada data destinasi populer</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {loading ? (
                <div className="text-center text-sm text-gray-500">Memuat data...</div>
              ) : stats.recentTransactions.length > 0 ? (
                stats.recentTransactions.map((transaction, i) => (
                  <div key={i} className="grid grid-cols-4 text-sm border-b last:border-0 pb-2 last:pb-0 pt-2 first:pt-0">
                    <div className="font-medium">#{transaction.id}</div>
                    <div className="truncate pr-2">{transaction.destination_name}</div>
                    <div className="truncate pr-2 text-gray-500">{transaction.user_email?.split('@')[0]}</div>
                    <div className="text-right font-medium">{formatCurrency(transaction.total_amount)}</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500">Belum ada transaksi</div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { activity: "System Update: Dashboard stats connected", time: "Just now" },
                { activity: "Admin scanned database integrity", time: "5 mins ago" },
                { activity: "Backup created successfully", time: "1 hour ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.activity}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
