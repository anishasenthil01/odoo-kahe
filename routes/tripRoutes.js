import express from 'express';
import { 
  createTrip, 
  getUserTrips, 
  getTripById, 
  updateTrip, 
  deleteTrip,
  copyTrip
} from '../controllers/tripController.js';
import { verifyToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

import { addStop, getStops, deleteStop } from '../controllers/stopController.js';
import { addActivity, getActivities, deleteActivity } from '../controllers/activityController.js';
import { getTripBudget, addBudgetItem, deleteBudgetItem } from '../controllers/budgetController.js';
import { getPackingList, addPackingItem, updatePackingItem, deletePackingItem, resetPackingList } from '../controllers/packingController.js';
import { getNotes, addNote, updateNote, deleteNote } from '../controllers/noteController.js';

const router = express.Router();

// Public trip route (Read-only)
router.get('/:id/public', getTripById);

// All other trip routes require authentication
router.use(verifyToken);

router.post('/', upload.single('cover_image'), createTrip);
router.get('/', getUserTrips);
router.get('/:id', getTripById);
router.put('/:id', upload.single('cover_image'), updateTrip);
router.delete('/:id', deleteTrip);
router.post('/:id/copy', copyTrip);

// Trip Stops
router.post('/:tripId/stops', addStop);
router.get('/:tripId/stops', getStops);
router.delete('/:tripId/stops/:stopId', deleteStop);

// Trip Activities
router.post('/:tripId/activities', addActivity);
router.get('/:tripId/activities', getActivities);
router.delete('/:tripId/activities/:activityId', deleteActivity);

// Trip Budget
router.get('/:tripId/budget', getTripBudget);
router.post('/:tripId/budget', addBudgetItem);
router.delete('/:tripId/budget/:budgetId', deleteBudgetItem);

// Trip Packing List
router.get('/:tripId/packing', getPackingList);
router.post('/:tripId/packing', addPackingItem);
router.put('/:tripId/packing/:itemId', updatePackingItem);
router.delete('/:tripId/packing/:itemId', deletePackingItem);
router.post('/:tripId/packing/reset', resetPackingList);

// Trip Notes
router.get('/:tripId/notes', getNotes);
router.post('/:tripId/notes', addNote);
router.put('/:tripId/notes/:noteId', updateNote);
router.delete('/:tripId/notes/:noteId', deleteNote);

export default router;
