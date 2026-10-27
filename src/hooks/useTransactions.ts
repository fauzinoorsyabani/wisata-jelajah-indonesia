import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Booking } from '@/components/admin/transactions/types';
import { destinationService } from '@/services/destinationService';

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
      const raw = destinationService.getBookings();
      const enriched: Booking[] = raw.map(b => ({
        id: b.id,
        booking_number: b.booking_code,
        user_id: String(b.user_id),
        visitor_name: b.user_name,
        visitor_email: b.user_email,
        visitor_phone: '08123456789',
        destination_id: String(b.destination_id),
        destination_name: b.destination_name,
        ticket_type_id: b.ticket_type,
        ticket_type_name: b.ticket_type,
        quantity: b.quantity,
        total_price: b.total_amount,
        visit_date: b.ticket_date,
        payment_status: b.status === 'paid' ? 'paid' : b.status === 'pending' ? 'unpaid' : 'cancelled',
        status: b.status === 'paid' ? 'confirmed' : b.status,
        created_at: b.created_at
      }));
      
      setBookings(enriched);
      setTotalItems(enriched.length);
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
    destinationService.updateBookingStatus(
      bookingId, 
      newPaymentStatus === 'paid' ? 'paid' : newPaymentStatus === 'cancelled' ? 'cancelled' : 'pending'
    );

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
