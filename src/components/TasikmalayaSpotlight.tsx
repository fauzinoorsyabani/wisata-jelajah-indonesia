import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Sparkles, Waves, Mountain, Landmark, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DestinationCard from './DestinationCard';
import { destinationService, Destination } from '@/services/destinationService';

const tasikCategories = [
  { name: 'Semua', icon: Sparkles, filter: 'all' },
  { name: 'Kolam Renang & Waterpark', icon: Waves, filter: 'waterpark' },
  { name: 'Gunung & Alam', icon: Mountain, filter: 'alam' },
  { name: 'Budaya & Desa Adat', icon: Landmark, filter: 'budaya' },
];

export const TasikmalayaSpotlight: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTasik = async () => {
      try {
        setLoading(true);
        const data = await destinationService.getTasikmalaya();
        setDestinations(data);
      } finally {
        setLoading(false);
      }
    };
    loadTasik();
  }, []);

  const filtered = destinations.filter(dest => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'waterpark') {
      return (
        dest.category.toLowerCase().includes('wahana air') ||
        dest.category.toLowerCase().includes('air') ||
        dest.category.toLowerCase().includes('hiburan') || 
        dest.name.toLowerCase().includes('waterpark') || 
        dest.name.toLowerCase().includes('renang')
      );
    }
    if (activeCategory === 'alam') {
      return dest.category.toLowerCase().includes('alam');
    }
    if (activeCategory === 'budaya') {
      return dest.category.toLowerCase().includes('budaya');
    }
    return true;
  });

  return (
    <section id="tasikmalaya-spotlight" className="py-16 bg-gradient-to-b from-amber-50/50 via-white to-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              DESTINASI PRIORITAS
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Eksplorasi Wisata <span className="text-primary underline decoration-amber-400 decoration-wavy">Tasikmalaya</span>
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl text-sm md:text-base">
              Kunjungi kawah legendaris Gunung Galunggung, bersantai di kolam renang TeeJay & Ampera Waterpark, hingga selami keasrian Kampung Naga.
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {tasikCategories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.filter;
              return (
                <button
                  key={cat.filter}
                  onClick={() => setActiveCategory(cat.filter)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Destination Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100 p-4">
                <div className="bg-gray-200 h-44 rounded-lg mb-4" />
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
                <div className="bg-gray-200 h-4 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(dest => (
              <DestinationCard
                key={dest.id}
                id={dest.id}
                name={dest.name}
                location={dest.location}
                image={dest.image}
                rating={dest.rating}
                price={dest.price}
                category={dest.category}
                slug={dest.slug}
                is_tasikmalaya={true}
              />
            ))}
          </div>
        )}

        {/* View All Tasik Button */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate('/destinasi?q=Tasikmalaya')}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md inline-flex items-center gap-2"
          >
            Lihat Seluruh Tiket Wisata Tasikmalaya
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TasikmalayaSpotlight;
