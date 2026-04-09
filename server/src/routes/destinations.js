import express from 'express';
import { getAllDestinations, getDestinationById, createDestination } from '../controllers/destinationController.js';

const router = express.Router();

router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);
router.post('/', createDestination); // Add auth middleware for admin check here later

export default router;
