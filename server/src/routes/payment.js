import express from 'express';
import crypto from 'crypto';

const router = express.Router();

const isProduction = () => process.env.MIDTRANS_IS_PRODUCTION === 'true';
const getSnapApiUrl = () => isProduction()
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

/**
 * POST /api/payment/snap-token
 * Create Midtrans Snap Transaction Token
 */
router.post('/snap-token', async (req, res) => {
  try {
    const { 
      bookingId, 
      destinationName, 
      ticketType, 
      quantity = 1, 
      amount, 
      customerName, 
      customerEmail, 
      customerPhone 
    } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ error: 'bookingId and amount are required' });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const clientKey = process.env.MIDTRANS_CLIENT_KEY || '';

    const orderId = `${bookingId}-${Date.now()}`;
    const authHeader = Buffer.from(`${serverKey}:`).toString('base64');

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(Number(amount))
      },
      item_details: [
        {
          id: bookingId,
          price: Math.round(Number(amount) / Number(quantity)),
          quantity: Number(quantity),
          name: `${(destinationName || 'Tiket Wisata').substring(0, 45)}`
        }
      ],
      customer_details: {
        first_name: customerName || 'Wisatawan',
        email: customerEmail || 'wisatawan@wisata.id',
        phone: customerPhone || '08123456789'
      },
      callbacks: {
        finish: `${req.headers.origin || 'http://localhost:8081'}/bookings`
      }
    };

    console.log('[Midtrans] Requesting Snap token for order:', orderId);

    const targetSnapUrl = getSnapApiUrl();
    console.log('[Midtrans] Requesting Snap token from:', targetSnapUrl, 'for order:', orderId);

    const response = await fetch(targetSnapUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn('[Midtrans] Snap API warning:', data);
      return res.status(200).json({
        success: false,
        token: null,
        message: data.error_messages ? data.error_messages.join(', ') : 'Gagal menghubungi server Midtrans.',
        clientKey: clientKey,
        orderId
      });
    }

    return res.json({
      success: true,
      token: data.token,
      redirect_url: data.redirect_url,
      clientKey: clientKey,
      orderId
    });

  } catch (error) {
    console.error('[Midtrans] Server error creating Snap token:', error);
    res.status(500).json({ 
      error: 'Failed to create payment token',
      details: error.message 
    });
  }
});

/**
 * POST /api/payment/notification
 * Midtrans Webhook Notification
 */
router.post('/notification', async (req, res) => {
  try {
    const notification = req.body;
    console.log('[Midtrans Webhook] Received notification:', notification);

    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = notification;

    // Verify signature key: SHA512(order_id + status_code + gross_amount + ServerKey)
    const rawSignature = `${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`;
    const expectedSignature = crypto.createHash('sha512').update(rawSignature).digest('hex');

    if (signature_key !== expectedSignature) {
      console.error('[Midtrans Webhook] Invalid signature key!');
      return res.status(403).json({ error: 'Invalid signature key' });
    }

    let isPaid = false;
    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'accept' || !fraud_status) {
        isPaid = true;
      }
    }

    console.log(`[Midtrans Webhook] Order ${order_id} status: ${transaction_status}, isPaid: ${isPaid}`);

    return res.status(200).json({ status: 'OK', isPaid });
  } catch (err) {
    console.error('[Midtrans Webhook] Error processing notification:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
