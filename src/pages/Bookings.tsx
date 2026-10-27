import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar,
  Ticket,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Download,
  MapPin,
  Sparkles,
  Building2,
  QrCode,
  Printer
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { destinationService, Booking } from '@/services/destinationService';
import OptimizedImage from '@/components/ui/OptimizedImage';

const Bookings = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/bookings' } });
      return;
    }

    const data = destinationService.getBookings();
    setBookings(data);
    setLoading(false);
  }, [isAuthenticated, navigate]);

  const toggleExpandBooking = (id: string) => {
    setExpandedBookingId(prev => (prev === id ? null : id));
  };

  const handlePrintTicket = (bookingId: string) => {
    // Remove previous active printable classes
    document.querySelectorAll('.ticket-print-target').forEach(el => {
      el.classList.remove('ticket-print-target');
    });

    const target = document.getElementById(`ticket-card-${bookingId}`);
    if (target) {
      target.classList.add('ticket-print-target');
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          target.classList.remove('ticket-print-target');
        }, 1500);
      }, 100);
    }
  };

  const getStatusBadge = (status: Booking['status'], paymentMethod?: string) => {
    if (status === 'paid') {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          E-Tiket Aktif (Lunas)
        </Badge>
      );
    }
    if (status === 'pending') {
      if (paymentMethod?.toLowerCase().includes('loket') || paymentMethod?.toLowerCase().includes('tempat')) {
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            Bayar di Loket (Belum Lunas)
          </Badge>
        );
      }
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-semibold flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Menunggu Pembayaran QRIS
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-semibold flex items-center gap-1">
        <XCircle className="w-3.5 h-3.5" />
        Dibatalkan
      </Badge>
    );
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      
      <div className="container-custom py-10 flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Ticket className="w-3.5 h-3.5" />
              TIKET SAYA
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pesanan & E-Tiket Saya</h1>
            <p className="text-gray-600 text-sm mt-1">
              Daftar tiket wisata digital aktif untuk Kawah Galunggung, Waterpark, dan destinasi lainnya
            </p>
          </div>
          
          <div className="w-full md:w-52">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Status Tiket" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Semua Tiket ({bookings.length})</SelectItem>
                  <SelectItem value="paid">Tiket Aktif / Lunas</SelectItem>
                  <SelectItem value="pending">Menunggu Pembayaran</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((b) => (
              <Card key={b.id} className="overflow-hidden border border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  {/* Top Bar / Header */}
                  <div className="p-5 md:p-6 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="h-20 w-28 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                        <OptimizedImage
                          src={b.destination_image} 
                          alt={b.destination_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="font-bold text-gray-900 text-base md:text-lg">{b.destination_name}</h3>
                          {getStatusBadge(b.status, b.payment_method)}
                        </div>
                        
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            <span>Kunjungan: <strong>{b.ticket_date}</strong></span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <Ticket className="h-3.5 w-3.5 text-amber-500" />
                            <span>{b.quantity}x {b.ticket_type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                      <div className="text-left md:text-right">
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Total Biaya</p>
                        <p className="font-bold text-primary text-lg">
                          Rp {b.total_amount.toLocaleString('id-ID')}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {b.status === 'pending' && !b.payment_method?.toLowerCase().includes('loket') && (
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                            onClick={() => navigate(`/payment/${b.id}`)}
                          >
                            <QrCode className="h-3.5 w-3.5" />
                            Bayar QRIS
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl flex items-center gap-1.5 text-xs font-semibold"
                          onClick={() => toggleExpandBooking(b.id)}
                        >
                          {expandedBookingId === b.id ? (
                            <>Tutup E-Tiket <ChevronUp className="h-4 w-4" /></>
                          ) : (
                            <>Buka E-Tiket <ChevronDown className="h-4 w-4" /></>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Digital Ticket with QR Code */}
                  {expandedBookingId === b.id && (
                    <div className="p-6 bg-slate-50 border-t border-dashed border-gray-200">
                      <div 
                        id={`ticket-card-${b.id}`}
                        className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-sm border border-gray-200 transition-all"
                      >
                        {/* Ticket Branding Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                          <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="Wisata Jelajah Logo" className="h-10 w-10 object-contain drop-shadow-sm" />
                            <div>
                              <span className="text-xs font-bold text-primary uppercase tracking-wider">E-Tiket Resmi WisataJelajah</span>
                              <h4 className="font-extrabold text-xl text-gray-900">{b.destination_name}</h4>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                {b.destination_location}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-gray-400 block uppercase">Kode Booking</span>
                            <span className="font-mono font-bold text-lg text-primary">{b.booking_code}</span>
                          </div>
                        </div>

                        {/* QR Code & Information Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <QRCodeSVG 
                              value={`https://wisatajelajah.id/verify/${b.booking_code}`}
                              size={130}
                              level="H"
                              className="w-28 h-28"
                            />
                            <span className="font-mono text-xs font-bold text-gray-700 mt-2">{b.booking_code}</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">Tunjukkan di loket masuk</span>
                          </div>

                          <div className="sm:col-span-2 space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-gray-400 block">Nama Pengunjung:</span>
                                <span className="font-semibold text-gray-800 text-sm">{b.user_name}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 block">Tanggal Kunjungan:</span>
                                <span className="font-semibold text-gray-800 text-sm">{b.ticket_date}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 block">Jenis Tiket:</span>
                                <span className="font-semibold text-gray-800">{b.ticket_type}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 block">Jumlah:</span>
                                <span className="font-semibold text-gray-800">{b.quantity} Orang / Tiket</span>
                              </div>
                              <div>
                                <span className="text-gray-400 block">Metode Pembayaran:</span>
                                <span className="font-semibold text-gray-800">{b.payment_method}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 block">Status:</span>
                                {b.status === 'paid' ? (
                                  <span className="font-semibold text-emerald-600">LUNAS / AKTIF</span>
                                ) : b.payment_method?.toLowerCase().includes('loket') ? (
                                  <span className="font-semibold text-blue-600">BAYAR DI LOKET</span>
                                ) : (
                                  <span className="font-semibold text-amber-600">MENUNGGU PEMBAYARAN</span>
                                )}
                              </div>
                            </div>

                            {b.status === 'paid' ? (
                              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 text-[11px] leading-relaxed">
                                ✓ Tiket digital ini sah dan lunas. Tunjukkan QR Code di samping pada loket / gerbang masuk wisata.
                              </div>
                            ) : b.payment_method?.toLowerCase().includes('loket') ? (
                              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-[11px] leading-relaxed space-y-1">
                                <div className="font-bold flex items-center gap-1.5 text-blue-800">
                                  <Building2 className="w-3.5 h-3.5" />
                                  Instruksi Pembayaran di Loket Masuk:
                                </div>
                                <p>
                                  Pesanan kuota tiket Anda telah dicatat. Silakan tunjukkan <strong>Kode Booking {b.booking_code}</strong> ke petugas loket destinasi dan lakukan pembayaran sebesar <strong>Rp {b.total_amount.toLocaleString('id-ID')}</strong> (tunai atau QRIS fisik di lokasi) saat Anda tiba.
                                </p>
                              </div>
                            ) : (
                              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-amber-800 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    Menunggu Pembayaran QRIS
                                  </span>
                                  <Button
                                    size="sm"
                                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-7 px-3 rounded-lg"
                                    onClick={() => navigate(`/payment/${b.id}`)}
                                  >
                                    Bayar Sekarang →
                                  </Button>
                                </div>
                                <p>
                                  E-Tiket ini belum aktif karena pembayaran belum diselesaikan. Silakan scan kode QRIS tagihan Anda agar tiket dapat segera diverifikasi.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Print Only Footer Note */}
                        <div className="hidden print:block mt-6 pt-3 border-t border-gray-200 text-[10px] text-gray-400 text-center">
                          Wisata Jelajah Indonesia • E-Tiket Resmi • Sah & Terverifikasi Sistem
                        </div>

                        {/* Ticket Action Buttons (Hidden when printed) */}
                        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-2 justify-end no-print">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => handlePrintTicket(b.id)}
                          >
                            <Printer className="w-3.5 h-3.5 mr-1" />
                            Cetak E-Tiket
                          </Button>
                          <Button
                            size="sm"
                            className="bg-primary text-white text-xs"
                            onClick={() => navigate(`/destinasi`)}
                          >
                            Pesan Destinasi Lain
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <Ticket className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada tiket pesanan</h3>
            <p className="text-gray-500 mb-6 text-sm">Anda belum memesan tiket wisata. Silakan jelajahi destinasi pilihan.</p>
            <Button onClick={() => navigate('/destinasi')} className="bg-primary text-white font-semibold rounded-xl">
              Jelajahi Wisata Tasikmalaya & Nasional
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Bookings;
