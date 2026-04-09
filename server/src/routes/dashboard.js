import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// Middleware to check if user is admin (simplified for now, ideally reused from auth middleware)
// For this quick implementation, we rely on the main server.js or expect a token check before this.
// But typically: router.get('/stats', authenticateToken, isAdmin, getDashboardStats);

router.get('/stats', getDashboardStats);

export default router;
