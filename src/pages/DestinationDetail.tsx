import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
// import { supabase } from '@/integrations/supabase/client';
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  Phone,
  Mail,
  DollarSign,
  ChevronRight,
  Ticket,
  Loader2,
  Users,
  CalendarCheck,
  Info,
  CheckCircle
} from 'lucide-react';

import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

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
import { DestinationType, TicketType } from '@/types/destination';
import TicketTab from '@/components/destination/TicketTab';
import DestinationContent from '@/components/destination/DestinationContent';

const DestinationDetail = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const [destination, setDestination] = useState<DestinationType | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [visitDate, setVisitDate] = useState(getTomorrowDate());
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Get tomorrow's date in YYYY-MM-DD format for default visit date
  function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk melihat detail destinasi",
        variant: "default"
      });
      navigate('/login', { state: { from: `/destinasi/${id || slug}` } });
      return;
    }

    const identifier = id || slug;
    if (!identifier) {
      navigate('/destinasi');
      return;
    }

    // Set visitor info from user data if available
    // Set visitor info from user data if available
    if (user) {
      if (user.email) setVisitorEmail(user.email);
      // Fallback name since we stripped full_name from register for simplicity
      // if (user.name) setVisitorName(user.name); 
      
      // Check if user is admin
      checkUserRole();
    }

    fetchDestinationData(identifier);
  }, [id, slug, isAuthenticated, user, navigate, toast]);

  // Check if the user is an admin
  const checkUserRole = async () => {
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    }
  };

  const fetchDestinationData = async (identifier: string) => {
    try {
      setLoading(true);
      console.log("Fetching destination with identifier:", identifier);

      // Fetch from our new backend
      const response = await fetch(`http://localhost:5000/api/destinations/${identifier}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch destination');
      }
      
      const data = await response.json();

      if (data) {
        console.log("Found destination:", data);
        // Create a properly typed destination object with default values for missing fields
        const typedDestination: DestinationType = {
          id: data.id,
          name: data.name,
          location: data.location,
          description: data.description,
          amenities: 'Fasilitas lengkap tersedia', // Default value
          address: data.location, // Use location as address fallback
          operational_hours: '08:00 - 18:00',
          best_time_to_visit: 'Sepanjang tahun', 
          google_maps_url: '', 
          image_url: data.image_url || '',
          price: parseFloat(data.price) || 0,
          category: 'Wisata',
          rating: parseFloat(data.rating) || 0,
          long_description: data.description,
          full_location: data.location,
          reviews_count: 0,
          slug: data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : '', 
          created_at: data.created_at || '',
          updated_at: data.created_at || ''
        };
        
        setDestination(typedDestination);
        
        // Mock ticket types for now as backend doesn't support them yet
        const typedTickets: TicketType[] = [{
            id: 'ticket-1',
            name: 'Tiket Masuk Reguler',
            price: parseFloat(data.price) || 0,
            description: 'Tiket masuk standar untuk satu orang',
            capacity: 'Tidak terbatas',
            validity_duration: '1',
            destination_id: data.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }];
          
        setTicketTypes(typedTickets);
        setSelectedTicket(typedTickets[0]); 

        // Check if destination is saved (Local check only for now or stub)
        // setIsSaved(false); // To implement later with backend
      } else {
         throw new Error("Data empty");
      }
    } catch (error) {
      console.error("Error fetching destination details:", error);
      // Fallback to dummy if backend fails or returns 404
       const dummyData: DestinationType = {
          id: identifier,
          name: 'Pantai Kuta',
          location: 'Bali',
          image_url: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8',
          price: 50000,
          description: 'Pantai Kuta adalah salah satu pantai terkenal di Bali dengan ombak yang cocok untuk berselancar, pemandangan sunset yang menakjubkan, dan berbagai aktivitas menarik.',
          category: 'Pantai',
          rating: 4.7,
          operational_hours: '08:00 - 18:00 (Setiap Hari)',
          amenities: 'Toilet, Tempat Parkir, Food Court, Penyewaan Papan Selancar',
          address: 'Jalan Pantai Kuta, Kuta, Badung, Bali',
          best_time_to_visit: 'Sepanjang tahun',
          google_maps_url: '',
          long_description: 'Pantai Kuta adalah salah satu pantai terkenal di Bali dengan ombak yang cocok untuk berselancar, pemandangan sunset yang menakjubkan, dan berbagai aktivitas menarik.',
          full_location: 'Jalan Pantai Kuta, Kuta, Badung, Bali',
          reviews_count: 150,
          slug: 'pantai-kuta'
        };
        setDestination(dummyData);
        setTicketTypes([]);
        setSelectedTicket(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDestination = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk menyimpan destinasi",
        variant: "default"
      });
      navigate('/login', { state: { from: `/destinasi/${id || slug}` } });
      return;
    }

    try {
      if (isSaved) {
        // Delete from saved destinations
        await supabase
          .from('saved_destinations')
          .delete()
          .eq('user_id', user.id)
          .eq('destination_id', destination?.id);
          
        setIsSaved(false);
        toast({
          title: "Berhasil dihapus",
          description: `${destination?.name} telah dihapus dari destinasi tersimpan`,
        });
      } else {
        // Add to saved destinations
        await supabase
          .from('saved_destinations')
          .insert({
            user_id: user.id,
            destination_id: destination?.id
          });
          
        setIsSaved(true);
        toast({
          title: "Berhasil disimpan",
          description: `${destination?.name} telah ditambahkan ke destinasi tersimpan`,
        });
      }
    } catch (error) {
      console.error("Error toggling saved destination:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan/menghapus destinasi",
        variant: "destructive"
      });
    }
  };

  const handleTicketSelect = (ticket: TicketType) => {
    setSelectedTicket(ticket);
  };

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleBookTicket = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk memesan tiket",
        variant: "default"
      });
      navigate('/login', { state: { from: `/destinasi/${id || slug}` } });
      return;
    }

    if (isAdmin) {
      toast({
        title: "Tidak Diizinkan",
        description: "Admin tidak dapat membeli tiket",
        variant: "destructive"
      });
      return;
    }

    if (!selectedTicket) {
      toast({
        title: "Tiket tidak dipilih",
        description: "Silakan pilih jenis tiket terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    if (!visitDate) {
      toast({
        title: "Tanggal kunjungan tidak dipilih",
        description: "Silakan pilih tanggal kunjungan",
        variant: "destructive"
      });
      return;
    }

    if (!visitorName || !visitorEmail) {
      toast({
        title: "Data tidak lengkap",
        description: "Nama dan email pengunjung wajib diisi",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!destination || !destination.id) {
        throw new Error("Data destinasi tidak valid");
      }
      
      console.log('Starting checkout process with:', {
        ticketId: selectedTicket.id,
        destinationId: destination.id,
        quantity,
        visitorName,
        visitorEmail,
        visitorPhone,
        visitDate,
        specialRequests,
        selectedTicketPrice: selectedTicket.price
      });
      
      // Call Stripe checkout function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          ticketId: selectedTicket.id,
          destinationId: destination.id,
          quantity,
          visitorName,
          visitorEmail,
          visitorPhone,
          visitDate,
          specialRequests
        }
      });

      if (error) {
        console.error('Stripe checkout error:', error);
        throw error;
      }

      if (!data || !data.url) {
        throw new Error('No checkout URL returned from server');
      }

      console.log('Redirecting to Stripe checkout:', data.url);
      
      // Redirect to Stripe checkout in the same window
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Gagal Memproses Pembayaran",
        description: "Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Memuat detail destinasi...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container-custom py-8 flex-grow">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Destinasi tidak ditemukan</h3>
            <p className="text-gray-500 mb-6">Destinasi yang Anda cari tidak ditemukan</p>
            <Button onClick={() => navigate('/destinasi')}>
              Jelajahi Destinasi Lain
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate total price
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;
  const formattedTotalPrice = totalPrice.toLocaleString('id-ID');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container-custom py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Destination Details */}
          <div className="lg:col-span-2">
            <DestinationContent 
              destination={destination}
              ticketTypes={ticketTypes}
              isSaved={isSaved}
              setIsSaved={setIsSaved}
              userId={user?.id}
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
            />
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            {!isAdmin ? (
              <Card className="sticky top-24" id="booking-form">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Pesan Tiket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ticket-type">Pilih Jenis Tiket</Label>
                      <Select 
                        value={selectedTicket?.id}
                        onValueChange={(value) => {
                          const ticket = ticketTypes.find(t => t.id === value);
                          if (ticket) setSelectedTicket(ticket);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Tiket" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Jenis Tiket</SelectLabel>
                            {ticketTypes.length > 0 ? (
                              ticketTypes.map((ticket) => (
                                <SelectItem key={ticket.id} value={ticket.id}>
                                  {ticket.name} - Rp {ticket.price.toLocaleString('id-ID')}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-tickets" disabled>
                                Tiket belum tersedia
                              </SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quantity">Jumlah Tiket</Label>
                      <div className="flex items-center mt-1">
                        <button 
                          type="button" 
                          onClick={() => decrementQuantity()}
                          className="bg-gray-200 px-3 py-2 rounded-l"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <input 
                          id="quantity"
                          type="number" 
                          min="1" 
                          value={quantity} 
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 text-center border-y py-2"
                          readOnly
                        />
                        <button 
                          type="button" 
                          onClick={() => incrementQuantity()}
                          className="bg-gray-200 px-3 py-2 rounded-r"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="visit-date">Tanggal Kunjungan</Label>
                      <Input 
                        id="visit-date"
                        type="date" 
                        className="mt-1"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        min={getTomorrowDate()}
                      />
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h3 className="font-medium mb-3">Data Pengunjung</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="visitor-name">Nama Lengkap</Label>
                          <Input
                            id="visitor-name"
                            placeholder="Masukkan nama lengkap"
                            value={visitorName}
                            onChange={(e) => setVisitorName(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="visitor-email">Email</Label>
                          <Input
                            id="visitor-email"
                            type="email"
                            placeholder="Masukkan email"
                            value={visitorEmail}
                            onChange={(e) => setVisitorEmail(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="visitor-phone">No. Telepon</Label>
                          <Input
                            id="visitor-phone"
                            placeholder="Masukkan nomor telepon"
                            value={visitorPhone}
                            onChange={(e) => setVisitorPhone(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="special-requests">Permintaan Khusus (Opsional)</Label>
                          <Input
                            id="special-requests"
                            placeholder="Masukkan permintaan khusus jika ada"
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Harga tiket</span>
                        <span>Rp {selectedTicket ? selectedTicket.price.toLocaleString('id-ID') : '0'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Jumlah</span>
                        <span>{quantity} tiket</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center font-medium text-lg">
                        <span>Total</span>
                        <span className="text-primary">Rp {formattedTotalPrice}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full flex items-center gap-2" 
                    onClick={handleBookTicket}
                    disabled={!selectedTicket || isSubmitting || ticketTypes.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4" />
                        <span>Pesan & Bayar Sekarang</span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Akun Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Anda masuk sebagai admin. Akses panel admin untuk mengelola destinasi dan sistem.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate('/admin')}>
                    Ke Dashboard Admin
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DestinationDetail;
