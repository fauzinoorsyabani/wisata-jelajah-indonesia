import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Map, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  Sparkles, 
  QrCode, 
  CheckCircle2, 
  AlertCircle,
  Ticket
} from 'lucide-react';
import { destinationService, Destination, Booking } from '@/services/destinationService';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalSales: number;
  totalUsers: number;
  totalDestinations: number;
  salesGrowth: number;
  userGrowth: number;
  destGrowth: number;
  recentTransactions: Booking[];
  popularDestinations: { name: string; bookings_count: number }[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalUsers: 0,
    totalDestinations: 0,
    salesGrowth: 15.4,
    userGrowth: 9.8,
    destGrowth: 6.2,
    recentTransactions: [],
    popularDestinations: []
  });
  const [loading, setLoading] = useState(true);

  // Ticket Validator State
  const [ticketQuery, setTicketQuery] = useState('');
  const [validatedBooking, setValidatedBooking] = useState<Booking | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid' | 'checked_in'>('idle');
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const destinations = await destinationService.getAll();
      const bookings = destinationService.getBookings();

      const totalSales = bookings
        .filter(b => b.status === 'paid')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);

      const popular = [
        { name: "Gunung Galunggung & Pemandian Air Panas", bookings_count: 320 },
        { name: "TeeJay Waterpark (Plaza Asia)", bookings_count: 285 },
        { name: "Ampera Waterpark Ciawi", bookings_count: 194 },
        { name: "Situ Gede Tasikmalaya", bookings_count: 160 },
        { name: "Kampung Naga Heritage", bookings_count: 135 },
      ];

      setStats({
        totalSales: totalSales > 0 ? totalSales : 4750000,
        totalUsers: 142,
        totalDestinations: destinations.length,
        salesGrowth: 15.4,
        userGrowth: 9.8,
        destGrowth: 6.2,
        recentTransactions: bookings.slice(0, 6),
        popularDestinations: popular
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const query = ticketQuery.trim().toUpperCase();
    if (!query) return;

    const bookings = destinationService.getBookings();
    const found = bookings.find(b => 
      b.booking_code.toUpperCase() === query || 
      b.id.toUpperCase() === query ||
      b.booking_code.toUpperCase().includes(query)
    );

    if (found) {
      setValidatedBooking(found);
      setValidationStatus(found.status === 'used' ? 'checked_in' : 'valid');
      toast({
        title: found.status === 'used' ? "Tiket Sudah Pernah Digunakan" : "Tiket Valid!",
        description: `Ditemukan: ${found.destination_name} atas nama ${found.user_name}`,
        variant: found.status === 'used' ? "destructive" : "default"
      });
    } else {
      setValidatedBooking(null);
      setValidationStatus('invalid');
      toast({
        title: "Tiket Tidak Ditemukan",
        description: `Kode "${query}" tidak terdaftar dalam sistem reservasi.`,
        variant: "destructive"
      });
    }
  };

  const handleCheckInTicket = () => {
    if (!validatedBooking) return;

    try {
      const bookings = destinationService.getBookings();
      const updatedBookings = bookings.map(b => {
        if (b.id === validatedBooking.id) {
          return { ...b, status: 'used' as const };
        }
        return b;
      });

      localStorage.setItem('wisata_bookings_v1', JSON.stringify(updatedBookings));
      setValidatedBooking(prev => prev ? { ...prev, status: 'used' } : null);
      setValidationStatus('checked_in');

      toast({
        title: "Check-in Berhasil!",
        description: `Tiket ${validatedBooking.booking_code} telah divalidasi. Pengunjung dipersilakan masuk.`
      });
      fetchStats();
    } catch (e) {
      toast({
        title: "Gagal memproses check-in",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="py-6 space-y-6">
      {/* Top Banner */}
      <div>
        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          ADMINISTRATION PANEL (OPERATIONAL)
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Ringkasan Operasional</h1>
        <p className="text-gray-500 text-sm mt-1">
          Pantau statistik transaksi tiket, kelola destinasi Tasikmalaya, dan validasi e-tiket pengunjung di loket masuk.
        </p>
      </div>
      
      {/* Metrics Row */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-wider font-bold text-gray-500">Total Penjualan</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-gray-900">{loading ? "..." : formatCurrency(stats.totalSales)}</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              +{stats.salesGrowth}% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-wider font-bold text-gray-500">Total Wisatawan</CardTitle>
            <div className="p-2 bg-blue-50 rounded-xl text-primary">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-gray-900">{stats.totalUsers} Orang</div>
            <p className="text-xs text-blue-600 font-semibold mt-1">
              +{stats.userGrowth}% wisatawan aktif
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-wider font-bold text-gray-500">Destinasi Aktif</CardTitle>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <Map className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-gray-900">{stats.totalDestinations} Destinasi</div>
            <p className="text-xs text-amber-600 font-semibold mt-1">
              Fokus Tasikmalaya & Nasional
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-wider font-bold text-gray-500">Konversi QR Tiket</CardTitle>
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-gray-900">96.4%</div>
            <p className="text-xs text-purple-600 font-semibold mt-1">
              Validasi langsung di loket
            </p>
          </CardContent>
        </Card>
      </div>

      {/* LOKET SCANNER & TICKET VALIDATOR TOOL */}
      <Card className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-white to-blue-50/40 shadow-md">
        <CardHeader className="pb-3 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-primary text-white rounded-xl">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Loket Validator E-Tiket & Scanner Masuk
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Ketik atau scan kode booking tiket pengunjung (contoh: BK-GALUNGGUNG-001) untuk memverifikasi keaslian dan menandai tiket sudah digunakan.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleValidateTicket} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Masukkan Kode Booking (cth: BK-GALUNGGUNG-001)..."
                value={ticketQuery}
                onChange={(e) => setTicketQuery(e.target.value)}
                className="pl-9 font-mono uppercase font-bold text-sm bg-white"
              />
            </div>
            <Button type="submit" className="bg-primary hover:bg-primary/90 font-semibold text-xs px-6">
              Verifikasi Tiket
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="text-xs bg-white"
              onClick={() => {
                setTicketQuery('BK-GALUNGGUNG-001');
              }}
            >
              Isi Contoh Tiket
            </Button>
          </form>

          {/* Validation Result Box */}
          {validationStatus === 'valid' && validatedBooking && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-200 text-emerald-900 uppercase">
                    TIKET VALID & AKTIF
                  </div>
                  <h4 className="font-extrabold text-base text-gray-900 mt-1">{validatedBooking.destination_name}</h4>
                  <p className="text-xs text-gray-600">
                    Pengunjung: <span className="font-bold text-gray-900">{validatedBooking.user_name}</span> • {validatedBooking.quantity} Tiket • Tanggal: {validatedBooking.ticket_date}
                  </p>
                  <p className="text-[11px] font-mono text-emerald-800 font-bold mt-0.5">Kode: {validatedBooking.booking_code}</p>
                </div>
              </div>

              <Button 
                onClick={handleCheckInTicket}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shrink-0 w-full sm:w-auto"
              >
                Tandai Sudah Masuk Loket (Check-In)
              </Button>
            </div>
          )}

          {validationStatus === 'checked_in' && validatedBooking && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 uppercase">
                  SUDAH CHECK-IN / DIGUNAKAN
                </span>
                <p className="font-bold text-sm text-gray-900 mt-1">{validatedBooking.destination_name}</p>
                <p className="text-xs text-amber-900">
                  Tiket dengan kode <span className="font-mono font-bold">{validatedBooking.booking_code}</span> ({validatedBooking.user_name}) sudah berstatus USED dan tidak dapat dipakai ulang.
                </p>
              </div>
            </div>
          )}

          {validationStatus === 'invalid' && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Tiket tidak ditemukan. Pastikan kode booking yang Anda masukkan sesuai dengan e-tiket resmi.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tables Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Popular Destinations */}
        <Card className="rounded-2xl border-gray-100 shadow-sm">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-base font-bold text-gray-900">Destinasi Terpopuler</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3.5">
              {stats.popularDestinations.map((destination, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="font-semibold text-gray-800 truncate pr-2 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <span className="truncate">{destination.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-primary">{destination.bookings_count}</span>
                    <span className="text-gray-400 ml-1">Tiket</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-2 rounded-2xl border-gray-100 shadow-sm">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-base font-bold text-gray-900">Pemesanan Tiket Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {stats.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs">
                  <div>
                    <span className="font-mono font-bold text-primary">{tx.booking_code}</span>
                    <p className="font-semibold text-gray-900 text-sm mt-0.5">{tx.destination_name}</p>
                    <span className="text-gray-500">{tx.user_name} • {tx.ticket_date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-sm block">
                      {formatCurrency(tx.total_amount)}
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                      tx.status === 'used' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {tx.status.toUpperCase()}
                    </span>
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
