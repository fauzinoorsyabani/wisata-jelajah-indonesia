import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import OptimizedImage from '@/components/ui/OptimizedImage';
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  Ticket,
  Loader2,
  CheckCircle,
  Share2,
  Bookmark,
  ShieldCheck,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { destinationService, Destination, TicketType } from '@/services/destinationService';

const DestinationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [destination, setDestination] = useState<Destination | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [visitDate, setVisitDate] = useState(getTomorrowDate());
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  useEffect(() => {
    if (user) {
      if (user.email) setVisitorEmail(user.email);
      if (user.name) setVisitorName(user.name);
    }
  }, [user]);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await destinationService.getById(id);
        if (data) {
          setDestination(data);
          const tickets: TicketType[] = data.ticket_types && data.ticket_types.length > 0 
            ? data.ticket_types 
            : [
                {
                  id: 'regular',
                  name: 'Tiket Masuk Reguler',
                  price: data.raw_price || 25000,
                  description: 'Akses masuk standar untuk 1 orang'
                }
              ];
          setTicketTypes(tickets);
          setSelectedTicket(tickets[0]);
        }
      } catch (err) {
        console.error('Error fetching detail', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleBookTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk memesan tiket wisata",
      });
      navigate('/login', { state: { from: `/destinasi/${id}` } });
      return;
    }

    if (!selectedTicket || !destination) {
      toast({
        title: "Tiket belum dipilih",
        description: "Silakan pilih jenis tiket yang diinginkan",
        variant: "destructive"
      });
      return;
    }

    if (!visitorName.trim()) {
      toast({
        title: "Nama Pengunjung Kosong",
        description: "Silakan isi nama lengkap pengunjung",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const totalAmount = selectedTicket.price * quantity;
      const newBooking = destinationService.createBooking({
        user_id: user?.id || 'demo_user',
        user_name: visitorName,
        user_email: visitorEmail || user?.email || 'wisatawan@wisata.id',
        destination_id: destination.id,
        destination_name: destination.name,
        destination_location: destination.location,
        destination_image: destination.image,
        ticket_type: selectedTicket.name,
        ticket_date: visitDate,
        quantity,
        unit_price: selectedTicket.price,
        total_amount: totalAmount,
        status: 'paid', // Immediately confirmed digital ticket
        payment_method: 'QRIS Instan'
      });

      toast({
        title: "Pemesanan Tiket Berhasil!",
        description: `E-Tiket dengan Kode ${newBooking.booking_code} telah diterbitkan. Siap digunakan!`,
      });

      navigate('/bookings');
    } catch (err) {
      toast({
        title: "Gagal Memproses Pemesanan",
        description: "Terjadi kesalahan, silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Dihapus dari Tersimpan" : "Disimpan ke Favorit",
      description: `${destination?.name} ${isSaved ? 'telah dihapus' : 'berhasil ditambahkan'}.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-gray-600 font-medium">Memuat detail destinasi...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container-custom py-16 flex-1 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Destinasi Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Destinasi yang Anda cari mungkin telah dipindahkan atau dihapus.</p>
          <Button onClick={() => navigate('/destinasi')} className="bg-primary text-white">
            Kembali ke Katalog Destinasi
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const totalPrice = selectedTicket ? selectedTicket.price * quantity : destination.raw_price * quantity;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      {/* Breadcrumb & Navigation */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="container-custom flex items-center justify-between text-xs md:text-sm text-gray-600">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 hover:text-primary font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSaveToggle}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-rose-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({ title: "Tautan Disalin", description: "Link destinasi berhasil disalin ke clipboard" });
              }}
              className="p-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:text-primary"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Media & Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image Banner with WebP */}
            <div className="relative h-80 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden shadow-md">
              <OptimizedImage
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="bg-primary/95 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  {destination.category}
                </span>
                {destination.is_tasikmalaya && (
                  <span className="bg-amber-500/95 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Destinasi Tasikmalaya
                  </span>
                )}
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center text-sm text-gray-500 font-medium">
                  <MapPin className="w-4 h-4 mr-1 text-primary shrink-0" />
                  <span>{destination.location}</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{destination.rating}</span>
                  <span className="text-gray-400 font-normal">({destination.reviews_count} ulasan)</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                {destination.name}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-gray-100 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <span className="text-xs text-gray-400 block">Jam Operasional</span>
                    <span className="font-semibold">{destination.operational_hours}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-xs text-gray-400 block">Tiket Digital Resmi</span>
                    <span className="font-semibold">Konfirmasi Langsung & QR Code</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Tentang Destinasi</h2>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {destination.description}
                </p>
              </div>

              {/* Facilities */}
              {destination.facilities && destination.facilities.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Fasilitas yang Tersedia</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {destination.facilities.map((fac, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Ticket Booking Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg border-gray-200 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary to-blue-700 text-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Pesan Tiket Online</span>
                    <CardTitle className="text-xl font-bold mt-1">Formulir Tiket</CardTitle>
                  </div>
                  <Ticket className="w-8 h-8 text-amber-300 opacity-90" />
                </div>
              </CardHeader>

              <form onSubmit={handleBookTicket}>
                <CardContent className="p-6 space-y-5">
                  {/* Ticket Type Selection */}
                  <div>
                    <Label htmlFor="ticketType" className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">
                      Pilihan Jenis Tiket
                    </Label>
                    <Select
                      value={selectedTicket?.id}
                      onValueChange={(val) => {
                        const found = ticketTypes.find(t => t.id === val);
                        if (found) setSelectedTicket(found);
                      }}
                    >
                      <SelectTrigger className="w-full text-xs md:text-sm py-2.5">
                        <SelectValue placeholder="Pilih Jenis Tiket" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Pilihan Tiket</SelectLabel>
                          {ticketTypes.map(t => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name} (Rp {t.price.toLocaleString('id-ID')})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {selectedTicket?.description && (
                      <p className="text-[11px] text-gray-500 mt-1.5 italic">
                        {selectedTicket.description}
                      </p>
                    )}
                  </div>

                  {/* Visit Date */}
                  <div>
                    <Label htmlFor="visitDate" className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">
                      Tanggal Kunjungan
                    </Label>
                    <div className="relative">
                      <Input
                        id="visitDate"
                        type="date"
                        min={getTomorrowDate()}
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        required
                        className="text-xs md:text-sm"
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">
                      Jumlah Tiket
                    </Label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-sm font-bold text-gray-900">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">orang / tiket</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Visitor Info */}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="visitorName" className="text-xs font-semibold text-gray-700 block mb-1">
                        Nama Lengkap Pemesan *
                      </Label>
                      <Input
                        id="visitorName"
                        placeholder="Contoh: Ahmad Fauzi"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        required
                        className="text-xs md:text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="visitorEmail" className="text-xs font-semibold text-gray-700 block mb-1">
                        Email Konfirmasi *
                      </Label>
                      <Input
                        id="visitorEmail"
                        type="email"
                        placeholder="email@example.com"
                        value={visitorEmail}
                        onChange={(e) => setVisitorEmail(e.target.value)}
                        required
                        className="text-xs md:text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="visitorPhone" className="text-xs font-semibold text-gray-700 block mb-1">
                        Nomor WhatsApp / HP
                      </Label>
                      <Input
                        id="visitorPhone"
                        placeholder="08123456789"
                        value={visitorPhone}
                        onChange={(e) => setVisitorPhone(e.target.value)}
                        className="text-xs md:text-sm"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Price Calculation */}
                  <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Harga Tiket:</span>
                      <span>Rp {(selectedTicket?.price || 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Jumlah Pengunjung:</span>
                      <span>{quantity}x</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Biaya Layanan & Cetak QR:</span>
                      <span className="text-emerald-600 font-medium">Gratis</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm font-bold text-gray-900 pt-1">
                      <span>Total Pembayaran:</span>
                      <span className="text-primary text-base">
                        Rp {totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Menerbitkan Tiket...
                      </span>
                    ) : (
                      <span>Pesan & Dapatkan E-Tiket Instan</span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DestinationDetail;
