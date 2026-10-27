import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Compass, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const destinations = [
  {
    id: 'galunggung',
    name: 'Kawah & Cipanas Gunung Galunggung, Tasikmalaya',
    tag: 'Fokus Wisata Tasikmalaya',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&fm=webp&w=1920&q=80'
  },
  {
    id: 'teejay',
    name: 'TeeJay Waterpark Plaza Asia, Tasikmalaya',
    tag: 'Kolam Renang & Wahana Air',
    image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&fm=webp&w=1920&q=80'
  },
  {
    id: 'borobudur',
    name: 'Candi Borobudur, Magelang',
    tag: 'Warisan Dunia UNESCO',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&fm=webp&w=1920&q=80'
  },
  {
    id: 'raja-ampat',
    name: 'Raja Ampat, Papua Barat',
    tag: 'Surga Bahari Dunia',
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&fm=webp&w=1920&q=80'
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % destinations.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const scrollToFeaturedDestinations = () => {
    const featuredSection = document.getElementById('tasikmalaya-spotlight') || document.getElementById('featured-destinations');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegisterClick = () => {
    navigate('/destinasi');
  };

  return (
    <section className="relative h-[620px] md:h-[680px] overflow-hidden bg-gray-900">
      {/* Background Carousel with WebP */}
      {destinations.map((destination, index) => (
        <div 
          key={destination.id} 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/40 to-black/30 z-10" />
          <img 
            src={destination.image} 
            alt={destination.name} 
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="w-full h-full object-cover object-center" 
          />
          <div className="absolute bottom-20 left-6 md:left-12 z-20 hidden md:block">
            <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full mb-1 border border-white/30">
              {destination.tag}
            </span>
            <p className="text-white font-medium text-sm drop-shadow flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {destination.name}
            </p>
          </div>
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-white px-4">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
            <Compass className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
            Jelajah Wisata Tasikmalaya & Seluruh Nusantara
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md text-balance">
            Pesan Tiket Wisata Online Tanpa Antri!
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200 drop-shadow">
            Nikmati kemudahan pesan tiket kolam renang, Kawah Galunggung, waterpark hingga destinasi impian dengan QR code instan dan konfirmasi otomatis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              onClick={scrollToFeaturedDestinations} 
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 shadow-lg shadow-primary/30 transition-transform active:scale-95"
            >
              Jelajahi Wisata Tasikmalaya
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleRegisterClick} 
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold px-8 backdrop-blur-sm"
            >
              Semua Destinasi
            </Button>
          </div>

          {/* Search Toggle Button (Mobile) */}
          <div className="md:hidden">
            <Button 
              variant="outline" 
              className="border-white/40 text-white bg-black/30 backdrop-blur-sm hover:bg-white/20" 
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Search className="h-4 w-4 mr-2" />
              Cari Destinasi
            </Button>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:block mt-4 w-full max-w-2xl mx-auto">
            <SearchBar />
          </div>

          {/* Search Bar (Mobile - Conditional) */}
          {isSearchVisible && (
            <div className="md:hidden mt-4 w-full">
              <SearchBar />
            </div>
          )}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 flex gap-2 z-20">
          {destinations.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentSlide(index)} 
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-8 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
              }`} 
              aria-label={`Slide ${index + 1}`} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
