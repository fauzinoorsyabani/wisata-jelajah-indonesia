import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Heart, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock interface for saved destination
interface SavedDestination {
  id: string; // The saved record ID
  destination_id: string;
  name: string;
  location: string;
  image_url: string;
  rating: number;
  price: number;
  category: string;
}

const SavedDestinations = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedDestinations, setSavedDestinations] = useState<SavedDestination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/saved-destinations' } });
      return;
    }
    
    fetchSavedDestinations();
  }, [isAuthenticated, navigate]);

  const fetchSavedDestinations = async () => {
    setLoading(true);
    try {
      // Mock data fetch - waiting for Backend API
      // const response = await fetch(`http://localhost:5000/api/users/${user.id}/saved`);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Dummy data
      const dummyData: SavedDestination[] = [
        {
          id: 'saved-1',
          destination_id: 'galunggung-tasik',
          name: 'Gunung Galunggung & Pemandian Air Panas',
          location: 'Tasikmalaya, Jawa Barat',
          image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&fm=webp&w=800&q=80',
          rating: 4.8,
          price: 15000,
          category: 'Wisata Alam'
        },
        {
          id: 'saved-2',
          destination_id: 'teejay-waterpark',
          name: 'TeeJay Waterpark Plaza Asia',
          location: 'Kota Tasikmalaya, Jawa Barat',
          image_url: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&fm=webp&w=800&q=80',
          rating: 4.7,
          price: 30000,
          category: 'Wisata Hiburan'
        },
        {
          id: 'saved-3',
          destination_id: 'candi-borobudur',
          name: 'Candi Borobudur',
          location: 'Magelang, Jawa Tengah',
          image_url: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&fm=webp&w=800&q=80',
          rating: 4.9,
          price: 85000,
          category: 'Wisata Sejarah'
        }
      ];
      
      setSavedDestinations(dummyData);
    } catch (error) {
      console.error('Error fetching saved destinations:', error);
      toast({
        title: "Error",
        description: "Gagal memuat daftar tersimpan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromSaved = async (savedId: string, destinationName: string) => {
    try {
        // Mock API Call
        // await fetch(`http://localhost:5000/api/saved/${savedId}`, { method: 'DELETE' });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setSavedDestinations(prev => prev.filter(item => item.id !== savedId));
        
        toast({
            title: "Berhasil dihapus",
            description: `${destinationName} berhasil dihapus dari daftar tersimpan`,
            variant: "default"
        });
    } catch (error) {
        console.error('Error removing destination:', error);
        toast({
            title: "Error",
            description: "Gagal menghapus destinasi",
            variant: "destructive"
        });
    }
  };

  const handleCardClick = (destinationId: string) => {
    navigate(`/destinasi/${destinationId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container-custom py-8 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Destinasi Tersimpan</h1>
            <p className="text-gray-600">Daftar destinasi yang Anda simpan untuk dikunjungi nanti</p>
          </div>
          
          <Button 
            variant="outline"
            onClick={fetchSavedDestinations}
            disabled={loading}
          >
            {loading ? 'Memuat...' : 'Refresh'}
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : savedDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDestinations.map((item) => (
              <div key={item.id} className="relative group bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                <div className="cursor-pointer" onClick={() => handleCardClick(item.destination_id)}>
                    <div className="h-48 overflow-hidden">
                        <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                            <div className="flex items-center bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs">
                                <span>{item.rating}</span>
                                <span className="ml-0.5">★</span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-3 flex items-center">
                             📍 {item.location}
                        </p>
                        <div className="font-medium text-primary">
                            Rp {item.price.toLocaleString('id-ID')}
                        </div>
                    </div>
                </div>
                
                {/* Remove button */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 rounded-full opacity-90 hover:opacity-100 shadow-md"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus dari Tersimpan?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus "{item.name}" dari daftar destinasi tersimpan? 
                          Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveFromSaved(item.id, item.name)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <Heart className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Belum ada destinasi tersimpan</h3>
            <p className="text-gray-500 mb-6">
              Simpan destinasi favorit Anda dengan mengklik tombol ♥ pada halaman detail destinasi
            </p>
            <Button onClick={() => navigate('/destinasi')}>
              Jelajahi Destinasi
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default SavedDestinations;
