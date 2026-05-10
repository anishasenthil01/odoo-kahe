import express from 'express';
import { getAdminStats, getAllUsers, deleteUser, toggleUserRole } from '../controllers/adminController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin verification
router.use(verifyAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/role', toggleUserRole);

export default router;
