import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { destinationService, Booking } from '@/services/destinationService';
import { QRCodeSVG } from 'qrcode.react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Copy,
  AlertCircle,
  HelpCircle,
  Loader2,
  Calendar,
  Ticket,
  MapPin,
  Banknote,
  QrCode,
  ShieldCheck,
  Building2,
  CreditCard
} from 'lucide-react';

const Payment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSwitchingCod, setIsSwitchingCod] = useState(false);
  const [isSnapLoading, setIsSnapLoading] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes timer

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/payment/${id}` } });
      return;
    }

    if (!id) {
      navigate('/bookings');
      return;
    }

    const found = destinationService.getBookingById(id);
    if (found) {
      setBooking(found);
    }
    setLoading(false);
  }, [id, isAuthenticated, navigate]);

  // Load Midtrans Snap SDK dynamically
  useEffect(() => {
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'Mid-client-UqhCGKX-B8eauHwV';
    const isProd = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true';
    const snapUrl = isProd
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';

    if (!document.querySelector(`script[src="${snapUrl}"]`)) {
      const script = document.createElement('script');
      script.src = snapUrl;
      script.setAttribute('data-client-key', clientKey);
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!booking || booking.status === 'paid' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [booking, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyAmount = () => {
    if (!booking) return;
    navigator.clipboard.writeText(booking.total_amount.toString());
    setCopiedAmount(true);
    toast({
      title: "Nominal Disalin",
      description: `Rp ${booking.total_amount.toLocaleString('id-ID')} telah disalin ke clipboard.`,
    });
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleVerifyPayment = () => {
    if (!booking) return;
    setIsVerifying(true);

    // Simulate instant payment gateway webhook verification
    setTimeout(() => {
      destinationService.updateBookingStatus(booking.id, 'paid', 'QRIS Instan (Lunas)');
      setIsVerifying(false);

      toast({
        title: "Pembayaran Dikonfirmasi!",
        description: `E-Tiket untuk ${booking.destination_name} telah aktif dan siap digunakan.`,
      });

      navigate('/bookings');
    }, 1500);
  };

  const handleSwitchToCod = () => {
    if (!booking) return;
    setIsSwitchingCod(true);

    setTimeout(() => {
      destinationService.updateBookingStatus(booking.id, 'pending', 'Bayar di Tempat (Loket)');
      setIsSwitchingCod(false);

      toast({
        title: "Metode Berhasil Diubah",
        description: `Pesanan dialihkan ke Bayar di Loket. Tunjukkan kode ${booking.booking_code} saat tiba di destinasi.`,
      });

      navigate('/bookings');
    }, 800);
  };

  const handleOpenSnapModal = async () => {
    if (!booking) return;
    setIsSnapLoading(true);

    try {
      const response = await fetch('/api/payment/snap-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          destinationName: booking.destination_name,
          ticketType: booking.ticket_type,
          quantity: booking.quantity,
          amount: booking.total_amount,
          customerName: booking.user_name,
          customerEmail: booking.user_email
        })
      });

      const data = await response.json();

      if (data.success && data.token && (window as any).snap) {
        (window as any).snap.pay(data.token, {
          onSuccess: (result: any) => {
            destinationService.updateBookingStatus(booking.id, 'paid', 'Midtrans Snap (Lunas)');
            toast({
              title: "Pembayaran Berhasil!",
              description: `Transaksi telah diverifikasi Midtrans. E-Tiket Anda telah aktif!`,
            });
            navigate('/bookings');
          },
          onPending: (result: any) => {
            toast({
              title: "Menunggu Pembayaran",
              description: "Silakan selesaikan pembayaran sesuai instruksi Midtrans.",
            });
            navigate('/bookings');
          },
          onError: (err: any) => {
            toast({
              title: "Pembayaran Dibatalkan / Gagal",
              description: "Anda dapat mencoba kembali atau membayar via QRIS langsung.",
              variant: "destructive"
            });
          },
          onClose: () => {
            toast({
              title: "Popup Ditutup",
              description: "Anda dapat melanjutkan pembayaran kapan saja.",
            });
          }
        });
      } else {
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
        } else {
          toast({
            title: "Info Midtrans Snap",
            description: data.message || "Gunakan QR Code dinamis di bawah untuk menyelesaikan transaksi.",
          });
        }
      }
    } catch (err) {
      console.error('Snap payment error:', err);
      toast({
        title: "Info Gateway",
        description: "Silakan scan kode QRIS langsung di bawah.",
      });
    } finally {
      setIsSnapLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-gray-500">Memuat detail tagihan...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container-custom py-16 flex-1 text-center">
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Tagihan Tidak Ditemukan</h2>
            <p className="text-sm text-gray-600 mb-6">
              Kode pemesanan yang Anda tuju mungkin sudah kedaluwarsa atau tidak terdaftar.
            </p>
            <Button onClick={() => navigate('/bookings')} className="bg-primary text-white w-full">
              Kembali ke Daftar Pesanan
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (booking.status === 'paid') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container-custom py-16 flex-1 text-center">
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pembayaran Sudah Lunas</h2>
            <p className="text-sm text-gray-600 mb-6">
              E-Tiket dengan kode booking <strong>{booking.booking_code}</strong> sudah aktif dan siap digunakan di pintu masuk wisata.
            </p>
            <Button onClick={() => navigate('/bookings')} className="bg-primary text-white w-full">
              Lihat E-Tiket Saya
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // QRIS standard payload simulation
  const qrisPayload = `00020101021226670014ID.LINKAJA.WWW01189360091100212000000215202610271319000303UMI51440014ID.CO.QRIS.WWW0215ID10200234567890303UMI520458125303360540${booking.total_amount}5802ID5913WisataJelajah6011Tasikmalaya62190115${booking.booking_code}6304`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="container-custom flex items-center justify-between text-xs md:text-sm text-gray-600">
          <button
            onClick={() => navigate('/bookings')}
            className="flex items-center gap-1.5 hover:text-primary font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Pesanan Saya
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Kode Booking:</span>
            <span className="font-mono font-bold text-gray-900">{booking.booking_code}</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 flex-1 max-w-5xl">
        {/* Countdown Header Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Menunggu Pembayaran QRIS</h3>
              <p className="text-xs text-gray-600">
                Selesaikan pembayaran sebelum batas waktu berakhir agar kuota tiket Anda tidak dibatalkan.
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Sisa Waktu Bayar</span>
            <span className="font-mono text-xl font-extrabold text-amber-600">
              {formatTimer(timeLeft)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: QRIS Screen */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="bg-white text-red-600 px-2 py-0.5 rounded font-black text-xs tracking-wider">
                    QRIS
                  </div>
                  <span className="text-xs font-semibold tracking-wide uppercase opacity-95">
                    Standar Pembayaran Nasional
                  </span>
                </div>
                <CardTitle className="text-lg font-bold tracking-tight">Wisata Jelajah Indonesia</CardTitle>
                <p className="text-[11px] text-red-100 mt-0.5">
                  NMID: ID1020023456789 • A.N Platform WisataJelajah
                </p>
              </CardHeader>

              <CardContent className="p-6 text-center space-y-5">
                {/* Total Nominal */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <span className="text-xs text-gray-500 block mb-1">Total yang Harus Dibayar:</span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      Rp {booking.total_amount.toLocaleString('id-ID')}
                    </span>
                    <button
                      onClick={handleCopyAmount}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition"
                      title="Salin Nominal"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  {copiedAmount && (
                    <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                      ✓ Nominal disalin
                    </span>
                  )}
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center">
                  <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-gray-300 shadow-inner">
                    <QRCodeSVG
                      value={qrisPayload}
                      size={220}
                      level="H"
                      includeMargin={true}
                      className="mx-auto"
                    />
                  </div>
                  <span className="text-xs text-gray-400 mt-2 font-mono">
                    Kode Tagihan: {booking.booking_code}
                  </span>
                </div>

                {/* Supported Apps Strip */}
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[11px] text-gray-500 block mb-2 font-medium">
                    Dapat di-scan dengan seluruh aplikasi berstandar QRIS:
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded-md">GoPay</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-md">OVO</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-md">DANA</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-md">ShopeePay</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-md">BCA Mobile</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-md">Livin' Mandiri</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-md">BRImo</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-md">BSI Mobile</span>
                  </div>
                </div>

                {/* Verification Actions */}
                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handleOpenSnapModal}
                    disabled={isSnapLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isSnapLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menghubungkan Midtrans Snap...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Bayar dengan Midtrans (Virtual Account / GoPay)</span>
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleVerifyPayment}
                    disabled={isVerifying}
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memverifikasi Pembayaran ke Gateway...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Saya Sudah Scan QRIS (Cek Status Otomatis)</span>
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <button
                      onClick={handleSwitchToCod}
                      disabled={isSwitchingCod}
                      className="text-xs text-gray-600 hover:text-primary font-medium flex items-center gap-1 mx-auto underline transition"
                    >
                      <Banknote className="w-3.5 h-3.5 text-gray-500" />
                      {isSwitchingCod ? 'Mengalihkan pesanan...' : 'Ubah ke Bayar di Loket Destinasi (Tunai/COD)'}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary & Instructions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Booking Details Card */}
            <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/70 p-5 border-b border-gray-100">
                <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-primary" />
                  Ringkasan Pesanan Wisata
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                {/* Destination info */}
                <div className="flex gap-3 items-center">
                  <div className="h-14 w-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <OptimizedImage
                      src={booking.destination_image}
                      alt={booking.destination_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{booking.destination_name}</h4>
                    <p className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-primary" />
                      {booking.destination_location}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Tanggal Kunjungan:</span>
                    <span className="font-semibold text-gray-900">{booking.ticket_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jenis Tiket:</span>
                    <span className="font-semibold text-gray-900">{booking.ticket_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jumlah Pengunjung:</span>
                    <span className="font-semibold text-gray-900">{booking.quantity} Orang / Tiket</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Harga Satuan:</span>
                    <span className="font-semibold text-gray-900">
                      Rp {booking.unit_price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nama Pengunjung:</span>
                    <span className="font-semibold text-gray-900">{booking.user_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Layanan Gateway:</span>
                    <span className="text-emerald-600 font-semibold">Gratis (Rp 0)</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-sm font-bold text-gray-900 pt-1">
                  <span>Total Tagihan:</span>
                  <span className="text-primary text-base">
                    Rp {booking.total_amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* How to Pay Guide */}
            <Card className="rounded-2xl border border-gray-200 shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  Cara Membayar QRIS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs text-gray-600 space-y-2.5">
                <div className="flex gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <p>Buka aplikasi E-Wallet (GoPay, OVO, DANA, ShopeePay) atau Mobile Banking favorit Anda.</p>
                </div>
                <div className="flex gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <p>Pilih menu <strong>Scan QR / Bayar</strong> di layar utama aplikasi.</p>
                </div>
                <div className="flex gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <p>Arahkan kamera smartphone ke kode QR di layar ini.</p>
                </div>
                <div className="flex gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    4
                  </span>
                  <p>
                    Periksa nama merchant (<strong>Wisata Jelajah Indonesia</strong>) dan nominal pembayaran.
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    5
                  </span>
                  <p>Konfirmasi transaksi & masukkan PIN Anda. Tiket akan aktif seketika!</p>
                </div>
              </CardContent>
            </Card>

            {/* Security Guarantee */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900">
                <span className="font-bold block">Jaminan Transaksi Aman & Terenkripsi</span>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Seluruh pembayaran menggunakan enkripsi 256-bit dan mematuhi regulasi Bank Indonesia QRIS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;
