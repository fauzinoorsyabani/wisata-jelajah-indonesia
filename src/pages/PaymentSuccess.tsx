

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardTitle, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Home, Ticket, ChevronRight } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get session_id from URL if redirect from Stripe
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Mock success state and fetch booking details (or just show success)
    setLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      // Mock booking details
      setBookingDetails({
        id: 'mock-booking-id',
        booking_number: 'WJL-MOCK-123',
        destinations: { name: 'Destinasi Wisata' },
        ticket_types: { name: 'Tiket Reguler' },
        quantity: 2,
        visit_date: new Date().toISOString(),
        total_price: 150000,
        status: 'confirmed',
        payment_status: 'paid'
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sessionId, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container-custom py-12 flex-grow">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h1>
              <p className="text-gray-600">
                Terima kasih telah melakukan pemesanan. Tiket perjalanan Anda telah dikonfirmasi.
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : bookingDetails ? (
              <>
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h2 className="font-semibold text-lg mb-4">Informasi Pemesanan</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nomor Booking</span>
                      <span className="font-medium">{bookingDetails.booking_number}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Destinasi</span>
                      <span className="font-medium">{bookingDetails.destinations?.name}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jenis Tiket</span>
                      <span className="font-medium">{bookingDetails.ticket_types?.name}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jumlah Tiket</span>
                      <span className="font-medium">{bookingDetails.quantity}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal Kunjungan</span>
                      <span className="font-medium">{new Date(bookingDetails.visit_date).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Pembayaran</span>
                      <span className="text-primary">Rp {bookingDetails.total_price?.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate(`/payment?id=${bookingDetails.id}`)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    Lihat E-Tiket
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={() => navigate('/bookings')}
                    >
                      Lihat Pesanan Saya
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={() => navigate('/')}
                    >
                      Kembali ke Beranda
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p>Data pemesanan tidak ditemukan</p>
                <Button 
                  onClick={() => navigate('/')} 
                  className="mt-4"
                >
                  Kembali ke Beranda
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
