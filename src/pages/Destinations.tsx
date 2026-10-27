import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import DestinationCard from '@/components/DestinationCard';
import { Button } from '@/components/ui/button';
import { 
  Grid, 
  Map, 
  Sparkles, 
  Mountain, 
  Palmtree, 
  Building, 
  Waves,
  MapPin
} from 'lucide-react';
import { destinationService, Destination } from '@/services/destinationService';

const categories = [
  { name: 'Semua Destinasi', icon: Grid, value: 'all' },
  { name: 'Fokus Tasikmalaya', icon: Sparkles, value: 'tasikmalaya' },
  { name: 'Kolam Renang & Air', icon: Waves, value: 'waterpark' },
  { name: 'Gunung & Alam', icon: Mountain, value: 'alam' },
  { name: 'Pantai & Bahari', icon: Palmtree, value: 'pantai' },
  { name: 'Budaya & Sejarah', icon: Building, value: 'budaya' },
];

const Destinations = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [activeCategory, setActiveCategory] = useState<string>(
    initialQuery.toLowerCase().includes('tasik') ? 'tasikmalaya' : 'all'
  );
  const [viewType, setViewType] = useState<'grid' | 'map'>('grid');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      if (q.toLowerCase().includes('tasik')) {
        setActiveCategory('tasikmalaya');
      }
    }
  }, [searchParams]);

  const fetchDestinations = async () => {
    try {
      setIsLoading(true);
      const data = await destinationService.getAll();
      setDestinations(data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDestinations = destinations.filter(dest => {
    // 1. Search Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = dest.name.toLowerCase().includes(q);
      const matchLoc = dest.location.toLowerCase().includes(q);
      const matchCat = dest.category.toLowerCase().includes(q);
      const matchDesc = dest.description?.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchCat && !matchDesc) return false;
    }

    // 2. Category filter
    if (activeCategory === 'all') return true;
    if (activeCategory === 'tasikmalaya') {
      return dest.is_tasikmalaya || dest.location.toLowerCase().includes('tasikmalaya');
    }
    if (activeCategory === 'waterpark') {
      return (
        dest.category.toLowerCase().includes('hiburan') || 
        dest.name.toLowerCase().includes('waterpark') || 
        dest.name.toLowerCase().includes('renang')
      );
    }
    if (activeCategory === 'alam') {
      return dest.category.toLowerCase().includes('alam') || dest.category.toLowerCase().includes('gunung');
    }
    if (activeCategory === 'pantai') {
      return dest.name.toLowerCase().includes('pantai') || dest.location.toLowerCase().includes('pantai') || dest.category.toLowerCase().includes('pantai');
    }
    if (activeCategory === 'budaya') {
      return dest.category.toLowerCase().includes('budaya') || dest.category.toLowerCase().includes('sejarah');
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-primary to-indigo-900 text-white py-14">
        <div className="container-custom">
          <div className="max-w-2xl">
            <span className="bg-white/10 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Katalog Wisata Lengkap
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-3 mb-3 tracking-tight">
              Jelajahi Destinasi Wisata
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              Pesan tiket kolam renang, Kawah Galunggung Tasikmalaya, waterpark, pantai, dan berbagai keindahan Indonesia
            </p>
          </div>
          
          <div className="mt-8 max-w-2xl">
            <SearchBar />
          </div>
        </div>
      </div>
      
      <div className="container-custom py-10 flex-1">
        {/* Categories Bar & View Toggles */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.value;
              return (
                <Button
                  key={category.value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center gap-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive 
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"
                  }`}
                  onClick={() => setActiveCategory(category.value)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {category.name}
                </Button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewType('grid')}
              className={`rounded-lg ${viewType === 'grid' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white'}`}
            >
              <Grid className="h-4 w-4 mr-1.5" />
              Grid
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewType('map')}
              className={`rounded-lg ${viewType === 'map' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white'}`}
            >
              <Map className="h-4 w-4 mr-1.5" />
              Peta Wisata
            </Button>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-6 font-medium">
          <span>Menampilkan {filteredDestinations.length} dari {destinations.length} destinasi</span>
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                navigate('/destinasi');
              }}
              className="text-primary hover:underline"
            >
              Hapus filter pencarian: "{searchQuery}"
            </button>
          )}
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100 p-4">
                <div className="bg-gray-200 h-44 rounded-lg mb-4" />
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
                <div className="bg-gray-200 h-4 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}
        
        {/* Grid View */}
        {!isLoading && viewType === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                id={destination.id}
                name={destination.name}
                location={destination.location}
                image={destination.image}
                rating={destination.rating}
                price={destination.price}
                category={destination.category}
                slug={destination.slug}
                is_tasikmalaya={destination.is_tasikmalaya}
              />
            ))}
          </div>
        )}
        
        {/* Map View */}
        {!isLoading && viewType === 'map' && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm min-h-[480px] flex flex-col items-center justify-center text-center">
            <div className="bg-blue-50 p-4 rounded-full mb-4 text-primary">
              <MapPin className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sebaran Peta Wisata Interaktif</h3>
            <p className="text-gray-600 max-w-md text-sm mb-6">
              Pusat destinasi wisata Tasikmalaya (Gunung Galunggung, TeeJay Waterpark, Ampera Waterpark, Situ Gede) & destinasi nasional kini siap dijelajahi.
            </p>
            <Button onClick={() => setViewType('grid')} className="bg-primary text-white">
              Kembali ke Tampilan Katalog Grid
            </Button>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && filteredDestinations.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-lg font-bold text-gray-800 mb-1">Destinasi Tidak Ditemukan</p>
            <p className="text-sm text-gray-500 mb-6">Coba kata kunci lain atau pilih kategori Semua Destinasi</p>
            <Button 
              className="bg-primary text-white"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                navigate('/destinasi');
              }}
            >
              Lihat Semua Destinasi
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Destinations;
