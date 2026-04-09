
import { useState, useEffect } from 'react';
// import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Booking } from '@/components/admin/transactions/types';

export const useTransactions = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();
  const itemsPerPage = 10;
  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Mock data fetching since backend booking API is not ready
      // await fetch('http://localhost:5000/api/bookings');
      
      const enrichedBookings: Booking[] = []; // Empty for now or mock if needed
      
      setBookings(enrichedBookings);
      setTotalItems(0);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data pemesanan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookingUpdated = (bookingId: string, newStatus: string, newPaymentStatus: string) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus, payment_status: newPaymentStatus } 
          : booking
      )
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage]);

  return {
    bookings,
    loading,
    currentPage,
    totalItems,
    itemsPerPage,
    fetchBookings,
    handleBookingUpdated,
    handlePageChange
  };
};
