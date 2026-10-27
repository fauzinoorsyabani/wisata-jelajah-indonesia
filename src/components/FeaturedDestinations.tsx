import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DestinationCard from './DestinationCard';
import { destinationService, Destination } from '@/services/destinationService';

const categories = ["Semua", "Wisata Alam", "Wisata Hiburan", "Wisata Budaya", "Wisata Sejarah"];

const FeaturedDestinations = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const data = await destinationService.getAll();
        setDestinations(data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);
    
  const filteredDestinations = activeCategory === "Semua" 
    ? destinations 
    : destinations.filter(dest => dest.category === activeCategory);
    
  const handleViewAllClick = () => {
    navigate('/destinasi');
  };

  return (
    <section id="featured-destinations" className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              Destinasi Unggulan Indonesia
            </h2>
            <p className="text-gray-600">
              Temukan tempat wisata populer di seluruh penjuru Indonesia dengan tiket digital instan
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 text-xs md:text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-xl h-80 animate-pulse border border-gray-100 p-4">
                <div className="bg-gray-200 h-44 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.length > 0 ? (
              filteredDestinations.slice(0, 8).map((destination) => (
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
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Tidak ada destinasi ditemukan untuk kategori ini</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            className="text-primary border-primary hover:bg-primary/5 px-8 py-2.5 font-semibold rounded-xl"
            onClick={handleViewAllClick}
          >
            Lihat Semua Destinasi ({destinations.length})
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
