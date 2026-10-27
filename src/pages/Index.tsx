import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TasikmalayaSpotlight from "@/components/TasikmalayaSpotlight";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import Footer from "@/components/Footer";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { Calendar, Ticket, MapPin, CreditCard, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      {/* 1. Hero Section with Galunggung & Waterpark Spotlight */}
      <HeroSection />

      {/* 2. Focused Section: Tasikmalaya Tourism & Ticket Booking */}
      <TasikmalayaSpotlight />
      
      {/* 3. Benefits Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              Keunggulan Kami
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-3">
              Mengapa Memilih WisataJelajah?
            </h2>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Platform booking tiket wisata terlengkap dengan teknologi modern dan kenyamanan maksimal
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50/70 hover:bg-white hover:shadow-lg transition-all border border-slate-100">
              <div className="bg-blue-100 p-3.5 rounded-2xl mb-4 text-primary">
                <Calendar className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Jadwal Fleksibel</h3>
              <p className="text-gray-600 text-sm">Pilih dan ubah tanggal kunjungan wisata sesuai rencanamu dengan mudah</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50/70 hover:bg-white hover:shadow-lg transition-all border border-slate-100">
              <div className="bg-emerald-100 p-3.5 rounded-2xl mb-4 text-emerald-600">
                <Ticket className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Tiket Digital Instan</h3>
              <p className="text-gray-600 text-sm">Dapatkan e-tiket dengan QR Code yang langsung dapat di-scan di pintu masuk</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50/70 hover:bg-white hover:shadow-lg transition-all border border-slate-100">
              <div className="bg-amber-100 p-3.5 rounded-2xl mb-4 text-amber-600">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Wisata Tasik & Nasional</h3>
              <p className="text-gray-600 text-sm">Fokus terlengkap wisata Tasikmalaya plus ribuan destinasi hits se-Indonesia</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50/70 hover:bg-white hover:shadow-lg transition-all border border-slate-100">
              <div className="bg-rose-100 p-3.5 rounded-2xl mb-4 text-rose-600">
                <CreditCard className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Pembayaran Praktis</h3>
              <p className="text-gray-600 text-sm">Mendukung QRIS, Virtual Account, dompet digital, dan transfer bank cepat</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Destinations Across Indonesia */}
      <FeaturedDestinations />

      {/* 5. Promo Section with Optimized WebP Image */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-primary to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-gray-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                PROMO SPESIAL LIBURAN
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
                Hemat 15% untuk Pemesanan Pertama!
              </h2>
              <p className="mb-6 text-blue-100 text-sm md:text-base leading-relaxed">
                Daftar sekarang dan nikmati diskon 15% untuk pembelian tiket wisata Kawah Galunggung, TeeJay Waterpark, Borobudur, atau destinasi favorit Anda.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <span className="text-xs text-blue-200">Kode Promo:</span>
                  <strong className="text-amber-300 font-mono text-base tracking-wider">JELAJAH15</strong>
                </div>
                <button 
                  type="button"
                  className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold py-2.5 px-6 rounded-xl shadow-lg transition-transform active:scale-95 inline-flex items-center gap-2"
                  onClick={() => navigate('/promo')}
                >
                  Klaim Promo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="w-full max-w-sm">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 transform hover:scale-102 transition-transform duration-300">
                <OptimizedImage 
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&fm=webp&w=800&q=80" 
                  alt="Promo Wisata Alam Galunggung Tasikmalaya" 
                  className="h-64 md:h-72 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
