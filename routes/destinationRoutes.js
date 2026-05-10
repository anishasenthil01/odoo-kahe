import express from 'express';
import { searchCities, getActivities } from '../controllers/destinationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', verifyToken, searchCities);
router.get('/activities', verifyToken, getActivities);

export default router;
