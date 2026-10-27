import { connect } from '@tidbcloud/serverless';
import { Destination, Booking } from './destinationService';

const TIDB_URL = import.meta.env.VITE_TIDB_DATABASE_URL;

// Initialize connection safely
let db: any = null;
try {
  if (TIDB_URL) {
    db = connect({ url: TIDB_URL });
  }
} catch (e) {
  console.warn('TiDB Client initialization note:', e);
}

export const tidbService = {
  isConfigured(): boolean {
    return Boolean(db);
  },

  async getDestinations(): Promise<Destination[] | null> {
    if (!db) return null;
    try {
      const rows = await db.execute('SELECT * FROM destinations ORDER BY is_popular DESC, rating DESC');
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          location: r.location,
          price: Number(r.price),
          rating: Number(r.rating),
          reviews: Number(r.reviews),
          image_url: r.image_url,
          description: r.description,
          category: r.category,
          features: typeof r.features === 'string' ? JSON.parse(r.features) : (r.features || []),
          is_popular: Boolean(r.is_popular)
        }));
      }
      return null;
    } catch (err) {
      console.warn('TiDB getDestinations fallback to local cache:', err);
      return null;
    }
  },

  async getBookings(): Promise<Booking[] | null> {
    if (!db) return null;
    try {
      const rows = await db.execute('SELECT * FROM bookings ORDER BY created_at DESC');
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.id,
          booking_code: r.booking_code,
          destination_id: r.destination_id,
          destination_name: r.destination_name,
          destination_location: r.destination_location,
          destination_image: r.destination_image,
          user_id: r.user_id,
          user_name: r.user_name,
          user_email: r.user_email,
          ticket_date: r.ticket_date ? String(r.ticket_date).substring(0, 10) : new Date().toISOString().substring(0, 10),
          quantity: Number(r.quantity),
          ticket_type: r.ticket_type,
          total_amount: Number(r.total_amount),
          status: r.status,
          created_at: r.created_at
        }));
      }
      return null;
    } catch (err) {
      console.warn('TiDB getBookings fallback to local cache:', err);
      return null;
    }
  },

  async createBooking(booking: Booking): Promise<boolean> {
    if (!db) return false;
    try {
      await db.execute(
        `INSERT INTO bookings (id, booking_code, destination_id, destination_name, destination_location, destination_image, user_id, user_name, user_email, ticket_date, quantity, ticket_type, total_amount, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          booking.id,
          booking.booking_code,
          booking.destination_id,
          booking.destination_name,
          booking.destination_location,
          booking.destination_image,
          booking.user_id,
          booking.user_name,
          booking.user_email,
          booking.ticket_date,
          booking.quantity,
          booking.ticket_type || 'REGULER',
          booking.total_amount,
          booking.status
        ]
      );
      return true;
    } catch (err) {
      console.warn('TiDB createBooking background sync error:', err);
      return false;
    }
  },

  async updateBookingStatus(id: string, status: string): Promise<boolean> {
    if (!db) return false;
    try {
      await db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
      return true;
    } catch (err) {
      console.warn('TiDB updateBookingStatus error:', err);
      return false;
    }
  }
};
