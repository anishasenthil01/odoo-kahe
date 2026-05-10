import express from 'express';
import { login, register } from '../controllers/authController.js';
import { 
  getProfile, 
  updateProfile, 
  changePassword, 
  deleteAccount, 
  getSavedDestinations, 
  saveDestination, 
  unsaveDestination 
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected user routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, upload.single('profile_image'), updateProfile);
router.post('/change-password', verifyToken, changePassword);
router.delete('/account', verifyToken, deleteAccount);

// Saved Destinations
router.get('/saved', verifyToken, getSavedDestinations);
router.post('/saved', verifyToken, saveDestination);
router.delete('/saved/:id', verifyToken, unsaveDestination);

export default router;
