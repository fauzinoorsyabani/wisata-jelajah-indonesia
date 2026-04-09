import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, ArrowRight, Percent, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Promotion {
  id: string;
  title: string;
  description: string;
  promo_code: string;
  discount_percentage: number | null;
  discount_amount: number | null;
  start_date: string;
  end_date: string;
  image_url: string;
  category: string;
  is_active: boolean;
}


const calculateDaysLeft = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const formatDiscount = (promotion: Promotion) => {
  if (promotion.discount_percentage === 100) return 'GRATIS';
  if (promotion.discount_percentage) return `${promotion.discount_percentage}%`;
  if (promotion.discount_amount) return `Rp ${promotion.discount_amount.toLocaleString('id-ID')}`;
  return 'Diskon Spesial';
};

const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredPromo, setFeaturedPromo] = useState<Promotion | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      // Mock data for promotions
      const mockPromotions: Promotion[] = [
        {
          id: '1',
          title: 'Diskon Liburan Sekolah',
          description: 'Nikmati liburan sekolah seru bersama keluarga dengan diskon spesial untuk semua destinasi wisata alam.',
          promo_code: 'SCHOOL20',
          discount_percentage: 20,
          discount_amount: null,
          start_date: '2024-06-01',
          end_date: '2024-07-15',
          image_url: 'https://images.unsplash.com/photo-1573790387438-4da905039392?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          category: 'Family',
          is_active: true
        },
        {
          id: '2',
          title: 'Flash Sale Weekend',
          description: 'Potongan harga khusus untuk booking di akhir pekan ini. Jangan sampai ketinggalan!',
          promo_code: 'FLASH50',
          discount_percentage: 50,
          discount_amount: null,
          start_date: '2024-06-08',
          end_date: '2024-06-09',
          image_url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          category: 'Flash Sale',
          is_active: true
        },
        {
          id: '3',
          title: 'Promo Spesial Kemerdekaan',
          description: 'Rayakan kemerdekaan dengan jelajah wisata sejarah Indonesia.',
          promo_code: 'MERDEKA17',
          discount_percentage: 17,
          discount_amount: null,
          start_date: '2024-08-01',
          end_date: '2024-08-31',
          image_url: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          category: 'Special',
          is_active: true
        },
        {
          id: '4',
          title: 'Paket Hemat Keluarga',
          description: 'Hemat Rp 100.000 untuk pembelian tiket grup minimal 5 orang.',
          promo_code: 'FAMILY100',
          discount_percentage: null,
          discount_amount: 100000,
          start_date: '2024-06-01',
          end_date: '2024-12-31',
          image_url: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          category: 'Family',
          is_active: true
        }
      ];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500)); 

      setPromotions(mockPromotions);
      
      // Set featured promo to the promo with highest discount
      const featured = mockPromotions.find(p => p.promo_code === 'FLASH50') || mockPromotions[0];
      setFeaturedPromo(featured);

    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast({
        title: "Error",
        description: "Gagal memuat promo. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPromoCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Berhasil!",
        description: `Kode promo ${code} berhasil disalin`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Gagal menyalin kode promo",
        variant: "destructive"
      });
    }
  };

  const filterPromotionsByCategory = (category: string) => {
    if (category === 'all') return promotions;
    return promotions.filter(p => p.category.toLowerCase() === category.toLowerCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-white py-12">
          <div className="container-custom">
            <Skeleton className="h-8 w-96 mb-4 bg-white/20" />
            <Skeleton className="h-6 w-[500px] bg-white/20" />
          </div>
        </div>
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-5">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="container-custom relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-accent/20 p-3 rounded-full">
              <Gift className="h-8 w-8 text-accent" />
            </div>
            <div>
              <Badge className="bg-accent text-white mb-2">Penawaran Terbatas</Badge>
              <h1 className="text-3xl md:text-5xl font-bold">
                Promo & Penawaran <span className="text-accent">Spesial</span>
              </h1>
            </div>
          </div>
          <p className="text-lg text-white/90 max-w-2xl">
            Dapatkan penawaran terbaik untuk pengalaman wisata yang tak terlupakan dengan promo eksklusif kami
          </p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        {/* Featured Promo */}
        {featuredPromo && (
          <div className="mb-12">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={featuredPromo.image_url} 
                alt={featuredPromo.title} 
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
                <div className="p-8 md:p-12 max-w-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-accent text-white font-semibold">
                      <Clock className="h-4 w-4 mr-1" />
                      Limited Time
                    </Badge>
                    <Badge className="bg-secondary text-white font-semibold">
                      <Percent className="h-4 w-4 mr-1" />
                      {formatDiscount(featuredPromo)}
                    </Badge>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {featuredPromo.title}
                  </h2>
                  <p className="text-white/90 text-lg mb-6 leading-relaxed">
                    {featuredPromo.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-3"
                      onClick={() => copyPromoCode(featuredPromo.promo_code)}
                    >
                      Gunakan Kode: {featuredPromo.promo_code}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-white border-white hover:bg-white/10 font-semibold px-8 py-3"
                    >
                      Lihat Semua Promo
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Promotion Categories */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Semua Penawaran</h2>
          <p className="text-muted-foreground mb-6">Pilih kategori promo yang sesuai dengan kebutuhan Anda</p>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg font-medium">Semua Promo</TabsTrigger>
            <TabsTrigger value="seasonal" className="rounded-lg font-medium">Seasonal</TabsTrigger>
            <TabsTrigger value="weekend" className="rounded-lg font-medium">Weekend</TabsTrigger>
            <TabsTrigger value="family" className="rounded-lg font-medium">Keluarga</TabsTrigger>
            <TabsTrigger value="flash sale" className="rounded-lg font-medium">Flash Sale</TabsTrigger>
            <TabsTrigger value="special" className="rounded-lg font-medium">Special</TabsTrigger>
          </TabsList>
          
          {['all', 'seasonal', 'weekend', 'family', 'flash sale', 'special'].map((category) => (
            <TabsContent key={category} value={category} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterPromotionsByCategory(category).map((promo) => (
                  <Card 
                    key={promo.id} 
                    className="group overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.02]"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={promo.image_url} 
                        alt={promo.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="font-medium bg-white/90 text-gray-800">
                          {promo.category}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-accent text-white font-medium shadow-lg">
                          {formatDiscount(promo)}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button 
                          size="sm" 
                          className="bg-accent hover:bg-accent/90 text-white"
                          onClick={(e) => {
                            e.preventDefault();
                            copyPromoCode(promo.promo_code);
                          }}
                        >
                          Copy Code
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {promo.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {promo.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Berakhir dalam {calculateDaysLeft(promo.end_date)} hari</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-primary border-primary">
                            {promo.promo_code}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filterPromotionsByCategory(category).length === 0 && (
                <div className="text-center py-12">
                  <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    Belum Ada Promo
                  </h3>
                  <p className="text-muted-foreground">
                    Promo untuk kategori ini belum tersedia. Cek kembali nanti!
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Promotions;
