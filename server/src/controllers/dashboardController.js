import { pool } from '../index.js';

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Sales (Sum of total_amount where status = 'paid')
    const [salesResult] = await pool.query(
      "SELECT SUM(total_amount) as totalSales FROM bookings WHERE status = 'paid'"
    );
    const totalSales = salesResult[0].totalSales || 0;

    // 2. Total Users (Count of all users)
    const [usersResult] = await pool.query(
      "SELECT COUNT(*) as totalUsers FROM users"
    );
    const totalUsers = usersResult[0].totalUsers || 0;

    // 3. Active Destinations (Count of all destinations)
    const [destinationsResult] = await pool.query(
      "SELECT COUNT(*) as totalDestinations FROM destinations"
    );
    const totalDestinations = destinationsResult[0].totalDestinations || 0;

    // 4. Recent Transactions (Limit 5)
    // Join with users and destinations to get names
    const [recentTransactions] = await pool.query(`
      SELECT 
        b.id, 
        b.booking_date, 
        b.total_amount, 
        b.status,
        u.email as user_email,
        d.name as destination_name
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN destinations d ON b.destination_id = d.id
      ORDER BY b.booking_date DESC
      LIMIT 5
    `);

    // 5. Monthly Sales (Group by month for current year) - Simplified for now
    // We can add this later for the chart

    // 6. Popular Destinations (Count bookings per destination)
     const [popularDestinations] = await pool.query(`
      SELECT 
        d.name, 
        COUNT(b.id) as booking_count 
      FROM bookings b
      JOIN destinations d ON b.destination_id = d.id
      WHERE b.status = 'paid'
      GROUP BY d.id, d.name
      ORDER BY booking_count DESC
      LIMIT 5
    `);

    res.json({
      totalSales,
      totalUsers,
      totalDestinations,
      recentTransactions,
      popularDestinations
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};
